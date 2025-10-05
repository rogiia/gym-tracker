const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Validation helpers
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

function isValidMuscleGroups(muscleGroups) {
  if (!Array.isArray(muscleGroups) || muscleGroups.length === 0) {
    return false;
  }
  const validGroups = ['Chest', 'Legs', 'Delts', 'Lats', 'Triceps', 'Biceps'];
  return muscleGroups.every(group => validGroups.includes(group));
}

// API Routes

// GET /api/sessions - Fetch all sessions
app.get('/api/sessions', (req, res) => {
  db.getAllSessions((err, sessions) => {
    if (err) {
      console.error('Error fetching sessions:', err);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }
    res.json(sessions);
  });
});

// POST /api/sessions - Create new session
app.post('/api/sessions', (req, res) => {
  const { date, muscle_groups } = req.body;

  // Validation
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }
  if (!muscle_groups) {
    return res.status(400).json({ error: 'Muscle groups are required' });
  }
  if (!isValidMuscleGroups(muscle_groups)) {
    return res.status(400).json({
      error: 'Invalid muscle groups. Must be a non-empty array containing: Chest, Legs, Delts, Lats, Triceps, Biceps'
    });
  }

  // Generate unique ID
  const id = uuidv4();

  // Create session
  db.createSession(id, date, muscle_groups, (err, session) => {
    if (err) {
      console.error('Error creating session:', err);
      return res.status(500).json({ error: 'Failed to create session' });
    }
    res.status(201).json(session);
  });
});

// PUT /api/sessions/:id - Update session
app.put('/api/sessions/:id', (req, res) => {
  const { id } = req.params;
  const { date, muscle_groups } = req.body;

  // Validation
  if (!date) {
    return res.status(400).json({ error: 'Date is required' });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }
  if (!muscle_groups) {
    return res.status(400).json({ error: 'Muscle groups are required' });
  }
  if (!isValidMuscleGroups(muscle_groups)) {
    return res.status(400).json({
      error: 'Invalid muscle groups. Must be a non-empty array containing: Chest, Legs, Delts, Lats, Triceps, Biceps'
    });
  }

  // Update session
  db.updateSession(id, date, muscle_groups, (err, session) => {
    if (err) {
      if (err.message === 'Session not found') {
        return res.status(404).json({ error: 'Session not found' });
      }
      console.error('Error updating session:', err);
      return res.status(500).json({ error: 'Failed to update session' });
    }
    res.json(session);
  });
});

// DELETE /api/sessions/:id - Delete session
app.delete('/api/sessions/:id', (req, res) => {
  const { id } = req.params;

  db.deleteSession(id, (err) => {
    if (err) {
      if (err.message === 'Session not found') {
        return res.status(404).json({ error: 'Session not found' });
      }
      console.error('Error deleting session:', err);
      return res.status(500).json({ error: 'Failed to delete session' });
    }
    res.status(204).send();
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  db.closeDatabase();
  process.exit(0);
});
