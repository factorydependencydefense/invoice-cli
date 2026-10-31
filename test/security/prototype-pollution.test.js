import assert from 'node:assert/strict';
import test from 'node:test';
import { batchRecords, batchTotal, normalizeFieldNames } from '../../src/invoices.js';

test('normalizeFieldNames must not let an own __proto__ field name reach Object.prototype', () => {
  try {
    normalizeFieldNames(JSON.parse('{"__proto__":{"invSecNormalize":"PWN"},"amount":1}'));
    assert.equal({}.invSecNormalize, undefined);
  } finally {
    delete Object.prototype.invSecNormalize;
  }
});

test('normalizeFieldNames must not let a constructor.prototype field name reach Object.prototype', () => {
  try {
    normalizeFieldNames(JSON.parse('{"constructor.prototype.invSecCtor":"PWN"}'));
    assert.equal({}.invSecCtor, undefined);
  } finally {
    delete Object.prototype.invSecCtor;
  }
});

test('batchRecords must not let a __proto__ account reach Object.prototype', () => {
  try {
    batchRecords(JSON.parse('[{"account":"__proto__","day":1,"invSecBatch":"PWN"}]'), 2);
    assert.equal({}.invSecBatch, undefined);
  } finally {
    delete Object.prototype.invSecBatch;
  }
});

test('batchRecords must not let an own __proto__ key on a record reach Object.prototype', () => {
  try {
    batchRecords(JSON.parse('[{"__proto__":{"invSecSort":"PWN"},"account":"a","day":1}]'), 2);
    assert.equal({}.invSecSort, undefined);
  } finally {
    delete Object.prototype.invSecSort;
  }
});

test('batchTotal must not let an own __proto__ key on a record reach Object.prototype', () => {
  try {
    batchTotal(JSON.parse('[{"amount":5},{"__proto__":{"invSecTotal":"PWN"}}]'));
    assert.equal({}.invSecTotal, undefined);
  } finally {
    delete Object.prototype.invSecTotal;
  }
});
