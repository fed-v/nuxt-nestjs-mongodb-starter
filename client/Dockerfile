# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.22.2
ARG API_BASE_URL='http://nestjs:4000'

################################################################################
# Set the base image
FROM node:${NODE_VERSION}-alpine AS base

# Set the working directory
WORKDIR /usr/src/app

# Define a build argument
ARG API_BASE_URL

# Set the environment variable 
# IMPORTANT: This is a build-time environment variable rather than using a .env.docker file like in the NestJS service
# This is because the environment variable is used in the build stage
ENV API_BASE_URL=${API_BASE_URL}


################################################################################
# Create a stage for installing dependencies
FROM base AS dependencies

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci


################################################################################
# Create a stage for running the application in development mode
FROM dependencies AS development

# Copy the source code
COPY . .

# Expose the port
EXPOSE 3000

# Run the application
CMD [ "npm", "run", "dev" ]


################################################################################
# Create a stage for building the application
FROM dependencies AS build

# Set the environment variable 
# IMPORTANT: This is a build-time environment variable rather than using a .env.docker file like in the NestJS service
# This is because the environment variable is used in the build stage
ENV API_BASE_URL=${API_BASE_URL}

# Copy the source code
COPY . .

# Build the application
RUN npm run build

# Remove extraneous packages
RUN npm prune


################################################################################
# Create a stage for running the application in production mode
FROM base AS production

# Set the environment variable 
# IMPORTANT: This is a build-time environment variable rather than using a .env.docker file like in the NestJS service
# This is because the environment variable is used in the build stage
ENV API_BASE_URL=${API_BASE_URL}

# Copy the built application
COPY --from=build /usr/src/app/.output /usr/src/app/.output

# Run the application
CMD [ "node", ".output/server/index.mjs" ]
