// ============================================================
// TravelBase — Pre-Departure Tasks Page
// ============================================================
import Store from '../store.js';
import Timer from '../timer.js';
import Auth from '../auth.js';

const DEFAULT_PREDEPARTURE = {
  phases: [
    { id:'A', name:'Urgent Foundations', deadline:'2026-04-16T23:59:00+05:30', tasks:[
      { id:'pa1', name:'Create organized folder structure (Identity, Forms, Financial, etc.)', completed:true, completedAt:Date.now(), deadline:'2026-04-16T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pa2', name:'Prepare identity details matching passport exactly', completed:true, completedAt:Date.now(), deadline:'2026-04-16T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pa3', name:'Upload passport biographic page to Box link', completed:true, completedAt:Date.now(), deadline:'2026-04-16T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pa4', name:'Confirm passport upload with Hannah', completed:true, completedAt:Date.now(), deadline:'2026-04-16T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pa5', name:'Start document tracking sheet', completed:true, completedAt:Date.now(), deadline:'2026-04-16T23:59:00+05:30', priority:'medium', notes:'' },
    ]},
    { id:'B', name:'Draft Core Forms (Day 1-3)', deadline:'2026-04-18T23:59:00+05:30', tasks:[
      { id:'pb1', name:'Complete J-1 Information Sheet', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pb2', name:'Complete DS-2019 Request Form', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pb3', name:'Fill BioForm with consistent identity data', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pb4', name:'Draft DS-7002 with faculty host', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'critical', notes:'No blank required fields' },
      { id:'pb5', name:'Sign Medical Insurance Attestation', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pb6', name:'Sign Service Fee Agreement', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pb7', name:'Finalize CV/resume as PDF', completed:true, completedAt:Date.now(), deadline:'2026-04-18T23:59:00+05:30', priority:'medium', notes:'' },
    ]},
    { id:'C', name:'Evidence Collection (Day 3-5)', deadline:'2026-04-20T23:59:00+05:30', tasks:[
      { id:'pc1', name:'Obtain financial proof in USD', completed:true, completedAt:Date.now(), deadline:'2026-04-20T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pc2', name:'Obtain home institution letter (IITGN)', completed:true, completedAt:Date.now(), deadline:'2026-04-20T23:59:00+05:30', priority:'critical', notes:'Must include "good standing" sentence' },
      { id:'pc3', name:'Obtain sponsor letterhead confirmation', completed:true, completedAt:Date.now(), deadline:'2026-04-20T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pc4', name:'Pay $260 program service fee', completed:true, completedAt:Date.now(), deadline:'2026-04-20T23:59:00+05:30', priority:'critical', notes:'Save receipt PDF' },
      { id:'pc5', name:'Email receipt to ISS with name + faculty name', completed:true, completedAt:Date.now(), deadline:'2026-04-20T23:59:00+05:30', priority:'high', notes:'' },
    ]},
    { id:'D', name:'Quality Control & Submission', deadline:'2026-04-22T23:59:00+05:30', tasks:[
      { id:'pd1', name:'Cross-check names, dates, passport# across all forms', completed:true, completedAt:Date.now(), deadline:'2026-04-22T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pd2', name:'Confirm all signatures present', completed:true, completedAt:Date.now(), deadline:'2026-04-22T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pd3', name:'Submit full packet to Hannah', completed:true, completedAt:Date.now(), deadline:'2026-04-22T23:59:00+05:30', priority:'critical', notes:'One organized email batch' },
      { id:'pd4', name:'Confirm no missing fields remain', completed:true, completedAt:Date.now(), deadline:'2026-04-22T23:59:00+05:30', priority:'high', notes:'' },
    ]},
    { id:'E', name:'Visa Readiness', deadline:'2026-05-15T23:59:00+05:30', tasks:[
      { id:'pe1', name:'Verify DS-2019 details on receipt', completed:true, completedAt:Date.now(), deadline:'2026-05-01T23:59:00+05:30', priority:'critical', notes:'Name, dates, category, funding' },
      { id:'pe2', name:'Complete DS-160 form', completed:true, completedAt:Date.now(), deadline:'2026-05-05T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pe3', name:'Pay SEVIS I-901 fee', completed:true, completedAt:Date.now(), deadline:'2026-05-05T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pe4', name:'Book visa appointment', completed:true, completedAt:Date.now(), deadline:'2026-05-10T23:59:00+05:30', priority:'critical', notes:'Early as possible due seasonal delays' },
      { id:'pe5', name:'Attend visa interview', completed:true, completedAt:Date.now(), deadline:'2026-05-15T23:59:00+05:30', priority:'critical', notes:'' },
    ]},
    { id:'F', name:'Operational Prep (2-4 weeks before)', deadline:'2026-06-01T23:59:00+05:30', tasks:[
      { id:'pf1', name:'Secure housing near UB North Campus', completed:false, deadline:'2026-06-01T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pf2', name:'Plan initial 4-week budget', completed:false, deadline:'2026-06-01T23:59:00+05:30', priority:'high', notes:'Rent deposit, food, transit, phone, emergency' },
      { id:'pf3', name:'Confirm health insurance coverage on arrival', completed:false, deadline:'2026-06-01T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pf4', name:'Book travel (aligned with 30-day entry window)', completed:true, completedAt:Date.now(), deadline:'2026-05-25T23:59:00+05:30', priority:'critical', notes:'BOM→JFK June 9' },
      { id:'pf5', name:'Print all immigration and internship documents', completed:false, deadline:'2026-06-05T23:59:00+05:30', priority:'high', notes:'Digital + printed copies' },
    ]},
    { id:'G', name:'Final Week Prep', deadline:'2026-06-08T23:59:00+05:30', tasks:[
      { id:'pg1', name:'All documents in cabin bag, copies in checked bags', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg2', name:'DS-2019 original in cabin bag — confirmed', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg3', name:'SEVIS fee receipt — confirmed', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg4', name:'Forex card activated and loaded', completed:false, deadline:'2026-06-05T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg5', name:'Travel insurance active from June 8', completed:false, deadline:'2026-06-07T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg6', name:'Phone set up for international roaming / unlocked', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pg7', name:'Bags weighed — each checked ≤22 kg', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg8', name:'Notify bank of international travel', completed:false, deadline:'2026-06-05T23:59:00+05:30', priority:'high', notes:'Prevent card blocks' },
      { id:'pg9', name:'Email Prof. Ayyalasomayajula arrival date/time', completed:false, deadline:'2026-06-07T23:59:00+05:30', priority:'high', notes:'' },
      { id:'pg10', name:'Backup all documents to cloud + pen drive', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'high', notes:'Google Drive' },
      { id:'pg11', name:'Melatonin accessible in cabin bag', completed:false, deadline:'2026-06-08T23:59:00+05:30', priority:'medium', notes:'Jet lag management' },
      { id:'pg12', name:'Activate international transactions on debit card', completed:false, deadline:'2026-06-05T23:59:00+05:30', priority:'critical', notes:'' },
      { id:'pg13', name:'Register on IITGN student travel portal', completed:false, deadline:'2026-06-05T23:59:00+05:30', priority:'high', notes:'Inform Dean of Students' },
      { id:'pg14', name:'Set up Wise account for USD transfers', completed:false, deadline:'2026-06-05T23:59:00+05:30', priority:'medium', notes:'Best exchange rate' },
    ]},
  ]
};

const PreDeparture = (() => {
  function render(container) {
    let data = Store.load('predeparture', null);
    if (!data) { data = JSON.parse(JSON.stringify(DEFAULT_PREDEPARTURE)); Store.save('predeparture', data); }
    const canEdit = Auth.canEdit();
    const allTasks = data.phases.flatMap(p => p.tasks);
    const done = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const pct = Math.round((done / total) * 100);

    container.innerHTML = `
      <div class="page-header">
        <div><h1 class="page-title"><span class="emoji">📋</span> Pre-Departure Tasks</h1>
        <p class="page-subtitle">${done}/${total} completed (${pct}%)</p></div>
      </div>
      <div class="progress-bar mb-8" style="height:10px"><div class="progress-fill ${pct >= 66 ? 'green' : pct >= 33 ? 'amber' : 'red'}" style="width:${pct}%"></div></div>
      ${data.phases.map(phase => {
        const pDone = phase.tasks.filter(t => t.completed).length;
        const pTotal = phase.tasks.length;
        const allDone = pDone === pTotal;
        return `
          <div class="accordion ${allDone ? '' : 'open'}" style="margin-bottom:8px">
            <button class="accordion-header">
              <span>${allDone ? '✅' : '📌'} Phase ${phase.id}: ${phase.name}</span>
              <span class="badge ${allDone ? 'badge-success' : 'badge-muted'}" style="margin-left:auto;margin-right:8px">${pDone}/${pTotal}</span>
              <span class="accordion-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>
            </button>
            <div class="accordion-body"><div class="accordion-content">
              ${phase.tasks.map(task => `
                <div class="checkbox-item ${task.completed ? 'completed' : ''}">
                  <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} data-task="${task.id}" ${canEdit ? '' : 'disabled'}>
                  <div class="flex-col flex-1 gap-1">
                    <span class="checkbox-label">${task.name}</span>
                    ${task.notes ? `<span class="text-xs text-muted">${task.notes}</span>` : ''}
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="badge badge-${task.priority === 'critical' ? 'danger' : task.priority === 'high' ? 'warning' : 'muted'}">${task.priority}</span>
                    ${Timer.renderDeadlineBadge(task.deadline, task.completed, task.completedAt)}
                  </div>
                </div>
              `).join('')}
            </div></div>
          </div>`;
      }).join('')}
    `;

    // Accordion toggles
    container.querySelectorAll('.accordion-header').forEach(h => {
      h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
    });

    // Task checkboxes
    container.querySelectorAll('[data-task]').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-task');
        data.phases.forEach(p => {
          const t = p.tasks.find(t => t.id === id);
          if (t && canEdit) {
            t.completed = cb.checked;
            t.completedAt = cb.checked ? Date.now() : null;
            Store.save('predeparture', data);
            render(container);
          }
        });
      });
    });
  }
  return { render };
})();

export default PreDeparture;
