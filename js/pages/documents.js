// TravelBase — Documents Page (IndexedDB local vault)
import Store from '../store.js';
import Auth from '../auth.js';

const DOC_CATEGORIES = [
  { id:'visa', name:'Visa & Immigration', emoji:'🛂', icon:'visa', required:['DS-2019','DS-160 Confirmation','DS-160 Signed','DS-7002','Visa Issued','SEVIS Receipt'] },
  { id:'university', name:'University & Program', emoji:'📋', icon:'university', required:['Offer Letter','Invitation Letter','NOC','Transcript','CV','BioForm'] },
  { id:'financial', name:'Financial', emoji:'💰', icon:'financial', required:['Bank Statement','Sponsor Letter','Service Fee Agreement'] },
  { id:'insurance', name:'Insurance', emoji:'🏥', icon:'insurance', required:['Medical Insurance Attestation','Health Insurance Policy'] },
  { id:'travel', name:'Travel', emoji:'✈️', icon:'travel', required:['Flight Ticket (BOM↔JFK)','Visa Appointment Confirmation'] },
  { id:'correspondence', name:'Correspondence', emoji:'📧', icon:'identity', required:[] },
  { id:'identity', name:'Identity', emoji:'🆔', icon:'identity', required:['Passport','Signature'] },
  { id:'reference', name:'Reference Guides', emoji:'📖', icon:'university', required:[] },
];

const Documents = (() => {
  function render(container) {
    const canEdit = Auth.canEdit();
    const uploadedDocs = Store.load('doc_status', {});

    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-title"><span class="emoji">📄</span> Document Vault</h1>
        <p class="page-subtitle">Upload, view, and manage your travel documents</p></div>
        ${canEdit ? `<div class="page-actions">
          <label class="btn btn-primary" style="cursor:pointer"><input type="file" id="doc-upload" accept=".pdf,.jpg,.jpeg,.png" multiple style="display:none"> 📤 Upload Documents</label>
        </div>` : ''}
      </div>

      <div class="tabs mb-6" id="doc-tabs">
        <button class="tab active" data-tab="checklist">📋 Checklist</button>
        <button class="tab" data-tab="uploaded">📁 Uploaded</button>
      </div>

      <div id="doc-content"></div>
    `;

    let activeTab = 'checklist';

    function renderTab() {
      const content = document.getElementById('doc-content');
      if (activeTab === 'checklist') {
        renderChecklist(content, uploadedDocs);
      } else {
        renderUploaded(content);
      }
    }

    function renderChecklist(el, status) {
      el.innerHTML = DOC_CATEGORIES.filter(c => c.required.length > 0).map(cat => `
        <div class="card mb-4">
          <div class="card-header">
            <span class="card-title"><span class="emoji">${cat.emoji}</span> ${cat.name}</span>
            <span class="badge ${cat.required.every(d => status[d]) ? 'badge-success' : 'badge-warning'}">${cat.required.filter(d => status[d]).length}/${cat.required.length}</span>
          </div>
          <div class="doc-grid">
            ${cat.required.map(docName => `
              <div class="doc-card" data-doc-name="${docName}">
                <div class="doc-card-icon ${cat.icon}"><span>${status[docName] ? '✅' : '⚠️'}</span></div>
                <div class="doc-card-info">
                  <div class="doc-card-name">${docName}</div>
                  <div class="doc-card-status ${status[docName] ? 'text-success' : 'text-amber'}">${status[docName] ? 'Uploaded' : 'Missing'}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      // Click to mark as uploaded
      el.querySelectorAll('.doc-card').forEach(card => {
        card.addEventListener('click', () => {
          if (!canEdit) return;
          const name = card.getAttribute('data-doc-name');
          uploadedDocs[name] = !uploadedDocs[name];
          Store.save('doc_status', uploadedDocs);
          renderTab();
          window.showToast(uploadedDocs[name] ? `${name} marked as uploaded` : `${name} marked as missing`, uploadedDocs[name] ? 'success' : 'warning');
        });
      });
    }

    async function renderUploaded(el) {
      const docs = await Store.getAllDocuments();
      if (docs.length === 0) {
        el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📂</div>
          <div class="empty-state-title">No documents uploaded yet</div>
          <div class="empty-state-text">Upload PDFs and images using the button above. Documents are stored locally on this device.</div></div>`;
        return;
      }
      el.innerHTML = `<div class="doc-grid">${docs.map(doc => `
        <div class="doc-card">
          <div class="doc-card-icon visa"><span>📄</span></div>
          <div class="doc-card-info">
            <div class="doc-card-name">${doc.name}</div>
            <div class="doc-card-status text-muted">${(doc.size / 1024).toFixed(0)} KB • ${new Date(doc.uploadedAt).toLocaleDateString()}</div>
          </div>
          ${canEdit ? `<button class="btn-icon" data-delete-doc="${doc.id}" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>` : ''}
        </div>
      `).join('')}</div>`;

      el.querySelectorAll('[data-delete-doc]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-delete-doc');
          await Store.deleteDocument(id);
          renderTab();
          window.showToast('Document deleted', 'warning');
        });
      });
    }

    // Tab switching
    document.getElementById('doc-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      document.querySelectorAll('#doc-tabs .tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      renderTab();
    });

    // File upload
    document.getElementById('doc-upload')?.addEventListener('change', async (e) => {
      const files = e.target.files;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = async () => {
          await Store.saveDocument({
            id: 'doc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
            name: file.name,
            category: 'general',
            blob: reader.result,
            mimeType: file.type,
            size: file.size,
          });
          window.showToast(`${file.name} uploaded`, 'success');
          if (activeTab === 'uploaded') renderTab();
        };
        reader.readAsDataURL(file);
      }
    });

    renderTab();
  }
  return { render };
})();
export default Documents;
