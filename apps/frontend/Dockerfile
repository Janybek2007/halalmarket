FROM node:24-alpine AS builder

RUN apk add --no-cache ca-certificates

RUN npm install -g bun

WORKDIR /app

ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_URL
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
		NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
		NEXT_PUBLIC_IMAGE_URL=${NEXT_PUBLIC_IMAGE_URL} \
		NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY}

COPY bun.lock* package.json ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build


FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]
