// API client for backend communication

const API_BASE_URL = window.location.hostname === 'gym.rogi.casa'
  ? '/api'
  : 'http://localhost:3000/api';

/**
 * Fetch all gym sessions from the backend
 * @returns {Promise<Array>} Array of session objects
 */
async function fetchSessions() {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`);

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    const sessions = await response.json();
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}

/**
 * Create a new gym session
 * @param {Object} session - Session object with date and muscle_groups
 * @param {string} session.date - Date in ISO format (YYYY-MM-DD)
 * @param {Array<string>} session.muscle_groups - Array of muscle group names
 * @returns {Promise<Object>} Created session object
 */
async function createSession(session) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create session: ${response.statusText}`);
    }

    const createdSession = await response.json();
    return createdSession;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Update an existing gym session
 * @param {string} id - Session ID
 * @param {Object} session - Updated session object
 * @param {string} session.date - Date in ISO format (YYYY-MM-DD)
 * @param {Array<string>} session.muscle_groups - Array of muscle group names
 * @returns {Promise<Object>} Updated session object
 */
async function updateSession(id, session) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to update session: ${response.statusText}`);
    }

    const updatedSession = await response.json();
    return updatedSession;
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  }
}

/**
 * Delete a gym session
 * @param {string} id - Session ID
 * @returns {Promise<void>}
 */
async function deleteSession(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to delete session: ${response.statusText}`);
    }

    return;
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
}

/**
 * Show loading indicator
 */
function showLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.classList.add('active');
  }
}

/**
 * Hide loading indicator
 */
function hideLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.classList.remove('active');
  }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
  alert(`Error: ${message}`);
}

/**
 * Show success message to user
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  // For now, we'll use console.log
  // In a production app, you might use a toast notification
  console.log(`Success: ${message}`);
}
