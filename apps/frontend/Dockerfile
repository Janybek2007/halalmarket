FROM node:24-alpine AS builder


ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG VITE_OAUTH_SERVER_URL

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY

RUN npm install -g bun

WORKDIR /app

COPY bun.lock* package.json ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npx", "next", "start"]
