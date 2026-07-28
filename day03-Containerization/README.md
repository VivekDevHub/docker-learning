# 🐳 Chapter 3 – Dockerizing Our Application

In this chapter, we will learn how to **Dockerize a Node.js/Express application** and understand the core Docker concepts required for running applications inside containers.

## 📚 What We Will Learn

* How Docker runs a Node.js/Express project
* What is a Dockerfile?
* Docker Image vs Docker Container
* How to build a Docker Image
* How to run a Docker Container
* Docker Port Mapping
* Bind Mounts / Code Mapping
* Docker Volumes
* MongoDB Data Persistence
* Running an Express Server inside Docker
* Important Dockerfile instructions

---

# 🏗️ Docker Architecture

The basic Docker workflow is:

```text
Node.js / Express Project
          │
          ▼
      Dockerfile
          │
     docker build
          │
          ▼
     Docker Image
          │
      docker run
          │
          ▼
   Docker Container
          │
          ▼
    Running Application
```

---

# 1️⃣ Create a Normal Node.js Project

First, create a normal Node.js project without Docker.

```bash
mkdir docker-app
cd docker-app

npm init -y
```

Install dependencies:

```bash
npm install express mongoose morgan
```

Install Nodemon for development:

```bash
npm install -D nodemon
```

---

# 2️⃣ Configure `package.json`

Use ES Modules and configure development scripts.

```json
{
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

---

# 3️⃣ Create `server.js`

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Docker!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

Run the application normally:

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# 4️⃣ What is a Dockerfile?

A **Dockerfile** is a text file containing instructions that tell Docker how to build a Docker Image.

Think of it as a **blueprint for creating an image**.

```text
Dockerfile
     │
     │ docker build
     ▼
Docker Image
     │
     │ docker run
     ▼
Docker Container
```

> Dockerfile → Image → Container

---

# 5️⃣ What is inside a Docker Image?

A Docker Image can contain:

```text
Docker Image
│
├── Base OS / Linux userspace
├── Node.js Runtime
├── Dependencies
└── Application Code
```

For a Node.js application, we can use an official Node.js image as our base.

---

# 6️⃣ `FROM node:20-alpine`

```dockerfile
FROM node:20-alpine
```

`FROM` defines the **base image**.

Here:

```text
node:20
   ↓
Node.js version 20

alpine
   ↓
Lightweight Linux distribution
```

So:

```text
Node.js 20
     +
Alpine Linux
     ↓
Base Image
```

### Why Alpine?

Alpine is lightweight compared to many general-purpose Linux distributions.

Benefits:

* Smaller image size
* Faster download
* Less storage
* Faster deployment

---

# 7️⃣ `WORKDIR /app`

```dockerfile
WORKDIR /app
```

This sets the working directory inside the image/container.

After this instruction, commands such as `COPY`, `RUN`, and `CMD` operate relative to `/app` unless otherwise specified.

The container structure can look like:

```text
/app
│
├── package.json
├── package-lock.json
├── server.js
└── node_modules
```

---

# 8️⃣ `COPY . .`

```dockerfile
COPY . .
```

The syntax is:

```text
COPY <host-path> <image-path>
```

In:

```dockerfile
WORKDIR /app

COPY . .
```

The first `.` means:

```text
Current project directory on the host
```

The second `.` means:

```text
Current working directory inside the image
```

So:

```text
Host Project
│
├── package.json
├── server.js
└── src/
       │
       │ COPY
       ▼
Container /app
│
├── package.json
├── server.js
└── src/
```

---

# 9️⃣ `RUN npm install`

```dockerfile
RUN npm install
```

`RUN` executes a command during the **image build process**.

It reads `package.json` and installs the application's dependencies inside the image.

```text
docker build
     ↓
RUN npm install
     ↓
Dependencies installed
     ↓
Image created
```

---

# 🔟 `CMD`

```dockerfile
CMD ["npm", "run", "dev"]
```

`CMD` specifies the default command that runs when a container starts from the image.

```text
docker run
     ↓
Container starts
     ↓
CMD executes
     ↓
