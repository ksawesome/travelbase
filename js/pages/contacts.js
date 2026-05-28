// TravelBase — Contacts Page
import Store from '../store.js';
import Auth from '../auth.js';

const DEFAULT_CONTACTS = [
  { id:'c1', name:'Prof. Ayyalasomayajula', role:'Faculty Host, WiRES Lab', phone:'', email:'', category:'university', notes:'Lab supervisor at UB' },
  { id:'c2', name:'Hannah (ISS Coordinator)', role:'J-1 Program Coordinator, UB ISS', phone:'', email:'', category:'university', notes:'DS-2019 and visa support' },
  { id:'c3', name:'UB International Student Services', role:'Talbert Hall, UB North Campus', phone:'+1-716-645-2258', email:'', category:'university', notes:'J-1 registration within 30 days' },
  { id:'c4', name:'UB Public Safety', role:'Emergency / Campus Police', phone:'+1-716-645-2222', email:'', category:'emergency', notes:'24/7 campus emergency' },
  { id:'c5', name:'Indian Consulate NYC', role:'Consulate General of India', phone:'+1-212-774-0600', email:'', category:'emergency', notes:'For passport/visa emergencies' },
  { id:'c6', name:'IITGN Dean of Students', role:'Student Affairs', phone:'', email:'', category:'university', notes:'Inform before departure' },
  { id:'c7', name:'IITGN International Relations', role:'IR Office', phone:'', email:'', category:'university', notes:'NOC and travel approval' },
  { id:'c8', name:'Travel Insurance Provider', role:'', phone:'', email:'', category:'insurance', notes:'Keep policy number accessible' },
  { id:'c9', name:'HDFC / Niyo Forex Support', role:'Card helpline', phone:'', email:'', category:'financial', notes:'For card blocks or disputes' },
  { id:'c10', name:'Family (India)', role:'Emergency contact', phone:'', email:'', category:'personal', notes:'Share US number on arrival' },
];

const CATEGORIES = {
  university: { name: 'University & Program', emoji: '🎓', color: 'var(--accent-2)' },
  emergency: { name: 'Emergency', emoji: '🚨', color: 'var(--danger)' },
  insurance: { name: 'Insurance', emoji: '🏥', color: 'var(--amber)' },
  financial: { name: 'Financial', emoji: '💳', color: 'var(--success)' },
  personal: { name: 'Personal', emoji: '👨‍👩‍👦', color: 'var(--accent)' },
};

