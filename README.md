# Post-Comments Service

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend Server](#starting-the-frontend-server)
- [API Endpoints](#api-endpoints)
- [Contact Information](#contact-information)

---

## Introduction

The **Post-Comments Service** is a web application that allows users to create text-based posts and enables other users to comment on these posts. It supports multiple nested comments per post, as well as likes and replies on each comment and post. This app is built using the MERN stack (MongoDB, Express, React, Node.js).

---

## Features

- **User Registration and Authentication**: Supports user registration, login, and logout functionality.
- **Post Creation**: Users can create posts, which are displayed to all users.
- **Commenting System**: Users can add comments to posts and reply to comments, enabling nested discussions.
- **Liking System**: Users can like or unlike posts and comments.
- **Real-Time Updates**: The frontend dynamically displays updated comments, replies, and like counts.

---

## Architecture

The application follows a **Client-Server** architecture:

- **Frontend**: Built using React.js for a dynamic user interface, with Tailwind CSS for styling.
- **Backend**: Developed with Node.js and Express.js, handling data management, user authentication, and CRUD operations for posts and comments.
- **Database**: MongoDB is used to persist user data, posts, comments, and likes.

---

#### Application Architecture

![Architecture Diagram](<./images/architecture.drawio%20(3).png> "Architecture Diagram")

---

## Prerequisites

Ensure the following software is installed:

- **Node.js** (v20.x or later)
- **npm** (v10.x or later)
- **MongoDB** (v4.x or later)
- **Git**

---

## Installation

### Backend Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/snoopdeep/post-comments-service-CloudSEK.git
   ```

   ```bash
   cd post-comments-service-CloudSEK/backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   In the `.env` file inside the `backend` directory, add your MongoDB connection URL and JWT secret key:

   ```bash
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

### Frontend Setup

1. **Navigate to the Frontend Directory**

   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

---

## Running the Application

### Starting the Backend Server

From the `backend` directory, run:

```bash
npm run dev
```

This will start the backend server on `http://localhost:5000` (default port can be configured).

### Starting the Frontend Server

From the `frontend` directory, run:

```bash
num run dev
```

This will start the frontend development server on `http://localhost:5173/`.

---

## Starting with Docker

I assume you have installed Docker and it is running.

See the [Docker website](http://www.docker.io/gettingstarted/#h_installation) for installation instructions.

**Environment Variables:** Ensure .env variables (e.g., MONGODB_URI, JWT_SECRET) are configured correctly in backend/.env file.

## Build

Run the following command to build and start the containers:

```bash
docker-compose up --build
```

Once everything has started up, you should be able to access the app via [http://localhost:5173/](http://localhost:5173/) on your host machine.

```bash
http://localhost:5173/
```

To stop the services, use:

```bash
docker-compose down
```

# Contact Information

If you have any questions or would like to reach out, feel free to contact me via the following channels:

- **Email**: [singhdeepak.bengaluru7@gmail.com](mailto:singhdeepak.bengaluru7@gmail.com)
- **Phone No**: [+91 9170520433](9170520433)
