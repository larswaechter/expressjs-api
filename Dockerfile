FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy package.json
COPY package.json /usr/src/app

# Install node_modules
RUN npm install

# Copy files
COPY . /usr/src/app
