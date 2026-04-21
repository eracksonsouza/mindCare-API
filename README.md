# MindCare — Backend

API REST do MindCare para registrar check-ins emocionais de forma anônima usando um token de sincronização (Bearer). Não usa e‑mail nem senha.

## O que é o MindCare

Aplicação de bem‑estar emocional para registrar como a pessoa está se sentindo ao longo do tempo.

## Como funciona (resumo)

1. O frontend solicita um token em `POST /api/token`.
2. O token é salvo no cliente.
3. Os check-ins são enviados e lidos com `Authorization: Bearer <token>`.

## Stack

- Node.js 20 + TypeScript
- Express
- Prisma + PostgreSQL

### Ícones da stack

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

## Endpoints

- GET `/health`
- POST `/api/token`
- GET `/api/checkins` (auth)
- POST `/api/checkins` (auth)
- DELETE `/api/checkins` (auth)

## Como rodar localmente

Pré-requisitos: Node.js 20+ e PostgreSQL.

```bash
git clone <url-do-repo>
cd mindcare-backend
npm install
```

Crie `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/mindcare"
CORS_ORIGINS="http://localhost:5173"
PORT=3333
```

```bash
npm run db:migrate
npm run db:generate
npm run dev
```

API disponível em http://localhost:3333

## Rodar com Docker

Pré-requisito: Docker instalado.

```bash
# build da imagem
docker build -t mindcare-backend .

# subir o container (ajuste a DATABASE_URL se necessário)
docker run --rm -p 3333:3333 \
  -e DATABASE_URL="postgresql://usuario:senha@host.docker.internal:5432/mindcare" \
  -e CORS_ORIGINS="http://localhost:5173" \
  -e PORT=3333 \
  mindcare-backend
```

Se preferir, posso adicionar também um `docker-compose.yml` com PostgreSQL.

## Exemplo rápido

```bash
curl -X POST http://localhost:3333/api/token
```

```bash
curl -X POST http://localhost:3333/api/checkins \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"emotion":"calm","intensity":4,"timestamp":"2026-04-20T12:00:00.000Z"}'
```

## Estrutura do projeto

Visão rápida do que cada pasta faz:

- `src/` — código da API (Express + middlewares + rotas).
- `prisma/` — schema e migrations do banco.

```
src/
├── index.ts          # entrada da aplicação (Express + middlewares + rotas)
├── lib/prisma.ts     # Prisma Client (singleton)
├── middleware/auth.ts# valida o token Bearer
└── routes/
    ├── token.ts      # POST /api/token
    └── checkins.ts   # GET/POST/DELETE /api/checkins

prisma/
├── schema.prisma     # modelos SyncToken e CheckIn
└── migrations/       # histórico de migrations
```

## Comandos úteis

```bash
npm run dev
npm run build
npm start
npm run db:migrate
npm run db:generate
npm run db:studio
```
