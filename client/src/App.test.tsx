import { useState } from 'react';

const statusColors = {
  online: 'bg-emerald-500',
  loading: 'bg-amber-500',
  error: 'bg-rose-500'
} as const;

type ThemeMode = 'dark' | 'light';
type ServiceStatus = 'online' | 'loading' | 'error';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [status, setStatus] = useState<ServiceStatus>('online');

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-slate-950 text-slate-100' : 'min-h-screen bg-slate-100 text-slate-900'}>
      <header className="border-b border-slate-700/80 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-400/60 bg-emerald-500/10 font-bold text-emerald-300">
              G
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">LOCALHOST</p>
              <h1 className="text-2xl font-semibold">GE Ledger</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} aria-label={`Service status: ${status}`} />
              <span className="text-sm capitalize">{status}</span>
            </div>

            <button
              type="button"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm transition hover:border-emerald-400 hover:text-emerald-300"
            >
              Refresh
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm transition hover:border-emerald-400 hover:text-emerald-300"
              onClick={() => setStatus((current) => (current === 'loading' ? 'online' : 'loading'))}
              aria-label="Toggle status indicator"
            >
              Auto refresh
            </button>

            <button
              type="button"
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm transition hover:border-emerald-400 hover:text-emerald-300"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ['Watchlist capital', '£0'],
            ['Best margin', '—'],
            ['Highest liquidity', '—'],
            ['Stale items', '0']
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Watchlist</h2>
              <p className="text-sm text-slate-400">Track the items you want to flip locally.</p>
            </div>
            <label className="w-full max-w-md">
              <span className="sr-only">Search item</span>
              <input
                type="search"
                placeholder="Search OSRS items"
                className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm outline-none transition placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-sm text-slate-400">
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Buy</th>
                  <th className="px-3 py-2">Sell</th>
                  <th className="px-3 py-2">Spread</th>
                  <th className="px-3 py-2">Margin</th>
                  <th className="px-3 py-2">5m vol</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="rounded-lg bg-slate-800/80 text-sm">
                  <td className="rounded-l-lg px-3 py-3">Energy rune</td>
                  <td className="px-3 py-3">120</td>
                  <td className="px-3 py-3">128</td>
                  <td className="px-3 py-3">8</td>
                  <td className="px-3 py-3 text-emerald-400">+4</td>
                  <td className="px-3 py-3">14,200</td>
                  <td className="rounded-r-lg px-3 py-3">
                    <button type="button" className="text-emerald-300 hover:text-emerald-200">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
