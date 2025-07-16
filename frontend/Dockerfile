# Étape 1 : Construire l'application Angular
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx nx build frontend --configuration=production

# Injecte la variable API_URL dans Angular
ARG API_URL
ENV API_URL=${API_URL}

# Remplace la valeur dans le fichier d'environnement Angular
RUN sed -i "s|API_URL_PLACEHOLDER|${API_URL}|g" src/environments/environment.prod.ts


# Étape 2 : Servir avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]