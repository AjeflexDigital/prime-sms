// server/index.vercel.js
import app from './index.js';  // Import your Express app (adjust if CommonJS: const app = require('./index')

export default app;  // ES modules export

// Fallback for CommonJS
export { default as config } from './index.js';