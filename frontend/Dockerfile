# Build stage
FROM node:20 AS build
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code and build
COPY . .
RUN npm run build

# Production stage: nginx
FROM nginx:alpine

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html/intproj25/pl1/itb-ecors
