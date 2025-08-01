function networkRequest() {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 5000; // Random delay 0-5 seconds
    const shouldFail = Math.random() < 0.1; // 10% chance of failure

    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network error'));
      } else {
        resolve('response');
      }
    }, delay);
  });
}

export { networkRequest };
