# Kryptonik

Plataforma de inteligência Web3: dados de mercado, movimentos on-chain e notícias em uma única experiência.

## Stack

- **Web:** Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query e Lightweight Charts.
- **API:** Fastify, TypeScript, Prisma, PostgreSQL (Supabase), Redis e Socket.io.
- **Infra:** Docker, Vercel (web), Railway ou Fly.io (API) e GitHub Actions.

## Estrutura

```text
apps/
  web/        # Interface Next.js
  api/        # API Fastify e Socket.io
packages/
  shared/     # Tipos e contratos compartilhados
```

## Pré-requisitos

- Node.js 24 LTS
- pnpm 10+
- Docker Desktop
- Projeto Supabase (quando a persistência de dados for iniciada)

## Primeiros comandos

```bash
corepack enable
pnpm install
docker compose up -d
pnpm dev
```

## Convenções

- Chaves de provedores externos ficam apenas no backend.
- A API normaliza respostas de fornecedores antes de enviá-las ao frontend.
- Dados efêmeros usam Redis; dados de usuário usam PostgreSQL.
