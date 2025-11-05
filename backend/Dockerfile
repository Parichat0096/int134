FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV LANG=C.UTF-8

EXPOSE 3000
CMD ["node", "server.js"]
