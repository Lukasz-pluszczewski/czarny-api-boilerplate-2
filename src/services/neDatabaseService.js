import Datastore from 'nedb';
import _ from 'lodash';

import config from '../config';
import { forEachParallel } from '../utils/asyncForEach';
import { resolvePath, listFiles } from '../utils/fileSystem';

export const getDatabase = async (collections = {}) => {
  if (config.env === 'development') {
    console.log('Creating neDatabase');
    console.log('Existing collection files', listFiles(config.neDBPath).filter(file => file !== '.gitkeep'));
  }

  const db = {};
  await forEachParallel(Object.keys(collections), async collection => {
    const dataStoreFileName = resolvePath(`${config.neDBPath}/${collection}.db`);
    db[collection] = new Datastore({ filename: dataStoreFileName, autoload: true });

    // auto compaction
    if (collections[collection].autocompaction) {
      db[collection].persistence.setAutocompactionInterval(collections[collection].autocompaction);
    }

    // indexes
    if (collections[collection].ensureIndex) {
      const ensureIndexes = Array.isArray(collections[collection].ensureIndex)
        ? collections[collection].ensureIndex
        : [collections[collection].ensureIndex];

      await Promise.all(ensureIndexes.map(ensureIndex => db[collection].ensureIndex(ensureIndex, error => {
        if (error) {
          throw error;
        }
      })));
    }
  });

  const dbInstance = {
    db,
    insert: collection => data => {
      return new Promise((resolve, reject) => {
        return db[collection].insert(data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },

    update: collection => (query, data) => {
      return new Promise((resolve, reject) => {
        db[collection].update(query, data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },

    upsert: collection => (query, data) => {
      return new Promise((resolve, reject) => {
        db[collection].update(query, data, { upsert: true }, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },

    find: collection => (query, fields, sort) => {
      return new Promise((resolve, reject) => {
        db[collection].find(query, fields).sort(sort).exec((err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
    },

    remove: collection => query => {
      return new Promise((resolve, reject) => {
        db[collection].remove(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
  };

  await forEachParallel(Object.keys(collections), async collection => {
    // fixtures
    if (collections[collection].fixtures) {
      return Promise.all(collections[collection].fixtures.map(fixture => {
        const query = Array.isArray(fixture[0]) ? _.pick(fixture[1], fixture[0]) : fixture[0];
        return dbInstance.upsert(collection)(query, fixture[1]);
      }));
    }
  });

  // compaction
  _.forEach(db, collection => collection.persistence.compactDatafile);

  return dbInstance;
};

const createDatabase = () => {
  return createDatabase({
    users: {
      ensureIndex: { fieldName: 'username', unique: true },
      fixtures: [
        [['username'], { username: 'changeme' }],
      ],
    },
  });
};

export default createDatabase;
