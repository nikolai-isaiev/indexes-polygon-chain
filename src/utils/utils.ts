export function timeout(ms?: number) {
  return new Promise((r) => setTimeout(() => r(true), ms || 1500));
}

export function toChunkedArray<T>(array: T[], chunkSize: number): T[][] {
  const result = [];
  for (let i = 0, j = array.length; i < j; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
