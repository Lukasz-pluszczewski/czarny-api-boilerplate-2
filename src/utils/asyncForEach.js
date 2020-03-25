export const chunkArray = (arr, chunkSize) => {
  const sourceArray = [...arr];
  const results = [];

  while (sourceArray.length) {
    results.push(sourceArray.splice(0, chunkSize));
  }

  return results;
};

export const forEachSequential = async(collection, cb) => {
  const results = [];

  for (const key in collection) {
    if (collection.hasOwnProperty(key)) {
      results.push(await cb(collection[key], key));
    }
  }

  return results;
};

export const forEachParallel = async(arr, cb) => Promise.all(arr.map(cb));

export const parallelBatch = async (items, batchSize, callback) => {
  const batches = chunkArray(items, batchSize);

  const results = await forEachSequential(batches, (batch, key) => forEachParallel(batch, (el, subKey) => callback(el, batchSize * key + subKey)));

  return results.flat();
};
