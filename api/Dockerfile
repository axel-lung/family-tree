# FROM node:18
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# EXPOSE 3333
# CMD ["npx", "nx", "serve", "api", "--configuration=production"]


# Étape 1 : build
FROM node:18 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build api --configuration=production

# Étape 2 : exécution allégée
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /api ./dist
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./
ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "dist/main.js"]
