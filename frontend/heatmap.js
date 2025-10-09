// Heatmap Component using Cal-Heatmap library

let cal = null;

/**
 * Initialize the Cal-Heatmap component
 * @param {Array} sessions - Array of session objects
 */
function initHeatmap(sessions) {
  const container = document.getElementById('heatmap');
  if (!container) return;

  // Transform sessions data for Cal-Heatmap
  const heatmapData = transformSessionsForHeatmap(sessions);

  // Initialize Cal-Heatmap
  cal = new CalHeatmap();

  const currentYear = new Date().getFullYear();

  cal.paint({
    itemSelector: '#heatmap',
    domain: {
      type: 'month',
      label: {
        position: 'bottom'
      },
    },
    subDomain: {
      type: 'day'
    },
    data: {
      source: heatmapData,
      type: 'json',
      x: 'date',
      y: 'value'
    },
    date: {
      start: new Date(currentYear, 0, 1),
      max: new Date(currentYear, 11, 31)
    },
    range: 12,
    scale: {
      color: {
        type: 'threshold',
        range: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
        domain: [1, 2, 3, 4]
      }
    },
    itemName: ['workout', 'workouts'],
    subDomainTextFormat: '%d',
    tooltip: true
  });

  // Set up navigation controls
  setupHeatmapControls();
}

/**
 * Transform sessions array into format suitable for Cal-Heatmap
 * @param {Array} sessions - Array of session objects
 * @returns {Array} Transformed data for Cal-Heatmap
 */
function transformSessionsForHeatmap(sessions) {
  const dateCounts = {};

  sessions.forEach(session => {
    const date = session.date;
    // Count number of muscle groups trained (as measure of intensity)
    const value = session.muscle_groups.length;

    if (dateCounts[date]) {
      dateCounts[date] += value;
    } else {
      dateCounts[date] = value;
    }
  });

  // Convert to array format expected by Cal-Heatmap
  return Object.entries(dateCounts).map(([date, value]) => ({
    date,
    value
  }));
}

/**
 * Update heatmap with new sessions data
 * @param {Array} sessions - Array of session objects
 */
function updateHeatmap(sessions) {
  if (!cal) {
    initHeatmap(sessions);
    return;
  }

  const heatmapData = transformSessionsForHeatmap(sessions);

  // Update the heatmap data
  cal.fill(heatmapData);
}

/**
 * Set up navigation controls for the heatmap (previous/next)
 */
function setupHeatmapControls() {
  const prevBtn = document.getElementById('heatmapPrev');
  const nextBtn = document.getElementById('heatmapNext');

  if (prevBtn && cal) {
    prevBtn.addEventListener('click', () => {
      cal.previous();
    });
  }

  if (nextBtn && cal) {
    nextBtn.addEventListener('click', () => {
      cal.next();
    });
  }
}

/**
 * Destroy and reinitialize the heatmap
 * @param {Array} sessions - Array of session objects
 */
function reinitializeHeatmap(sessions) {
  if (cal) {
    cal.destroy();
    cal = null;
  }
  initHeatmap(sessions);
}
