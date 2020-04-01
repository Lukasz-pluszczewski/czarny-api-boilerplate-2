import { parallelBatch } from './asyncForEach';

describe('parallelBatch', () => {
  it('should execute async callback in batches', async () => {
    const items = [1, 2, 3, 4, 5, 6];
    const results = await parallelBatch(items, 2, i => Promise.resolve(i * 2));

    expect(results).toStrictEqual([2, 4, 6, 8, 10, 12]);
  });
  it('should pass correct indexes to async callback', async () => {
    const items = [1, 2, 3, 4, 5, 6];
    const results = await parallelBatch(items, 2, (i, index) => Promise.resolve(index));

    expect(results).toStrictEqual([0, 1, 2, 3, 4, 5]);
  });
});
