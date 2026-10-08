import { useEffect, useMemo, useState } from 'react';

type ThemeMode = 'dark' | 'light';
type ServiceStatus = 'online' | 'loading' | 'error' | 'stale';

type ItemResult = {
  id: number;
  name: string;
  examine?: string;
  icon?: string;
};

type WatchRow = {
  id: number;
  name: string;
  buy: number;
  sell: number;
  spread: number;
  tax: number;
  margin: number;
  roi: number;
  volume: number;
  lastUpdated: string;
  targetStatus: 'Below target' | 'On target' | 'Above target';
  stale: boolean;
};

const statusColors = {
  online: 'bg-emerald-500',
  loading: 'bg-amber-500',
  error: 'bg-rose-500',
  stale: 'bg-amber-500'
} as const;

const watchRows: WatchRow[] = [
  {
    id: 4151,
    name: 'Abyssal whip',
    buy: 1015200,
    sell: 1044000,
    spread: 28800,
    tax: 10440,
    margin: 18360,
    roi: 1.8,
    volume: 1280,
    lastUpdated: '2 min ago',
    targetStatus: 'Below target',
    stale: false
  },
  {
    id: 1704,
    name: 'Air rune',
    buy: 98,
    sell: 104,
    spread: 6,
    tax: 2,
    margin: 4,
    roi: 4.1,
    volume: 324000,
    lastUpdated: '1 min ago',
    targetStatus: 'On target',
    stale: false
  },
  {
    id: 995,
    name: 'Coins',
    buy: 1,
    sell: 1,
    spread: 0,
    tax: 0,
    margin: 0,
    roi: 0,
    volume: 0,
    lastUpdated: 'No recent data',
    targetStatus: 'Above target',
    stale: true
  }
];

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [status, setStatus] = useState<ServiceStatus>('loading');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ItemResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          throw new Error('Health check failed');
        }
        setStatus('online');
      } catch (_error) {
        setStatus('error');
        setError('The GE Ledger API is currently unavailable.');
      }
    };

    void loadHealth();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        setError(null);
        const response = await fetch(`/api/items/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const payload = (await response.json()) as { items?: ItemResult[] };
        setItems(payload.items ?? []);
      } catch (_error) {
        setError('Unable to load OSRS item search results right now.');
        setItems([]);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const summary = useMemo(() => {
    if (!items.length) {
      return 'No results yet';
    }

    return `${items.length} items loaded`;
  }, [items.length]);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-GB', {
      maximumFractionDigits: value >= 100 ? 0 : 2
    }).format(value);

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'}>
      <header className="border-b border-slate-700/80 bg-slate-900/80 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/60 bg-emerald-500/10 font-bold text-emerald-300">
              G
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Localhost</p>
              <h1 className="text-2xl font-semibold tracking-tight">GE Ledger</h1>
            </div>
          </div>

          <label className="w-full max-w-xl">
            <span className="sr-only">Search items</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search OSRS items"
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
            />
          </label>

          <div className="flex items-center gap-2 self-end lg:self-auto">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} aria-label={`Service status: ${status}`} />
              <span className="text-sm capitalize">{status}</span>
            </div>

            <button
              type="button"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium transition hover:border-blue-400 hover:text-blue-300"
            >
              Refresh
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium transition hover:border-blue-400 hover:text-blue-300"
              aria-label="Toggle auto-refresh"
            >
              Auto refresh
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium transition hover:border-blue-400 hover:text-blue-300"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Watchlist capital', '£0'],
            ['Best net margin', '—'],
            ['Highest liquidity', '—'],
            ['Stale items', '0']
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/30">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Watchlist</h2>
                <p className="text-sm text-slate-400">Estimated profit based on observed prices and assumed GE tax.</p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm hover:border-blue-400 hover:text-blue-300">
                  Sort: Margin
                </button>
                <button type="button" className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm hover:border-blue-400 hover:text-blue-300">
                  + Add item
                </button>
              </div>
            </div>

            <div className="mb-3 text-sm text-slate-300">{summary}</div>
            {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.12em] text-slate-400">
                    <th scope="col" className="px-3 py-2 font-medium">Item</th>
                    <th scope="col" className="px-3 py-2 font-medium">Buy / low</th>
                    <th scope="col" className="px-3 py-2 font-medium">Sell / high</th>
                    <th scope="col" className="px-3 py-2 font-medium">Spread</th>
                    <th scope="col" className="px-3 py-2 font-medium">Tax</th>
                    <th scope="col" className="px-3 py-2 font-medium">Net margin</th>
                    <th scope="col" className="px-3 py-2 font-medium">ROI</th>
                    <th scope="col" className="px-3 py-2 font-medium">5m vol</th>
                    <th scope="col" className="px-3 py-2 font-medium">Last obs</th>
                    <th scope="col" className="px-3 py-2 font-medium">Target</th>
                    <th scope="col" className="px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watchRows.map((row) => (
                    <tr key={row.id} className="rounded-xl bg-slate-800/80 text-sm">
                      <td className="rounded-l-xl px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-xs font-semibold text-blue-300">
                            {row.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-100">{row.name}</div>
                            <div className="text-xs text-slate-400">#{row.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 tabular-nums text-slate-100">{formatNumber(row.buy)}</td>
                      <td className="px-3 py-3 tabular-nums text-slate-100">{formatNumber(row.sell)}</td>
                      <td className="px-3 py-3 tabular-nums text-slate-100">{formatNumber(row.spread)}</td>
                      <td className="px-3 py-3 tabular-nums text-slate-100">{formatNumber(row.tax)}</td>
                      <td className={`px-3 py-3 tabular-nums font-medium ${row.margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatNumber(row.margin)}
                      </td>
                      <td className={`px-3 py-3 tabular-nums font-medium ${row.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.roi.toFixed(1)}%
                      </td>
                      <td className="px-3 py-3 tabular-nums text-slate-100">{formatNumber(row.volume)}</td>
                      <td className="px-3 py-3 text-slate-300">
                        {row.stale ? <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-300">Stale</span> : row.lastUpdated}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-200">{row.targetStatus}</span>
                      </td>
                      <td className="rounded-r-xl px-3 py-3">
                        <button type="button" className="text-blue-300 hover:text-blue-200">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 md:hidden">
              {watchRows.map((row) => (
                <article key={row.id} className="rounded-xl border border-slate-700 bg-slate-800/80 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-100">{row.name}</div>
                      <div className="text-xs text-slate-400">#{row.id}</div>
                    </div>
                    <span className="rounded-full bg-slate-700 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-200">
                      {row.targetStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-slate-400">Observed low</div>
                      <div className="tabular-nums text-slate-100">{formatNumber(row.buy)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Observed high</div>
                      <div className="tabular-nums text-slate-100">{formatNumber(row.sell)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Net margin</div>
                      <div className={`tabular-nums font-medium ${row.margin >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatNumber(row.margin)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400">ROI</div>
                      <div className={`tabular-nums font-medium ${row.roi >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {row.roi.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>{row.stale ? 'Stale data' : row.lastUpdated}</span>
                    <button type="button" className="text-blue-300 hover:text-blue-200">
                      Expand details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Selected item</p>
                <h3 className="mt-1 text-xl font-semibold">Abyssal whip</h3>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">Healthy</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Observed high</span>
                  <span className="tabular-nums text-slate-100">1,044,000</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Observed low</span>
                  <span className="tabular-nums text-slate-100">1,015,200</span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-3">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Estimated tax</span>
                  <span className="tabular-nums text-slate-100">10,440</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                  <span>Net margin</span>
                  <span className="tabular-nums text-emerald-400">18,360</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                  <span>ROI</span>
                  <span className="tabular-nums text-emerald-400">1.8%</span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-3">
                <div className="text-xs uppercase tracking-[0.15em] text-slate-400">Price notes</div>
                <p className="mt-2 text-sm text-slate-300">
                  Observed values are raw upstream data points. Profit is estimated and should be treated as a local approximation.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
