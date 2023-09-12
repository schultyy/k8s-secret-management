# Specify the base image
FROM node:20-bookworm

RUN apt-get update && apt-get install -y netcat-openbsd iputils-ping && rm -rf /var/apt/lists*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port your application listens on (if applicable)
EXPOSE 3000

# Start the application
CMD ["/bin/bash", "-c", "node index.js"]
