# Stage 1
FROM node:21.4-bullseye-slim as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

#Stage 2
FROM nginx:1.25.3-alpine-slim

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
EXPOSE 3000
ENTRYPOINT ["nginx", "-g", "daemon off;"]


