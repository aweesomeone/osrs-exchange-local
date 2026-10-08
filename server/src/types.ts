export type HealthResponse = {
  ok: boolean;
  service: string;
  ts: string;
  uptimeSeconds?: number;
};
