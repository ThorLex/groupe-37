# Dockerfile pour app Node.js + MongoDB
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "src/app.js"]
