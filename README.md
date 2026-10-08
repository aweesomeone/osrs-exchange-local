# GE Ledger

GE Ledger is a localhost-first tracker for Old School RuneScape Grand Exchange data, personal watchlists, and portfolio estimates. This repository is the Phase 1 foundation for the full application described in the build pack.

## Project structure

```text
ge-ledger/
├── client/
│   ├── src/
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   ├── .eslintrc.cjs
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .gitignore
├── README.md
├── package.json
└── .nvmrc (optional)
```

## Phase 1 included

- Vite + React + TypeScript client shell
- Express + TypeScript server with health endpoint
- Tailwind CSS + dark/light shell layout
- Prisma schema and seed script foundation
- Environment file and structured server error handling
- Vitest setup for browser and Node tests

## Commands to run

```bash
npm install
npm run build
npm test
```

## Notes

- This is designed for localhost use first.
- The OSRS Wiki request user-agent should be replaced with a real contact before any public deployment.
