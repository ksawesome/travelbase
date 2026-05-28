// ============================================================
// TravelBase — Deadline Timer Engine
// Single global interval, efficient per-item countdowns
// ============================================================

const Timer = (() => {
  let _interval = null;
  const _listeners = new Set();

  // Departure date — June 9, 2026 23:10 IST (BOM)
  const DEPARTURE_DATE = new Date('2026-06-09T23:10:00+05:30');

  function start() {
    if (_interval) return;
    _interval = setInterval(() => {
      _listeners.forEach(fn => fn());
    }, 60000); // tick every 60 seconds
    // Also fire immediately
    _listeners.forEach(fn => fn());
  }

  function stop() {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
  }

  function onTick(fn) {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  }

  function getDepartureCountdown() {
    const now = new Date();
    const diff = DEPARTURE_DATE - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, past: true };
    }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      total: diff,
      past: false
    };
  }

  function getDeadlineInfo(deadline) {
    if (!deadline) return null;
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;

    if (diff <= 0) {
      const absDiff = Math.abs(diff);
      return {
        status: 'overdue',
        label: formatDuration(absDiff) + ' overdue',
        diff: diff,
        cssClass: 'deadline-overdue'
      };
    }

    const days = diff / 86400000;
    let status, cssClass;
    if (days > 7) {
      status = 'safe';
      cssClass = 'deadline-safe';
    } else if (days > 2) {
      status = 'soon';
      cssClass = 'deadline-soon';
    } else {
      status = 'urgent';
      cssClass = 'deadline-urgent';
    }

    return {
      status,
      label: formatDuration(diff) + ' left',
      diff,
      cssClass
    };
  }

  function getCompletedInfo(completedAt) {
    if (!completedAt) return null;
    const d = new Date(completedAt);
    return {
      status: 'done',
      label: `Done ${formatDate(d)}`,
      cssClass: 'deadline-done'
    };
  }

  function formatDuration(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  }

  function formatDate(date) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  function formatDateFull(date) {
    if (typeof date === 'string') date = new Date(date);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function formatDateShort(date) {
    if (typeof date === 'string') date = new Date(date);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  function formatDateTime(date) {
    if (typeof date === 'string') date = new Date(date);
    return `${formatDateShort(date)} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
  }

  function getDaysUntilDeparture() {
    const now = new Date();
    const diff = DEPARTURE_DATE - now;
    return Math.max(0, Math.ceil(diff / 86400000));
  }

  function getSmartReminder() {
    const days = getDaysUntilDeparture();
    if (days > 30) return { type: 'info', message: '📅 Plenty of time. Focus on documents and visa paperwork.' };
    if (days > 14) return { type: 'info', message: '🛒 Start shopping for packing items. Activate international cards.' };
    if (days > 7) return { type: 'warning', message: '🟡 One week to start packing. Weigh your bags and check off items.' };
    if (days > 3) return { type: 'warning', message: '🟠 Final stretch! Confirm all documents are ready and bags are packed.' };
    if (days > 1) return { type: 'danger', message: '🔴 Almost there! Triple-check: DS-2019, passport, SEVIS receipt in cabin bag.' };
    if (days === 1) return { type: 'danger', message: '🔴 Tomorrow is the day! Final bag check. Get some rest tonight.' };
    if (days === 0) return { type: 'success', message: '✈️ Today\'s the day! Safe travels, Kshitish!' };
    return { type: 'success', message: '🌎 You should be in Buffalo! Check post-arrival tasks.' };
  }

  // Render a deadline badge HTML
  function renderDeadlineBadge(deadline, completed, completedAt) {
    if (completed && completedAt) {
      const info = getCompletedInfo(completedAt);
      return `<span class="deadline-badge ${info.cssClass}">✅ ${info.label}</span>`;
    }
    if (completed) {
      return `<span class="deadline-badge deadline-done">✅ Done</span>`;
    }
    if (!deadline) {
      return `<span class="deadline-badge badge-muted">No deadline</span>`;
    }
    const info = getDeadlineInfo(deadline);
    const icon = info.status === 'overdue' ? '🔴' : info.status === 'urgent' ? '⚠️' : info.status === 'soon' ? '⏰' : '📅';
    return `<span class="deadline-badge ${info.cssClass}">${icon} ${info.label}</span>`;
  }

  return {
    start,
    stop,
    onTick,
    DEPARTURE_DATE,
    getDepartureCountdown,
    getDeadlineInfo,
    getCompletedInfo,
    getDaysUntilDeparture,
    getSmartReminder,
    formatDuration,
    formatDate,
    formatDateFull,
    formatDateShort,
    formatDateTime,
    renderDeadlineBadge
  };
})();

export default Timer;
