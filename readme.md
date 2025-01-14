# E-commerce Microservices Project (redis and redis cluster usage)

This project is an e-commerce platform built using a microservices architecture. The system consists of the following services:

- **Auth Service**: Handles user authentication and authorization.
- **Product Service**: Manages product data.
- **Inventory Service**: Manages product inventory.
- **Order Service**: Handles order creation and management.

The project uses Docker Compose for service orchestration and integrates Redis and MongoDB for caching, message queuing, and data persistence.

---

## Features

### Redis Cluster Usage

1. **Authentication Token Storage** (Auth Service):

   - **Service Name**: Auth Service
   - After user login, the authentication token is stored in Redis for session management.
   - Redis is queried to validate tokens, ensuring efficient and secure authentication across services.

2. **Product Creation Queue** (Product Service and Inventory Service):

   - **Service Names**: Product Service, Inventory Service
   - When a new product is created, its details are added to a Redis queue.
   - The Inventory Service consumes the queue to automatically create and update inventory entries for the new product.

3. **Order Processing Queue** (Order Service and Inventory Service):

   - **Service Names**: Order Service, Inventory Service
   - When an order is placed, its details (e.g., product IDs, quantities) are pushed to a Redis queue.
   - The Inventory Service consumes the queue to adjust inventory levels for the ordered products.

4. **Task Status Management** (Across All Services):

   - **Service Names**: All services using Redis queues
   - Each task in Redis queues is tracked using a status key:
     - **Pending**: Task is added to the queue.
     - **Processing**: Task is picked up by a worker.
     - **Complete**: Task is successfully processed.
     - **Failed**: Task encountered an error during processing.
   - This status management ensures better visibility and control over task processing.

5. **Caching Frequently Accessed Data**:
   - **Service Names**: All services
   - Redis is used to cache frequently accessed data (e.g., user session details, product metadata) to reduce database load and improve response times.

---

## Project Structure

### Services

- **Auth Service**:

  - Port: `4001`
  - Database: `auth-service` MongoDB collection

- **Product Service**:

  - Port: `4002`
  - Database: `product-service` MongoDB collection

- **Inventory Service**:

  - Port: `4003`
  - Database: `inventory-service` MongoDB collection

- **Order Service**:
  - Port: `4005`
  - Database: `order-service` MongoDB collection

### Dependencies

- **Redis Cluster**: Used for caching and message queuing.
- **MongoDB**: Used for persistent data storage.
- **Docker Compose**: Used to orchestrate the services.

---

## Setup Instructions

### Prerequisites

- Install Docker and Docker Compose on your machine.

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Start the services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Verify the setup:
   - Auth Service: [http://localhost:4001](http://localhost:4001)
   - Product Service: [http://localhost:4002](http://localhost:4002)
   - Inventory Service: [http://localhost:4003](http://localhost:4003)
   - Order Service: [http://localhost:4005](http://localhost:4005)

---

## Redis Cluster Setup

The Redis cluster consists of three nodes:

- `redis-1` (Port: `6379`)
- `redis-2` (Port: `6380`)
- `redis-3` (Port: `6381`)

The cluster is initialized by the `redis-cluster-init` service.

---

## Docker Compose File

```yaml
version: "3.8"

services:
  redis-1:
    image: "redis:latest"
    command: redis-server --port 6379 --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    ports:
      - "6379:6379"
    volumes:
      - redis-1-data:/data
    networks:
      - microservices-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis-2:
    image: "redis:latest"
    command: redis-server --port 6379 --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    ports:
      - "6380:6379"
    volumes:
      - redis-2-data:/data
    networks:
      - microservices-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis-3:
    image: "redis:latest"
    command: redis-server --port 6379 --cluster-enabled yes --cluster-config-file nodes.conf --cluster-node-timeout 5000
    ports:
      - "6381:6379"
    volumes:
      - redis-3-data:/data
    networks:
      - microservices-net
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis-cluster-init:
    image: "redis:latest"
    depends_on:
      redis-1:
        condition: service_healthy
      redis-2:
        condition: service_healthy
      redis-3:
        condition: service_healthy
    command: >
      /bin/sh -c '
      redis-cli -h redis-1 FLUSHALL &&
      redis-cli -h redis-2 FLUSHALL &&
      redis-cli -h redis-3 FLUSHALL &&
      sleep 5 &&
      redis-cli --cluster create redis-1:6379 redis-2:6379 redis-3:6379 --cluster-replicas 0 --cluster-yes
      '
    networks:
      - microservices-net

  auth-service:
    build:
      context: ./auth-service
      dockerfile: Dockerfile.dev
    ports:
      - "4001:4001"
    environment:
      - NODE_ENV=development
      - PORT=4001
      - DATABASE_URL=mongodb://mongodb:27017/auth-service
      - REDIS_NODES=redis://redis-1:6379,redis://redis-2:6379,redis://redis-3:6379
    depends_on:
      redis-cluster-init:
        condition: service_completed_successfully
      mongodb:
        condition: service_started
    networks:
      - microservices-net
    volumes:
      - ./auth-service:/app
    command: npm run dev

  # Other services follow a similar structure...

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb-data:/data/db
    networks:
      - microservices-net

networks:
  microservices-net:
    driver: bridge

volumes:
  mongodb-data:
  redis-1-data:
  redis-2-data:
  redis-3-data:
```

---

## Notes

- Ensure all environment variables are correctly set in `.env` files or directly in the `docker-compose.yml` file.
- Update the `REDIS_NODES` environment variable if adding more Redis nodes.

---
