# Interno
A modern full-stack project with a React frontend and .NET backend
## Prerequisites
Node.js (v18 or higher)

.NET SDK (v8.0 or higher)

PostgreSQL (v15 or higher) 
## Frontend Setup (React + Vite)
`cd interno`
### Install dependencies
`npm install`
### Set up environment variables
`cp .env.example .env`
### Run the frontend
`npm run dev`
## Backend Setup (.NET API)
`cd internoApi`
### Restore dependencies
`dotnet restore`
### Set up environment variables
`cp .env.example .env`
### Apply database migrations
`dotnet ef database update`
### Run the backend
`dotnet run`