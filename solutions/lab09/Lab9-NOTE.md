# Lab 9 - Flaky Tests

⚠️ **Note**: The early versions of the `networkRequest.test.js` file are intentionally flaky.
- They use real timeouts and randomness, which will cause intermittent failures.

✅ Use the later examples with `jest.useFakeTimers()` and `jest.runAllTimers()` plus mocked `Math.random()` to make the tests deterministic and stable.
