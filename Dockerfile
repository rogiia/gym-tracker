# Multi-stage build for Gym Tracker application
# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Install backend dependencies
RUN cd backend && npm ci --only=production

# Stage 2: Final image
FROM node:20-alpine

# Install nginx
RUN apk add --no-cache nginx

# Create app directory
WORKDIR /app

# Copy backend files and dependencies
COPY --from=dependencies /app/backend/node_modules ./backend/node_modules
COPY backend/package*.json ./backend/
COPY backend/*.js ./backend/

# Copy frontend files to nginx html directory
COPY frontend/ /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create data directory for SQLite database
RUN mkdir -p /app/data && chmod 755 /app/data

# Create nginx directories and set permissions
RUN mkdir -p /var/log/nginx /var/lib/nginx /run/nginx && \
    chown -R nginx:nginx /var/log/nginx /var/lib/nginx /run/nginx

# Create startup script
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "Starting Gym Tracker application..."' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start nginx in background' >> /app/start.sh && \
    echo 'echo "Starting nginx..."' >> /app/start.sh && \
    echo 'nginx' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Start backend server' >> /app/start.sh && \
    echo 'echo "Starting backend server on port 3000..."' >> /app/start.sh && \
    echo 'cd /app/backend' >> /app/start.sh && \
    echo 'exec node server.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose ports
EXPOSE 80 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Run startup script
CMD ["/app/start.sh"]
