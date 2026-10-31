import assert from 'node:assert/strict';
import test from 'node:test';
import { batchRecords, batchTotal, normalizeFieldNames } from '../src/invoices.js';
import { buildProgram } from '../bin/invoice.js';

const records = [
  { account: 'b', day: 2, amount: 10 },
  { account: 'a', day: 1, amount: 5 },
  { account: 'a', day: 2, amount: 7 },
];

test('batchRecords sorts by account then day and chunks the whole list', () => {
  assert.deepEqual(batchRecords(records, 2), [
    [
      { account: 'a', day: 1, amount: 5 },
      { account: 'a', day: 2, amount: 7 },
    ],
    [{ account: 'b', day: 2, amount: 10 }],
  ]);
});

test('batchRecords honours the batch size', () => {
  assert.deepEqual(
    batchRecords(records, 1).map((batch) => batch.length),
    [1, 1, 1],
  );
  assert.deepEqual(batchRecords([], 2), []);
});

test('normalizeFieldNames camel cases every key and keeps the values', () => {
  assert.deepEqual(normalizeFieldNames({ 'Account Id': 1, usage_amount: 2, 'TOTAL-DUE': null }), {
    accountId: 1,
    usageAmount: 2,
    totalDue: null,
  });
});

test('batchTotal sums amounts and treats a missing amount as zero', () => {
  assert.equal(batchTotal([{ amount: 5 }, {}, { amount: 2.5 }]), 7.5);
  assert.equal(batchTotal([]), 0);
});

test('the CLI exposes only the batch command with a default size', () => {
  const batch = buildProgram().commands.find((command) => command.name() === 'batch');
  assert.equal(buildProgram().commands.length, 1);
  assert.deepEqual(batch.opts(), { size: '2' });
});
