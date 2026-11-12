FROM node:22-bookworm-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json users.json ./
COPY src ./src
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
