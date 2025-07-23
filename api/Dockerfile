FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3333
WORKDIR /dist/api
CMD ["node", "api/src/main.js"]