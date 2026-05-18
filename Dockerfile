# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm install --prefix client && npm install --prefix server

COPY client ./client
RUN npm run build --prefix client

COPY server ./server
RUN npm install --prefix server --omit=dev

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/node_modules ./server/node_modules

RUN mkdir -p /app/data

EXPOSE 5000

CMD ["node", "server/index.js"]
