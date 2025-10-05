# Gym Tracker App - Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for building the Gym Tracker application based on the Product Design Document. The application will be containerized using Docker and consist of a Node.js/Express backend with SQLite database, and a vanilla JavaScript frontend served by Nginx.

## Project Structure

```
gym-tracker/
├── backend/
│   ├── server.js              # Express server and API routes
│   ├── database.js            # SQLite database setup and queries
│   ├── package.json           # Node.js dependencies
│   └── package-lock.json
├── frontend/
│   ├── index.html             # Main HTML file
│   ├── styles.css             # CSS styling
│   ├── app.js                 # Main application logic
│   ├── heatmap.js             # Heatmap component logic
│   ├── muscleGroups.js        # Muscle group tracking logic
│   └── api.js                 # API client for backend communication
├── nginx/
│   └── nginx.conf             # Nginx configuration
├── Dockerfile                 # Docker container definition
└── README.md                  # Setup and usage instructions
```

## Implementation Phases

### Phase 1: Backend Setup

#### Step 1.1: Initialize Node.js Backend
- [ ] Create `backend/` directory
- [ ] Initialize npm project (`npm init`)
- [ ] Install dependencies:
  - `express` - Web framework
  - `sqlite3` - SQLite database driver
  - `cors` - Enable CORS for API
  - `body-parser` - Parse JSON request bodies
  - `uuid` - Generate unique session IDs

#### Step 1.2: Create Database Schema
- [ ] Create `database.js` file
- [ ] Define SQLite database initialization
- [ ] Create `sessions` table with schema:
  ```sql
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    muscle_groups TEXT NOT NULL
  );
  ```
- [ ] Implement database connection management
- [ ] Add error handling for database operations

#### Step 1.3: Build API Endpoints
- [ ] Create `server.js` with Express setup
- [ ] Implement `GET /api/sessions` - Fetch all sessions
- [ ] Implement `POST /api/sessions` - Create new session
  - Validate date format
  - Validate muscle_groups array
  - Generate unique ID
- [ ] Implement `PUT /api/sessions/:id` - Update session
  - Validate session exists
  - Validate input data
- [ ] Implement `DELETE /api/sessions/:id` - Delete session
- [ ] Add error handling and appropriate HTTP status codes
- [ ] Enable CORS for frontend access

#### Step 1.4: Test Backend API
- [ ] Test each endpoint with curl or Postman
- [ ] Verify data persistence in SQLite
- [ ] Test edge cases (invalid data, missing sessions, etc.)

### Phase 2: Frontend Development

#### Step 2.1: HTML Structure
- [ ] Create `frontend/index.html`
- [ ] Define semantic HTML structure:
  - Header with app title and balance indicator
  - "Add Today's Workout" button
  - Heatmap container
  - Muscle groups dashboard (6 cards)
  - Modal/form for adding sessions
- [ ] Include CDN links for Cal-Heatmap
- [ ] Link CSS and JS files

#### Step 2.2: CSS Styling
- [ ] Create `frontend/styles.css`
- [ ] Style header and navigation
- [ ] Style balance indicator (emoji + status text)
- [ ] Style "Add Workout" button
- [ ] Style heatmap container
- [ ] Style muscle group cards:
  - Color-coded indicators (green/yellow/red)
  - Display days since last trained
  - Display training counts
- [ ] Style modal/form for session entry
- [ ] Add responsive design for mobile devices
- [ ] Implement color scheme and typography

#### Step 2.3: API Client Layer
- [ ] Create `frontend/api.js`
- [ ] Implement `fetchSessions()` function
- [ ] Implement `createSession(session)` function
- [ ] Implement `updateSession(id, session)` function
- [ ] Implement `deleteSession(id)` function
- [ ] Add error handling for network requests
- [ ] Add loading states

#### Step 2.4: Core Application Logic
- [ ] Create `frontend/app.js`
- [ ] Initialize application state:
  - Sessions array
  - Muscle groups configuration
- [ ] Implement session management:
  - Load sessions on page load
  - Add new session functionality
  - Edit session functionality
  - Delete session functionality
- [ ] Implement data calculation functions:
  - Calculate days since last trained per muscle group
  - Calculate training frequency (7 days, 30 days)
  - Calculate balance indicator score
- [ ] Implement UI update functions:
  - Update muscle group cards
  - Update balance indicator
  - Refresh heatmap

#### Step 2.5: Heatmap Component
- [ ] Create `frontend/heatmap.js`
- [ ] Initialize Cal-Heatmap with configuration:
  - Set date range (current year)
  - Configure color scheme (green/grey)
  - Set domain and subDomain
- [ ] Transform sessions data for Cal-Heatmap format
- [ ] Implement tooltip showing:
  - Date
  - Muscle groups trained
- [ ] Add navigation controls (previous/next year)
- [ ] Handle click events on heatmap cells

#### Step 2.6: Muscle Groups Dashboard
- [ ] Create `frontend/muscleGroups.js`
- [ ] Define muscle groups configuration:
  - Chest, Legs, Delts, Lats, Triceps, Biceps
- [ ] Implement rendering of muscle group cards
- [ ] Calculate and display for each muscle group:
  - Days since last trained
  - Training count (last 7 days / last 30 days)
  - Color-coded status indicator
- [ ] Update cards when sessions change

