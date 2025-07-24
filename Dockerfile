FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generic build – no API_URL baked in
RUN npm run build

# Install serve globally to serve static files
RUN npm install -g serve

# Copy and make entrypoint script executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Use entrypoint script to generate runtime config and start server
ENTRYPOINT ["/entrypoint.sh"] 