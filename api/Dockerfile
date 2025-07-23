FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3333
WORKDIR /
CMD ["node", "dist/main.js"]