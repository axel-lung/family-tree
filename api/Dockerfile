# Étape 1 : build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build api --configuration=production

# Étape 2 : exécution allégée
FROM node:18-alpine
WORKDIR /
COPY --from=builder /app/dist/api ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "dist/main.js"]