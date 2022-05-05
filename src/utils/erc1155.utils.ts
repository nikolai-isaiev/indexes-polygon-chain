import Web3 from 'web3';

export function parseBatchDataString(dataString: string) {
  const string = dataString.substring(2);
  const list = [];
  for (let i = 0; i < string.length / 64; i++) {
    const t = string.slice(i * 64, i * 64 + 64);
    list.push(t);
  }

  const listDecoded = list.map((t) => Web3.utils.hexToNumberString(`0x${t}`));

  return {
    ids: listDecoded.slice(3, +listDecoded[2] + 3),
    value: listDecoded.slice(
      3 + +listDecoded[2] + 1,
      +listDecoded[3 + +listDecoded[2]] + 3 + +listDecoded[2] + 1,
    ),
  };
}
