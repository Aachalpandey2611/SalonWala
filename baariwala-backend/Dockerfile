# Stage 1: Build Environment
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies required for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Set Node environment
ENV NODE_ENV=production

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Create a non-root user for security
RUN addgroup -S SalonWala && adduser -S SalonWala -G SalonWala
USER SalonWala

EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
