// TravelBase — Admin Panel
import Auth from '../auth.js';
import Store from '../store.js';

const Admin = (() => {
  function render(container) {
    if (!Auth.isAdmin()) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🔒</div><div class="empty-state-title">Unauthorized</div></div>';
      return;
    }

    const users = Auth.getAllUsers();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="emoji">⚙️</span> Admin Panel</h1>
          <p class="page-subtitle">Manage users, data, and settings</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-sm btn-primary" id="btn-create-user">+ Create User</button>
        </div>
      </div>

      <div class="admin-stats">
        <div class="card text-center">
          <div class="stat-label">Total Users</div>
          <div class="stat-value text-accent">${users.length}</div>
        </div>
        <div class="card text-center">
          <div class="stat-label">Storage Used</div>
          <div class="stat-value text-lg font-mono">${getStorageSize()}</div>
        </div>
        <div class="card text-center">
          <div class="stat-label">App Version</div>
          <div class="stat-value text-lg font-mono">1.0.0</div>
        </div>
      </div>

      <div class="card mb-6">
        <div class="card-header"><span class="card-title">👥 User Management</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Created</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td class="flex items-center gap-3">
                    <span class="avatar avatar-sm">${u.username.charAt(0)}</span>
                    <span class="font-semibold">${u.username}</span>
                  </td>
                  <td><span class="badge badge-${u.role === 'admin' ? 'info' : 'muted'}">${u.role}</span></td>
                  <td class="text-sm text-muted">${new Date(u.createdAt).toLocaleDateString()}</td>
                  <td class="text-sm text-muted">${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <div class="flex gap-2">
                      <button class="btn btn-sm btn-ghost" data-reset-pwd="${u.id}" title="Reset password">🔑</button>
                      ${u.role !== 'admin' ? `<button class="btn btn-sm btn-danger" data-delete-user="${u.id}" title="Delete user">🗑️</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">📤 Data Management</span></div>
          <div class="flex-col gap-3">
            <button class="btn btn-secondary w-full" id="btn-export-all">📥 Export All Data (JSON)</button>
            <label class="btn btn-ghost w-full" style="cursor:pointer">
              <input type="file" accept=".json" id="import-file" style="display:none">
              📤 Import Data (JSON)
            </label>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">🎨 Appearance</span></div>
          <div class="flex-col gap-4">
            <div class="flex items-center justify-between">
              <span class="text-sm">Dark Mode</span>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-dark" ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="card" style="border-color:rgba(239,68,68,0.25)">
          <div class="card-header"><span class="card-title" style="color:var(--danger)">🚨 Danger Zone</span></div>
          <div class="flex-col gap-3">
            <button class="btn btn-danger w-full" id="btn-factory-reset">🗑️ Factory Reset (Erase Everything)</button>
            <div class="text-xs text-muted text-center">This permanently deletes all data, users, and settings. Cannot be undone.</div>
          </div>
        </div>
      </div>
    `;

    // Create user
    document.getElementById('btn-create-user').addEventListener('click', async () => {
      const result = await window.showModal('Create User', `
        <div class="flex-col gap-4">
          <div><label class="text-sm text-muted">Username</label><input type="text" class="input mt-2" id="new-username" minlength="3"></div>
          <div><label class="text-sm text-muted">Password</label><input type="password" class="input mt-2" id="new-password" minlength="6"></div>
          <div><label class="text-sm text-muted">Role</label><select class="input select mt-2" id="new-role"><option value="user">User</option><option value="admin">Admin</option></select></div>
        </div>
      `, [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Create', class: 'btn-primary', value: 'create' }]);
      if (result === 'create') {
        try {
          const username = document.getElementById('new-username')?.value?.trim();
          const password = document.getElementById('new-password')?.value;
          const role = document.getElementById('new-role')?.value;
          if (!username || !password) throw new Error('Username and password required');
          await Auth.adminCreateUser(username, password, role);
          render(container);
          window.showToast(`User "${username}" created`, 'success');
        } catch (err) {
          window.showToast(err.message, 'error');
        }
      }
    });

    // Reset password
    container.querySelectorAll('[data-reset-pwd]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.getAttribute('data-reset-pwd');
        const result = await window.showModal('Reset Password', `
          <div><label class="text-sm text-muted">New Password</label><input type="password" class="input mt-2" id="reset-pwd" minlength="6"></div>
        `, [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Reset', class: 'btn-primary', value: 'reset' }]);
        if (result === 'reset') {
          const pwd = document.getElementById('reset-pwd')?.value;
          if (pwd && pwd.length >= 6) {
            await Auth.adminResetPassword(userId, pwd);
            window.showToast('Password reset', 'success');
          } else {
            window.showToast('Password must be at least 6 characters', 'error');
          }
        }
      });
    });

    // Delete user
    container.querySelectorAll('[data-delete-user]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.getAttribute('data-delete-user');
        const result = await window.showModal('Delete User', '<p>This will permanently delete this user and all their data.</p>',
          [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Delete', class: 'btn-danger', value: 'delete' }]);
        if (result === 'delete') {
          Auth.adminDeleteUser(userId);
          render(container);
          window.showToast('User deleted', 'warning');
        }
      });
    });

    // Export
    document.getElementById('btn-export-all').addEventListener('click', async () => {
      const data = await Store.exportAll();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `travelbase-full-backup-${new Date().toISOString().slice(0,10)}.json`; a.click();
      URL.revokeObjectURL(url);
      window.showToast('Full backup exported', 'success');
    });

    // Import
    document.getElementById('import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (Store.importAll(reader.result)) {
          window.showToast('Data imported. Refreshing...', 'success');
          setTimeout(() => location.reload(), 1500);
        } else {
          window.showToast('Import failed. Invalid JSON.', 'error');
        }
      };
      reader.readAsText(file);
    });

    // Theme toggle
    document.getElementById('toggle-dark').addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      Store.saveGlobal('theme', theme);
    });

    // Factory reset
    document.getElementById('btn-factory-reset').addEventListener('click', async () => {
      const result = await window.showModal('⚠️ Factory Reset',
        '<p style="color:var(--danger)"><strong>WARNING:</strong> This will permanently erase ALL data — users, packing lists, tasks, documents, budgets, and settings. This CANNOT be undone.</p><p class="mt-4 text-sm text-muted">Type "DELETE" to confirm:</p><input type="text" class="input mt-2" id="confirm-delete" placeholder="Type DELETE">',
        [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Erase Everything', class: 'btn-danger', value: 'reset' }]);
      if (result === 'reset') {
        const confirm = document.getElementById('confirm-delete')?.value;
        if (confirm === 'DELETE') {
          Store.clearAll();
          Auth.clearSession();
          window.showToast('All data erased. Reloading...', 'warning');
          setTimeout(() => location.reload(), 1500);
        } else {
          window.showToast('Type "DELETE" exactly to confirm', 'error');
        }
      }
    });
  }

  function getStorageSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('tb_')) {
        total += localStorage.getItem(key).length * 2; // UTF-16
      }
    }
    if (total < 1024) return total + ' B';
    if (total < 1048576) return (total / 1024).toFixed(1) + ' KB';
    return (total / 1048576).toFixed(1) + ' MB';
  }

  return { render };
})();
export default Admin;
