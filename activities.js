(function () {
  "use strict";

  const ACTIVITIES = [
    { id: 1, date: "2026-05-11", route: "Riverside Trail", distance: 5.2, duration: 1420, avgHr: 148, elevation: 42, type: "run", subtype: "easy", notes: "Beautiful morning along the river" },
    { id: 2, date: "2026-05-10", route: "City Pool", distance: 0, duration: 2700, avgHr: 0, elevation: 0, type: "swim", subtype: "laps", notes: "2km freestyle drills" },
    { id: 3, date: "2026-05-09", route: "Park Loop", distance: 10.1, duration: 2820, avgHr: 158, elevation: 85, type: "run", subtype: "tempo", notes: "Steady effort, felt strong" },
    { id: 4, date: "2026-05-08", route: "Home Gym", distance: 0, duration: 3600, avgHr: 0, elevation: 0, type: "strength", subtype: "upper", notes: "Chest, shoulders, triceps" },
    { id: 5, date: "2026-05-07", route: "Hill Repeats", distance: 6.8, duration: 2060, avgHr: 162, elevation: 210, type: "run", subtype: "intervals", notes: "8x400m hill repeats" },
    { id: 6, date: "2026-05-06", route: "Riverbank", distance: 0, duration: 1800, avgHr: 0, elevation: 0, type: "cycle", subtype: "commute", notes: "Easy spin to work and back" },
    { id: 7, date: "2026-05-05", route: "Coastal Path", distance: 21.2, duration: 5640, avgHr: 155, elevation: 340, type: "run", subtype: "long", notes: "Great half marathon progression" },
    { id: 8, date: "2026-05-04", route: "Yoga Studio", distance: 0, duration: 2400, avgHr: 0, elevation: 0, type: "yoga", subtype: "recovery", notes: "60 min flow, focus on hip mobility" },
    { id: 9, date: "2026-05-02", route: "Tempo Run", distance: 8.3, duration: 2160, avgHr: 165, elevation: 55, type: "run", subtype: "tempo", notes: "Goal pace felt manageable" },
    { id: 10, date: "2026-04-30", route: "Lake Trail", distance: 0, duration: 5400, avgHr: 0, elevation: 0, type: "cycle", subtype: "endurance", notes: "40km ride, moderate hills" },
    { id: 11, date: "2026-04-28", route: "City Marathon", distance: 42.2, duration: 11040, avgHr: 160, elevation: 420, type: "run", subtype: "race", notes: "PB by 4 minutes! 3:04:00" },
    { id: 12, date: "2026-04-26", route: "Recovery Walk", distance: 3.2, duration: 2880, avgHr: 0, elevation: 25, type: "walk", subtype: "recovery", notes: "Active recovery day" },
    { id: 13, date: "2026-04-25", route: "Easy Recovery", distance: 4.5, duration: 1500, avgHr: 132, elevation: 30, type: "run", subtype: "easy", notes: "Kept it very relaxed" },
    { id: 14, date: "2026-04-23", route: "Track", distance: 5.8, duration: 1500, avgHr: 170, elevation: 10, type: "run", subtype: "intervals", notes: "12x400m @ 5K pace" },
    { id: 15, date: "2026-04-22", route: "Bridge Run", distance: 11.4, duration: 3180, avgHr: 152, elevation: 88, type: "run", subtype: "tempo", notes: "Progressive build" },
    { id: 16, date: "2026-04-20", route: "Trail Half", distance: 21.5, duration: 5820, avgHr: 157, elevation: 480, type: "run", subtype: "long", notes: "Technical trail, tough but rewarding" },
    { id: 17, date: "2026-04-19", route: "Home Gym", distance: 0, duration: 2700, avgHr: 0, elevation: 0, type: "strength", subtype: "lower", notes: "Squats, deadlifts, lunges" },
    { id: 18, date: "2026-04-18", route: "Greenway", distance: 0, duration: 3600, avgHr: 0, elevation: 0, type: "cycle", subtype: "endurance", notes: "Group ride, 28km" },
    { id: 19, date: "2026-04-16", route: "Speed Repeats", distance: 3.6, duration: 780, avgHr: 172, elevation: 18, type: "run", subtype: "intervals", notes: "Short and fast" },
    { id: 20, date: "2026-04-14", route: "Lakeside Loop", distance: 14.2, duration: 4020, avgHr: 150, elevation: 110, type: "run", subtype: "easy", notes: "Scenic loop, great weather" },
  ];

  const ACTIVITY_META = {
    run:      { label: "Run",      icon: "run",      color: "#4f7cff" },
    cycle:    { label: "Cycle",    icon: "cycle",    color: "#34d399" },
    swim:     { label: "Swim",     icon: "swim",     color: "#22d3ee" },
    strength: { label: "Strength", icon: "strength", color: "#a78bfa" },
    yoga:     { label: "Yoga",     icon: "yoga",     color: "#fb923c" },
    walk:     { label: "Walk",     icon: "walk",     color: "#f87171" },
  };

  const SUBTYPE_LABELS = {
    easy: "Easy", tempo: "Tempo", intervals: "Intervals", long: "Long Run",
    race: "Race", recovery: "Recovery", endurance: "Endurance",
    upper: "Upper Body", lower: "Lower Body", laps: "Laps",
    commute: "Commute", flow: "Flow",
  };

  let currentTypeFilter = "all";

  const ICONS = {
    run:      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M12 6v6l-3 4"/><path d="M14 12l3 4"/><path d="M8 22l2-4"/></svg>',
    cycle:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    swim:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20c2-2 4-4 8-4s6 2 10 4"/><path d="M2 16c2-2 4-4 8-4s6 2 10 4"/><path d="M2 12c2-2 4-4 8-4s6 2 10 4"/></svg>',
    strength: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m18 16 1-2"/></svg>',
    yoga:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 4v6"/><path d="M8 16c2 0 4-2 6-2s4 2 6 2"/><path d="M4 22c2-2 4-4 8-4s6 2 8 4"/></svg>',
    walk:     '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M9 22v-8l-2-4"/><path d="M11 22v-6l2-4"/><path d="M9 10h4l3 3"/></svg>',
  };

  function parseDate(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function formatDuration(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    if (h > 0) return h + "h " + String(m).padStart(2, "0") + "m";
    return m + "m";
  }

  function formatPace(secPerKm) {
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return m + ":" + String(s).padStart(2, "0") + " /km";
  }

  function formatDate(str) {
    const dt = parseDate(str);
    return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function getWeekStart(str) {
    const dt = parseDate(str);
    const day = dt.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    dt.setDate(dt.getDate() + diff);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }

  function getFilteredActivities() {
    let list = [...ACTIVITIES].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    if (currentTypeFilter !== "all") {
      list = list.filter(a => a.type === currentTypeFilter);
    }
    return list;
  }

  function groupByWeek(activities) {
    const groups = {};
    activities.forEach(a => {
      const weekStart = getWeekStart(a.date);
      const key = weekStart.toISOString().slice(0, 10);
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }

  function renderStats() {
    const activities = getFilteredActivities();
    const now = parseDate("2026-05-12");
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthActivities = activities.filter(a => parseDate(a.date) >= monthStart);
    const totalDist = monthActivities.reduce((s, a) => s + a.distance, 0);
    const totalDur = monthActivities.reduce((s, a) => s + a.duration, 0);
    const runCount = monthActivities.filter(a => a.type === "run").length;
    const activeDays = new Set(monthActivities.map(a => a.date)).size;

    document.getElementById("activityStats").innerHTML = `
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.run}</span> Activities</div>
        <div class="stat-value">${monthActivities.length}<span class="stat-sub-unit">this month</span></div>
        <div class="stat-sub">${runCount} runs · ${activeDays} active days</div>
      </div>
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.run}</span> Total Distance</div>
        <div class="stat-value">${totalDist.toFixed(1)}<span class="stat-sub-unit">km</span></div>
        <div class="stat-sub">All activities combined</div>
      </div>
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.cycle}</span> Total Time</div>
        <div class="stat-value">${formatDuration(totalDur)}<span class="stat-sub-unit"></span></div>
        <div class="stat-sub">${Math.round(totalDur / 3600 * 10) / 10} hours</div>
      </div>
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${ICONS.strength}</span> Activities</div>
        <div class="stat-value">${Object.keys(ACTIVITY_META).filter(t => t !== "run").map(t => monthActivities.filter(a => a.type === t).length).reduce((a, b) => a + b, 0)}<span class="stat-sub-unit">cross-train</span></div>
        <div class="stat-sub">${monthActivities.filter(a => a.type !== "run").map(a => ACTIVITY_META[a.type].label).join(" · ")}</div>
      </div>
    `;
  }

  function renderActivities() {
    const activities = getFilteredActivities();
    const container = document.getElementById("activityList");
    const grouped = groupByWeek(activities);

    if (grouped.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>No activities match this filter</p>
          <span>Try a different type</span>
        </div>`;
      return;
    }

    container.innerHTML = grouped.map(([weekKey, acts]) => {
      const weekStart = parseDate(weekKey);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekLabel = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        + " – " + weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const weekDist = acts.reduce((s, a) => s + a.distance, 0);
      const weekDur = acts.reduce((s, a) => s + a.duration, 0);

      return `
        <div class="week-group">
          <div class="week-header">
            <h2 class="week-title">${weekLabel}</h2>
            <div class="week-summary">
              <span>${acts.length} activities</span>
              ${weekDist > 0 ? '<span class="week-summary-dot">·</span><span>' + weekDist.toFixed(1) + ' km</span>' : ''}
              <span class="week-summary-dot">·</span>
              <span>${formatDuration(weekDur)}</span>
            </div>
          </div>
          <div class="activity-cards">
            ${acts.map(a => {
              const meta = ACTIVITY_META[a.type];
              const pace = a.distance > 0 ? a.duration / a.distance : 0;
              const subtypeLabel = SUBTYPE_LABELS[a.subtype] || a.subtype;
              return `
                <div class="activity-card" style="--accent-color: ${meta.color}">
                  <div class="activity-card-accent"></div>
                  <div class="activity-card-body">
                    <div class="activity-card-top">
                      <div class="activity-type-badge" style="background: ${meta.color}22; color: ${meta.color}">
                        ${ICONS[a.type] || ICONS.run}
                        <span>${meta.label}</span>
                      </div>
                      <span class="activity-date">${formatDate(a.date)}</span>
                    </div>
                    <h3 class="activity-route">${a.route}</h3>
                    ${a.notes ? '<p class="activity-notes">' + a.notes + '</p>' : ''}
                    <div class="activity-metrics">
                      ${a.distance > 0 ? `<div class="activity-metric">
                        <span class="activity-metric-value">${a.distance.toFixed(1)}</span>
                        <span class="activity-metric-label">km</span>
                      </div>` : ''}
                      <div class="activity-metric">
                        <span class="activity-metric-value">${formatDuration(a.duration)}</span>
                        <span class="activity-metric-label">duration</span>
                      </div>
                      ${pace > 0 ? `<div class="activity-metric">
                        <span class="activity-metric-value">${formatPace(pace)}</span>
                        <span class="activity-metric-label">pace</span>
                      </div>` : ''}
                      ${a.avgHr > 0 ? `<div class="activity-metric">
                        <span class="activity-metric-value">${a.avgHr}</span>
                        <span class="activity-metric-label">avg hr</span>
                      </div>` : ''}
                      ${a.elevation > 0 ? `<div class="activity-metric">
                        <span class="activity-metric-value">${a.elevation}</span>
                        <span class="activity-metric-label">elevation</span>
                      </div>` : ''}
                      <div class="activity-metric">
                        <span class="activity-metric-value subtype">${subtypeLabel}</span>
                        <span class="activity-metric-label">type</span>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }).join("");
  }

  function render() {
    renderStats();
    renderActivities();
  }

  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      this.classList.add("active");
      currentTypeFilter = this.dataset.filter;
      render();
    });
  });

  render();
})();
