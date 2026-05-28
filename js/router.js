// ============================================================
// TravelBase — Hash-based SPA Router
// ============================================================

const Router = (() => {
  const routes = {};
  let currentRoute = null;
  let container = null;
  let onBeforeNavigate = null;

  function register(path, handler, options = {}) {
    routes[path] = { handler, ...options };
  }

  function setContainer(el) {
    container = typeof el === 'string' ? document.getElementById(el) : el;
  }

  function setBeforeNavigate(fn) {
    onBeforeNavigate = fn;
  }

  async function navigate(path, pushState = true) {
    if (!routes[path]) {
      path = '/dashboard'; // fallback
    }

    if (onBeforeNavigate) {
      const allowed = onBeforeNavigate(path, currentRoute);
      if (allowed === false) return;
    }

    const route = routes[path];

    // Check role access
    if (route.adminOnly) {
      const Auth = (await import('./auth.js')).default;
      if (!Auth.isAdmin()) {
        navigate('/dashboard');
        return;
      }
    }

    currentRoute = path;

    if (pushState) {
      window.location.hash = '#' + path;
    }

    if (container) {
      // Page transition
      container.style.opacity = '0';
      container.style.transform = 'translateY(8px)';

      await new Promise(r => setTimeout(r, 150));

      container.innerHTML = '';
      
      if (route.handler) {
        await route.handler(container);
      }

      container.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }

    // Update active nav items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
      const href = item.getAttribute('data-route');
      item.classList.toggle('active', href === path);
    });

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('routechange', { detail: { path } }));
  }

  function getCurrentRoute() {
    return currentRoute;
  }

  function getRouteFromHash() {
    const hash = window.location.hash.replace('#', '') || '/dashboard';
    return hash;
  }

  function start() {
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const path = getRouteFromHash();
      if (path !== currentRoute) {
        navigate(path, false);
      }
    });

    // Initial route
    const initial = getRouteFromHash();
    navigate(initial, false);
  }

  return {
    register,
    setContainer,
    setBeforeNavigate,
    navigate,
    getCurrentRoute,
    start
  };
})();

export default Router;
