# Étape 1 : Construire l'application Angular
   FROM node:18 AS build
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   COPY . .
   RUN npx nx build frontend --configuration=production

   # Étape 2 : Servir avec Nginx
   FROM nginx:alpine
   COPY --from=build /app/dist/apps/frontend /usr/share/nginx/html
   COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]