# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gym Tracker is a containerized web application for tracking gym sessions and muscle group training frequency. It displays a heatmap of workout sessions, tracks muscle group balance, and provides insights into training patterns.

**Tech Stack:**
- **Backend:** Node.js with Express (REST API)
- **Database:** SQLite (file-based, for simplicity)
- **Frontend:** Vanilla JavaScript (no build process)
- **Deployment:** Docker container with Nginx reverse proxy

## Commands

### Backend Development
```bash
# Install dependencies
cd backend && npm install

# Start the backend server (port 3000)
npm start
```

### Docker
```bash
# Build the Docker image
docker build -t gym-tracker .

# Run the container
docker run -p 80:80 -p 3000:3000 -v $(pwd)/data:/app/data gym-tracker

# Note: Volume mount for /app/data ensures SQLite database persists across restarts
```

## Architecture

### Backend Structure
- **`backend/server.js`**: Express server with REST API endpoints
  - `GET /api/sessions` - Fetch all gym sessions
  - `POST /api/sessions` - Create new session (requires date and muscle_groups array)
  - `PUT /api/sessions/:id` - Update existing session
  - `DELETE /api/sessions/:id` - Delete session
- **`backend/database.js`**: SQLite database layer with schema and query functions
- **Database schema**: Single `sessions` table with columns: `id` (TEXT), `date` (TEXT, ISO format), `muscle_groups` (TEXT, JSON array)

### Frontend Structure
- **`frontend/index.html`**: Main HTML structure
- **`frontend/app.js`**: Core application logic and state management
- **`frontend/api.js`**: API client for backend communication
- **`frontend/styles.css`**: Application styling
- **Frontend architecture**: Modular vanilla JS without build tools, served directly by Nginx

### Muscle Groups
The application tracks 6 muscle groups: Chest, Legs, Delts (shoulders), Lats (back), Triceps, Biceps

### Balance Indicator Logic
- **Happy**: All 6 muscle groups trained 2+ times in last 7 days
- **Neutral**: All 6 muscle groups trained 1+ times in last 7 days
- **Angry**: Any muscle group not trained in last 7 days

### Docker Configuration
- Single container runs both Nginx (frontend) and Express (backend)
- Nginx serves static files and proxies `/api/*` requests to Express
- SQLite database requires volume mount for persistence
- Ports: 80 (Nginx/HTTP), 3000 (Express API)

## Important Implementation Details

### Date Format
All dates are stored and transmitted in ISO 8601 format (YYYY-MM-DD) for consistency between frontend and backend.

### Session IDs
Sessions use UUID format for unique identification.

### Muscle Groups Storage
Muscle groups are stored as JSON-encoded arrays in the SQLite TEXT column, e.g., `["Chest", "Legs", "Delts"]`.

### Heatmap Implementation
Uses Cal-Heatmap library (loaded via CDN) to visualize workout frequency across the year.
