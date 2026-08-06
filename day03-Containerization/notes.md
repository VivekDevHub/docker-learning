# 🐳 Docker Beginner Series – Chapter 3

## Dockerizing Our Application | Dockerfile | Image | Container | Port Mapping | Volumes

### 🎬 INTRO

Hello everyone, welcome back to **Vivek Dev Hub**.

Aaj hum Docker series ke **Chapter 3** mein enter kar rahe hain.

Ab tak humne Docker ke basics samjhe hain, lekin aaj hum ek **real Node.js + Express application ko Docker ke andar run karenge.**

Aaj ke chapter mein hum cover karenge:

* Dockerfile kya hoti hai?
* Docker Image kaise build hoti hai?
* Container kaise create aur run hota hai?
* Dockerfile ke important instructions
* `RUN` vs `CMD`
* `.dockerignore`
* Port Mapping
* MongoDB ko Docker mein run karna
* Docker Volumes
* Bind Mount ka basic concept

So let's start!

---

# 1️⃣ Sabse Pehle Normal Node.js Project Banate Hain

Sabse pehle hum ek normal Node.js project banayenge.

Terminal open karo aur:

```bash
mkdir docker-node-app
cd docker-node-app
npm init -y
```

Ab dependencies install karenge:

```bash
npm install express mongoose morgan
```

Development ke liye agar nodemon use karna hai:

```bash
npm install -D nodemon
```

Ab `package.json` mein:

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

Ab ek simple Express server banate hain.

`server.js`

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Docker!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

Ab normal machine par run karo:

```bash
npm run dev
```

Browser mein:

```text
http://localhost:3000
```

Agar `"Hello from Docker!"` aa raha hai, iska matlab hamara normal Node.js application properly run ho raha hai.

---

# 2️⃣ Ab Question Aata Hai – Dockerize Kaise Karein?

Ab hum isi application ko Docker ke andar run karna chahte hain.

Aur yahin par entry hoti hai:

## Dockerfile

Dockerfile ek simple text file hoti hai jisme instructions likhi hoti hain ki Docker ko hamari application ki image kaise build karni hai.

Simple language mein:

**Dockerfile = Blueprint**

Jaise ghar banane se pehle blueprint hota hai, waise hi Docker image banane ke liye Dockerfile blueprint ka kaam karti hai.

Flow yaad rakho:

```text
Dockerfile
     ↓
Docker Image
     ↓
Docker Container
```

Ya simple words mein:

**Dockerfile se Image banti hai, aur Image se Container run hota hai.**

---

# 3️⃣ Docker Image ke Andar Kya Hota Hai?

Docker Image ko tum ek **ready-to-use package/template** samajh sakte ho.

Iske andar generally hamari application ko run karne ke liye required cheezein hoti hain:

```text
Docker Image
│
├── Base OS / Linux files
├── Node.js Runtime
├── Dependencies
└── Application Code
```

Matlab agar hamare system mein Node.js installed nahi bhi hai, toh Docker image ke andar Node runtime provide kiya ja sakta hai.

---

# 4️⃣ Dockerfile Create Karte Hain

Project ke root folder mein ek file create karo:

```text
Dockerfile
```

Important:

Dockerfile ka generally koi `.txt` ya `.js` extension nahi hota.

Ab likhte hain:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

Ab ek-ek line samajhte hain.

---

# 5️⃣ FROM

```dockerfile
FROM node:20-alpine
```

`FROM` batata hai ki hamari image ka **base image kya hoga**.

Hum Node.js application bana rahe hain, toh hume Node.js environment chahiye.

Yahan:

```text
node = Node.js image
20   = Node.js version
alpine = lightweight Linux distribution
```

Toh basically:

**Node.js + Linux environment**

---

# 6️⃣ Alpine Kya Hai?

Ab question:

### Alpine hi kyun?

Alpine ek lightweight Linux distribution hai.

Normal Linux based images comparatively large ho sakti hain.

Alpine ka benefit:

* Small image size
* Fast download
* Less storage
* Faster deployment

Isliye Docker images mein Alpine kaafi popular hai.

---

# 7️⃣ WORKDIR

Next:

```dockerfile
WORKDIR /app
```

Iska matlab:

**Container/image ke andar `/app` ko working directory bana do.**

Ab Docker ke andar hamara application isi `/app` folder ke andar work karega.

So imagine:

```text
Container
   │
   └── /app
        │
        ├── server.js
        ├── package.json
        └── node_modules
```

---

# 8️⃣ COPY

Next:

```dockerfile
COPY package*.json ./
```

Yahan hum host machine se `package.json` aur `package-lock.json` ko image ke `/app` folder mein copy kar rahe hain.

Phir:

```dockerfile
COPY . .
```

