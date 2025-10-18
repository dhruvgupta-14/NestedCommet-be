# Use official Node.js 22 (slim version for smaller size & better compatibility)
FROM node:22-slim

# Set working directory inside container
WORKDIR /app

# Copy only package files first (for better caching)
COPY package*.json ./

# Install dependencies (only production deps for smaller image)
RUN npm install 

# Copy the rest of your app
COPY . .

# Expose the backend port (make sure this matches your .env PORT)
EXPOSE 8000

# Set environment variable (optional)
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]