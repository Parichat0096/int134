# Stage 1: Build
FROM node:24.11.0-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN mkdir -p intproj25/pl1/itb-ecors
COPY --from=build /app/dist ./intproj25/pl1/itb-ecors
COPY nginx.conf /etc/nginx/conf.d/default.conf
