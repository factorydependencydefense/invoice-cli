import assert from 'node:assert/strict';
import test from 'node:test';
import { batchRecords, batchTotal, normalizeFieldNames } from '../src/invoices.js';
import { buildProgram } from '../bin/invoice.js';

const records = [
  { account: 'b', day: 2, amount: 10 },
  { account: 'a', day: 1, amount: 5 },
  { account: 'a', day: 2, amount: 7 },
];

test('batchRecords sorts then chunks', () => {
  const batches = batchRecords(records, 2);
  assert.equal(batches.length, 2);
  assert.deepEqual(batches[0].map((r) => r.account), ['a', 'a']);
});

test('normalizeFieldNames camel cases keys', () => {
  assert.deepEqual(normalizeFieldNames({ 'Account Id': 1, usage_amount: 2 }), {
    accountId: 1,
    usageAmount: 2,
  });
});

test('batchTotal sums amounts and tolerates gaps', () => {
  assert.equal(batchTotal([{ amount: 5 }, {}, { amount: 2.5 }]), 7.5);
});

test('the CLI exposes a batch command', () => {
  const names = buildProgram().commands.map((c) => c.name());
  assert.deepEqual(names, ['batch']);
});
