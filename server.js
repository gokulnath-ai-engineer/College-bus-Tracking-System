const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('node:path');
const { port } = require('./src/config/constants');
const apiRouter = require('./src/routes/apiRouter');

const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);
app.use('/api/v1', apiLimiter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRouter);
app.use('/api/v1', apiRouter);

function startServer() {
  return app.listen(port, () => console.log(`College Bus Tracking System running at http://localhost:${port}`));
}

if (require.main === module) startServer();
module.exports = { app, startServer };
