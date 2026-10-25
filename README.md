# Fullstack Application Boilerplate

This is a fullstack application starter boilerplate with a lot of useful features. The project is split up into a client directory that runs a Nuxt 3 application for the front-end and a server directory that runs a NestJS application which also connects to a MongoDB database.

## Tech Stack

[![My Skills](https://skillicons.dev/icons?i=vue,nuxt,html,css,nestjs,mongodb,docker)](https://skillicons.dev)

## API Architecture Features

This boilerplate includes a production-oriented API foundation designed to keep both frontend and backend code consistent as the application grows.
These features establish clear boundaries between request handling, validation, response formatting, and frontend API consumption.

### 1. Reusable Nuxt API Composable

The frontend uses a centralized `useApi()` composable instead of scattered `fetch()` calls. This keeps request behavior consistent across the app by handling the API base URL, default headers, auth token support, request bodies, query params, and normalized errors in one place.

### 2. Consistent Backend Response Format

The backend wraps all successful responses and errors in a shared API format. Controllers can return simple data, while a global interceptor formats successful responses and a global exception filter formats errors. This gives the frontend one predictable response contract.

### 3. Global Request Validation

The backend uses a shared global validation pipe with DTO-based request contracts. Invalid input fails before reaching controller or service logic, unknown fields are rejected, and query params can be transformed into the correct types automatically. This makes future API modules cleaner, safer, and easier to scale.

### 4. Health Check Endpoint

Dedicated `GET /health` endpoint checks API uptime and MongoDB availability, making the project ready for Docker, deployment health checks, monitoring, and debugging.

### 5. Lightweight Request Logging

The backend includes simple global request logging to make debugging easier during development and production support. Each request logs a request ID, method, path, status code, and duration, while skipping sensitive data such as bodies and auth tokens. Logging is built on Nest’s native logger and can be configured through environment variables.

## Docker

Create and start the development container:

```bash
docker compose up --build -d
```

This also runs a one-off seed container that adds a few dummy users to MongoDB. The seed is idempotent, so running it again will update the sample users without creating duplicates.

Manually seed the database:

```bash
docker compose run --rm seed
```

Reset and reseed the users collection:

```bash
docker compose run --rm seed npm run seed:reset
```

Stop and remove the development container:

```bash
docker compose down
```

Create and start the production container:

```bash
docker compose -f compose.production.yaml up --build -d
```

Stop and remove the production container:

```bash
docker compose -f compose.production.yaml down
```