Iska simple meaning:

**Current project ke files ko container/image ke current working directory mein copy karo.**

First `.`:

```text
Host ka current folder
```

Second `.`:

```text
Image ke andar current folder
```

Aur kyunki humne:

```dockerfile
WORKDIR /app
```

set kiya hai, toh files `/app` ke andar jayengi.

---

# 9️⃣ RUN

Next:

```dockerfile
RUN npm install
```

Ye bahut important hai.

`RUN` command **image build time par execute hoti hai.**

Matlab Docker image build karte waqt:

```text
package.json
      ↓
npm install
      ↓
node_modules install
      ↓
Image ke andar dependencies
```

---

# 🔟 RUN vs CMD

Ye interview mein bhi poocha ja sakta hai.

### RUN

```dockerfile
RUN npm install
```

`RUN` image **build time** par execute hota hai.

### CMD

```dockerfile
CMD ["npm", "run", "dev"]
```

`CMD` container **start/run time** par execute hota hai.

Simple trick:

```text
RUN → Image Build Time

CMD → Container Run Time
```

Yaad rakho:

**RUN image banate time, CMD container chalate time.**

---

# 1️⃣1️⃣ Build Phase vs Run Phase

Docker ko broadly do phases mein samajh sakte ho:

## Build Phase

Jab image ban rahi hoti hai:

```text
Dockerfile
   ↓
FROM
WORKDIR
COPY
RUN
   ↓
Docker Image
```

## Run Phase

Jab image ko run karte hain:

```text
Docker Image
     ↓
docker run
     ↓
Container
     ↓
CMD execute
```

Isliye:

**RUN → Build Phase**

**CMD → Run Phase**

---

# 1️⃣2️⃣ Docker Image Build Karte Hain

Ab actual image banate hain.

Terminal mein project root par:

```bash
docker build -t vivek-first-image .
```

Isko break karte hain:

```text
docker build → Image build karo

-t → Image ko tag/name do

vivek-first-image → Image ka naam

. → Current directory mein Dockerfile dhundo
```

Build complete hone ke baad:

```bash
docker images
```

Is command se tumhari Docker images dekh sakte ho.

---

# 1️⃣3️⃣ Container Run Karte Hain

Ab image ko run karenge:

```bash
docker run vivek-first-image
```

Docker image se ek container create karega aur container ke andar CMD execute karega.

Docker Desktop mein bhi tum image aur container dekh sakte ho.

Aur container ka naam agar tumne manually specify nahi kiya hai, Docker automatically ek name assign kar sakta hai.

---

# ⚠️ IMPORTANT – Image Automatically Update Nahi Hoti

Suppose tumne `server.js` change kiya.

Tum sochoge ki container mein bhi automatically change aa jayega.

But normally:

**Docker image automatically update nahi hoti.**

Agar Dockerfile ya application files image mein copy hone wali hain aur tumne changes kiye hain, toh image ko dobara build karna padega:

```bash
docker build -t vivek-first-image .
```

Phir container run karo.

---

# 1️⃣4️⃣ .dockerignore

Ab ek important file create karte hain:

```text
.dockerignore
```

Andar:

```text
node_modules
```

Question:

### node_modules ko ignore kyun karein?

Because `node_modules` bahut large ho sakta hai.

Aur ek aur important reason:

**Node modules platform-dependent ho sakte hain.**

Host machine ke installed modules ko blindly container mein copy karna reliable approach nahi hai.

Hum kya karenge?

Host ka:

```text
node_modules ❌
```

copy nahi karenge.

Instead Dockerfile mein:

```dockerfile
RUN npm install
```

rakhenge.

Docker container ke environment ke according dependencies install kar dega.

---

# 1️⃣5️⃣ nodemon: command not found

Ab maan lo `.dockerignore` mein:

```text
node_modules
```

hai.

Aur Dockerfile mein:

```dockerfile
CMD ["npm", "run", "dev"]
```

Hai.

Agar `nodemon` `devDependencies` mein installed hai aur Docker image ke andar dependencies install nahi hui hain, toh error aa sakti hai:

```text
nodemon: not found
```

Reason?

Container ke andar `node_modules` nahi hai.

Solution:

Dockerfile mein:

```dockerfile
RUN npm install
```

ensure karo.

Example:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

Ab Docker build ke time dependencies install hongi.

---

# 1️⃣6️⃣ PORT MAPPING

Ab aata hai Docker ka ek bahut important concept:

## Port Mapping

Container isolated environment mein run hota hai.

Matlab container ke andar chal rahi application directly host machine/browser se accessible nahi hoti jab tak hum uske port ko expose/map na karein.

Suppose Express app container ke andar:

```text
Port 3000
```

par run ho rahi hai.

