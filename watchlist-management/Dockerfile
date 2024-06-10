# Use the Node 20 image as the base image
FROM node:20

# Set the working directory within the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json package.json
COPY yarn.lock yarn.lock

# Install the Node.js dependencies using yarn
RUN yarn install

# Copy the entire application code to the working directory in the container
COPY . .

ENV NODE_ENV=dev

# Start the application in development mode
CMD ["yarn", "start:dev"]

