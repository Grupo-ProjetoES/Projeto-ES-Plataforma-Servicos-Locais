FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


FROM nginx:1.25-alpine

# Remove o conteúdo padrão e ajusta permissões
RUN rm -rf /usr/share/nginx/html/* && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html

# Alterna para o usuário não-root do Nginx
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]