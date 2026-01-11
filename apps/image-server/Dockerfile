FROM node:24-alpine

RUN npm install -g bun

WORKDIR /app

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile

COPY src/ ./src/

EXPOSE 3030

CMD ["node", "src/main.js"]
