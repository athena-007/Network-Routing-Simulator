# Network Routing Simulator using Dijkstra's Algorithm

## Overview

The **Network Routing Simulator** is a web-based application that demonstrates shortest path routing in a network using **Dijkstra's Algorithm**. Users can create a network of routers, connect them using weighted links, and calculate the shortest route between any two routers.

The application consists of a **C++ routing engine**, a **FastAPI backend**, and an interactive **HTML, CSS, and JavaScript frontend**. The frontend communicates with the backend through REST APIs, while the backend executes the C++ program to compute the shortest path.

---

# Features

- Create a custom network with any number of routers.
- Add weighted links between routers.
- Compute the shortest path using Dijkstra's Algorithm.
- Interactive graphical network visualization using HTML Canvas.
- Animated packet movement along the shortest path.
- FastAPI REST API backend.
- C++ routing engine integration.
- Input validation and error handling.
- Responsive web interface.

---

# Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- HTML Canvas API

## Backend

- Python 3
- FastAPI
- Uvicorn
- Pydantic

## Routing Engine

- C++
- Standard Template Library (STL)

---

# Project Structure

```
NetworkRoutingSimulator/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── service.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── build/
│   └── routing_engine.exe
│
├── routing_engine.cpp
│
└── README.md
```

---

# Project Workflow

1. The user creates a network by specifying the number of routers.
2. Weighted links are added between routers.
3. The frontend sends the network information to the FastAPI backend.
4. FastAPI invokes the C++ routing engine.
5. Dijkstra's Algorithm computes the shortest path.
6. The backend returns the shortest distance and path.
7. The frontend displays the path graphically and animates packet traversal.

---

# Algorithm Used

## Dijkstra's Shortest Path Algorithm

The routing engine computes the shortest path between the selected source and destination routers.

### Steps

1. Initialize the distance to every router as infinity.
2. Set the source router distance to zero.
3. Use a priority queue to repeatedly select the router with the minimum tentative distance.
4. Relax all adjacent edges.
5. Update parent routers whenever a shorter path is found.
6. Continue until all reachable routers have been processed.
7. Reconstruct the shortest path using the parent array.

---

# API Endpoints

## Home

### GET /

Returns

```json
{
    "message": "Router Routing Backend is Running!"
}
```

---

## Calculate Shortest Path

### POST /route

### Request Body

```json
{
    "nodes": 5,
    "edges": [
        [0,1,10],
        [0,2,5],
        [1,3,8],
        [2,3,6],
        [3,4,2]
    ],
    "source": 0,
    "destination": 4
}
```

### Response

```json
{
    "distance": 13,
    "path": [0,2,3,4]
}
```

---

# Installation

## Install Python dependencies

```bash
pip install fastapi uvicorn pydantic
```

or

```bash
pip install -r requirements.txt
```

---

## Compile the C++ routing engine

### Windows

```bash
g++ routing_engine.cpp -o build/routing_engine.exe
```

### Linux/macOS

```bash
g++ routing_engine.cpp -o build/routing_engine
```

---

## Start the backend

```bash
cd backend

uvicorn app.main:app --reload
```

Backend runs at

```
http://127.0.0.1:8000
```

---

## Launch the frontend

Open the **frontend** folder using the **Live Server** extension in Visual Studio Code.

---

# Example

### Network

```
0 --------10--------1
|                    |
5                    8
|                    |
2 --------6---------3
           |
           2
           |
           4
```

### Source

```
0
```

### Destination

```
4
```

### Output

```
Shortest Distance

13

Shortest Path

0 → 2 → 3 → 4
```

---

# Input Validation

The application validates:

- Invalid router numbers
- Invalid edge weights
- Missing input values
- Invalid graph structure
- No available route between routers

---

# Current Functionality

The current version of the project supports:

- Creating a network topology
- Adding weighted connections
- Computing the shortest path using Dijkstra's Algorithm
- Backend communication through FastAPI
- Execution of a C++ routing engine
- Graphical visualization of the network
- Packet animation along the computed shortest path
- Display of shortest distance and path

---

# Learning Outcomes

This project demonstrates practical implementation of:

- Graph data structures
- Dijkstra's Shortest Path Algorithm
- Object-Oriented Programming in C++
- REST API development using FastAPI
- Frontend-backend communication
- HTML Canvas graphics
- JavaScript asynchronous programming
- Integration of C++ with Python

---

# Authors

Developed as an academic project for demonstrating shortest path routing using Dijkstra's Algorithm.

---

# License

This project is intended for educational and academic purposes only.
