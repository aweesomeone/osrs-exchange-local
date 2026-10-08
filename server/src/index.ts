import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { AppError } from './lib/errors.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'GE Ledger API',
    ts: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  });
});

app.get('/api/status', (_req, res) => {
  res.json({
    ok: true,
    environment: 'local',
    configuredApiBase: env.OSRS_PRICE_API_BASE,
    configuredUserAgent: env.OSRS_PRICE_API_USER_AGENT
  });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        type: 'application_error'
      }
    });
  }

  const message = err instanceof Error ? err.message : 'Internal server error';

  return res.status(500).json({
    error: {
      message,
      statusCode: 500,
      type: 'internal_server_error'
    }
  });
});

const port = env.PORT;
app.listen(port, () => {
  console.log(`GE Ledger API listening on http://localhost:${port}`);
});

export default app;
