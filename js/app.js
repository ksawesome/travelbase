// ============================================================
// TravelBase — App Shell (Loaded ONLY after auth)
// Orchestrates the entire SPA: sidebar, navbar, router, pages
// ============================================================

import Store from './store.js';
import Router from './router.js';
import Timer from './timer.js';

const ICONS = {
  dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  packing: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-3V4a1 1 0 00-1-1H8a1 1 0 00-1 1v3H4a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V8a1 1 0 00-1-1z"/><path d="M9 3v4M15 3v4M9 14h6"/></svg>',
  tasks: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  arrival: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M12 3v14M5 10l7 7 7-7"/></svg>',
  docs: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  budget: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  timeline: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  transport: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14v-5H5z"/><path d="M2 17h20"/><path d="M15 17V9a3 3 0 00-3-3H8"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
  weather: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>',
  contacts: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  admin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
  sun: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  chevronLeft: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
};

const NAV_ITEMS = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'dashboard', section: 'Main' },
  { id: 'packing', path: '/packing', label: 'Packing List', icon: 'packing', section: 'Main' },
  { id: 'predeparture', path: '/predeparture', label: 'Pre-Departure', icon: 'tasks', section: 'Planning' },
  { id: 'postarrival', path: '/postarrival', label: 'Post-Arrival', icon: 'arrival', section: 'Planning' },
  { id: 'documents', path: '/documents', label: 'Documents', icon: 'docs', section: 'Planning' },
  { id: 'budget', path: '/budget', label: 'Budget', icon: 'budget', section: 'Planning' },
  { id: 'transport', path: '/transport', label: 'JFK → Buffalo', icon: 'transport', section: 'Travel' },
  { id: 'timeline', path: '/timeline', label: 'Timeline', icon: 'timeline', section: 'Travel' },
  { id: 'weather', path: '/weather', label: 'Weather', icon: 'weather', section: 'Travel' },
  { id: 'contacts', path: '/contacts', label: 'Contacts', icon: 'contacts', section: 'Travel' },
];

