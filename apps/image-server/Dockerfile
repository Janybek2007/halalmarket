FROM node:24-alpine AS builder

RUN npm install -g bun

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY src/ ./src/

RUN bun build ./src/main.js --outdir=out --minify --splitting --target=node

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /usr/local/bin/bun /usr/local/bin/bun

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/out ./out

EXPOSE 3030

CMD ["node", "out/main.js"]
