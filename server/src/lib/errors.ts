import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { env } from './config/env.js';
import { AppError } from './lib/errors.js';
import {
  fetchItemHistory,
  fetchLatestPrices,
  fetchMappedItems,
  searchItems,
  type ItemMetadata,
  type LatestPrice
} from './lib/osrsApi.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

const healthSchema = z.object({
  q: z.string().optional().default('')
});

const itemIdSchema = z.coerce.number();
const timestepSchema = z.enum(['5m', '1h', '6h', '24h']);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'GE Ledger API',
    ts: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  });
});

app.get('/api/items/search', async (req, res, next) => {
  try {
    const parsed = healthSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new AppError('Invalid search query', 400);
    }

    const items = await searchItems(parsed.data.q, 50);
    res.json({ items, total: items.length });
  } catch (error) {
    next(error);
  }
});

app.get('/api/items/:itemId', async (req, res, next) => {
  try {
    const itemId = itemIdSchema.parse(req.params.itemId);
    const items = await fetchMappedItems();
    const item = items.find((entry) => entry.id === itemId);

    if (!item) {
      throw new AppError(`Item ${itemId} was not found in the OSRS mapping cache.`, 404);
    }

    const latest = await fetchLatestPrices();
    const latestItem = latest.find((entry) => entry.itemId === itemId);

    res.json({
      item,
      latest: latestItem ?? null,
      stale: latestItem ? latestItem.stale : true
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/items/:itemId/history', async (req, res, next) => {
  try {
    const itemId = itemIdSchema.parse(req.params.itemId);
    const timestep = timestepSchema.parse(req.query.timestep ?? '1h');
    const history = await fetchItemHistory(itemId, timestep);

    res.json({ itemId, timestep, history });
  } catch (error) {
    next(error);
  }
});

app.post('/api/refresh', async (_req, res, next) => {
  try {
    const items = await fetchMappedItems();
    const latest = await fetchLatestPrices();

    res.json({
      ok: true,
      mappingCount: items.length,
      pricesFetched: latest.length,
      refreshedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
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

  if (err instanceof Error) {
    return res.status(500).json({
      error: {
        message: err.message,
        statusCode: 500,
        type: 'internal_server_error'
      }
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal server error',
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
