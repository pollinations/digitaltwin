# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ngrok
RUN npm install -g ngrok

# Copy the rest of the application code
COPY . .

# Make the start script executable
RUN chmod +x start_patpapo.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the application using the start_patpapo.sh script
CMD ["./start_patpapo.sh"]