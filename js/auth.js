// ============================================================
// TravelBase — Authentication System
// Three-tier: Admin / User / Demo
// Zero-load: dynamically imports app ONLY after auth success
// ============================================================

import Crypto from './crypto.js';

const Auth = (() => {
  const USERS_KEY = 'tb_users';
  const SESSION_KEY = 'tb_session';
  const LOCKOUT_KEY = 'tb_lockout';
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MS = 60000;
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min
  const REMEMBER_DAYS = 7;

  let currentUser = null;
  let inactivityTimer = null;

  // --- User storage (unencrypted metadata, hashed passwords) ---

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function isFirstVisit() {
    return getUsers().length === 0;
  }

  // --- Lockout ---

  function getLockout() {
    try {
      const l = JSON.parse(sessionStorage.getItem(LOCKOUT_KEY) || '{}');
      return l;
    } catch {
      return {};
    }
  }

  function setLockout(data) {
    sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
  }

  function isLockedOut() {
    const l = getLockout();
    if (!l.until) return false;
    if (Date.now() < l.until) return true;
    // Lockout expired
    setLockout({});
    return false;
  }

  function recordFailedAttempt() {
    const l = getLockout();
    l.attempts = (l.attempts || 0) + 1;
    if (l.attempts >= MAX_ATTEMPTS) {
      l.until = Date.now() + LOCKOUT_MS;
      l.attempts = 0;
    }
    setLockout(l);
    return l;
  }

  function getRemainingLockoutSeconds() {
    const l = getLockout();
    if (!l.until) return 0;
    return Math.max(0, Math.ceil((l.until - Date.now()) / 1000));
  }

  // --- Session ---

  function createSession(user, remember) {
    const session = {
      token: Crypto.generateToken(),
      userId: user.id,
      username: user.username,
      role: user.role,
      createdAt: Date.now(),
      remember
    };
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function getSession() {
    let session = null;
    try {
      session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch {}
    if (!session) {
      try {
        session = JSON.parse(localStorage.getItem(SESSION_KEY));
      } catch {}
    }
    if (!session) return null;

    // Check expiry
    const maxAge = session.remember ? REMEMBER_DAYS * 24 * 60 * 60 * 1000 : SESSION_TIMEOUT_MS;
    if (Date.now() - session.createdAt > maxAge) {
      clearSession();
      return null;
    }
    return session;
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    currentUser = null;
  }

  // --- Inactivity timer ---

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    const session = getSession();
    if (session && !session.remember) {
      inactivityTimer = setTimeout(() => {
        logout();
        window.location.reload();
      }, SESSION_TIMEOUT_MS);
    }
  }

  function startInactivityMonitor() {
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(evt => {
      document.addEventListener(evt, resetInactivityTimer, { passive: true });
    });
    resetInactivityTimer();
  }

  // --- Core auth operations ---

  async function createUser(username, password, role = 'user') {
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already exists');
    }
    const salt = Crypto.generateSalt();
    const hash = await Crypto.hashPassword(password, salt);
    const user = {
      id: Crypto.generateToken(),
      username,
      role,
      salt,
      hash,
      createdAt: Date.now(),
      lastLogin: null
    };
    users.push(user);
    saveUsers(users);
    return user;
  }

  async function login(username, password, remember = false) {
    if (isLockedOut()) {
      const secs = getRemainingLockoutSeconds();
      throw new Error(`Too many attempts. Try again in ${secs}s`);
    }

    // Demo shortcut
    if (username === 'demo' && password === 'demo123') {
      const demoUser = {
        id: 'demo',
        username: 'demo',
        role: 'demo',
        createdAt: 0,
        lastLogin: Date.now()
      };
      currentUser = demoUser;
      createSession(demoUser, false);
      return demoUser;
    }

    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      recordFailedAttempt();
      throw new Error('Invalid username or password');
    }

    const hash = await Crypto.hashPassword(password, user.salt);
    if (hash !== user.hash) {
      const l = recordFailedAttempt();
      if (l.until) {
        throw new Error(`Too many attempts. Locked for 60s`);
      }
      throw new Error('Invalid username or password');
    }

    // Success — clear lockout
    setLockout({});
    user.lastLogin = Date.now();
    saveUsers(users);
    currentUser = user;
    createSession(user, remember);
    return user;
  }

  function logout() {
    clearSession();
    if (inactivityTimer) clearTimeout(inactivityTimer);
    document.getElementById('app-root').style.display = 'none';
    document.getElementById('app-root').innerHTML = '';
    document.getElementById('login-root').style.display = '';
    // Remove dynamically loaded CSS
    document.querySelectorAll('link[data-dynamic]').forEach(el => el.remove());
    // Re-add login.css for the login page
    loadCSS('css/login.css');
    window.location.hash = '';
    initLoginUI();
  }

  function getCurrentUser() {
    if (currentUser) return currentUser;
    const session = getSession();
    if (!session) return null;
    if (session.role === 'demo') {
      currentUser = { id: 'demo', username: 'demo', role: 'demo' };
      return currentUser;
    }
    const users = getUsers();
    currentUser = users.find(u => u.id === session.userId) || null;
    return currentUser;
  }

  function isAdmin() {
    const u = getCurrentUser();
    return u && u.role === 'admin';
  }

  function isDemo() {
    const u = getCurrentUser();
    return u && u.role === 'demo';
  }

  function canEdit() {
    return !isDemo();
  }

  // --- Admin operations ---

  async function adminCreateUser(username, password, role) {
    if (!isAdmin()) throw new Error('Unauthorized');
    return createUser(username, password, role);
  }

  function adminDeleteUser(userId) {
    if (!isAdmin()) throw new Error('Unauthorized');
    let users = getUsers();
    users = users.filter(u => u.id !== userId);
    saveUsers(users);
    // Clean up user data
    Object.keys(localStorage).forEach(key => {
      if (key.includes(userId)) localStorage.removeItem(key);
    });
  }

  async function adminResetPassword(userId, newPassword) {
    if (!isAdmin()) throw new Error('Unauthorized');
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    const salt = Crypto.generateSalt();
    user.salt = salt;
    user.hash = await Crypto.hashPassword(newPassword, salt);
    saveUsers(users);
  }

  function getAllUsers() {
    if (!isAdmin()) return [];
    return getUsers().map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));
  }

  // --- Boot the app after auth ---

  async function bootApp(user) {
    // Hide login, show app
    document.getElementById('login-root').style.display = 'none';
    document.getElementById('app-root').style.display = '';

    // Remove login.css (its body { overflow: hidden } blocks all scrolling)
    const loginCSS = document.querySelector('link[href="css/login.css"]');
    if (loginCSS) loginCSS.remove();

    // Dynamically load CSS
    loadCSS('css/index.css');
    loadCSS('css/components.css');
    loadCSS('css/pages.css');

    // Start inactivity monitor
    startInactivityMonitor();

    // Dynamically import and boot the app
    const { default: App } = await import('./app.js');
    App.init(user);
  }

  function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-dynamic', 'true');
    document.head.appendChild(link);
  }

  // --- Login UI logic ---

  function initLoginUI() {
    const loginForm = document.getElementById('login-form');
    const setupForm = document.getElementById('setup-form');
    const subtitle = document.getElementById('login-subtitle');
    const demoBtn = document.getElementById('demo-btn');
    const togglePwd = document.getElementById('toggle-password');

    if (isFirstVisit()) {
      loginForm.style.display = 'none';
      setupForm.style.display = '';
      subtitle.textContent = 'Create your admin account to get started';
    } else {
      loginForm.style.display = '';
      setupForm.style.display = 'none';
      subtitle.textContent = 'Sign in to your account';
    }

    // Password toggle
    if (togglePwd) {
      togglePwd.onclick = () => {
        const pwd = document.getElementById('login-password');
        const isText = pwd.type === 'text';
        pwd.type = isText ? 'password' : 'text';
        togglePwd.innerHTML = isText
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
      };
    }

    // Login form handler
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('login-btn');
      const errEl = document.getElementById('login-error');
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const remember = document.getElementById('login-remember').checked;

      btn.classList.add('loading');
      errEl.textContent = '';

      try {
        const user = await login(username, password, remember);
        await bootApp(user);
      } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.remove('shake');
        void errEl.offsetWidth; // reflow
        errEl.classList.add('shake');
        btn.classList.remove('loading');
      }
    };

    // Setup form handler
    setupForm.onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('setup-btn');
      const errEl = document.getElementById('setup-error');
      const username = document.getElementById('setup-username').value.trim();
      const password = document.getElementById('setup-password').value;
      const confirm = document.getElementById('setup-confirm').value;

      btn.classList.add('loading');
      errEl.textContent = '';

      if (password !== confirm) {
        errEl.textContent = 'Passwords do not match';
        errEl.classList.remove('shake');
        void errEl.offsetWidth;
        errEl.classList.add('shake');
        btn.classList.remove('loading');
        return;
      }

      if (password.length < 6) {
        errEl.textContent = 'Password must be at least 6 characters';
        errEl.classList.remove('shake');
        void errEl.offsetWidth;
        errEl.classList.add('shake');
        btn.classList.remove('loading');
        return;
      }

      try {
        const user = await createUser(username, password, 'admin');
        const loggedIn = await login(username, password, false);
        await bootApp(loggedIn);
      } catch (err) {
        errEl.textContent = err.message;
        btn.classList.remove('loading');
      }
    };

    // Demo button
    demoBtn.onclick = async () => {
      try {
        const user = await login('demo', 'demo123');
        await bootApp(user);
      } catch (err) {
        console.error('Demo login failed:', err);
      }
    };

    // Update lockout UI
    if (isLockedOut()) {
      showLockoutBanner();
    }
  }

  function showLockoutBanner() {
    const existing = document.querySelector('.lockout-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.className = 'lockout-banner';
    const secs = getRemainingLockoutSeconds();
    banner.innerHTML = `Too many failed attempts. Try again in <strong id="lockout-timer">${secs}s</strong>`;
    const form = document.getElementById('login-form');
    form.parentNode.insertBefore(banner, form);

    const interval = setInterval(() => {
      const remaining = getRemainingLockoutSeconds();
      const timer = document.getElementById('lockout-timer');
      if (timer) timer.textContent = `${remaining}s`;
      if (remaining <= 0) {
        clearInterval(interval);
        banner.remove();
      }
    }, 1000);
  }

  // --- Init on page load ---

  async function init() {
    // Check for existing session
    const session = getSession();
    if (session) {
      const user = getCurrentUser();
      if (user) {
        await bootApp(user);
        return;
      }
    }
    // No valid session — show login
    initLoginUI();
  }

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    getCurrentUser,
    isAdmin,
    isDemo,
    canEdit,
    logout,
    login,
    createUser,
    adminCreateUser,
    adminDeleteUser,
    adminResetPassword,
    getAllUsers,
    getSession,
    clearSession
  };
})();

export default Auth;
