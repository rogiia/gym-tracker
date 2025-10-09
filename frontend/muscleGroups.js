// Muscle Groups Dashboard Component

// Configuration for the 6 muscle groups
const MUSCLE_GROUPS = ['Chest', 'Legs', 'Delts', 'Lats', 'Triceps', 'Biceps'];

/**
 * Calculate statistics for each muscle group based on sessions
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Statistics for each muscle group
 */
function calculateMuscleGroupStats(sessions) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = {};

  MUSCLE_GROUPS.forEach(muscle => {
    // Filter sessions that include this muscle group
    const muscleSessions = sessions.filter(session =>
      session.muscle_groups.includes(muscle)
    );

    // Sort by date descending
    const sortedSessions = muscleSessions
      .map(s => ({ ...s, dateObj: new Date(s.date) }))
      .sort((a, b) => b.dateObj - a.dateObj);

    // Calculate days since last trained
    let daysSince = null;
    if (sortedSessions.length > 0) {
      const lastDate = sortedSessions[0].dateObj;
      const diffTime = now - lastDate;
      daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // Count sessions in last 7 days
    const last7Days = sortedSessions.filter(s => s.dateObj >= sevenDaysAgo).length;

    // Count sessions in last 30 days
    const last30Days = sortedSessions.filter(s => s.dateObj >= thirtyDaysAgo).length;

    // Determine status (good, warning, bad)
    let status;
    if (daysSince === null) {
      status = 'bad'; // Never trained
    } else if (daysSince <= 3) {
      status = 'good';
    } else if (daysSince <= 7) {
      status = 'warning';
    } else {
      status = 'bad';
    }

    stats[muscle] = {
      daysSince,
      last7Days,
      last30Days,
      status
    };
  });

  return stats;
}

/**
 * Render muscle group cards in the dashboard
 * @param {Object} stats - Statistics for each muscle group
 */
function renderMuscleGroups(stats) {
  const container = document.getElementById('muscleGroupsGrid');
  if (!container) return;

  container.innerHTML = '';

  MUSCLE_GROUPS.forEach(muscle => {
    const muscleStats = stats[muscle];

    const card = document.createElement('div');
    card.className = `muscle-card status-${muscleStats.status}`;

    const daysSinceText = muscleStats.daysSince === null
      ? 'Never trained'
      : muscleStats.daysSince === 0
        ? 'Trained today'
        : `${muscleStats.daysSince} day${muscleStats.daysSince === 1 ? '' : 's'} ago`;

    card.innerHTML = `
            <div class="muscle-card-header">
                <h3 class="muscle-name">${muscle}</h3>
                <div class="status-indicator ${muscleStats.status}"></div>
            </div>
            <div class="muscle-card-stats">
                <div class="stat-row">
                    <span class="stat-label">Last trained:</span>
                    <span class="stat-value">${daysSinceText}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Last 7 days:</span>
                    <span class="stat-value">${muscleStats.last7Days}x</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Last 30 days:</span>
                    <span class="stat-value">${muscleStats.last30Days}x</span>
                </div>
            </div>
        `;

    container.appendChild(card);
  });
}

/**
 * Calculate and update balance indicator
 * @param {Object} stats - Statistics for each muscle group
 */
function updateBalanceIndicator(stats) {
  const emojiElement = document.getElementById('balanceEmoji');
  const textElement = document.getElementById('balanceText');

  if (!emojiElement || !textElement) return;

  // Check if all muscle groups meet certain criteria
  const allTrainedLast7Days = MUSCLE_GROUPS.every(muscle =>
    stats[muscle].last7Days >= 1
  );

  const allTrainedTwiceLast7Days = MUSCLE_GROUPS.every(muscle =>
    stats[muscle].last7Days >= 2
  );

  let emoji, text, status;

  if (allTrainedTwiceLast7Days) {
    emoji = '=+';
    text = 'Excellent Balance';
    status = 'happy';
  } else if (allTrainedLast7Days) {
    emoji = '=';
    text = 'Neutral Balance';
    status = 'neutral';
  } else {
    emoji = '= ';
    text = 'Poor Balance';
    status = 'angry';
  }

  emojiElement.textContent = emoji;
  textElement.textContent = text;

  // Add status class for potential styling
  const indicator = document.getElementById('balanceIndicator');
  if (indicator) {
    indicator.className = `balance-indicator balance-${status}`;
  }
}

/**
 * Update the entire muscle groups dashboard
 * @param {Array} sessions - Array of session objects
 */
function updateMuscleGroupsDashboard(sessions) {
  const stats = calculateMuscleGroupStats(sessions);
  renderMuscleGroups(stats);
  updateBalanceIndicator(stats);
}
