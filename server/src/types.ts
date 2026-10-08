export type ItemMetadata = {
  id: number;
  name: string;
  examine?: string;
  members?: boolean;
  lowalch?: number;
  highalch?: number;
  limit?: number;
  value?: number;
  icon?: string;
};

export type LatestPrice = {
  itemId: number;
  high?: number;
  highTime?: number;
  low?: number;
  lowTime?: number;
  fetchedAt: string;
  stale: boolean;
};

export type AggregatePrice = {
  itemId: number;
  avgHighPrice?: number;
  avgLowPrice?: number;
  highPriceVolume?: number;
  lowPriceVolume?: number;
  timestamp: number;
};

export type HistoryPoint = {
  timestamp: number;
  avgHighPrice?: number;
  avgLowPrice?: number;
  highPriceVolume?: number;
  lowPriceVolume?: number;
};

export type HealthResponse = {
  ok: boolean;
  service: string;
  ts: string;
  uptimeSeconds?: number;
};
