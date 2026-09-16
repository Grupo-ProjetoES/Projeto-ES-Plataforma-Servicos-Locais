FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

# Adicionado --ignore-scripts para evitar execução de scripts maliciosos durante o npm ci
RUN npm ci --ignore-scripts

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


FROM nginx:1.25-alpine

# Ajusta as permissões dos diretórios do Nginx para permitir execução por um usuário não-root
RUN rm -rf /usr/share/nginx/html/* && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html

# Muda a execução do container para o usuário não-privilegiado "nginx"
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]