# Step 1: Serve App with Nginx (dist/ is built in CI, not here)
FROM nginx:1.25-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy pre-built Angular app from CI artifact
COPY dist/portfolio/ .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]