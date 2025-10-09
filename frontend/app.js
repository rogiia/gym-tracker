// Main Application Logic

// Application state
let sessions = [];
let currentEditingSessionId = null;

/**
 * Initialize the application
 */
async function init() {
    try {
        showLoading();

        // Load sessions from backend
        await loadSessions();

        // Set up event listeners
        setupEventListeners();

        // Initial render
        updateUI();

        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to initialize application: ' + error.message);
    }
}

/**
 * Load all sessions from the backend
 */
async function loadSessions() {
    try {
        sessions = await fetchSessions();
    } catch (error) {
        console.error('Error loading sessions:', error);
        throw error;
    }
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Add Workout button
    const addWorkoutBtn = document.getElementById('addWorkoutBtn');
    if (addWorkoutBtn) {
        addWorkoutBtn.addEventListener('click', openAddSessionModal);
    }

    // Modal close button
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Session form submit
    const sessionForm = document.getElementById('sessionForm');
    if (sessionForm) {
        sessionForm.addEventListener('submit', handleSessionFormSubmit);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('sessionModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

/**
 * Open modal for adding a new session
 */
function openAddSessionModal() {
    currentEditingSessionId = null;

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = 'Add Workout Session';
    }

    // Set default date to today
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Clear all checkboxes
    const checkboxes = document.querySelectorAll('input[name="muscleGroup"]');
    checkboxes.forEach(cb => cb.checked = false);

    showModal();
}

/**
 * Open modal for editing an existing session
 * @param {string} sessionId - ID of the session to edit
 */
function openEditSessionModal(sessionId) {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
        showError('Session not found');
        return;
    }

    currentEditingSessionId = sessionId;

    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Workout Session';
    }

    // Set date
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        dateInput.value = session.date;
    }

    // Set checkboxes
    const checkboxes = document.querySelectorAll('input[name="muscleGroup"]');
    checkboxes.forEach(cb => {
        cb.checked = session.muscle_groups.includes(cb.value);
    });

    showModal();
}

/**
 * Show the modal
 */
function showModal() {
    const modal = document.getElementById('sessionModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Close the modal
 */
function closeModal() {
    const modal = document.getElementById('sessionModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentEditingSessionId = null;
}

/**
 * Handle session form submission
 * @param {Event} e - Form submit event
 */
async function handleSessionFormSubmit(e) {
    e.preventDefault();

    const dateInput = document.getElementById('sessionDate');
    const checkboxes = document.querySelectorAll('input[name="muscleGroup"]:checked');

    const date = dateInput.value;
    const muscle_groups = Array.from(checkboxes).map(cb => cb.value);

    // Validate that at least one muscle group is selected
    if (muscle_groups.length === 0) {
        showError('Please select at least one muscle group');
        return;
    }

    const sessionData = {
        date,
        muscle_groups
    };

    try {
        showLoading();

        if (currentEditingSessionId) {
            // Update existing session
            await updateSession(currentEditingSessionId, sessionData);
            showSuccess('Session updated successfully');
        } else {
            // Create new session
            await createSession(sessionData);
            showSuccess('Session added successfully');
        }

        // Reload sessions and update UI
        await loadSessions();
        updateUI();

        closeModal();
        hideLoading();
    } catch (error) {
        hideLoading();
        showError('Failed to save session: ' + error.message);
    }
}

/**
 * Delete a session
 * @param {string} sessionId - ID of the session to delete
 */
async function handleDeleteSession(sessionId) {
    if (!confirm('Are you sure you want to delete this session?')) {
        return;
    }

    try {
        showLoading();
        await deleteSession(sessionId);
        await loadSessions();
        updateUI();
        hideLoading();
        showSuccess('Session deleted successfully');
    } catch (error) {
        hideLoading();
        showError('Failed to delete session: ' + error.message);
    }
}

/**
 * Update the entire UI with current sessions data
 */
function updateUI() {
    // Update muscle groups dashboard
    updateMuscleGroupsDashboard(sessions);

    // Update heatmap
    updateHeatmap(sessions);
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
