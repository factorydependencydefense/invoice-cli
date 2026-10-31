# invoice-cli

Turns usage records into invoice batches. Part of the dependency-defense demo fleet.

```bash
npm ci
npm test
node bin/invoice.js batch usage.json --size 3
```

## Tests

`npm test` runs `test/*.test.js`: `test/invoices.test.js` plus `test/preservation.test.js`, which pin
the whole sorted-and-chunked output of `batchRecords`, the renamed keys from `normalizeFieldNames`,
`batchTotal` and the CLI's command surface. They must stay green across a lodash upgrade, so a
remediation PR can use them as proof it changed no behaviour.

There is no characterization suite here, because no vulnerable behaviour is observable through this
package's API (see below).

`npm run test:security` runs `test/security/**/*.test.js` and is deliberately **not** part of
`npm test`. It asserts that keys and account names from an untrusted `usage.json` cannot reach
`Object.prototype`.

All 5 security tests are **green today**. The advisory against the pinned lodash version is real, but
this package only uses `camelCase`, `chunk`, `sortBy` and `sum`. `_.camelCase('__proto__')` is
`'proto'`, so a hostile field name cannot name the prototype, and none of the four functions writes
through a path. These tests exist to document the invariant and catch a regression if the CLI starts
using a deep-write lodash function such as `set` or `merge`.

What these tests do **not** cover: the planted unused dependencies (`chalk`, `moment`), the bundled
`dist/invoice.js`, the `readFileSync`/stdout path inside the `batch` action, malformed JSON input,
dynamic imports, and any network path.
