# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY next.config.ts postcss.config.mjs eslint.config.mjs tsconfig.json components.json source.config.ts ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application's source code
COPY . .

# Build the app
RUN pnpm build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["pnpm", "start"]
