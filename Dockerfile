# Step 1: Build Angular App
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Build the Angular app
RUN npm run build --output-path=dist/portfolio --prod

# Step 2: Serve App with Nginx
FROM nginx:1.25-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy build output from the previous stage
COPY --from=build /app/dist/portfolio/ . 

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
