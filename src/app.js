import logger from '#config/logger.js';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from '#routes/auth.routes.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', router);
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(securityMiddleware);
app.get('/', (req, res) => {
  res.send({
    message: 'Hello world!',
    time: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  logger.info('Health check OK');
  res.status(200).send({ status: 'OK', time: new Date().toISOString(), uptime: process.uptime() });
});

export default app;
