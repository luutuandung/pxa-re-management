module.exports = {
    info: (message) => console.log(`[INFO] ${typeof message === 'string' ? message : JSON.stringify(message)}`),
    error: (error) => {
      if (typeof error === 'object' && error.message) {
        console.error(`[ERROR] ${error.message}`, error.stack || '');
      } else {
        console.error(`[ERROR] ${error}`);
      }
    },
    warn: (message) => console.warn(`[WARN] ${typeof message === 'string' ? message : JSON.stringify(message)}`),
};
