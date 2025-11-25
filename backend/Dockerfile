FROM node:24.11.0-bookworm-slim
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3443

CMD ["node", "app.js"]
