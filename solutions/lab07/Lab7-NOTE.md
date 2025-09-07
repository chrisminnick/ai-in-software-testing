# Lab 7 - Test Smells and Anti-Patterns

**Note**: The `badCalculator.test.js` file is intentionally broken to demonstrate test smells.

- It mixes up variable names (`calc` vs `calculate`).
- It includes assertions outside of `test()` blocks, which Jest does not allow.

This file will throw errors if run. Use it only as a _bad example_ to refactor.

The `refactoredCalculator.test.js` file contains the fixed, runnable version.
