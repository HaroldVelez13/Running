(function () {
  "use strict";

  const GOALS = [
    {
      id: 1,
      title: "Monthly Distance",
      description: "Run 200 km in May",
      current: 142.8,
      target: 200,
      unit: "km",
      deadline: "2026-05-31",
      category: "distance",
      icon: "distance",
      milestones: [50, 100, 150, 200],
    },
    {
      id: 2,
      title: "Sub-3 Marathon",
      description: "Break 3 hours at the next marathon",
      current: 184,
      target: 180,
      unit: "min",
      deadline: "2026-10-18",
      category: "race",
      icon: "race",
      lowerIsBetter: true,
      milestones: [190, 185, 180],
    },
    {
      id: 3,
      title: "Weekly Consistency",
      description: "Run at least 5 days every week",
      current: 4,
      target: 5,
      unit: "days",
      deadline: "2026-05-17",
      category: "consistency",
      icon: "calendar",
      milestones: [3, 4, 5],
    },
    {
      id: 4,
      title: "Streak",
      description: "Consecutive days with at least 1 activity",
      current: 12,
      target: 30,
      unit: "days",
      deadline: null,
      category: "consistency",
      icon: "streak",
      milestones: [7, 14, 21, 30],
    },
    {
      id: 5,
      title: "Elevation Gain",
      description: "Climb 5000 m this month",
      current: 2240,
      target: 5000,
      unit: "m",
      deadline: "2026-05-31",
      category: "distance",
      icon: "elevation",
      milestones: [1000, 2500, 3750, 5000],
    },
    {
      id: 6,
      title: "5K PR",
      description: "Run a sub-19 minute 5K",
      current: 1210,
      target: 1140,
      unit: "sec",
      deadline: "2026-08-01",
      category: "race",
      icon: "race",
      lowerIsBetter: true,
      milestones: [1250, 1200, 1170, 1140],
    },
    {
      id: 7,
      title: "Cross-Train Balance",
      description: "Complete 8 cross-training sessions this month",
      current: 5,
      target: 8,
      unit: "sessions",
      deadline: "2026-05-31",
      category: "consistency",
      icon: "strength",
      milestones: [2, 4, 6, 8],
    },
    {
      id: 8,
      title: "Heart Rate Efficiency",
      description: "Average HR below 150 bpm on tempo runs",
      current: 158,
      target: 150,
      unit: "bpm",
      deadline: "2026-06-15",
      category: "fitness",
      icon: "heart",
      lowerIsBetter: true,
      milestones: [160, 155, 150],
    },
  ];

  const ICONS = {
    distance:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2"/><path d="M6 8h2"/><path d="M10 16h2"/><path d="M14 4h2"/><path d="M18 20h2"/></svg>',
    race:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    streak:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    elevation:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
    strength: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m18 16 1-2"/></svg>',
    heart:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  };

  function computeProgress(goal) {
    let pct = goal.lowerIsBetter
      ? Math.max(0, Math.min(100, ((goal.target - goal.current) / (goal.target - goal.target * 1.5)) * 100))
      : Math.min(100, (goal.current / goal.target) * 100);
    pct = Math.max(0, Math.min(100, pct));
    const isComplete = goal.lowerIsBetter ? goal.current <= goal.target : goal.current >= goal.target;
    let status;
    if (isComplete) {
      status = "completed";
    } else if (pct >= 75) {
      status = "on-track";
    } else if (pct >= 40) {
      status = "behind";
    } else {
      status = "at-risk";
    }
    return { pct, isComplete, status };
  }

  function getDeadlineDisplay(deadline) {
    if (!deadline) return "No deadline";
    const now = new Date("2026-05-12");
    const d = new Date(deadline);
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "Past due";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 7) return diffDays + " days left";
    const weeks = Math.floor(diffDays / 7);
    return weeks + " wk" + (weeks > 1 ? "s" : "") + " left";
  }

  function getStatusLabel(status) {
    const map = {
      "completed": "Completed",
      "on-track": "On Track",
      "behind": "Behind",
      "at-risk": "At Risk",
    };
    return map[status] || status;
  }

  function render() {
    const container = document.getElementById("goalsContainer");
    const statsRow = document.getElementById("goalsStats");

    const completed = GOALS.filter(g => computeProgress(g).isComplete).length;
    const onTrack = GOALS.filter(g => {
      const s = computeProgress(g);
      return !s.isComplete && s.status === "on-track";
    }).length;
    const behind = GOALS.filter(g => {
      const s = computeProgress(g);
      return !s.isComplete && s.status !== "at-risk" && s.status !== "on-track";
    }).length;
    const atRisk = GOALS.filter(g => {
      const s = computeProgress(g);
      return !s.isComplete && s.status === "at-risk";
    }).length;

    statsRow.innerHTML = `
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.distance}</span> Total Goals</div>
        <div class="stat-value">${GOALS.length}</div>
        <div class="stat-sub">${completed} completed</div>
      </div>
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.race}</span> On Track</div>
        <div class="stat-value" style="color: var(--green)">${onTrack}</div>
        <div class="stat-sub">Progressing well</div>
      </div>
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.calendar}</span> Behind</div>
        <div class="stat-value" style="color: var(--orange)">${behind}</div>
        <div class="stat-sub">Needs attention</div>
      </div>
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.streak}</span> At Risk</div>
        <div class="stat-value" style="color: var(--red)">${atRisk}</div>
        <div class="stat-sub">Requires action</div>
      </div>
    `;

    const statusColors = {
      "completed": "var(--green)",
      "on-track": "var(--green)",
      "behind": "var(--orange)",
      "at-risk": "var(--red)",
    };

    const progressBgColors = {
      "completed": "var(--green-bg)",
      "on-track": "var(--green-bg)",
      "behind": "var(--orange-bg)",
      "at-risk": "var(--red-bg)",
    };

    container.innerHTML = GOALS.map(goal => {
      const { pct, isComplete, status } = computeProgress(goal);
      const deadlineStr = getDeadlineDisplay(goal.deadline);
      const statusColor = statusColors[status];
      const bgColor = progressBgColors[status];

      const milestonesHtml = goal.milestones.map(m => {
        let filled = false;
        if (goal.lowerIsBetter) {
          filled = goal.current <= m;
        } else {
          filled = goal.current >= m;
        }
        return `<span class="milestone-dot" style="${filled ? 'background: ' + statusColor : ''}; ${filled ? 'border-color: ' + statusColor : ''}"></span>`;
      }).join("");

      return `
        <div class="goal-card" style="--goal-status: ${statusColor}">
          <div class="goal-card-head">
            <div class="goal-icon-wrap" style="background: ${bgColor}; color: ${statusColor}">
              ${ICONS[goal.icon] || ICONS.distance}
            </div>
            <div class="goal-info">
              <h3 class="goal-title">${goal.title}</h3>
              <p class="goal-desc">${goal.description}</p>
            </div>
            <span class="goal-status-badge" style="background: ${bgColor}; color: ${statusColor}">
              ${getStatusLabel(status)}
            </span>
          </div>
          <div class="goal-progress-section">
            <div class="goal-values">
              <span class="goal-current">${goal.lowerIsBetter ? formatTimeOrNum(goal.current, goal.unit) : goal.current.toLocaleString()}</span>
              <span class="goal-sep">of</span>
              <span class="goal-target">${goal.lowerIsBetter ? formatTimeOrNum(goal.target, goal.unit) : goal.target.toLocaleString()}</span>
              <span class="goal-unit">${goal.unit}</span>
            </div>
            <div class="goal-progress-bar-bg">
              <div class="goal-progress-bar-fill" style="width: ${pct}%; background: ${statusColor}; ${isComplete ? 'background: linear-gradient(90deg, ' + statusColor + ', var(--green))' : ''}"></div>
            </div>
            <div class="goal-progress-bottom">
              <span class="goal-pct">${isComplete ? "100" : Math.round(pct)}% complete</span>
              <span class="goal-deadline">${deadlineStr}</span>
            </div>
          </div>
          <div class="goal-milestones">
            <span class="milestones-label">Milestones</span>
            <div class="milestones-track">${milestonesHtml}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function formatTimeOrNum(val, unit) {
    if (unit === "min" && val >= 60) {
      const h = Math.floor(val / 60);
      const m = val % 60;
      return h + "h " + m + "m";
    }
    if (unit === "sec" && val >= 60) {
      const m = Math.floor(val / 60);
      const s = val % 60;
      return m + ":" + String(s).padStart(2, "0");
    }
    return val.toLocaleString();
  }

  render();
})();
