# Base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the Vue project
RUN npm run build

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "serve", "&&", "node", "backend/server.cjs" ]