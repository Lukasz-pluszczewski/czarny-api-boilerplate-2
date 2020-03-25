import uuid from 'uuid/v4';
import _ from 'lodash';
import log from './log';

const articles = [
  {
    id: 'bf85a915-700c-439d-9702-007ccc3a3be7',
    title: 'Lorem ipsum',
    content: 'Lorem ipsum dolor sit amet',
    author: {
      id: '7cb595b5-6969-4624-bc01-10fd1ac0775d',
      name: 'John',
      familyName: 'Doe',
    },
    comments: [
      {
        id: '522bcb41-d860-4f29-81da-eb7e8613538c',
        title: 'Love it',
        content: 'It\'s so great! I love it!',
      },
      {
        id: 'f7f1a3ab-21df-4d62-9986-47ef3c48efd1',
        title: 'Hate it!',
        content: 'It sucks! I hate it',
      },
    ],
  },
  {
    id: 'c6e5070f-8170-428e-a9c3-40e138a93286',
    title: 'Adepictit elit',
    content: 'Foo bar baz bam baq',
    author: {
      id: 'a0e67ee8-b58b-43a3-8f4b-ba705f7e818e',
      name: 'Will',
      familyName: 'Brown',
    },
    comments: [
      {
        id: 'ab82ce52-34e9-4b3a-9110-85f40fc2561d',
        title: 'So so',
        content: 'Not good, not bad',
      },
    ],
  },
];

// ================== log.js ===================


// errors
export class InternalError extends Error {}
export class QueryError extends Error {}
export class NotFoundError extends Error {}

const PAGINATION_TYPES = {
  PAGE: 'PAGE',
  OFFSET: 'OFFSET',
  CURSOR: 'CURSOR', // not implemented!
};

const parseParam = paramValue => {
  if (_.isPlainObject(paramValue)) {
    return _.mapValues(paramValue, parseParam);
  }
  return paramValue ? paramValue.split(',') : null;
};

const getPagination = paginationType => pageQuery => {
  if (paginationType === PAGINATION_TYPES.PAGE) {
    if (!pageQuery) {
      return null;
    }
    if (!_.isPlainObject(pageQuery)) {
      throw new QueryError('page query parameter must be an object');
    }

    return { number: pageQuery.number, size: pageQuery.size };
  }
  if (paginationType === PAGINATION_TYPES.PAGE) {
    if (!pageQuery) {
      return null;
    }
    if (!_.isPlainObject(pageQuery)) {
      throw new QueryError('page query parameter must be an object');
    }

    return { offset: pageQuery.offset, size: pageQuery.limit };
  }
  if (paginationType === PAGINATION_TYPES.CURSOR) {
    throw new InternalError('Cursor based pagination is not implemented');
  }
  throw new InternalError('No pagination type set');
};

const transformQuery = paginationType => query => {
  const include = parseParam(query.include);
  const fields = parseParam(query.fields);
  const sort = parseParam(query.sort);
  const filter = query.filter;

  // pagination
  const pagination = getPagination(paginationType)(query.page);

  return { include, fields, sort, filter, pagination };
};

const prepareDataEntry = type => dataEntry => {
  const { id, ...attributes } = dataEntry;
  return {
    type,
    id,
    attributes,
  };
};
const prepareData = resourceType => rawData => Array.isArray(rawData)
  ? rawData.map(prepareDataEntry(resourceType))
  : prepareDataEntry(resourceType)(rawData);

const prepareResponse = resourceType => (data, meta) => {
  return {
    links: {
      self: `/${resourceType}`,
    },
    data,
    meta,
  };
};


export const adapters = {
  mongodb: db => ({
    get: ({ resource, include, fields, sort, filter, pagination }) => {

      const queryFilter = {};
      if (filter) {
        Object.keys(filter).forEach(filterField => {
          queryFilter[filterField] = filter[filterField];
        });
      }

      let cursor = db.collection(resource).find(queryFilter);

      const projection = { _id: 0, id: 1 };
      if (fields) {
        Object.keys(fields).forEach(resourceName => {
          if (resourceName === resource) {
            fields[resourceName].forEach(fieldName => {
              projection[fieldName] = 1;
            });
            return;
          }

          log.warning('You passed connected resources fields in "fields" param. Relations are not currently supported by simpleAPI');
        });
      }
      cursor = cursor.project(projection);

      if (pagination) {
        if (pagination.hasOwnProperty('offset')) {
          cursor = cursor.skip(pagination.offset).limit(pagination.size);
        } else if (pagination.hasOwnProperty('number')) {
          cursor = cursor.skip((pagination.number - 1) * pagination.size).limit(pagination.size);
        }
        log.warning('Misshaped pagination parameter in mongodb "get" adapter. It may be caused by a bug in simpleAPI');
      }

      if (sort) {
        const sortQuery = {};
        sort.forEach(field => {
          sortQuery[field] = field.indexOf('-') === 0 ? -1 : 1;
        });
        cursor = cursor.sort(sortQuery);
      }

      if (include) {
        log.warning('Including related entities is not implemented. The "include" param is going to be ignored.');
      }

      return new Promise((resolve, reject) => {
        cursor.toArray((err, result) => {
          if (err) {
            return reject(err);
          }

          if (!result.length) {
            return reject(new NotFoundError(`${resource} not found`));
          }
          resolve(result);
        });
      });
    },
    put: ({ resource, id, data }) => new Promise((resolve, reject) => {
      db.collection(resource).update({ id }, data, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    }),
    post: ({ resource, data }) => new Promise((resolve, reject) => {
      if (Array.isArray(data)) {
        data.forEach(el => el.id = uuid());
        return db.collection(resource).insertMany(data, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      }
      data.id = uuid();
      db.collection(resource).insertOne(data, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    }),
    delete: ({ resource, id }) => new Promise((resolve, reject) => {
      db.collection(resource).deleteOne({ id }, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    }),
  }),
};

export const simpleApi = (adapter, options = {}) => resource => {
  const { paginationType = PAGINATION_TYPES.PAGE } = options;

  return {
    get: ({ query }) => {
      const {
        include,
        fields,
        sort,
        filter,
        pagination,
      } = transformQuery(paginationType)(query);

      return adapter.get({ resource, include, fields, sort, filter, pagination })
        .then(data => prepareResponse(resource)(prepareData(resource)(data)));
    },
    post: ({ body: data }) => adapter.post({ resource, data })
      .then(data => prepareResponse(resource)(null, data)),
    put: ({ body: data, params }) => adapter.put({ resource, id: params.id, data })
      .then(data => prepareResponse(resource)(null, data)),
    delete: ({ params }) => adapter.delete({ resource, id: params.id })
      .then(data => prepareResponse(resource)(null, data)),
  };
};

export default simpleApi;
