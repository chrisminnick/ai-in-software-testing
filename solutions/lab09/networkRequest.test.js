const { networkRequest } = require('./networkRequest');

describe('Network Request', () => {
  test('resolves with response', async () => {
    const result = await networkRequest();
    expect(result).toBe('response');
  });

  test('resolves after delay (mocked)', async () => {
    // Use fake timers only for this test
    jest.useFakeTimers();

    // Mock Math.random to ensure consistent behavior for this test
    const originalRandom = Math.random;
    Math.random = jest.fn(() => 0.5); // Always return 0.5 (won't trigger the 10% failure)

    const promise = networkRequest();

    // Fast-forward all timers
    jest.runAllTimers();

    const result = await promise;
    expect(result).toBe('response');

    // Clean up
    Math.random = originalRandom;
    jest.useRealTimers();
  });

  test('flaky test - sometimes fails due to timeout', async () => {
    // This test will sometimes timeout because the function can take up to 5 seconds
    const result = await networkRequest();
    expect(result).toBe('response');
  }, 2500); // Set timeout as second parameter to test function

  test('unstable test - random failure', async () => {
    // This test randomly fails about 30% of the time
    const shouldFail = Math.random() < 0.3;
    if (shouldFail) {
      throw new Error('Random test failure to simulate instability');
    }
    const result = await networkRequest();
    expect(result).toBe('response');
  }, 10000); // Longer timeout to account for potential network delays

  test('another flaky approach - race condition', async () => {
    // Create a race condition between our request and a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 2000);
    });

    const result = await Promise.race([networkRequest(), timeoutPromise]);
    expect(result).toBe('response');
  }, 10000); // Longer timeout
});
