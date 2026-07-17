# 🐳 Docker Notes (Beginner Friendly)

A complete beginner's guide to understanding and using Docker.

---

## 📚 Table of Contents

- [Chapter 1 - Why Docker?](#chapter-1---why-docker--what-is-docker--image-vs-container)
- [Chapter 2 - Installing Docker](#chapter-2---installing-docker--docker-setup--basic-commands)

---

# Chapter 1 - Why Docker? | What is Docker? | Image vs Container

## 📌 The Problem Before Docker

Before Docker, developers faced a common problem:

> "Works on my machine, but not on yours."

Let's understand this problem.

---

### Example 1: Different Dependencies Problem

Suppose you create a backend server using:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt

These are the dependencies required for your application.

#### 👨‍💻 Red User
Installed: ✅ Node.js ✅ MongoDB ✅ Express ✅ Mongoose ✅ JWT ✅ Bcrypt

The project works perfectly.

#### 👨‍💻 Blue User
Installed: ✅ Node.js ❌ MongoDB

When Blue User runs the project:
```
Error: MongoDB not found
```
The application does not work. Blue User first needs to install MongoDB manually.

---

### Example 2: Different Runtime Version Problem

Suppose your project is developed using **Node.js Version 18**.

#### 👨‍💻 Red User
Application works successfully.

#### 👨‍💻 Blue User
Node.js: 16 — Some JavaScript features are not supported.

**Result:** Application Crashes ❌

---

## 🚨 "Works on My Machine" Problem

This happens because every developer has a different environment.

Every machine may have:
- Different Operating System
- Different Node.js Version
- Different Database Version
- Different Libraries
- Different Dependencies

Even if the code is exactly the same, the application may behave differently.

---

## 🖥️ Backend Server Depends On 4 Things

```
Backend Server
│
├── Operating System
├── Runtime Environment
├── Dependencies
└── Application Code
```

### 1️⃣ Operating System
Examples: Windows, Linux, macOS

The Operating System manages computer hardware and provides an environment to run applications.

### 2️⃣ Runtime Environment
Example: Node.js allows JavaScript code to execute outside the browser.

### 3️⃣ Dependencies
Dependencies are packages required by your application.

> Examples: Express, Mongoose, MongoDB Driver, JWT, Bcrypt, dotenv

Without dependencies, the application cannot work properly.

### 4️⃣ Application Code
This is the code written by developers.

> Examples: Routes, Controllers, Models, APIs, Business Logic

---

## Summary

A backend application is a combination of:

```
Operating System
+
Runtime Environment
+
Dependencies
+
Application Code
```

If any one of these changes, the application may stop working.

---

## 🎯 What Do We Want?

- ✅ Same environment everywhere
- ✅ Same Node.js version
- ✅ Same dependencies
- ✅ Same operating system environment
- ✅ Same application behavior
- ✅ No manual installation every time

---

## 🐳 Docker Solves This Problem

Docker packages everything required by an application into a single portable unit.

```
Operating System Files
+
Runtime
+
Dependencies
+
Application Code
```

Now the complete environment becomes portable.

---

## 📦 What Does Docker Actually Create?

Docker creates a file that contains the complete application environment. This file is called a **Docker Image**.

Think of an image as a snapshot of your application. It contains:
- Application Code
- Runtime
- Dependencies
- Required OS Files
- Configuration

---

## 🐳 What is Docker?

Docker is an open-source platform used to:
- Build applications
- Package applications
- Ship applications
- Run applications inside containers

Docker ensures applications behave the same on every machine.

> **Definition:** Docker is a platform that packages an application along with its runtime, dependencies, and required environment into containers, allowing it to run consistently on any system.

---

## 📦 What is a Docker Image?

A Docker Image is a read-only blueprint used to create Docker containers. It contains instructions and files required to build a container.

### Docker Image Contains:
- Application Code
- Node.js Runtime
- Dependencies
- Required OS Files
- Configuration

### Important Point

When we share an application environment:
- ❌ We don't share the container
- ✅ We share the Docker Image

Because: `Image → Creates → Container`

> **Definition:** A Docker Image is a read-only blueprint that contains everything required to create and run a Docker Container.

---

## Real World Example

A class is a blueprint of an object. Using one class we can create multiple objects.

Similarly:

```
Docker Image
     |
     Creates Multiple Containers
```

---

## 🆚 Docker Image vs Container

| Docker Image | Docker Container |
|---|---|
| Blueprint | Running Application |
| Read-only | Read/Write |
| Cannot execute directly | Executes application |
| Used to create containers | Created from image |
| One image can create many containers | Each container is an independent instance |

---

## 🖥️ Understanding Operating System in Docker

Many beginners think:

> Docker contains a complete operating system.

This is **not** completely true.

A container contains:
- OS User Space Files
- Libraries
- Binaries

But: ❌ Container does not contain its own Kernel

---

## 🧠 What is Kernel?

Kernel is the core part of an operating system. It works as a bridge between software and hardware.

### Kernel Manages:
- CPU
- Memory
- Storage
- Devices
- Processes

---

## Does Every Container Have Its Own Kernel?

❌ No. Containers share the Host Operating System Kernel.

```
Host Machine
Linux Kernel
│
├── Container 1
├── Container 2
└── Container 3
```

All containers use the same kernel. Only the application environment is isolated.

---

## 🚀 Why Are Containers Lightweight?

Containers do not include a separate kernel.

Benefits:
- ✅ Smaller size
- ✅ Faster startup
- ✅ Lower memory usage
- ✅ Better performance

### Example Size Comparison

| Image | Approx. Size |
|---|---|
| Alpine Linux | ≈ 5 MB |
| Node.js 20 Alpine Image | ≈ 170–180 MB |

Container shares the host kernel.

---

## Why Docker is Faster Than Virtual Machine?

Because containers:
- Do not have a separate OS
- Do not have a separate kernel
- Use fewer resources

Therefore: **Docker Container → Faster Startup → Less Memory Usage → Better Performance**

---

## 🔒 Container Isolation

Each Docker container runs in an isolated environment. This means:
- ✅ Separate filesystem
- ✅ Separate processes
- ✅ Separate networking

Other containers continue working independently.

---

## 🎯 Chapter 1 Summary

- ✅ Why Docker was created
- ✅ Works on My Machine problem
- ✅ Backend environment components
- ✅ What Docker solves
- ✅ What is Docker
- ✅ What is Docker Image
- ✅ What is Docker Container
- ✅ Difference between Image and Container
- ✅ Kernel concept
- ✅ Why containers are lightweight
- ✅ Docker vs Virtual Machine
- ✅ Container Isolation