npm run dev
     ↓
Express Server
```

### RUN vs CMD

```text
RUN
 ↓
Image build time

CMD
 ↓
Container start/run time
```

Easy way to remember:

> **RUN = Image banate waqt**

> **CMD = Container chalate waqt**

---

# 1️⃣1️⃣ Complete Dockerfile

Create a file named:

```text
Dockerfile
```

Add:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

# 1️⃣2️⃣ Build Docker Image

Run this command from the project root:

```bash
docker build -t vivek-first-image .
```

Explanation:

```text
docker build
    ↓
Build an image

-t
    ↓
Give the image a name/tag

vivek-first-image
    ↓
Image name

.
    ↓
Current directory / build context
```

---

# 1️⃣3️⃣ Run Docker Container

After creating the image:

```bash
docker run vivek-first-image
```

Docker creates a container from the image and starts it.

```text
Dockerfile
     ↓
docker build
     ↓
Image
     ↓
docker run
     ↓
Container
```

You can give the container your own name:

```bash
docker run --name my-node-container vivek-first-image
```

---

# 1️⃣4️⃣ Check Docker Images

To see all available Docker Images:

```bash
docker images
```

You may see:

```text
REPOSITORY          TAG       IMAGE ID
vivek-first-image   latest    abc123
second-image        latest    xyz456
third-image         latest    pqr789
```

---

# 1️⃣5️⃣ Important: Images Don't Automatically Update

If you modify your Dockerfile or application files, Docker does **not** automatically rebuild the existing image.

You need to build the image again:

```bash
docker build -t vivek-first-image .
```

Then create/run a container from the updated image.

---

# 1️⃣6️⃣ `.dockerignore`

Create:

```text
.dockerignore
```

Example:

```text
node_modules
.git
.env
npm-debug.log
```

### Why ignore `node_modules`?

Host `node_modules` may contain dependencies with native binaries that are specific to the host OS/CPU.

For example:

```text
Mac
 ↓
node_modules
 ↓
Potentially Mac-specific native binaries
```

But the Docker container is typically Linux-based:

```text
Docker Container
 ↓
Linux
 ↓
