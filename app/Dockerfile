FROM node:lts

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json users.json ./
COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
