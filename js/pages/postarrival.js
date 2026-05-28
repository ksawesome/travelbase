// TravelBase — Post-Arrival Tasks
import Store from '../store.js';
import Timer from '../timer.js';
import Auth from '../auth.js';

const DEFAULT = { phases: [
  { id:'day1', name:'Day 1 (Arrival)', tasks:[
    { id:'a1', name:'Check in with WiRES Lab', completed:false, deadline:'2026-06-10T18:00:00-04:00', priority:'critical', notes:'Within 24 hours or as instructed' },
    { id:'a2', name:'Activate T-Mobile SIM ($30/month plan)', completed:false, deadline:'2026-06-10T20:00:00-04:00', priority:'high', notes:'T-Mobile store in Amherst or at Buffalo Niagara Airport' },
    { id:'a3', name:'Buy power strip + immediate groceries', completed:false, deadline:'2026-06-10T22:00:00-04:00', priority:'high', notes:'Walmart/Target. Power strip is day-1 essential' },
    { id:'a4', name:'Set up dorm room essentials', completed:false, deadline:'2026-06-10T23:00:00-04:00', priority:'medium', notes:'Unpack, organize, find laundry room' },
  ]},
  { id:'week1', name:'First Week', tasks:[
    { id:'a5', name:'Register with UB J-1 office (ISS at Talbert Hall)', completed:false, deadline:'2026-06-17T17:00:00-04:00', priority:'critical', notes:'Legally required within 30 days' },
    { id:'a6', name:'Submit US address to ISS', completed:false, deadline:'2026-06-17T17:00:00-04:00', priority:'critical', notes:'' },
    { id:'a7', name:'Submit health insurance proof to ISS', completed:false, deadline:'2026-06-17T17:00:00-04:00', priority:'critical', notes:'' },
    { id:'a8', name:'Get UB student ID card', completed:false, deadline:'2026-06-14T17:00:00-04:00', priority:'high', notes:'As early as possible' },
    { id:'a9', name:'Open Chase Bank student checking account', completed:false, deadline:'2026-06-17T17:00:00-04:00', priority:'high', notes:'Requires passport + DS-2019 + proof of address' },
    { id:'a10', name:'Get Buffalo Public Library card', completed:false, deadline:'2026-06-17T17:00:00-04:00', priority:'medium', notes:'Free. ID + proof of address. E-resources + printing' },
    { id:'a11', name:'Explore UB campus shuttle & NFTA bus routes', completed:false, deadline:'2026-06-15T20:00:00-04:00', priority:'medium', notes:'Free campus shuttle available' },
    { id:'a12', name:'Coordinate lab access & department onboarding', completed:false, deadline:'2026-06-15T17:00:00-04:00', priority:'critical', notes:'ID card, building access, payroll paperwork' },
  ]},
  { id:'month1', name:'First Month', tasks:[
    { id:'a13', name:'Settle into lab routine', completed:false, deadline:'2026-06-30T17:00:00-04:00', priority:'medium', notes:'' },
    { id:'a14', name:'First budget review', completed:false, deadline:'2026-07-01T20:00:00-04:00', priority:'medium', notes:'Compare actual vs planned spending' },
    { id:'a15', name:'Share US contact number & address with family', completed:false, deadline:'2026-06-15T20:00:00-04:00', priority:'high', notes:'' },
    { id:'a16', name:'Explore Buffalo (Niagara Falls, Elmwood Village)', completed:false, deadline:'2026-07-15T20:00:00-04:00', priority:'low', notes:'Weekend trip!' },
  ]},
]};

const PostArrival = (() => {
  function render(container) {
    let data = Store.load('postarrival', null);
    if (!data) { data = JSON.parse(JSON.stringify(DEFAULT)); Store.save('postarrival', data); }
    const canEdit = Auth.canEdit();
    const allTasks = data.phases.flatMap(p => p.tasks);
    const done = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;
    const pct = Math.round((done / total) * 100);

    container.innerHTML = `
      <div class="page-header"><div><h1 class="page-title"><span class="emoji">🛬</span> Post-Arrival Tasks</h1>
      <p class="page-subtitle">${done}/${total} completed (${pct}%)</p></div></div>
      <div class="progress-bar mb-8" style="height:10px"><div class="progress-fill ${pct >= 66 ? 'green' : pct >= 33 ? 'amber' : 'red'}" style="width:${pct}%"></div></div>
      ${data.phases.map(phase => {
        const pDone = phase.tasks.filter(t => t.completed).length, pTotal = phase.tasks.length;
        return `<div class="accordion ${pDone < pTotal ? 'open' : ''}" style="margin-bottom:8px">
          <button class="accordion-header"><span>${pDone === pTotal ? '✅' : '📌'} ${phase.name}</span>
            <span class="badge ${pDone === pTotal ? 'badge-success' : 'badge-muted'}" style="margin-left:auto;margin-right:8px">${pDone}/${pTotal}</span>
            <span class="accordion-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></span>
          </button>
          <div class="accordion-body"><div class="accordion-content">
            ${phase.tasks.map(t => `<div class="checkbox-item ${t.completed ? 'completed' : ''}">
              <input type="checkbox" class="checkbox" ${t.completed ? 'checked' : ''} data-task="${t.id}" ${canEdit ? '' : 'disabled'}>
              <div class="flex-col flex-1 gap-1"><span class="checkbox-label">${t.name}</span>${t.notes ? `<span class="text-xs text-muted">${t.notes}</span>` : ''}</div>
              <div class="flex items-center gap-2">
                <span class="badge badge-${t.priority === 'critical' ? 'danger' : t.priority === 'high' ? 'warning' : t.priority === 'low' ? 'muted' : 'info'}">${t.priority}</span>
                ${Timer.renderDeadlineBadge(t.deadline, t.completed, t.completedAt)}
              </div>
            </div>`).join('')}
          </div></div></div>`;
      }).join('')}`;

    container.querySelectorAll('.accordion-header').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('open')));
    container.querySelectorAll('[data-task]').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-task');
        data.phases.forEach(p => { const t = p.tasks.find(t => t.id === id); if (t && canEdit) { t.completed = cb.checked; t.completedAt = cb.checked ? Date.now() : null; Store.save('postarrival', data); render(container); }});
      });
    });
  }
  return { render };
})();
export default PostArrival;
