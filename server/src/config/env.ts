import 'dotenv/config';

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  OSRS_PRICE_API_BASE: process.env.OSRS_PRICE_API_BASE ?? 'https://prices.runescape.wiki/api/v1/osrs',
  OSRS_PRICE_API_USER_AGENT:
    process.env.OSRS_PRICE_API_USER_AGENT ?? 'GE Ledger localhost (contact: your-email@example.com)',
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:./dev.db'
};