Hum host machine ke port ko container port se connect karenge.

Syntax:

```bash
docker run -p HOST_PORT:CONTAINER_PORT IMAGE_NAME
```

Example:

```bash
docker run -p 3000:3000 vivek-first-image
```

Meaning:

```text
Host Machine
Port 3000
     ↓
     ↓
Container
Port 3000
```

Agar browser mein:

```text
http://localhost:3000
```

open karoge, request container ke port `3000` tak forward hogi.

---

# 1️⃣7️⃣ Host Port aur Container Port Same Hona Zaroori Hai?

No.

Dono different bhi ho sakte hain.

For example:

```bash
docker run -p 5000:3000 vivek-first-image
```

Meaning:

```text
Host Port      Container Port
   5000   →       3000
```

Ab browser mein:

```text
http://localhost:5000
```

open karoge.

Request container ke:

```text
Port 3000
```

par jayegi.

So remember:

```text
-p HOST_PORT:CONTAINER_PORT
```

---

# 1️⃣8️⃣ MongoDB Docker Container

Ab ek real example dekhte hain.

Hum MongoDB ko bhi Docker container ke andar run kar sakte hain.

```bash
docker run mongo:7
```

Ye MongoDB image se container run karega.

Agar host machine se MongoDB ko access karna hai toh port mapping karenge:

```bash
docker run -p 27019:27017 mongo:7
```

Yahan:

```text
Host
27019
  ↓
Container
27017
```

Ab MongoDB client mein connection banate time host port `27019` use kar sakte ho.

---

# 1️⃣9️⃣ Docker Volume

Ab sabse important problem:

### Container delete ho gaya toh database ka data?

By default container ke writable filesystem mein stored data container ke lifecycle se tied ho sakta hai.

Agar container delete kar diya:

```text
MongoDB Container
       │
       ↓
 Database Data

Container Delete ❌
       ↓
Data can be lost ❌
```

Is problem ko solve karne ke liye use hota hai:

# Docker Volume

Volume ek persistent storage mechanism hai jo container ke lifecycle se data ko separate rakhne mein help karta hai.

Concept:

```text
MongoDB Container
       │
       ↓
Docker Volume
       │
       ↓
Database Data
```

Ab:

```text
Container Delete ❌

Volume ✅
Data ✅
```

Isliye databases jaise MongoDB ke liye volumes extremely important hain.

---

# 2️⃣0️⃣ Dockerfile ke Important Instructions

Ab quickly Dockerfile ke important instructions revise karte hain.

### FROM

Base image define karta hai.

```dockerfile
FROM node:20-alpine
```

### WORKDIR

Working directory set karta hai.

```dockerfile
WORKDIR /app
```

### COPY

Host se files image mein copy karta hai.

```dockerfile
COPY . .
```

### RUN

Image build time par command execute karta hai.

```dockerfile
RUN npm install
```

Multiple `RUN` instructions ho sakti hain.

### CMD

Container start hone par default command set karta hai.

```dockerfile
CMD ["npm", "run", "dev"]
```

Generally ek effective default `CMD` use karna best practice hai.

### EXPOSE

Image metadata mein batata hai ki application kis port ko use karna chahti hai.

```dockerfile
EXPOSE 3000
```

Important:

`EXPOSE` khud host port mapping nahi karta.

Port mapping ke liye:

```bash
docker run -p 3000:3000 image-name
```

use karte hain.

### ENV

Environment variables define karne ke liye use hota hai.

```dockerfile
ENV NODE_ENV=production
```

---

# 🔥 FINAL REVISION – Sirf 8 Lines

Agar tumhe Docker ka Chapter 3 ekdum short mein yaad rakhna hai, toh ye 8 lines yaad rakho:

```text
Dockerfile  = Blueprint

Image       = Template / Package

Container   = Running Instance of Image

docker build = Image banao

docker run   = Container chalao

-p           = Port Mapping

Bind Mount   = Host Code ↔ Container Code

Volume       = Persistent Data
```

Aur complete flow:

```text
Your Code
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
Application Running
```

---

# 🎬 OUTRO

So guys, aaj ke chapter mein humne practically dekha ki ek normal Node.js/Express application ko Docker ke andar kaise run karte hain.

Humne cover kiya:

Dockerfile,

Docker Image,

Docker Container,

`FROM`,

`WORKDIR`,

`COPY`,

`RUN`,

`CMD`,

`.dockerignore`,

Port Mapping,

MongoDB Container,

aur Docker Volumes.

Agar video helpful laga ho toh video ko like karo, channel ko subscribe karo aur comment mein batao ki Docker ka next chapter kis topic par chahiye.

Milte hain next chapter mein.

**Keep Learning, Keep Building! 🚀**

This is Vivek Dev Hub.
