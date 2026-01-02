FROM node:22-alpine AS builder

RUN npm install -g bun

WORKDIR /app

COPY bun.lock* package.json ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["npm", "run", "start"]
