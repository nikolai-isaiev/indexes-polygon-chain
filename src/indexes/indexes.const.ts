import Web3 from 'web3';

export const ERC721_KECCAK = Web3.utils.sha3(
  'Transfer(address,address,uint256)',
);
export const ERC1155_SINGLE_KECCAK = Web3.utils.sha3(
  'TransferSingle(address,address,address,uint256,uint256)',
);
export const ERC1155_BATCH_KECCAK = Web3.utils.sha3(
  'TransferBatch(address,address,address,uint256[],uint256[])',
);
