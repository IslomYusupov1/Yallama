FROM node:21-alpine as builder
ARG API_BASE_URL=${API_BASE_URL}
ENV VITE_BASE_URL=$API_BASE_URL
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN npm run build

FROM nginx:stable
RUN apt-get update && apt-get install -y curl
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist .
HEALTHCHECK --start-period=5s CMD curl --fail http://localhost/web_metrics || exit 1
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]