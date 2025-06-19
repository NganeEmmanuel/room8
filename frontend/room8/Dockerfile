# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies and install first (faster rebuilds)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build


# Stage 2: Serve with a lightweight web server
FROM nginx:alpine AS production

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
