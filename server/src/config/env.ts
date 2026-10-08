import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3001),
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  OSRS_PRICE_API_BASE: process.env.OSRS_PRICE_API_BASE ?? 'https://prices.runescape.wiki/api/v1/osrs',
  OSRS_PRICE_API_USER_AGENT: process.env.OSRS_PRICE_API_USER_AGENT ?? 'GE-Ledger-localhost/0.1 (replace-with-your-contact)',
  LATEST_CACHE_SECONDS: Number(process.env.LATEST_CACHE_SECONDS ?? 60),
  AGGREGATE_CACHE_SECONDS: Number(process.env.AGGREGATE_CACHE_SECONDS ?? 300),
  TIMESERIES_CACHE_SECONDS: Number(process.env.TIMESERIES_CACHE_SECONDS ?? 300),
  MAPPING_CACHE_SECONDS: Number(process.env.MAPPING_CACHE_SECONDS ?? 86400),
  DEFAULT_TAX_RATE: Number(process.env.DEFAULT_TAX_RATE ?? 0.01),
  DEFAULT_TAX_CAP_PER_ITEM: Number(process.env.DEFAULT_TAX_CAP_PER_ITEM ?? 5000000)
};
