import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IOptionsIndexes } from 'src/interfaces/interfaces';
import { TransactionsRepository } from 'src/repo/transactions.repo';
import { parseBatchDataString } from 'src/utils/erc1155.utils';
import { timeout } from 'src/utils/utils';
import Web3 from 'web3';
import {
  ERC1155_BATCH_KECCAK,
  ERC1155_SINGLE_KECCAK,
  ERC721_KECCAK,
} from './indexes.const';

const URL_RPC_MAINNET =
  // 'https://polygon-rpc.com';
  'https://speedy-nodes-nyc.moralis.io/173c906bbd79b4c01dc6034b/polygon/mainnet/archive';

@Injectable()
export class IndexesService {
  public readonly web3: Web3;
  private currentBlock: number;

  private debug = process.env.TEST;

  constructor(
    @InjectRepository(TransactionsRepository)
    protected readonly transactionsRepo: TransactionsRepository,
  ) {
    this.web3 = new Web3(URL_RPC_MAINNET);
  }

  //scaning all blocks and save in DB
  async indexBlocks(options: IOptionsIndexes) {
    //get last block in chain
    const lastBlock = await this.web3.eth.getBlockNumber();
    await this.getBlocks(lastBlock, {
      start: options.startBlock,
      end: options.endBlock,
    });
  }

  //scaning blocks to keccak string for erc721 and erc1155
  private async getBlocks(
    lastBlock: number,
    options?: {
      gap?: number;
      start?: number;
      end?: number;
    },
  ) {
    console.log(`start scan ${new Date()}`);
    const start = options.start || 0; // 22000000
    const gap = options.gap || 1000;
    const end = options.end || lastBlock; //23000000

    for (let i = start; i < end; i += gap) {
      const fromBlock = i;
      const toBlock = i + gap - 1;
      try {
        const logsErc721 = await this.getPastLogs(fromBlock, toBlock, [
          ERC721_KECCAK,
        ]);
        const logsErc1155Single = await this.getPastLogs(fromBlock, toBlock, [
          ERC1155_SINGLE_KECCAK,
        ]);
        const logsErc1155Batch = await this.getPastLogs(fromBlock, toBlock, [
          ERC1155_BATCH_KECCAK,
        ]);

        const mappdedLogsErc721 = logsErc721
          .filter((l) => l.topics.length === 4)
          .map((l) => ({
            from: `0x${l.topics[1].substring(26)}`,
            to: `0x${l.topics[2].substring(26)}`,
            tokenAddress: l.address,
            block: l.blockNumber,
            tokenId: this.web3.utils.hexToNumberString(l.topics[3]),
            amount: '1',
            tokenType: 'ERC721',
            transactionHash: l.transactionHash,
          }));

        const mappdedLogsErc1155Single = logsErc1155Single.map((l) => ({
          from: `0x${l.topics[2].substring(26)}`,
          to: `0x${l.topics[3].substring(26)}`,
          tokenAddress: l.address,
          block: l.blockNumber,
          tokenId: this.web3.utils.hexToNumberString(l.data.substring(0, 66)),
          amount: this.web3.utils.hexToNumberString(
            `0x${l.data.substring(66)}`,
          ),
          tokenType: 'ERC1155',
          transactionHash: l.transactionHash,
        }));

        const mappdedLogsErc1155Batch = logsErc1155Batch.map((l) => {
          const data = parseBatchDataString(l.data);
          return {
            from: `0x${l.topics[2].substring(26)}`,
            to: `0x${l.topics[3].substring(26)}`,
            tokenAddress: l.address,
            block: l.blockNumber,
            tokenId: JSON.stringify(data.ids),
            amount: JSON.stringify(data.value),
            tokenType: 'ERC1155',
            transactionHash: l.transactionHash,
          };
        });

        const listLogsToSaving = [
          ...mappdedLogsErc721,
          ...mappdedLogsErc1155Single,
          ...mappdedLogsErc1155Batch,
        ];

        await this.transactionsRepo.save(listLogsToSaving, { chunk: 100 });

        console.log(`end scan ${fromBlock} - ${toBlock} / ${new Date()}`);
        await timeout(300);
        if (this.debug) {
          break;
        }
      } catch (e) {
        console.log(`${fromBlock} - ${toBlock}`, e);
      }
    }
    console.log(`end scan all ${new Date()}`);
  }

  private async getPastLogs(
    fromBlock: number,
    toBlock: number,
    topics: string[],
  ) {
    return await this.web3.eth.getPastLogs({
      fromBlock,
      toBlock,
      topics,
    });
  }
}
