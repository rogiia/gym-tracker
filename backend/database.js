const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, '../data/gym-tracker.db');

// Initialize database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at', DB_PATH);
    initializeDatabase();
  }
});

// Create tables if they don't exist
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      muscle_groups TEXT NOT NULL
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating sessions table:', err.message);
    } else {
      console.log('Sessions table ready');
    }
  });
}

// Get all sessions
function getAllSessions(callback) {
  const sql = 'SELECT * FROM sessions ORDER BY date DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      // Parse muscle_groups JSON string back to array
      const sessions = rows.map(row => ({
        id: row.id,
        date: row.date,
        muscle_groups: JSON.parse(row.muscle_groups)
      }));
      callback(null, sessions);
    }
  });
}

// Get session by ID
function getSessionById(id, callback) {
  const sql = 'SELECT * FROM sessions WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      callback(err, null);
    } else if (!row) {
      callback(null, null);
    } else {
      const session = {
        id: row.id,
        date: row.date,
        muscle_groups: JSON.parse(row.muscle_groups)
      };
      callback(null, session);
    }
  });
}

// Create new session
function createSession(id, date, muscleGroups, callback) {
  const sql = 'INSERT INTO sessions (id, date, muscle_groups) VALUES (?, ?, ?)';
  const muscleGroupsJSON = JSON.stringify(muscleGroups);

  db.run(sql, [id, date, muscleGroupsJSON], function(err) {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, date, muscle_groups: muscleGroups });
    }
  });
}

// Update existing session
function updateSession(id, date, muscleGroups, callback) {
  const sql = 'UPDATE sessions SET date = ?, muscle_groups = ? WHERE id = ?';
  const muscleGroupsJSON = JSON.stringify(muscleGroups);

  db.run(sql, [date, muscleGroupsJSON, id], function(err) {
    if (err) {
      callback(err);
    } else if (this.changes === 0) {
      callback(new Error('Session not found'));
    } else {
      callback(null, { id, date, muscle_groups: muscleGroups });
    }
  });
}

// Delete session
function deleteSession(id, callback) {
  const sql = 'DELETE FROM sessions WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      callback(err);
    } else if (this.changes === 0) {
      callback(new Error('Session not found'));
    } else {
      callback(null);
    }
  });
}

// Close database connection
function closeDatabase() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
  });
}

module.exports = {
  getAllSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  closeDatabase
};
