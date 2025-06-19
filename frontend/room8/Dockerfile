# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies and install
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of the application
COPY . .

# Build with Vite (assumes base: '/room8/')
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS production

# Copy built assets into /usr/share/nginx/html/room8
COPY --from=builder /app/dist /usr/share/nginx/html/room8

# Replace default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
