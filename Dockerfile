# Use an older, specific version of Node to ensure vulnerabilities are present
FROM node:10.24.1-slim

# Create and define the working directory for the application
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
# This leverages Docker's build cache
COPY package*.json ./

# Install the outdated dependencies defined in package.json
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Expose the port the application runs on
EXPOSE 3000

# Define the command to run the application
CMD [ "npm", "start" ]