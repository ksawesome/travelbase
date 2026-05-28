// TravelBase — Budget Planner
import Store from '../store.js';
import Auth from '../auth.js';

const DEFAULT_BUDGET = {
  currency: 'USD',
  categories: [
    { id:'housing', name:'Housing/Rent', emoji:'🏠', budgeted:1600, spent:0, color:'#00d4ff', notes:'UB dorm or off-campus ~$800/month × 2 months' },
    { id:'food', name:'Food & Groceries', emoji:'🍕', budgeted:400, spent:0, color:'#10b981', notes:'$50/week groceries, occasional dining out' },
    { id:'transport', name:'Transportation', emoji:'🚌', budgeted:200, spent:0, color:'#7c3aed', notes:'JFK→Buffalo transit + local. NFTA bus $75/month' },
    { id:'phone', name:'Phone/SIM', emoji:'📱', budgeted:60, spent:0, color:'#f59e0b', notes:'T-Mobile prepaid $30/month × 2' },
    { id:'supplies', name:'Supplies & Misc', emoji:'🛒', budgeted:200, spent:0, color:'#ec4899', notes:'Bedding, power strip, shower caddy, etc.' },
    { id:'emergency', name:'Emergency Fund', emoji:'🚨', budgeted:300, spent:0, color:'#ef4444', notes:'Unexpected medical, replacement items' },
    { id:'recreation', name:'Recreation', emoji:'🎉', budgeted:150, spent:0, color:'#06b6d4', notes:'Niagara Falls, Buffalo Wings, weekend trips' },
    { id:'laundry', name:'Laundry', emoji:'🧺', budgeted:40, spent:0, color:'#a855f7', notes:'~$5/week' },
  ],
  expenses: []
};

const Budget = (() => {
  function render(container) {
    let data = Store.load('budget', null);
    if (!data) { data = JSON.parse(JSON.stringify(DEFAULT_BUDGET)); Store.save('budget', data); }
    const canEdit = Auth.canEdit();

    const totalBudget = data.categories.reduce((s, c) => s + c.budgeted, 0);
    const totalSpent = data.categories.reduce((s, c) => s + c.spent, 0);
    const remaining = totalBudget - totalSpent;
    const spentPct = Math.round((totalSpent / totalBudget) * 100);

    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-title"><span class="emoji">💰</span> Budget Planner</h1>
        <p class="page-subtitle">8-week internship budget tracker</p></div>
        ${canEdit ? `<div class="page-actions"><button class="btn btn-sm btn-primary" id="btn-add-expense">+ Add Expense</button></div>` : ''}
      </div>

      <div class="budget-summary">
        <div class="card text-center">
          <div class="text-sm text-muted">Total Budget</div>
          <div class="stat-value text-accent">$${totalBudget.toLocaleString()}</div>
        </div>
        <div class="card text-center">
          <div class="text-sm text-muted">Spent</div>
          <div class="stat-value" style="color:${spentPct > 85 ? 'var(--danger)' : spentPct > 60 ? 'var(--amber)' : 'var(--success)'}">$${totalSpent.toLocaleString()}</div>
        </div>
        <div class="card text-center">
          <div class="text-sm text-muted">Remaining</div>
          <div class="stat-value text-success">$${remaining.toLocaleString()}</div>
        </div>
        <div class="card text-center">
          <div class="text-sm text-muted">Weekly Pace</div>
          <div class="stat-value font-mono text-lg">$${Math.round(totalSpent / Math.max(1, getElapsedWeeks()))}/wk</div>
          <div class="text-xs text-muted mt-2">Target: $${Math.round(totalBudget / 8)}/wk</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><span class="card-title">📊 Budget Breakdown</span></div>
          <div class="progress-bar mb-4" style="height:12px"><div class="progress-fill" style="width:${spentPct}%;background:${spentPct > 85 ? '#ef4444' : spentPct > 60 ? '#f59e0b' : '#10b981'}"></div></div>
          <div class="text-xs text-muted text-right mb-6">${spentPct}% used</div>
          ${data.categories.map(cat => {
            const catPct = cat.budgeted > 0 ? Math.round((cat.spent / cat.budgeted) * 100) : 0;
            return `
              <div class="budget-category-row">
                <span class="budget-dot" style="background:${cat.color}"></span>
                <span class="budget-category-name">${cat.emoji} ${cat.name}</span>
                <div class="progress-bar" style="width:100px"><div class="progress-fill" style="width:${catPct}%;background:${cat.color}"></div></div>
                <span class="budget-category-amount" style="color:${cat.color}">$${cat.spent} / $${cat.budgeted}</span>
              </div>`;
          }).join('')}
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">📝 Recent Expenses</span></div>
          ${data.expenses.length === 0 
            ? '<div class="empty-state"><div class="empty-state-icon">💸</div><div class="empty-state-title">No expenses yet</div><div class="empty-state-text">Add your first expense to start tracking.</div></div>'
            : `<div class="flex-col gap-2">${data.expenses.slice(-10).reverse().map(exp => `
              <div class="flex items-center gap-3 p-4" style="border-bottom:1px solid var(--border)">
                <span>${data.categories.find(c => c.id === exp.category)?.emoji || '💵'}</span>
                <div class="flex-1"><div class="text-sm">${exp.description}</div><div class="text-xs text-muted">${new Date(exp.date).toLocaleDateString()}</div></div>
                <span class="font-mono font-semibold">$${exp.amount}</span>
              </div>`).join('')}</div>`
          }
        </div>
      </div>
    `;

    document.getElementById('btn-add-expense')?.addEventListener('click', async () => {
      const catOptions = data.categories.map(c => `<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('');
      const result = await window.showModal('Add Expense', `
        <div class="flex-col gap-4">
          <div><label class="text-sm text-muted">Category</label><select class="input select mt-2" id="exp-cat">${catOptions}</select></div>
          <div><label class="text-sm text-muted">Amount ($)</label><input type="number" class="input mt-2" id="exp-amount" placeholder="0.00" step="0.01" min="0"></div>
          <div><label class="text-sm text-muted">Description</label><input type="text" class="input mt-2" id="exp-desc" placeholder="What was this for?"></div>
          <div><label class="text-sm text-muted">Date</label><input type="date" class="input mt-2" id="exp-date" value="${new Date().toISOString().slice(0,10)}"></div>
        </div>
      `, [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Add', class: 'btn-primary', value: 'add' }]);

      if (result === 'add') {
        const cat = document.getElementById('exp-cat')?.value;
        const amount = parseFloat(document.getElementById('exp-amount')?.value) || 0;
        const desc = document.getElementById('exp-desc')?.value || 'Expense';
        const date = document.getElementById('exp-date')?.value;
        if (amount > 0) {
          const category = data.categories.find(c => c.id === cat);
          if (category) category.spent += amount;
          data.expenses.push({ id: Date.now(), category: cat, amount, description: desc, date });
          Store.save('budget', data);
          render(container);
          window.showToast('Expense added', 'success');
        }
      }
    });
  }

  function getElapsedWeeks() {
    const start = new Date('2026-06-10');
    const now = new Date();
    return Math.max(1, Math.ceil((now - start) / (7 * 86400000)));
  }

  return { render };
})();
export default Budget;
