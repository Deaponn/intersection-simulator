# Traffic Intersection Simulator

A full-stack, highly interactive traffic intersection simulation engine built with **TypeScript**. This project allows users to design complex intersections, configure lane turns, and simulate vehicle and pedestrian traffic. It features both a CLI for automated batch processing and a rich Web GUI for real-time visualization.

## 🌟 Key Features
* **Custom Intersection Engine:** Define 4-way intersections with variable lane counts and dynamic turn restrictions (preventing collidable trajectories).
* **Visual Editor & Playback:** A wizard-based React frontend utilizing `react-konva` to construct simulations and render playback of the server's output state.
* **Traffic Controllers:** Pluggable traffic light algorithms (currently featuring `simple-controller` and `with-arrows`).
* **Headless CLI Support:** Run simulations directly from the terminal using standard JSON inputs and outputs.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Docker](https://www.docker.com/) (Optional, for running the full-stack GUI)

### 1. Running the CLI Simulation (Automated Mode)
The simulation can be executed purely via the terminal using a single command. It takes an input JSON and generates an output JSON. Examples for these files are in `backend/examples/` directory.

```bash
# Install dependencies
npm install

# Run the simulation engine via CLI
npm run simulate -- input.json output.json
```

### 2. Running the Visualizer GUI (Full-Stack Mode)
To experience the graphical intersection builder and the playback engine, start the containerized environment. This spins up the Express backend, the React frontend, and an Nginx reverse proxy.

```bash
# Start the Docker environment
docker compose up --build
```
Navigate to **`http://localhost:8080`** in your browser.

---

## 🧠 Traffic Light Algorithm: `simple-controller` and `with-arrows`

The project currently implements a baseline `simple-controller` and `with-arrows` controllers to manage the intersection's flow. 

**How it works:**
1.  **Fixed-Time Phasing:** The controller operates on a deterministic, time-based cycle, alternating the `greenAxis` between the North-South (`vertical`) and East-West (`horizontal`) roads. If the controller is `with-arrows`, the right arrow is green for the last tick of current green axis.
2.  **Conflict Resolution:** * Vehicles going `straightAhead` or turning `right` are given priority during their axis's green phase.
    * Left-turning vehicles must yield to oncoming traffic (unless a dedicated left-turn arrow phase is active, depending on lane configuration).
3.  **Pedestrian Safety:** Pedestrians are allowed to cross parallel to the active `greenAxis`. Turning vehicles wait at the `preCrosswalk` state if pedestrians are actively crossing the destination road.
4.  **Sub-step Architecture:** A single `step()` command evaluates the intersection in three micro-phases to prevent gridlock:
    * *Phase A:* Cars clear the crosswalk (`preCrosswalk` -> exit).
    * *Phase B:* Cars enter the intersection (`postLights` -> `preCrosswalk`).
    * *Phase C:* Cars cross the stop line (`preLights` -> `postLights`).

---

## 🏗️ Architecture & Technologies

The project follows a decoupled client-server architecture to ensure high performance and maintainability:

**Backend Node.js & Express:**
Serves as the API for the GUI and houses the core simulation loop.

**Frontend React:**
Helps to render current user settings and the result from the server.

**Infrastructure Docker & Nginx:**
Containerized for easy deployment and local development. Nginx proxies `/api` requests to the backend while serving the frontend.