#### Step 2.7: Balance Indicator
- [ ] Implement balance score calculation logic:
  - Happy: All 6 groups trained 2+ times in last 7 days
  - Neutral: All 6 groups trained 1+ times in last 7 days
  - Angry: Any group not trained in last 7 days
- [ ] Render emoji and status text
- [ ] Update indicator when sessions change

#### Step 2.8: Session Form/Modal
- [ ] Create modal UI for adding/editing sessions
- [ ] Implement form with:
  - Date picker (default: today)
  - Checkboxes for 6 muscle groups
  - Save button
  - Cancel button
- [ ] Handle form submission
- [ ] Validate form inputs
- [ ] Clear form after submission
- [ ] Close modal after save

### Phase 3: Docker Configuration

#### Step 3.1: Create Dockerfile
- [ ] Create `Dockerfile` in root directory
- [ ] Use multi-stage build:
  - Stage 1: Install Node.js dependencies
  - Stage 2: Copy backend and frontend files
  - Stage 3: Install and configure Nginx
- [ ] Copy backend files to container
- [ ] Copy frontend files to Nginx html directory
- [ ] Expose ports (80 for Nginx, 3000 for Express)
- [ ] Set up startup command to run both services

#### Step 3.2: Configure Nginx
- [ ] Create `nginx/nginx.conf`
- [ ] Configure Nginx to:
  - Serve static files from `/usr/share/nginx/html`
  - Proxy `/api/*` requests to Express backend
  - Set appropriate headers
- [ ] Configure port 80 for HTTP

#### Step 3.3: Test Docker Build
- [ ] Build Docker image
- [ ] Run container locally
- [ ] Verify frontend loads correctly
- [ ] Verify API endpoints work through Nginx proxy
- [ ] Verify database persistence across container restarts
- [ ] Test complete workflow (add/edit/delete sessions)

### Phase 4: Integration and Testing

#### Step 4.1: End-to-End Testing
- [ ] Test adding multiple sessions
- [ ] Test multiple sessions on same day
- [ ] Test editing sessions
- [ ] Test deleting sessions
- [ ] Verify heatmap updates correctly
- [ ] Verify muscle group stats update correctly
- [ ] Verify balance indicator changes appropriately

#### Step 4.2: Edge Case Testing
- [ ] Test with empty database (first use)
- [ ] Test with many sessions (performance)
- [ ] Test date boundaries (year transitions)
- [ ] Test all muscle groups selected
- [ ] Test no muscle groups selected (validation)
- [ ] Test invalid date inputs

#### Step 4.3: UI/UX Polish
- [ ] Review and improve styling
- [ ] Add loading indicators
- [ ] Add success/error messages
- [ ] Improve mobile responsiveness
- [ ] Test across different browsers
- [ ] Optimize performance

### Phase 5: Documentation and Deployment

#### Step 5.1: Create README
- [ ] Write `README.md` with:
  - Project overview
  - Prerequisites (Docker installed)
  - Installation instructions
  - Usage instructions
  - Docker commands reference
  - Backup recommendations
  - Troubleshooting guide

#### Step 5.2: Deployment Preparation
- [ ] Document Docker build process
- [ ] Document port configuration
- [ ] Document volume mount for data persistence
- [ ] Create startup scripts if needed
- [ ] Document environment variables

#### Step 5.3: Final Review
- [ ] Code review and cleanup
- [ ] Remove console.logs and debug code
- [ ] Optimize bundle size
- [ ] Verify all PRD requirements met
- [ ] Test final Docker image

## Development Order Recommendation

**Recommended sequence for building:**

1. **Backend First** (Phase 1)
   - Build and test API independently
   - Ensures data layer is solid before frontend

2. **Frontend Core** (Phase 2.1-2.4)
   - HTML structure and basic styling
   - API client and core logic
   - Can test with mock data initially

3. **Frontend Components** (Phase 2.5-2.8)
   - Heatmap integration
   - Muscle groups dashboard
   - Balance indicator
   - Session form

4. **Docker Integration** (Phase 3)
   - Containerize application
   - Configure Nginx proxy

5. **Testing & Polish** (Phase 4-5)
   - End-to-end testing
   - Documentation
   - Final deployment preparation

## Key Technical Decisions

### Database Design
- **Single table:** Simple schema with JSON-encoded muscle_groups array
- **Text IDs:** Using UUIDs for session identification
- **Date format:** ISO 8601 string format (YYYY-MM-DD) for consistency

### Frontend Architecture
- **Modular files:** Separate concerns (app logic, heatmap, muscle groups, API)
- **No build process:** Vanilla JS served directly
- **Cal-Heatmap:** Mature library for heatmap visualization

### Docker Strategy
- **Single container:** Both Nginx and Express in one container for simplicity
- **Volume mount:** Persistent data storage outside container
- **Nginx proxy:** Clean separation of static and API requests

## Success Criteria

- ✅ Application runs in Docker container
- ✅ All API endpoints function correctly
- ✅ Heatmap displays gym sessions accurately
- ✅ Muscle group tracking calculates correctly
- ✅ Balance indicator shows appropriate status
- ✅ Sessions can be added, edited, and deleted
- ✅ Data persists across container restarts
- ✅ UI is responsive and user-friendly
- ✅ All PRD requirements implemented