const App = (() => {
  let _user = null;

  async function init(user) {
    _user = user;
    Store.init(user.id, user.role);
    Timer.start();

    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = buildShell();
    appRoot.style.display = '';

    // Demo banner
    if (user.role === 'demo') {
      const banner = document.createElement('div');
      banner.className = 'demo-banner';
      banner.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Demo Mode — Read-only. Changes won't be saved.`;
      document.querySelector('.app-main').prepend(banner);
    }

    setupSidebar();
    setupNavbar();
    setupMobileNav();
    await registerRoutes();
    Router.setContainer('page-content');
    Router.start();

    // Theme
    const theme = Store.loadGlobal('theme', 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function buildShell() {
    const isAdmin = _user.role === 'admin';
    let sections = {};
    NAV_ITEMS.forEach(item => {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });

    let navHTML = '';
    Object.entries(sections).forEach(([section, items]) => {
      navHTML += `<div class="sidebar-section">
        <div class="sidebar-section-title">${section}</div>
        ${items.map(item => `
          <button class="nav-item" data-route="${item.path}" id="nav-${item.id}">
            <span class="nav-item-icon">${ICONS[item.icon]}</span>
            <span class="nav-item-label">${item.label}</span>
          </button>
        `).join('')}
      </div>`;
    });

    if (isAdmin) {
      navHTML += `<div class="sidebar-section">
        <div class="sidebar-section-title">System</div>
        <button class="nav-item" data-route="/admin" id="nav-admin">
          <span class="nav-item-icon">${ICONS.admin}</span>
          <span class="nav-item-label">Admin Panel</span>
        </button>
      </div>`;
    }

    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <svg class="sidebar-logo" width="36" height="36" viewBox="0 0 48 48" fill="none">
            <defs><linearGradient id="sLogo" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stop-color="#00d4ff"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
            <circle cx="24" cy="24" r="22" stroke="url(#sLogo)" stroke-width="2.5" fill="none"/>
            <path d="M14 28 L22 18 L26 24 L34 14" stroke="url(#sLogo)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
          <span class="sidebar-brand">TravelBase</span>
        </div>
        <nav class="sidebar-nav">${navHTML}</nav>
        <button class="sidebar-collapse-btn" id="sidebar-toggle" title="Collapse sidebar">
          ${ICONS.chevronLeft}
        </button>
      </aside>

      <div class="navbar" id="navbar">
        <div class="navbar-left">
          <button class="btn-icon mobile-menu-btn" id="mobile-menu-btn" style="display:none">${ICONS.menu}</button>
          <span class="navbar-title" id="navbar-title">Dashboard</span>
        </div>
        <div class="navbar-right">
          <button class="btn-icon" id="theme-toggle" title="Toggle theme">${ICONS.moon}</button>
          <div class="relative">
            <button class="navbar-user" id="user-menu-btn">
              <span class="avatar avatar-sm">${_user.username.charAt(0)}</span>
              <span>${_user.username}</span>
              ${_user.role !== 'user' ? `<span class="badge badge-${_user.role === 'admin' ? 'info' : 'warning'}" style="font-size:9px">${_user.role}</span>` : ''}
            </button>
            <div class="navbar-dropdown hidden" id="user-dropdown">
              <button class="navbar-dropdown-item" id="btn-export">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export Data
              </button>
              <div class="navbar-dropdown-divider"></div>
              <button class="navbar-dropdown-item danger" id="btn-logout">
                ${ICONS.logout}
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <main class="app-main" id="app-main">
        <div class="page-container" id="page-content"></div>
      </main>

      <nav class="mobile-nav" id="mobile-nav"></nav>
    `;
  }

  function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const appMain = document.getElementById('app-main');
    const navbar = document.getElementById('navbar');

    const collapsed = Store.loadGlobal('sidebarCollapsed', false);
    if (collapsed) {
      sidebar.classList.add('collapsed');
      appMain.classList.add('sidebar-collapsed');
      navbar.style.left = 'var(--sidebar-collapsed)';
    }

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      appMain.classList.toggle('sidebar-collapsed', isCollapsed);
      navbar.style.left = isCollapsed ? 'var(--sidebar-collapsed)' : '';
      Store.saveGlobal('sidebarCollapsed', isCollapsed);
    });

    // Nav item clicks
    sidebar.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.getAttribute('data-route');
        Router.navigate(route);
      });
    });
  }

  function setupNavbar() {
    const userBtn = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');

    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      Store.saveGlobal('theme', next);
      const btn = document.getElementById('theme-toggle');
      btn.innerHTML = next === 'dark' ? ICONS.moon : ICONS.sun;
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', async () => {
      const Auth = (await import('./auth.js')).default;
      Auth.logout();
    });

    // Export
    document.getElementById('btn-export').addEventListener('click', async () => {
      const data = await Store.exportAll();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `travelbase-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported successfully', 'success');
    });

    // Update title on route change
    window.addEventListener('routechange', (e) => {
      const path = e.detail.path;
      const item = NAV_ITEMS.find(i => i.path === path);
      const title = document.getElementById('navbar-title');
      if (item) title.textContent = item.label;
      else if (path === '/admin') title.textContent = 'Admin Panel';
      else title.textContent = 'TravelBase';
    });
  }

  function setupMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileItems = [
      { path: '/dashboard', icon: 'dashboard', label: 'Home' },
      { path: '/packing', icon: 'packing', label: 'Pack' },
      { path: '/predeparture', icon: 'tasks', label: 'Tasks' },
      { path: '/documents', icon: 'docs', label: 'Docs' },
      { path: '/budget', icon: 'budget', label: 'Budget' },
    ];

    mobileNav.innerHTML = mobileItems.map(item => `
      <button class="mobile-nav-item" data-route="${item.path}">
        ${ICONS[item.icon]}
        <span>${item.label}</span>
      </button>
    `).join('');

    mobileNav.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        Router.navigate(btn.getAttribute('data-route'));
      });
    });
  }

  async function registerRoutes() {
    // Lazy-load page modules
    Router.register('/dashboard', async (container) => {
      const { default: page } = await import('./pages/dashboard.js');
      page.render(container);
    });
    Router.register('/packing', async (container) => {
      const { default: page } = await import('./pages/packing.js');
      page.render(container);
    });
    Router.register('/predeparture', async (container) => {
      const { default: page } = await import('./pages/predeparture.js');
      page.render(container);
    });
    Router.register('/postarrival', async (container) => {
      const { default: page } = await import('./pages/postarrival.js');
      page.render(container);
    });
    Router.register('/documents', async (container) => {
      const { default: page } = await import('./pages/documents.js');
      page.render(container);
    });
    Router.register('/budget', async (container) => {
      const { default: page } = await import('./pages/budget.js');
      page.render(container);
    });
    Router.register('/timeline', async (container) => {
      const { default: page } = await import('./pages/timeline.js');
      page.render(container);
    });
    Router.register('/transport', async (container) => {
      const { default: page } = await import('./pages/transport.js');
      page.render(container);
    });
    Router.register('/weather', async (container) => {
      const { default: page } = await import('./pages/weather.js');
      page.render(container);
    });
    Router.register('/contacts', async (container) => {
      const { default: page } = await import('./pages/contacts.js');
      page.render(container);
    });
    Router.register('/admin', async (container) => {
      const { default: page } = await import('./pages/admin.js');
      page.render(container);
    }, { adminOnly: true });
  }

  function getUser() {
    return _user;
  }

  return { init, getUser, ICONS };
})();

// --- Global Toast Helper ---
window.showToast = function(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span style="flex:1">${message}</span>
    <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(()=>this.parentElement.remove(), 300)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// --- Global Modal Helper ---
window.showModal = function(title, bodyHTML, actions = []) {
  return new Promise(resolve => {
    const overlay = document.getElementById('modal-overlay');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" id="modal-close-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="modal-body">${bodyHTML}</div>
        <div class="modal-footer">
          ${actions.map((a, i) => `<button class="btn ${a.class || 'btn-ghost'}" id="modal-action-${i}">${a.label}</button>`).join('')}
        </div>
      </div>
    `;

    const close = () => {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
      resolve(null);
    };

    document.getElementById('modal-close-btn').onclick = close;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });

    actions.forEach((a, i) => {
      document.getElementById(`modal-action-${i}`).onclick = () => {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
        resolve(a.value);
      };
    });
  });
};

export default App;
