# QPGrocery

QPGrocery API is a RESTful API for managing grocery items and orders.

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [PostgreSQL](https://www.postgresql.org/) (You can install it locally or use a cloud-hosted service like [ElephantSQL](https://www.elephantsql.com/))

### Setup

1. run npm init (npm init -y)
2. setup typescript (npm install typescript --save-dev)
3. install prisma library (npm install @prisma/client prisma --save-dev)
4. run prisma migration to create schema (prisma migrate dev --name added_job_title)
5. setup env file
   here are env variables that you need to create in env file :
   DATABASE_URL="postgresql://postgres:password@localhost:5433/db_name?schema=public"
   APP_PORT=your server port
   JWT_SECRET_KEY="your secret key"
6. I heve used postgresql database.
7. Created docker file for deployment.
8. TODO: create docker compose file for development with 2 services backend and DB.
