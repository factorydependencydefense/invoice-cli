#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import { batchRecords, batchTotal, normalizeFieldNames } from '../src/invoices.js';

export function buildProgram(write = console.log) {
  const program = new Command();
  program.name('invoice').description('Turn usage records into invoice batches');

  program
    .command('batch <file>')
    .option('-s, --size <n>', 'records per batch', '2')
    .action((file, options) => {
      const records = JSON.parse(readFileSync(file, 'utf8')).map(normalizeFieldNames);
      for (const batch of batchRecords(records, Number(options.size))) {
        write(`${batch.length} records, total ${batchTotal(batch)}`);
      }
    });

  return program;
}

if (process.argv[1] && process.argv[1].endsWith('invoice.js')) {
  buildProgram().parse(process.argv);
}
