import _ from 'lodash';
import { MongoClient } from 'mongodb';
import config from '../config';

/*
  Capped collection config example:
  {
    lastRequests: {
      max: 5,
      size: 5242880,
    }
  }
 */
export const createDatabaseConnection = ({ cappedCollections = {} } = {}) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb://${config.dbHost}/`, { useNewUrlParser: true }, (err, db) => {
      if (err) {
        return reject(err);
      }

      const database = db.db(config.dbName);

      // Capped collections
      const cappedCollectionsPromises = _.map(cappedCollections, (cappedCollectionConfig, collectionName) => {
        return new Promise((resolve, reject) => {
          const capped = database.collection(collectionName);

          capped.find().count((err, count) => {
            if (err) {
              reject(err);
            }

            if (count === 0) {
              database.createCollection(
                collectionName,
                {
                  capped: true,
                  max: 5,
                  size: 5242880,
                  ...cappedCollectionConfig,
                },
                err => {
                  if (err) {
                    reject(err);
                  }

                  resolve();
                }
              );
            } else {
              resolve();
            }
          });
        });
      });

      Promise.all(cappedCollectionsPromises)
        .then(() => resolve(database))
        .catch(reject);
    });
  });
};

const createDatabase = async options => {
  const db = await createDatabaseConnection(options);

  return {
    insert: collection => data => {
      return new Promise((resolve, reject) => {
        if (Array.isArray(data)) {
          return db.collection(collection).insertMany(data, (err, result) => {
            if (err) {
              return reject(err);
            }
            resolve(result);
          });
        }
        db.collection(collection).insertOne(data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    update: collection => (query, data) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).update(query, data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
    find: collection => (query, fields) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).find(query, fields && { projection: fields }).toArray((err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
    },
    findLast: collection => (query, fields) => {
      return new Promise((resolve, reject) => {
        db.collection(collection).find(query, fields && { projection: fields }).sort({ $natural: -1 }).limit(1).toArray((err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result);
        });
      });
    },
    remove: collection => query => {
      return new Promise((resolve, reject) => {
        db.collection(collection).deleteOne(query, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      });
    },
  };
};

export default createDatabase;
