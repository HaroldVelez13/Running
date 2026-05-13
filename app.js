(function () {
  "use strict";

  // ─── Mock Data ───────────────────────────────────────────────────────────

  const RUNS = [
    { id: 1, date: "2026-05-11", route: "Riverside Trail", distance: 5.2, duration: 1420, avgHr: 148, elevation: 42, type: "5k" },
    { id: 2, date: "2026-05-09", route: "Park Loop", distance: 10.1, duration: 2820, avgHr: 158, elevation: 85, type: "10k" },
    { id: 3, date: "2026-05-07", route: "Hill Repeats", distance: 6.8, duration: 2060, avgHr: 162, elevation: 210, type: "5k" },
    { id: 4, date: "2026-05-05", route: "Coastal Path", distance: 21.2, duration: 5640, avgHr: 155, elevation: 340, type: "half" },
    { id: 5, date: "2026-05-02", route: "Tempo Run", distance: 8.3, duration: 2160, avgHr: 165, elevation: 55, type: "10k" },
    { id: 6, date: "2026-04-28", route: "City Marathon", distance: 42.2, duration: 11040, avgHr: 160, elevation: 420, type: "marathon" },
    { id: 7, date: "2026-04-25", route: "Easy Recovery", distance: 4.5, duration: 1500, avgHr: 132, elevation: 30, type: "5k" },
    { id: 8, date: "2026-04-22", route: "Bridge Run", distance: 11.4, duration: 3180, avgHr: 152, elevation: 88, type: "10k" },
    { id: 9, date: "2026-04-20", route: "Trail Half", distance: 21.5, duration: 5820, avgHr: 157, elevation: 480, type: "half" },
    { id: 10, date: "2026-04-16", route: "Track Intervals", distance: 5.8, duration: 1500, avgHr: 170, elevation: 10, type: "5k" },
    { id: 11, date: "2026-04-14", route: "Lakeside Loop", distance: 14.2, duration: 4020, avgHr: 150, elevation: 110, type: "10k" },
    { id: 12, date: "2026-04-10", route: "Mountain Descent", distance: 9.4, duration: 2640, avgHr: 145, elevation: 290, type: "10k" },
    { id: 13, date: "2026-04-08", route: "Speed Repeats", distance: 3.6, duration: 780, avgHr: 172, elevation: 18, type: "5k" },
    { id: 14, date: "2026-04-03", route: "Weekend Long Run", distance: 24.8, duration: 6840, avgHr: 153, elevation: 380, type: "half" },
    { id: 15, date: "2026-03-30", route: "Marathon Prep", distance: 32.5, duration: 8640, avgHr: 158, elevation: 510, type: "marathon" },
    { id: 16, date: "2026-03-26", route: "Riverbank 5K", distance: 5.0, duration: 1200, avgHr: 168, elevation: 25, type: "5k" },
    { id: 17, date: "2026-03-22", route: "Forest Trail", distance: 15.7, duration: 4440, avgHr: 149, elevation: 275, type: "10k" },
    { id: 18, date: "2026-03-18", route: "Sunset Half", distance: 21.1, duration: 5700, avgHr: 156, elevation: 365, type: "half" },
  ];

  const WEEKS = [
    { label: "Mar 16", km: 36.8 },
    { label: "Mar 23", km: 42.5 },
    { label: "Mar 30", km: 32.5 },
    { label: "Apr 6",  km: 13.0 },
    { label: "Apr 13", km: 23.6 },
    { label: "Apr 20", km: 37.3 },
    { label: "Apr 27", km: 42.2 },
    { label: "May 4",  km: 29.5 },
    { label: "May 11", km: 22.1 },
  ];

  const HR_ZONES = [
    { name: "Zone 1", range: "&lt; 120 bpm", pct: 8,  color: "#a78bfa" },
    { name: "Zone 2", range: "120 – 139 bpm", pct: 28, color: "#60a5fa" },
    { name: "Zone 3", range: "140 – 159 bpm", pct: 35, color: "#34d399" },
    { name: "Zone 4", range: "160 – 179 bpm", pct: 22, color: "#fb923c" },
    { name: "Zone 5", range: "180+ bpm", pct: 7,   color: "#f87171" },
  ];

  // ─── State ───────────────────────────────────────────────────────────────

  let currentView = "month";
  let currentFilter = "all";

  // ─── Helpers ─────────────────────────────────────────────────────────────

  function parseDate(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function formatDuration(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return h + "h " + String(m).padStart(2, "0") + "m";
    return m + "m " + String(s).padStart(2, "0") + "s";
  }

  function formatPace(secPerKm) {
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return m + ":" + String(s).padStart(2, "0") + " /km";
  }

  function getMonday(d) {
    const dt = new Date(d);
    const day = dt.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    dt.setDate(dt.getDate() + diff);
    dt.setHours(0, 0, 0, 0);
    return dt;
  }

  function getMonthStart(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function filterRuns(view) {
    const now = parseDate("2026-05-12");
    const all = [...RUNS].sort((a, b) => parseDate(b.date) - parseDate(a.date));

    if (view === "all") return all;

    if (view === "week") {
      const monday = getMonday(now);
      return all.filter(r => parseDate(r.date) >= monday);
    }

    // month
    const monthStart = getMonthStart(now);
    return all.filter(r => parseDate(r.date) >= monthStart);
  }

  function filterByDistanceType(runs) {
    if (currentFilter === "all") return runs;
    return runs.filter(r => r.type === currentFilter);
  }

  function getVisibleRuns() {
    return filterByDistanceType(filterRuns(currentView));
  }

  function paceToColor(pace) {
    if (pace < 250) return "var(--green)";
    if (pace < 300) return "var(--cyan)";
    if (pace < 330) return "var(--orange)";
    return "var(--text)";
  }

  // ─── Stats ───────────────────────────────────────────────────────────────

  function renderStats() {
    const runs = getVisibleRuns();
    const totalDist = runs.reduce((s, r) => s + r.distance, 0);
    const totalTime = runs.reduce((s, r) => s + r.duration, 0);
    const avgPace = runs.length ? totalTime / totalDist : 0;
    const avgHrVal = runs.length ? Math.round(runs.reduce((s, r) => s + r.avgHr, 0) / runs.length) : 0;
    const weekDist = filterByDistanceType(filterRuns("week")).reduce((s, r) => s + r.distance, 0);

    const labels = [
      { icon: "distance", value: totalDist.toFixed(1), unit: "km", sub: "", color: "" },
      { icon: "pace",     value: formatPace(avgPace),    sub: avgPace < 290 ? "↑ Faster than avg" : "↓ On track", color: avgPace < 290 ? "positive" : "" },
      { icon: "time",     value: formatDuration(totalTime), unit: "", sub: "", color: "" },
      { icon: "heart",    value: avgHrVal, unit: "bpm", sub: avgHrVal < 150 ? "Good efficiency" : "Moderate effort", color: avgHrVal < 150 ? "positive" : "" },
      { icon: "week",     value: weekDist.toFixed(1), unit: "km", sub: "", color: "" },
    ];

    const icons = {
      distance: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h2"/><path d="M6 8h2"/><path d="M10 16h2"/><path d="M14 4h2"/><path d="M18 20h2"/></svg>',
      pace:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      time:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      heart:    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      week:     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    };

    const titles = {
      distance: "Total Distance",
      pace: "Average Pace",
      time: "Total Time",
      heart: "Avg Heart Rate",
      week: "This Week",
    };

    const grid = document.getElementById("statsGrid");
    grid.innerHTML = labels
      .map(
        (s, i) => `
      <div class="stat-card">
        <div class="stat-label"><span class="stat-icon">${icons[Object.keys(icons)[i]]}</span> ${titles[Object.keys(titles)[i]]}</div>
        <div class="stat-value">${s.value}${s.unit ? '<span class="stat-sub-unit">' + s.unit + "</span>" : ""}</div>
        ${s.sub ? '<div class="stat-sub ' + s.color + '">' + s.sub + "</div>" : ""}
      </div>`
      )
      .join("");
  }

  // ─── Weekly Chart ────────────────────────────────────────────────────────

  function renderWeeklyChart() {
    const svg = document.getElementById("weeklyChart");
    const data = WEEKS;
    const w = 600, h = 220;
    const pad = { top: 24, right: 22, bottom: 28, left: 10 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;
    const maxVal = Math.max(...data.map(d => d.km));
    const yMax = Math.ceil(maxVal / 10) * 10;
    const barW = Math.min(40, chartW / data.length - 10);
    const gap = (chartW - barW * data.length) / (data.length + 1);

    const gridColor = "var(--border)";
    const dimColor = "var(--text-dim)";
    const mutedColor = "var(--text-muted)";
    const accentColor = "var(--accent)";

    let html = `<defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accentColor}"/><stop offset="100%" stop-color="var(--accent-dim)"/></linearGradient></defs>`;

    // Grid lines
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = pad.top + (chartH / steps) * i;
      const val = yMax - (yMax / steps) * i;
      html += `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="${gridColor}" stroke-width="0.5" stroke-dasharray="${i === steps ? "0" : "4 4"}"/>`;
      html += `<text x="${pad.left - 4}" y="${y + 3}" class="chart-label" text-anchor="end">${Math.round(val)}</text>`;
    }

    // Bars
    data.forEach((d, i) => {
      const x = pad.left + gap + i * (barW + gap);
      const barH = (d.km / yMax) * chartH;
      const y = pad.top + chartH - barH;
      const isCurrent = i === data.length - 1;
      html += `<g class="chart-bar">
        <rect x="${x}" y="${y}" width="${barW}" height="${barH}" class="chart-bar-rect"
          fill="${isCurrent ? "var(--accent)" : "url(#barGrad)"}" opacity="${isCurrent ? "1" : "0.75"}" rx="3"/>
        <text x="${x + barW / 2}" y="${y - 6}" class="chart-value" fill="${mutedColor}">${d.km}</text>
      </g>`;
      // X labels
      const textX = x + barW / 2;
      html += `<text x="${textX}" y="${h - 6}" class="chart-label">${d.label}</text>`;
    });

    svg.innerHTML = html;
  }

  // ─── HR Zones ────────────────────────────────────────────────────────────

  function renderHRZones() {
    const container = document.getElementById("hrZonesContainer");
    const total = HR_ZONES.reduce((s, z) => s + z.pct, 0);

    const html = `
      <div class="hr-zone-list">
        ${HR_ZONES.map(z => `
          <div class="hr-zone-item">
            <div class="hr-zone-color" style="background:${z.color}"></div>
            <div class="hr-zone-info">
              <div class="hr-zone-header">
                <span class="hr-zone-name">${z.name}</span>
                <span class="hr-zone-range">${z.range}</span>
              </div>
              <div class="hr-zone-bar-bg">
                <div class="hr-zone-bar-fill" style="width:${(z.pct / total) * 100}%; background:${z.color}"></div>
              </div>
            </div>
            <span class="hr-zone-percent">${z.pct}%</span>
          </div>
        `).join("")}
      </div>`;

    // Also render a doughnut-like ring using canvas
    const ringHtml = `<canvas id="hrRing" width="140" height="140" style="margin-bottom:8px;display:block;margin-left:auto;margin-right:auto"></canvas>`;

    container.innerHTML = ringHtml + html;

    // Draw ring
    requestAnimationFrame(() => {
      const canvas = document.getElementById("hrRing");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const cx = 70, cy = 70, r = 56, ringW = 12;
      const totalPct = HR_ZONES.reduce((s, z) => s + z.pct, 0);
      let startAngle = -Math.PI / 2;

      HR_ZONES.forEach(z => {
        const slice = (z.pct / totalPct) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, startAngle + slice);
        ctx.strokeStyle = z.color;
        ctx.lineWidth = ringW;
        ctx.lineCap = "round";
        ctx.stroke();
        startAngle += slice;
      });

      // Center text
      ctx.fillStyle = "#e2e6f0";
      ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("155", cx, cy - 4);
      ctx.font = "10px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#7b8296";
      ctx.fillText("avg bpm", cx, cy + 14);
    });
  }

  // ─── Runs Table ──────────────────────────────────────────────────────────

  function renderRunsTable() {
    const runs = getVisibleRuns();
    const tbody = document.getElementById("runsTableBody");
    const empty = document.getElementById("emptyState");
    const headerDate = document.getElementById("dateRangeDisplay");

    if (runs.length === 0) {
      tbody.innerHTML = "";
      empty.style.display = "flex";
    } else {
      empty.style.display = "none";
      tbody.innerHTML = runs
        .map(r => {
          const pace = r.duration / r.distance;
          const dt = parseDate(r.date);
          const dateStr = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const badgeLabel = { "5k": "5K", "10k": "10K", half: "Half", marathon: "Marathon" };
          return `<tr>
            <td>${dateStr}</td>
            <td>
              <span class="route-name">${r.route}</span>
              <span class="distance-type-badge badge-${r.type}">${badgeLabel[r.type]}</span>
            </td>
            <td>${r.distance.toFixed(1)} km</td>
            <td>${formatDuration(r.duration)}</td>
            <td><span class="pace-text" style="color:${paceToColor(pace)}">${formatPace(pace)}</span></td>
            <td>${r.avgHr} bpm</td>
            <td>${r.elevation} m</td>
          </tr>`;
        })
        .join("");
    }

    // Update header date range
    const filtered = filterRuns(currentView);
    if (filtered.length > 0) {
      const dates = filtered.map(r => parseDate(r.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      headerDate.textContent = "${fmt(minDate)} – ${fmt(maxDate)}";
    } else {
      headerDate.textContent = "No data";
    }
  }

  // ─── Render All ──────────────────────────────────────────────────────────

  function render() {
    renderStats();
    renderWeeklyChart();
    renderHRZones();
    renderRunsTable();
  }

  // ─── Event Handlers ──────────────────────────────────────────────────────

  document.getElementById("viewToggles").addEventListener("click", e => {
    const btn = e.target.closest(".toggle-btn");
    if (!btn) return;
    document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentView = btn.dataset.view;
    render();
  });

  document.getElementById("distanceFilter").addEventListener("click", e => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentFilter = chip.dataset.filter;
    render();
  });

  // ─── Init ─────────────────────────────────────────────────────────────────

  render();
})();