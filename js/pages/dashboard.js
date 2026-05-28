// ============================================================
// TravelBase — Dashboard Page
// Command center: readiness score, countdown, progress, urgent items
// ============================================================

import Store from '../store.js';
import Timer from '../timer.js';

const Dashboard = (() => {
  let _tickUnsub = null;

  function render(container) {
    if (_tickUnsub) _tickUnsub();

    const packing = Store.load('packing', null);
    const predeparture = Store.load('predeparture', null);
    const postarrival = Store.load('postarrival', null);
    const budget = Store.load('budget', null);
    const transportChoice = Store.load('transport_choice', null);

    const packingStats = getPackingStats(packing);
    const preStats = getTaskStats(predeparture);
    const postStats = getTaskStats(postarrival);
    const readiness = calcReadiness(packingStats, preStats, postStats);
    const reminder = Timer.getSmartReminder();
    const urgentItems = getUrgentItems(predeparture, postarrival, packing);

    container.innerHTML = `
      <div class="reminder-banner ${reminder.type}">${reminder.message}</div>

      <div class="dashboard-grid">
        <!-- Hero: Readiness + Countdown -->
        <div class="dashboard-hero">
          <div class="card card-accent">
            <div class="card-header">
              <span class="card-title"><span class="emoji">🎯</span> Readiness Score</span>
            </div>
            <div class="flex items-center gap-8">
              <div class="readiness-score">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(100,116,139,0.12)" stroke-width="10"/>
                  <circle cx="80" cy="80" r="70" fill="none" stroke="url(#readGrad)" stroke-width="10"
                    stroke-dasharray="${2 * Math.PI * 70}" stroke-dashoffset="${2 * Math.PI * 70 * (1 - readiness / 100)}"
                    stroke-linecap="round" transform="rotate(-90 80 80)"
                    style="transition: stroke-dashoffset 1s ease"/>
                  <defs><linearGradient id="readGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
                </svg>
                <div class="readiness-score-value">
                  <span class="readiness-score-number">${readiness}</span>
                  <span class="readiness-score-label">% ready</span>
                </div>
              </div>
              <div class="flex-col gap-3" style="flex:1">
                ${renderMiniProgress('📦 Packing', packingStats.percent)}
                ${renderMiniProgress('📋 Pre-Departure', preStats.percent)}
                ${renderMiniProgress('🛬 Post-Arrival', postStats.percent)}
                ${renderMiniProgress('💰 Budget', budget ? 85 : 0)}
              </div>
            </div>
          </div>

          <div class="card card-accent">
            <div class="card-header">
              <span class="card-title"><span class="emoji">✈️</span> Departure Countdown</span>
            </div>
            <div id="countdown-display" class="countdown-display" style="justify-content:center; margin:20px 0">
              ${renderCountdown()}
            </div>
            <div class="text-center text-sm text-muted" style="margin-top:8px">
              June 9, 2026 • 23:10 IST • BOM → JFK
            </div>
            <div class="text-center text-xs text-muted" style="margin-top:4px">PNR: 7VHLRL</div>
          </div>
        </div>

        <!-- Urgent / Overdue Items -->
        <div class="card ${urgentItems.length > 0 ? 'card-accent' : ''}" style="${urgentItems.length > 0 ? 'border-color: rgba(239,68,68,0.25)' : ''}">
          <div class="card-header">
            <span class="card-title"><span class="emoji">⚠️</span> Urgent Items</span>
            <span class="badge ${urgentItems.length > 0 ? 'badge-danger' : 'badge-success'}">${urgentItems.length > 0 ? urgentItems.length : '✓ Clear'}</span>
          </div>
          ${urgentItems.length === 0 
            ? '<div class="text-center text-muted p-4">No urgent or overdue items ✨</div>'
            : `<div class="flex-col gap-2">${urgentItems.slice(0, 5).map(item => `
              <div class="checkbox-item" style="padding:8px 10px">
                <span style="flex:1;font-size:13px">${item.name}</span>
                ${Timer.renderDeadlineBadge(item.deadline, false)}
              </div>
            `).join('')}
            ${urgentItems.length > 5 ? `<div class="text-center text-sm text-muted">+${urgentItems.length - 5} more</div>` : ''}
            </div>`
          }
        </div>

        <!-- Packing Progress -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><span class="emoji">📦</span> Packing Progress</span>
            <span class="text-sm font-mono text-accent">${packingStats.packed}/${packingStats.total}</span>
          </div>
          <div class="flex gap-6 justify-center" style="margin:12px 0">
            ${renderProgressRing('Cabin', packingStats.bags.cabin || {packed:0,total:0}, 80)}
            ${renderProgressRing('Check 1', packingStats.bags.checked1 || {packed:0,total:0}, 80)}
            ${renderProgressRing('Check 2', packingStats.bags.checked2 || {packed:0,total:0}, 80)}
          </div>
        </div>

        <!-- Weight Status -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><span class="emoji">⚖️</span> Weight Status</span>
          </div>
          ${renderWeightGauge('Cabin Bag', packingStats.bags.cabin?.weight || 0, 7000)}
          ${renderWeightGauge('Checked Bag 1', packingStats.bags.checked1?.weight || 0, 23000)}
          ${renderWeightGauge('Checked Bag 2', packingStats.bags.checked2?.weight || 0, 23000)}
        </div>

        <!-- Today's Tasks -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><span class="emoji">📋</span> Today's Tasks</span>
          </div>
          ${renderTodaysTasks(predeparture, postarrival)}
        </div>

        <!-- Document Status -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><span class="emoji">📄</span> Documents</span>
            <button class="btn btn-sm btn-secondary" onclick="location.hash='#/documents'">View All</button>
          </div>
          ${renderDocStatus()}
        </div>

        <!-- Transport Decision -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><span class="emoji">🚌</span> JFK → Buffalo</span>
          </div>
          ${transportChoice 
            ? `<div class="flex items-center gap-3"><span class="badge badge-success">Decided</span><span class="text-sm">${transportChoice}</span></div>`
            : `<p class="text-sm text-muted mb-4">Have you decided how to get from JFK to Buffalo?</p>
               <button class="btn btn-sm btn-secondary" onclick="location.hash='#/transport'">Compare Options →</button>`
          }
        </div>

        <!-- Weather -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><span class="emoji">🌤️</span> Buffalo Weather</span>
          </div>
          <div id="dash-weather" class="text-sm text-muted">Loading weather...</div>
        </div>
      </div>
    `;

    // Live countdown
    _tickUnsub = Timer.onTick(() => {
      const el = document.getElementById('countdown-display');
      if (el) el.innerHTML = renderCountdown();
    });

    // Fetch weather
    fetchWeatherSnippet();
  }

  function renderCountdown() {
    const c = Timer.getDepartureCountdown();
    if (c.past) {
      return `<div class="text-center text-xl font-bold text-success">✈️ You should be en route!</div>`;
    }
    return `
      <div class="countdown-segment"><span class="countdown-value">${String(c.days).padStart(2,'0')}</span><span class="countdown-unit">Days</span></div>
      <span class="countdown-separator">:</span>
      <div class="countdown-segment"><span class="countdown-value">${String(c.hours).padStart(2,'0')}</span><span class="countdown-unit">Hours</span></div>
      <span class="countdown-separator">:</span>
      <div class="countdown-segment"><span class="countdown-value">${String(c.minutes).padStart(2,'0')}</span><span class="countdown-unit">Mins</span></div>
      <span class="countdown-separator">:</span>
      <div class="countdown-segment"><span class="countdown-value">${String(c.seconds).padStart(2,'0')}</span><span class="countdown-unit">Secs</span></div>
    `;
  }

  function renderMiniProgress(label, percent) {
    const color = percent >= 66 ? 'green' : percent >= 33 ? 'amber' : 'red';
    return `
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm">${label}</span>
          <span class="text-xs font-mono text-muted">${percent}%</span>
        </div>
        <div class="progress-bar"><div class="progress-fill ${color}" style="width:${percent}%"></div></div>
      </div>`;
  }

  function renderProgressRing(label, stats, size) {
    const pct = stats.total > 0 ? Math.round((stats.packed / stats.total) * 100) : 0;
    const r = (size - 12) / 2;
    const circ = 2 * Math.PI * r;
    const color = pct >= 66 ? '#10b981' : pct >= 33 ? '#f59e0b' : '#ef4444';
    return `
      <div class="flex-col items-center gap-2">
        <div class="progress-ring-container" style="width:${size}px;height:${size}px">
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(100,116,139,0.12)" stroke-width="6"/>
            <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="6"
              stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct/100)}"
              stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
              style="transition: stroke-dashoffset 0.8s ease"/>
          </svg>
          <span class="progress-ring-label" style="font-size:14px">${pct}%</span>
        </div>
        <span class="text-xs text-muted">${label}</span>
      </div>`;
  }

  function renderWeightGauge(label, currentGrams, maxGrams) {
    const pct = Math.min(100, (currentGrams / maxGrams) * 100);
    const color = pct > 95 ? '#ef4444' : pct > 85 ? '#f59e0b' : '#10b981';
    const cur = (currentGrams / 1000).toFixed(1);
    const max = (maxGrams / 1000).toFixed(0);
    return `
      <div class="weight-gauge" style="margin-bottom:14px">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm">${label}</span>
        </div>
        <div class="weight-gauge-bar">
          <div class="weight-gauge-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <div class="weight-gauge-labels">
          <span class="weight-gauge-current">${cur} kg</span>
          <span class="weight-gauge-max">${max} kg max</span>
        </div>
      </div>`;
  }

  function renderTodaysTasks(pre, post) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const tasks = [];
    const check = (list) => {
      if (!list) return;
      (Array.isArray(list) ? list : list.phases ? list.phases.flatMap(p => p.tasks) : []).forEach(t => {
        if (!t.completed && t.deadline) {
          const d = new Date(t.deadline);
          if (d <= today) tasks.push(t);
        }
      });
    };
    check(pre);
    check(post);

    if (tasks.length === 0) {
      return '<div class="text-center text-muted p-4">No tasks due today ✨</div>';
    }
    return tasks.slice(0, 5).map(t => `
      <div class="checkbox-item" style="padding:8px 10px">
        <input type="checkbox" class="checkbox" ${t.completed ? 'checked' : ''}>
        <span class="checkbox-label text-sm">${t.name}</span>
      </div>
    `).join('');
  }

  function renderDocStatus() {
    const requiredDocs = ['DS-2019', 'Visa', 'Passport', 'Offer Letter', 'Insurance', 'Flight Ticket'];
    const uploadedDocs = Store.load('doc_status', {});
    return `<div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 8px">
      ${requiredDocs.map(doc => {
        const uploaded = uploadedDocs[doc];
        return `<div class="flex items-center gap-2 p-4" style="background:var(--bg-tertiary);border-radius:var(--radius-sm);font-size:13px">
          <span>${uploaded ? '✅' : '⚠️'}</span>
          <span class="${uploaded ? 'text-muted' : ''}">${doc}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  function getPackingStats(data) {
    const stats = { packed: 0, total: 0, percent: 0, bags: {} };
    if (!data || !data.bags) return stats;
    data.bags.forEach(bag => {
      const bagStats = { packed: 0, total: 0, weight: 0 };
      (bag.categories || []).forEach(cat => {
        (cat.items || []).forEach(item => {
          if (!item.skipped) {
            bagStats.total++;
            stats.total++;
            if (item.packed) {
              bagStats.packed++;
              stats.packed++;
            }
            if (item.packed && item.estimatedWeight) {
              bagStats.weight += item.estimatedWeight * (item.quantity || 1);
            }
          }
        });
      });
      stats.bags[bag.id] = bagStats;
    });
    stats.percent = stats.total > 0 ? Math.round((stats.packed / stats.total) * 100) : 0;
    return stats;
  }

  function getTaskStats(data) {
    let done = 0, total = 0;
    if (!data) return { done: 0, total: 0, percent: 0 };
    const tasks = Array.isArray(data) ? data : data.phases ? data.phases.flatMap(p => p.tasks) : [];
    tasks.forEach(t => {
      total++;
      if (t.completed) done++;
    });
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  function calcReadiness(packing, pre, post) {
    return Math.round(packing.percent * 0.3 + pre.percent * 0.3 + post.percent * 0.1 + 30 * 0.3);
  }

  function getUrgentItems(pre, post, packing) {
    const items = [];
    const now = new Date();
    const checkTasks = (data) => {
      if (!data) return;
      const tasks = Array.isArray(data) ? data : data.phases ? data.phases.flatMap(p => p.tasks) : [];
      tasks.forEach(t => {
        if (!t.completed && t.deadline) {
          const info = Timer.getDeadlineInfo(t.deadline);
          if (info && (info.status === 'overdue' || info.status === 'urgent')) {
            items.push({ ...t, _urgency: info.status === 'overdue' ? 0 : 1 });
          }
        }
      });
    };
    checkTasks(pre);
    checkTasks(post);
    items.sort((a, b) => a._urgency - b._urgency);
    return items;
  }

  async function fetchWeatherSnippet() {
    try {
      const res = await fetch('https://wttr.in/Buffalo,NY?format=%t+%C+UV:%u+Humidity:%h');
      if (res.ok) {
        const text = await res.text();
        const el = document.getElementById('dash-weather');
        if (el) {
          el.innerHTML = `<div class="flex items-center gap-3">
            <span style="font-size:24px">🌤️</span>
            <div>
              <div class="font-semibold text-base" style="color:var(--text-primary)">${text.trim()}</div>
              <div class="text-xs text-muted mt-2">Pack for 28°C outdoors + 18°C AC indoors</div>
            </div>
          </div>`;
        }
      }
    } catch {
      const el = document.getElementById('dash-weather');
      if (el) el.textContent = 'Weather unavailable offline';
    }
  }

  return { render };
})();

export default Dashboard;
