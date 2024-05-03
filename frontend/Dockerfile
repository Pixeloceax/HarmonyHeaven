FROM node:alpine as build

WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm install --omit=dev

# Use unprivileged image for security
FROM nginxinc/nginx-unprivileged

# Configuration file
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

USER nginx

CMD ["nginx", "-g", "daemon off;"]