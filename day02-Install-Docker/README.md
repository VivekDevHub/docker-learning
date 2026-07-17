# Chapter 2 - Installing Docker

**Docker Setup | Basic Commands**

---

## 🐳 Step 1 - Download Docker Desktop

Docker Desktop is the official application that allows us to run Docker on our local machine.

Visit the official Docker website:

👉 https://www.docker.com/get-started/

Download Docker Desktop according to your operating system:
- Windows
- macOS (Intel)
- macOS (Apple Silicon)

---

## 🖥️ Step 2 - Install Docker Desktop

After downloading Docker Desktop, follow these steps:

1. Double-click the installer.
2. Accept the License Agreement.
3. Keep default settings (Recommended).
4. Click Install.
5. Wait until installation completes.
6. Restart your computer if required.

---

## 🚀 Step 3 - Launch Docker Desktop

Open Docker Desktop. During the first launch, Docker automatically:

```
Starts Docker Engine
        ↓
Initializes Required Services
        ↓
Prepares Docker Environment
```

---

## 🐳 Docker Desktop Dashboard

Docker Desktop provides a graphical interface to manage Docker resources.

```
Docker Desktop
│
├── Containers
├── Images
├── Volumes
├── Networks
└── Logs
```

---

## 📦 Docker Desktop Components

### Containers
Shows all running and stopped containers.
> Example: Node Container, Mongo Container, Redis Container

### Images
Stores downloaded and created Docker Images.
> Example: `node:20`, `mongo:7`, `ubuntu`, `nginx`

### Volumes
Used for permanent data storage.
> Example: MongoDB Database Data

### Networks
Used for communication between containers.

---

## ✅ Step 4 - Verify Docker Installation

Open Terminal / Command Prompt / PowerShell and run:

```bash
docker --version
```

Example output:
```
Docker version 28.x.x
```

This confirms Docker is installed successfully.

### 🔍 Check Docker Engine

```bash
docker info
```

This displays:
- Docker Engine Status
- Number of Containers
- Number of Images
- Storage Driver
- CPU Information
- Memory Information

---

## 🌎 GitHub vs DockerHub

Many beginners confuse GitHub and DockerHub. Let's understand the difference.

### GitHub
GitHub is a collection of repositories. It stores:
- Source Code
- Projects
- Documentation
- Version History

```
GitHub
│
├── React Project
├── Node Project
└── Full Stack Project
```

### DockerHub
DockerHub is a collection of Docker Images. It stores:
- Docker Images

```
DockerHub
│
├── node image
├── mongo image
├── nginx image
└── ubuntu image
```

---

## 🐳 Docker Workflow

Before learning commands, understand the Docker workflow:

```
Docker Hub
     ↓
 docker pull
     ↓
Docker Image
     ↓
 docker run
     ↓
Docker Container
     ↓
Start | Stop | Restart | Delete
```

---

## 📌 Basic Docker Commands

### 1. Download Docker Image
```bash
docker pull image_name
```
Example:
```bash
docker pull node
```
Downloads an image from DockerHub.

### 2. View Docker Images
```bash
docker images
```
Shows all downloaded images:
```
REPOSITORY     TAG
node           latest
mongo          7
ubuntu         latest
```

### 3. Create and Run Container
```bash
docker run image_name
```
Example:
```bash
docker run hello-world
```
Flow:
```
Image → Container → Run Application
```

### 4. Run Container with Interactive Terminal
```bash
docker run -it image_name
```
- `-i` → Interactive Mode
- `-t` → Terminal Access

Example:
```bash
docker run -it ubuntu
```
You can directly interact with the container.

### 5. View Running Containers
```bash
docker ps
```
Shows only running containers (Container ID, Image, Status).

### 6. View All Containers
```bash
docker ps -a
```
Shows running **and** stopped containers.

### 7. Stop Container
```bash
docker stop container_id
# or
docker stop container_name
```
Stops a running container.

### 8. Start Container Again
```bash
docker start container_id
# or
docker start container_name
```
Restarts a stopped container.

### 9. Remove Docker Image
```bash
docker rmi image_name
```
Example:
```bash
docker rmi node
```
Deletes an image.

### 10. Remove Container
```bash
docker rm container_name
```
Example:
```bash
docker rm my-container
```
Deletes a container.

---

## 🚀 Run Your First Docker Container

```bash
docker run hello-world
```

Docker performs these steps:

```
Check Image
     ↓
Image Not Found
     ↓
Download Image From DockerHub
     ↓
Create Container
     ↓
Run Container
     ↓
Display Success Message
```

---

## 🎉 Docker Installation Successful

If you see:

```
Hello from Docker!
```

This message shows that your installation appears to be working correctly. Docker is installed successfully.

---

## 🔄 Understanding What Happened

When we executed `docker run hello-world`, Docker automatically:

1. Checked image locally
2. Image was not available
3. Downloaded image from DockerHub
4. Created a container
5. Started the container
6. Executed the program
7. Container exited

### Why Did Container Exit?

Because `hello-world` only prints a message, then the program finishes. **A container stops when the main process completes.**

---

## ⚠️ Common Docker Installation Errors

### Error 1 - Docker Engine is Not Running
**Problem:** `Cannot connect to Docker Engine`
**Cause:** Docker Desktop is closed.
**Solution:** Start Docker Desktop.

### Error 2 - WSL2 is Not Installed
**Problem:** `WSL2 installation required`
**Cause:** Windows Subsystem for Linux is missing.
**Solution:** Install WSL2 and restart the computer.

### Error 3 - Virtualization is Disabled
**Problem:** Docker Desktop cannot start.
**Cause:** CPU virtualization is disabled.
**Solution:** Enable virtualization from BIOS.

- For Intel: `Intel VT-x`
- For AMD: `AMD-V`

After enabling, restart your computer.

---

## 🎯 Chapter 2 Summary

After completing this chapter, you learned:

- ✅ Install Docker Desktop
- ✅ Understand Docker Dashboard
- ✅ Verify Docker Installation
- ✅ Difference between GitHub and DockerHub
- ✅ Docker Workflow
- ✅ Basic Docker Commands
- ✅ Run First Docker Container
- ✅ Understand Image Download Process
- ✅ Solve Common Installation Errors