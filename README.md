# Cymulate Task - Phishing Simulation Project

This project consists of three main components:
- Phishing Management Server (NestJS)
- Phishing Simulation Server (NestJS)
- Frontend Application (React)

## Prerequisites

Make sure you have installed:
- Docker and Docker Compose (for Docker deployment)
- Node.js and npm (for local development)
- MongoDB (for local development without Docker)

## Running with Docker Compose

### 1. Clone the repository

```bash
git clone <repository-url>
cd nestjs-react-phishing
```

### 2. Environment Variables

The Docker Compose file is already configured with default environment variables:

**Database Configuration:**
- MongoDB credentials: admin/password
- MongoDB URI: mongodb://admin:password@mongodb:27017/cymulate-task?authSource=admin

**Service Ports:**
- Frontend: 5173
- Phishing Management: 5000
- Phishing Simulation: 5001
- MongoDB: 27017
- Mongo Express: 8081

**Security:**
- JWT Secret: your_jwt_secret_key

**Email Configuration (for phishing simulation):**
- EMAIL_USER: example@gmail.com
- EMAIL_PASSWORD: your_email_app_password

**CORS Configuration:**
- CORS_ORIGIN: http://frontend:5173,http://localhost:5173,http://phishing-management:5000

You can modify these variables in the docker-compose.yml file if needed.

### 3. Build and Start the containers

```bash
# Build and start all services
docker-compose up -d

# If you need to rebuild services after making changes
docker-compose up -d --build
```

### 4. Access the services

- Frontend: http://localhost:5173
- Phishing Management API: http://localhost:5000
- Phishing Simulation API: http://localhost:5001
- MongoDB Express (Database UI): http://localhost:8081

### 5. Check logs

```bash
# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs phishing-management
docker-compose logs phishing-simulation
docker-compose logs frontend
```

### 6. Stop the containers

```bash
# Stop all containers but preserve data
docker-compose down

# Stop all containers and remove volumes (will delete database data)
docker-compose down -v
```

## Running Locally (without Docker)

### 1. Set up MongoDB

Make sure MongoDB is installed and running on your machine or use a cloud-hosted instance.

### 2. Configure Environment Variables

Create .env files for each service:

**For phishing-management/.env:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cymulate-task
JWT_SECRET=your_jwt_secret_key
SIMULATION_API_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:5173,http://localhost:5001
```

**For phishing-simulation/.env:**
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/cymulate-task
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
SERVER_URL=http://localhost:5001
CORS_ORIGIN=http://localhost:5173,http://localhost:5000
```

**For frontend/.env:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Install dependencies and run each service

Open three separate terminal windows:

**Terminal 1 (Phishing Management):**
```bash
cd phishing-management
npm install
npm run start:dev
```

**Terminal 2 (Phishing Simulation):**
```bash
cd phishing-simulation
npm install
npm run start:dev
```

**Terminal 3 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the services

- Frontend: http://localhost:5173
- Phishing Management API: http://localhost:5000
- Phishing Simulation API: http://localhost:5001

## Project Structure

```
nestjs-react-phishing/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   └── ...
├── phishing-management/
│   ├── Dockerfile
│   └── ...
└── phishing-simulation/
    ├── Dockerfile
    └── ...
```
