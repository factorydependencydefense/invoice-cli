import _ from 'lodash';

export function batchRecords(records, size = 2) {
  return _.chunk(_.sortBy(records, ['account', 'day']), size);
}

export function normalizeFieldNames(record) {
  const out = {};
  for (const [key, value] of Object.entries(record)) {
    out[_.camelCase(key)] = value;
  }
  return out;
}

export function batchTotal(batch) {
  return _.sum(batch.map((record) => record.amount ?? 0));
}
