### 🚀 Quick Start (Running with Docker)

This project is fully containerized, meaning you can get the API and the Database up and running with a single command, without needing Node.js or PostgreSQL installed on your local machine.

#### Prerequisites

* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

#### 1. Environment Setup

First, create your environment variables file. You can easily do this by copying the example file provided in the repository:

```bash
cp .env.example .env

```

> **Note:** The default values in `.env.example` are already configured to work seamlessly with the `docker-compose.yml` setup.

#### 2. Start the Application

Open your terminal in the root directory of the project and run the following command to build and start the containers in detached mode:

```bash
docker-compose up -d --build

```

> *The first time you run this, it will take a few moments to download the images and install the NestJS dependencies. Subsequent runs will be much faster.*

#### 3. Access the API

Once the containers are successfully running, the backend server will be available at:
**`http://localhost:3000`**

📚 **API Documentation:** You can explore and test the endpoints using Swagger UI at **`http://localhost:3000/api/docs`**

#### 4. Stopping the Application

When you are done testing, you can stop and remove the containers gracefully by running:

```bash
docker-compose down

```
