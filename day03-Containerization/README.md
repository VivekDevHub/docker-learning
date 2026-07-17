# Chapter 3 - Running Express Server Inside a Docker Container

## Dockerfile | Image Build | Port Mapping | Volumes

> 📌 Previous chapters covered **why Docker exists** and **basic Docker commands**. In this chapter, we containerize a real Node.js/Express server — build an image, run it, map ports, and persist data using volumes.

---

## 🎯 What We'll Do in This Chapter

- Run a Node.js Express server inside a container
- Understand what goes inside a Docker Image
- Create and understand a `Dockerfile`
- Solve the `node_modules` OS-compatibility problem
- Use `.dockerignore` to exclude unnecessary files
- Build and run a Docker Image
- Fix the "nodemon watching too much" problem
- Understand Port Mapping (host ↔ container)
- Understand Volumes (persistent storage)

---

## 🧱 Step 1 - Create a Normal Node.js Project

Before containerizing anything, first build a normal Node.js project outside Docker:

1. Initialize a Node.js project (`npm init`)
2. Install Express
3. Write a basic server
4. Run it normally with `npm run dev` / `node server.js`

✅ Make sure the server runs successfully **on your machine first**, before putting it inside Docker.

---

## 📦 Recap - What's Inside an Image?

When we run an image, a **container** is created from it.

An image contains **4 core things**:

```
Docker Image
│
├── Operating System (base OS files)
├── Node.js Runtime
├── Dependencies (node_modules)
└── Application Code
```

---

## ⚠️ Important - node_modules Are OS-Specific!

> **Question:** Is `node_modules` different for different operating systems?
> **Answer:** ✅ Yes.

Some npm packages contain **native binaries** (compiled C/C++ code) that are built specifically for an OS (Windows/macOS/Linux). This means:

- `node_modules` installed on **Windows** may **not work** inside a **Linux-based container**.
- This is why we **never copy `node_modules` from host to image**.
- Instead, we let Docker **run `npm install` inside the container itself**, so the correct OS-specific modules get installed.

This is exactly why `.dockerignore` will be used to exclude `node_modules` (explained below).

---

## 🐳 Step 2 - Create a `Dockerfile`

Create a new file in your **project root directory** named exactly:

```
Dockerfile
```

(No extension — just `Dockerfile`)

### Dockerfile Code

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]
```

### 🔍 Line-by-Line Explanation

| Instruction | Meaning |
|---|---|
| `FROM node:20-alpine` | Sets the **base image**. `alpine` = lightweight Linux distro, `node:20` = Node.js version 20 runtime installed on top of it. This defines the final image's foundation OS + runtime. |
| `WORKDIR /app` | Sets the **working directory** inside the container. All future commands (`COPY`, `RUN`, `CMD`) execute relative to this folder. |
| `COPY . .` | First `.` = current folder on **host machine** (your project). Second `.` = destination inside the **image** (`/app`, because of `WORKDIR`). This copies your project files from host → image. |
| `RUN npm install` | Installs dependencies **inside the container**, ensuring OS-correct `node_modules`. |
| `CMD ["npm", "run", "dev"]` | The command that runs **when the container starts** (not when the image is built). |

> 💡 `RUN` executes during **image build time**. `CMD` executes during **container run time**.

---

## 🚫 Step 3 - Create `.dockerignore`

Just like `.gitignore`, create a file named `.dockerignore` in the root folder:

```
node_modules
```

### Why?

- We don't want the host's `node_modules` copied into the image (OS-mismatch problem explained above).
- Docker will **skip/ignore** this folder while copying files via `COPY . .`
- Instead, `npm install` (inside Dockerfile) will generate a fresh, correct `node_modules` inside the container.

---

## 🏗️ Step 4 - Build the Docker Image

Run this command in the project root (where the Dockerfile is):

```bash
docker build -t my-node-app .
```

| Part | Meaning |
|---|---|
| `docker build` | Builds an image from the Dockerfile |
| `-t my-node-app` | `-t` = tag name → gives the image a readable name (`my-node-app`) |
| `.` | Build context = current directory (where Dockerfile + code exist) |

---

## ▶️ Step 5 - Run the Container

```bash
docker run my-node-app
```

### ❌ Common Error: `nodemon: not found`

**Cause:** `node_modules` (including dev dependencies like `nodemon`) weren't properly installed inside the image.

**Fix:** Make sure `RUN npm install` is present in the Dockerfile **before** `CMD`. This reads `package.json` and installs **all** required packages (including `nodemon`) inside the container.

---

## ⏹️ Stop a Running Container

```bash
docker stop container_id
```

---

## ⚙️ Problem - Nodemon Consuming Too Much RAM

**Issue:** Nodemon is supposed to watch only your **application code** for changes. But inside the container, if your code sits directly in the root (`/app`), nodemon ends up watching **the entire filesystem**, including unrelated Linux system files — causing **huge, unnecessary RAM usage**.

### ✅ Solution

Don't keep your app code directly in root. Instead:

1. Create a dedicated subfolder, e.g. `app/`
2. Move all your project code (server files, routes, package.json, etc.) inside `app/`
3. Run nodemon **from within `app/`**

Now nodemon only watches the `app/` folder — not the whole container filesystem.

```
Project Root
│
└── app/              ← nodemon watches only this
    ├── server.js
    ├── package.json
    └── ...
