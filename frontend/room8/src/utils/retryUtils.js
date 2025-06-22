export const withRetry = async (fn, retries = 2, delay = 50000) => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) {
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  throw lastError;
};
