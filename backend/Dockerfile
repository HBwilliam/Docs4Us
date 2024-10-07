# Use the official Node.js image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["node", "server.cjs"]  # Replace with the actual name of your app file