const Contacts = (() => {
  function render(container) {
    let contacts = Store.load('contacts', null);
    if (!contacts) { contacts = JSON.parse(JSON.stringify(DEFAULT_CONTACTS)); Store.save('contacts', contacts); }
    const canEdit = Auth.canEdit();

    const grouped = {};
    contacts.forEach(c => {
      const cat = c.category || 'personal';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(c);
    });

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="emoji">📞</span> Important Contacts</h1>
          <p class="page-subtitle">Quick access to key people and numbers</p>
        </div>
        ${canEdit ? `<div class="page-actions"><button class="btn btn-sm btn-primary" id="btn-add-contact">+ Add Contact</button></div>` : ''}
      </div>

      ${Object.entries(grouped).map(([catId, catContacts]) => {
        const cat = CATEGORIES[catId] || { name: catId, emoji: '📋', color: 'var(--text-muted)' };
        return `
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-muted mb-3" style="text-transform:uppercase;letter-spacing:1px">${cat.emoji} ${cat.name}</h3>
            <div class="flex-col gap-2">
              ${catContacts.map(contact => `
                <div class="contact-card">
                  <div class="avatar" style="background:${cat.color}">${contact.name.charAt(0)}</div>
                  <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-detail">${contact.role}</div>
                    ${contact.phone ? `<div class="contact-detail"><a href="tel:${contact.phone}" style="color:var(--accent)">${contact.phone}</a></div>` : ''}
                    ${contact.email ? `<div class="contact-detail"><a href="mailto:${contact.email}" style="color:var(--accent)">${contact.email}</a></div>` : ''}
                    ${contact.notes ? `<div class="text-xs text-muted mt-1">${contact.notes}</div>` : ''}
                  </div>
                  ${canEdit ? `<div class="contact-actions">
                    <button class="btn-icon" data-edit-contact="${contact.id}" title="Edit">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon" data-delete-contact="${contact.id}" title="Delete">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>`;
      }).join('')}
    `;

    // Add contact
    document.getElementById('btn-add-contact')?.addEventListener('click', async () => {
      const catOpts = Object.entries(CATEGORIES).map(([id, c]) => `<option value="${id}">${c.emoji} ${c.name}</option>`).join('');
      const result = await window.showModal('Add Contact', `
        <div class="flex-col gap-4">
          <div><label class="text-sm text-muted">Name</label><input type="text" class="input mt-2" id="ct-name"></div>
          <div><label class="text-sm text-muted">Role / Title</label><input type="text" class="input mt-2" id="ct-role"></div>
          <div><label class="text-sm text-muted">Phone</label><input type="tel" class="input mt-2" id="ct-phone"></div>
          <div><label class="text-sm text-muted">Email</label><input type="email" class="input mt-2" id="ct-email"></div>
          <div><label class="text-sm text-muted">Category</label><select class="input select mt-2" id="ct-cat">${catOpts}</select></div>
          <div><label class="text-sm text-muted">Notes</label><input type="text" class="input mt-2" id="ct-notes"></div>
        </div>
      `, [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Add', class: 'btn-primary', value: 'add' }]);
      if (result === 'add') {
        const name = document.getElementById('ct-name')?.value?.trim();
        if (name) {
          contacts.push({
            id: 'ct_' + Date.now(),
            name,
            role: document.getElementById('ct-role')?.value || '',
            phone: document.getElementById('ct-phone')?.value || '',
            email: document.getElementById('ct-email')?.value || '',
            category: document.getElementById('ct-cat')?.value || 'personal',
            notes: document.getElementById('ct-notes')?.value || ''
          });
          Store.save('contacts', contacts);
          render(container);
          window.showToast('Contact added', 'success');
        }
      }
    });

    // Edit contact
    container.querySelectorAll('[data-edit-contact]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-edit-contact');
        const contact = contacts.find(c => c.id === id);
        if (!contact) return;
        const catOpts = Object.entries(CATEGORIES).map(([cid, c]) => `<option value="${cid}" ${contact.category === cid ? 'selected' : ''}>${c.emoji} ${c.name}</option>`).join('');
        const result = await window.showModal('Edit Contact', `
          <div class="flex-col gap-4">
            <div><label class="text-sm text-muted">Name</label><input type="text" class="input mt-2" id="ct-name" value="${contact.name}"></div>
            <div><label class="text-sm text-muted">Role</label><input type="text" class="input mt-2" id="ct-role" value="${contact.role}"></div>
            <div><label class="text-sm text-muted">Phone</label><input type="tel" class="input mt-2" id="ct-phone" value="${contact.phone}"></div>
            <div><label class="text-sm text-muted">Email</label><input type="email" class="input mt-2" id="ct-email" value="${contact.email}"></div>
            <div><label class="text-sm text-muted">Category</label><select class="input select mt-2" id="ct-cat">${catOpts}</select></div>
            <div><label class="text-sm text-muted">Notes</label><input type="text" class="input mt-2" id="ct-notes" value="${contact.notes}"></div>
          </div>
        `, [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Save', class: 'btn-primary', value: 'save' }]);
        if (result === 'save') {
          contact.name = document.getElementById('ct-name')?.value || contact.name;
          contact.role = document.getElementById('ct-role')?.value || '';
          contact.phone = document.getElementById('ct-phone')?.value || '';
          contact.email = document.getElementById('ct-email')?.value || '';
          contact.category = document.getElementById('ct-cat')?.value || 'personal';
          contact.notes = document.getElementById('ct-notes')?.value || '';
          Store.save('contacts', contacts);
          render(container);
          window.showToast('Contact updated', 'success');
        }
      });
    });

    // Delete contact
    container.querySelectorAll('[data-delete-contact]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-delete-contact');
        const result = await window.showModal('Delete Contact', '<p>Are you sure you want to delete this contact?</p>',
          [{ label: 'Cancel', class: 'btn-ghost', value: null }, { label: 'Delete', class: 'btn-danger', value: 'delete' }]);
        if (result === 'delete') {
          const idx = contacts.findIndex(c => c.id === id);
          if (idx >= 0) contacts.splice(idx, 1);
          Store.save('contacts', contacts);
          render(container);
          window.showToast('Contact deleted', 'warning');
        }
      });
    });
  }
  return { render };
})();
export default Contacts;