```

This keeps nodemon's file-watching scope small, fixing the RAM/performance issue.

---

## 🔌 Port Mapping - Host ↔ Container

By default, a container's internal port is **not accessible** from your browser/host machine. We need to explicitly map ports.

```bash
docker run -p 8080:3000 kodex:v8
```

### Syntax

```
-p HOST_PORT:CONTAINER_PORT
```

| Side | Meaning |
|---|---|
| **Left (8080)** | Port on your **host machine** (what you open in browser) |
| **Right (3000)** | Port **inside the container** (what your Express app listens on) |

➡️ Any request to `localhost:8080` on your machine gets **forwarded** to port `3000` inside the container.

> 💡 You can change the host-side port freely (e.g. `9090:3000`), but the container-side port must match what your app actually listens on internally.

### Example with MongoDB

```bash
docker run -p 8080:27017 mongo
```

This maps host port `8080` → MongoDB's default container port `27017`.

---

## 💾 Volumes - Persistent Storage

### 🧠 Simple Analogy

Think of a **Volume** like an **SD card**:
- It's small removable storage.
- You save photos/videos/songs on it.
- Even if you take it out and put it in a **different phone**, your data is still there.

Similarly, a **Docker Volume**:
- Is a small storage unit
- **Managed by Docker itself**
- **Physically lives on the host machine**
- Independent of any single container's lifecycle

### Why Do We Need Volumes?

Containers are **temporary** — by default, when a container is deleted, **all data inside it is lost** (e.g., your database records).

✅ With a volume:
- Whatever data is stored inside the container gets **automatically replicated/synced** to the volume (on the host).
- Even if the container is **deleted**, the data **survives** inside the volume.
- A new container can be **reconnected to the same volume** to restore the data.

### Volume Command Syntax

```bash
docker run -p HOST_PORT:CONTAINER_PORT -v volume_name:container_path image_name
```

### Example - MongoDB with Volume

```bash
docker run -p 27019:27017 -v mongo-data:/data/db mongo:7
```

| Part | Meaning |
|---|---|
| `-p 27019:27017` | Maps host port `27019` → container's MongoDB port `27017` |
| `-v mongo-data:/data/db` | Creates/uses a volume named `mongo-data`, synced with `/data/db` inside the container |
| `mongo:7` | The MongoDB image (version 7) being used |

### What Happens Here?

- MongoDB, by default, stores its database files inside `/data/db` **inside the container**.
- By mapping `mongo-data:/data/db`, Docker keeps this folder **in sync** with the `mongo-data` volume on the host.
- So even if this MongoDB container is stopped/deleted, your database data stays safe inside the `mongo-data` volume.
- Next time you run a new container with `-v mongo-data:/data/db`, it picks up the **same data** again.

```
Container (/data/db)  ⇄  Volume (mongo-data, on host)
        [in sync — data persists even after container deletion]
```

---

## 🎯 Chapter 3 Summary

- ✅ Ran an Express server inside a Docker container
- ✅ Understood the 4 components of an Image (OS, Runtime, Dependencies, Code)
- ✅ Learned why `node_modules` are OS-specific
- ✅ Created a `Dockerfile` (`FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`)
- ✅ Used `.dockerignore` to exclude `node_modules`
- ✅ Built an image using `docker build -t`
- ✅ Ran and stopped containers
- ✅ Fixed the nodemon high-RAM-usage issue using a dedicated app folder
- ✅ Understood Port Mapping (`-p host:container`)
- ✅ Understood Volumes (`-v volume_name:container_path`) for persistent storage

---

## 🚀 Coming Next

**Chapter 4** — Docker Compose, multi-container setups, and networking between containers 🚀