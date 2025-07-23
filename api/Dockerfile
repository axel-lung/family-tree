# FROM node:18
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# EXPOSE 3333
# WORKDIR /dist/api
# CMD ["node", "api/src/main.js"]


# Build stage
FROM node:18 AS builder

WORKDIR /

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx nx build api --configuration=production

# Production stage
FROM node:18-alpine

WORKDIR /

COPY --from=builder /dist ./dist
COPY --from=builder /package*.json ./

RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 3333
WORKDIR /dist/api
CMD ["node", "api/src/main.js"]
