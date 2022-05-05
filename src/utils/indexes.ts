// import web3 from '@types/web3';
import web3 from 'web3';
// import { web3 } from 'nestjs-web3';

const URL_RPC_MAINNET = 'https://rpc-mainnet.maticvigil.com/';

const minABI = `[
  {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [{"name": "", "type": "string"}],
      "type": "function"
  }
]`;

export async function indexes() {
  const web3in = new web3(URL_RPC_MAINNET);
  // const keccakTest = keccak('keccak256').update('Transfer(bytes32, bytes32, uint256)').digest('hex');
  // const keccakTest = web3in.utils.sha3('safeTransferFrom(address,address,uint256)');
  const keccakTest = web3in.utils.sha3('Transfer(address,address,uint256)');
  console.log(keccakTest);
  const test = await web3in.eth.getPastLogs({
    fromBlock: 26962790,
    toBlock: 26962890,
    // topics,
    // topics: ['0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9']
    topics: [`${keccakTest}`],
    // topics: [web3in.utils.sha3('Transfer(bytes32, bytes32, uint256)')]
    // topics: [web3in.utils.sha3('onERC721Received(bytes32, bytes32, uint256, bytes32)')]
  });
  // console.log(test);

  const list = new Map();
  test.map(async (e) => {
    if (e.topics.length === 4) {
      list.set(e.transactionHash, {
        address: e.address,
        blockHash: e.blockHash,
        block: e.blockNumber,
        transactionHash: e.transactionHash,
        topics: e.topics,
        data: e.data,
      });
    }
    // if (e.topics.length == 3) {
    // console.log(`----------------------------BlockNumber: ${e.blockNumber}----------------------------`);
    // console.log(`Address - ${e.address}
    //               BlockHash - ${e.blockHash}
    //               blockNumber - ${e.blockNumber}
    //               trxHash - ${e.transactionHash}`);
    // console.log('Topics');
    // console.log(e.topics);
    // console.log(e);
    // const test = await web3in.eth.getCode(e.address);
    // // console.log(web3in.utils.isHexStrict(test));
    // if (web3in.utils.isHexStrict(test)) {
    //   console.log(web3in.utils.hexToString(test));
    // }
    // }
    // const recptTrx = await web3in.eth.getTransactionReceipt(e.transactionHash);
    // // console.log(recptTrx);
    // recptTrx.logs.map((e) => {
    //   console.log(e);
    // })
  });

  const testPr = await Array.from(list.values())
    .slice(0, 50)
    .map(async (e) => {
      await timeout();
      const { address, topics } = e;
      try {
        const idToken = web3in.utils.hexToNumber(topics[3]);
        e.idToken = idToken;
      } catch (er) {
        console.log(topics, er);
      }
      try {
        const contract = new web3in.eth.Contract(JSON.parse(minABI), address);
        const result = await contract.methods.name().call();
        // const nameT = web3in.utils.fromWei(result);
        // console.log(result);
        e.name = result;
        return e;
      } catch (e) {
        // console.log(address, e);
      }
      return e;
    });

  const t = await Promise.all(testPr);

  t.map((t) => {
    // Indexes.create({
    //   owner_token: '',
    //   address: t.address,
    //   id_token: t.idToken,
    //   name_token: t.name,
    //   transaction_hash: t.transactionHash,
    //   topics: JSON.stringify(t.topics),
    //   number_block: t.block,
    // })
    // sequelize.query('INSERT INTO indexes SET ');
  });
  console.log(t);
}

function timeout() {
  return new Promise((r) => setTimeout(() => r(true), 1500));
}
