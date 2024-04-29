# Use a base image containing Node.js and npm
FROM node:alpine
# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose the port on which the application listens
EXPOSE 5200

# Start the React application
CMD ["npm", "run", "preview"]