Linux-compatible dependencies
```

Therefore, instead of copying the host's `node_modules`, install dependencies inside the image:

```dockerfile
RUN npm install
```

---

# 1️⃣7️⃣ Common Error: `nodemon: not found`

You may see:

```text
nodemon: not found
```

This can happen when Nodemon is not installed inside the container.

If `nodemon` is a development dependency, make sure your Docker build installs development dependencies and that your `package.json` contains:

```json
{
  "scripts": {
    "dev": "nodemon server.js"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

Then rebuild the image:

```bash
docker build -t vivek-first-image .
```

---

# 1️⃣8️⃣ Port Mapping

Containers are isolated environments.

Suppose our Express application is running inside the container on:

```text
Container :3000
```

The host/browser cannot automatically access that container port.

We use **Port Mapping**.

```bash
docker run -p 3000:3000 vivek-first-image
```

Syntax:

```bash
docker run -p HOST_PORT:CONTAINER_PORT IMAGE_NAME
```

Example:

```text
-p 3000:3000
   │     │
   │     └── Container Port
   └──────── Host Port
```

Flow:

```text
Browser
   │
   │ localhost:3000
   ▼
Host Machine :3000
   │
   │ Port Mapping
   ▼
Container :3000
   │
   ▼
Express Server
```

Now open:

```text
http://localhost:3000
```

---

# 1️⃣9️⃣ Host Port and Container Port Can Be Different

They do not have to be the same.

For example:

```bash
docker run -p 8080:3000 vivek-first-image
```

Means:

```text
Browser
   ↓
localhost:8080
   ↓
Host :8080
   ↓
Container :3000
   ↓
Express Server
```

Open:

```text
http://localhost:8080
```

Remember:

```text
-p HOST_PORT:CONTAINER_PORT
```

---

# 2️⃣0️⃣ `EXPOSE`

Dockerfile:

```dockerfile
EXPOSE 3000
```

`EXPOSE` indicates the port that the application inside the image is intended to use.

However:

```dockerfile
EXPOSE 3000
```

does **not** publish the port to your host by itself.

For host access, use:

```bash
docker run -p 3000:3000 vivek-first-image
```

---

# 2️⃣1️⃣ Bind Mounts / Code Mapping

During development, we don't want to rebuild the Docker image every time we change code.

We can use a **Bind Mount**.

```text
Host Project
     │
     │ Bind Mount
     ▼
Container /app
```

Example:

```bash
docker run -p 3000:3000 -v "$(pwd):/app" vivek-first-image
```

Now changes made on the host can be reflected inside the container.

With Nodemon:

```text
Host Code Change
       ↓
Bind Mount
       ↓
Container sees the change
       ↓
Nodemon detects change
       ↓
Server restarts
       ↓
Latest code runs
```

### Port Mapping vs Bind Mount

```text
PORT MAPPING
Browser
   ↓
Host Port
   ↓
Container Port
   ↓
Application
```

```text
BIND MOUNT
Host Code
   ↓
Container Code
   ↓
Nodemon
   ↓
Application Restart
```

They solve **different problems**.

---

# 2️⃣2️⃣ Docker Volumes

A Docker Volume is used for **persistent data storage**.

This becomes especially important for databases such as MongoDB.

Without a volume:

```text
MongoDB Container
       │
       └── Database Data

Container deleted
       ↓
Data may be lost
```

With a volume:

```text
MongoDB Container
       │
       ▼
Docker Volume
       │
       ▼
Persistent Database Data
```

The volume has its own lifecycle separate from the container.

---

# 2️⃣3️⃣ MongoDB Container

Run MongoDB:

```bash
docker run mongo:7
```

To expose MongoDB to the host:

```bash
docker run -p 27019:27017 mongo:7
```

Mapping:

```text
Host :27019
     ↓
Container :27017
     ↓
MongoDB
```

Your MongoDB client can connect using:

```text
localhost:27019
```

---

# 2️⃣4️⃣ MongoDB + Docker Volume

Create a volume:

```bash
docker volume create mongo-data
```

Run MongoDB with the volume:

```bash
docker run \
  --name my-mongo \
  -p 27019:27017 \
  -v mongo-data:/data/db \
  mongo:7
```

Flow:

```text
MongoDB Container
       │
       │ /data/db
       ▼
Docker Volume
   mongo-data
       │
       ▼
Persistent Data
```

If the MongoDB container is removed and recreated using the same volume, the database data can remain available.

---

# 2️⃣5️⃣ Bind Mount vs Docker Volume

| Feature            | Bind Mount                                    | Docker Volume               |
| ------------------ | --------------------------------------------- | --------------------------- |
| Storage managed by | Host filesystem                               | Docker                      |
| Common use         | Development code                              | Persistent application data |
| Code sync          | ✅ Yes                                         | ❌ Not the primary purpose   |
| MongoDB data       | Possible, but not usually the simplest choice | ✅ Recommended               |
| Example            | `-v "$(pwd):/app"`                            | `-v mongo-data:/data/db`    |

### Easy way to remember:

```text
Bind Mount
     ↓
Host Code ↔ Container Code

Volume
     ↓
Container Data ↔ Persistent Storage
```

---

# 2️⃣6️⃣ Important Dockerfile Instructions

## FROM

Defines the base image.

```dockerfile
FROM node:20-alpine
```

---

## WORKDIR

Sets the working directory.

```dockerfile
WORKDIR /app
```

---

## COPY

Copies files from the build context into the image.

```dockerfile
COPY . .
```

---

## RUN

Executes commands during image build.

```dockerfile
RUN npm install
```

Multiple `RUN` instructions can be used.

---

## CMD

Defines the default command when the container starts.

```dockerfile
CMD ["npm", "run", "dev"]
```

An image can have only one effective `CMD` instruction; if multiple are specified, the last one takes effect.

---

## EXPOSE

Documents the port the application is intended to listen on.

```dockerfile
EXPOSE 3000
```

---

## ENV

Sets environment variables.

```dockerfile
ENV PORT=3000
```

---

# 2️⃣7️⃣ Build Phase vs Run Phase

This distinction is extremely important.

## Build Phase

When we execute:

```bash
docker build -t my-image .
```

Docker processes instructions such as:

```text
FROM
WORKDIR
COPY
RUN
```

Flow:

```text
Dockerfile
    ↓
FROM
    ↓
WORKDIR
    ↓
COPY
    ↓
RUN
    ↓
Docker Image
```

---

## Run Phase

When we execute:

```bash
docker run my-image
```

The container starts and the default command from `CMD` executes.

```text
Docker Image
    ↓
docker run
    ↓
Container
    ↓
CMD
    ↓
Application
```

### Easy Rule

```text
BUILD → FROM, WORKDIR, COPY, RUN

RUN   → CMD
```

---

# 🧠 Quick Revision

```text
Dockerfile
    ↓
Blueprint / Instructions

Docker Image
    ↓
Packaged template created from Dockerfile

Docker Container
    ↓
Running instance of an image

Port Mapping
    ↓
Host Port ↔ Container Port

Bind Mount
    ↓
Host Code ↔ Container

Docker Volume
    ↓
Persistent Data

MongoDB Volume
    ↓
Database survives container recreation
```

---

# 🔥 Most Important Commands

### Build Image

```bash
docker build -t my-image .
```

### Run Container

```bash
docker run my-image
```

### Run with Port Mapping

```bash
docker run -p 3000:3000 my-image
```

### Run with Container Name

```bash
docker run --name my-container my-image
```

### List Images

```bash
docker images
```

### List Running Containers

```bash
docker ps
```

### List All Containers

```bash
docker ps -a
```

### Create Volume

```bash
docker volume create mongo-data
```

### Run MongoDB with Port Mapping

```bash
docker run -p 27019:27017 mongo:7
```

### Run MongoDB with Volume

```bash
docker run \
  --name my-mongo \
  -p 27019:27017 \
  -v mongo-data:/data/db \
  mongo:7
```

---

# 🎯 Interview Questions

### 1. What is Dockerfile?

A Dockerfile is a text file containing instructions used to build a Docker Image.

### 2. What is Docker Image?

A Docker Image is a packaged, read-only template containing the application code, runtime, dependencies, and required filesystem layers needed to create containers.

### 3. What is Docker Container?

A Container is a running, isolated instance created from a Docker Image.

### 4. What is Port Mapping?

Port Mapping connects a host machine port to a container port.

```bash
docker run -p 3000:3000 image
```

### 5. What is Bind Mount?

A Bind Mount maps a directory/file from the host machine into the container, commonly used for development and live code changes.

### 6. What is Docker Volume?

A Docker Volume provides Docker-managed persistent storage that can survive container removal.

### 7. Difference between RUN and CMD?

```text
RUN → Executes during image build

CMD → Default command when container starts
```

### 8. Why use `.dockerignore`?

To prevent unnecessary or sensitive files such as `node_modules`, `.git`, and `.env` from being sent into the Docker build context.

### 9. Why use Docker Volume with MongoDB?

Because database data should survive container removal/recreation.

### 10. Why use Port Mapping?

Because a container's network is isolated. Port mapping allows services inside the container to be reached through a port on the host.

---

# 🔗 Reference Documentation

Official Docker documentation:

https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/

---

# 🚀 Chapter Summary

In this chapter, we learned how to take a normal Node.js/Express application and run it inside Docker.

The complete process is:

```text
Node.js Project
      ↓
Dockerfile
      ↓
docker build
      ↓
Docker Image
      ↓
docker run
      ↓
Docker Container
      ↓
Port Mapping
      ↓
Browser
```

For development:

```text
Host Code
    ↓
Bind Mount
    ↓
Container
    ↓
Nodemon
    ↓
Automatic Restart
```

For databases:

```text
MongoDB Container
       ↓
Docker Volume
       ↓
Persistent Data
```

> **Dockerfile builds the image, the image creates the container, Port Mapping exposes the application, Bind Mount syncs development code, and Volumes preserve important data.**

