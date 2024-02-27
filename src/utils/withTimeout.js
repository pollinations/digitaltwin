export const withTimeout = (promise) => {
  let hasResolved = false;
  promise.then(() => {
    hasResolved = true;
  });

  let timeout = new Promise((resolve) => setTimeout(() => {
    if (!hasResolved) {
      console.log("20s TIMEOUT REACHED");
    }
    resolve(null);
  }, 30000));

  return Promise.race([promise, timeout]);
};
