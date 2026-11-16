FROM node:lts

WORKDIR /app

# Copy package files, configuration and install dependencies
COPY package*.json .npmrc ./
RUN npm install

# Copy the rest of the application code
COPY tsconfig.json users.json ./
COPY src ./src

# Build the TS code to JS
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
