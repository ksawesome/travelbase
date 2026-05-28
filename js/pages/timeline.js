// TravelBase — Timeline Page
import Timer from '../timer.js';

const TIMELINE_EVENTS = [
  { date:'2026-04-10', title:'Program Kickoff', desc:'Identity prep & document org', status:'completed' },
  { date:'2026-04-16', title:'Phase A Done', desc:'Passport uploaded, folder structure created', status:'completed' },
  { date:'2026-04-18', title:'Core Forms Drafted', desc:'J-1 info sheet, DS-2019 request, BioForm, DS-7002', status:'completed' },
  { date:'2026-04-20', title:'Evidence Collected', desc:'Financial proof, IITGN letter, $260 fee paid', status:'completed' },
  { date:'2026-04-22', title:'Packet Submitted', desc:'Full document packet sent to Hannah', status:'completed' },
  { date:'2026-05-01', title:'DS-2019 Received', desc:'Verify all details match passport exactly', status:'completed' },
  { date:'2026-05-05', title:'DS-160 + SEVIS', desc:'Visa form + I-901 SEVIS fee completed', status:'completed' },
  { date:'2026-05-15', title:'Visa Interview', desc:'J-1 visa stamp obtained', status:'completed' },
  { date:'2026-05-25', title:'Flight Booked', desc:'BOM → JFK, June 9, PNR: 7VHLRL', status:'completed' },
  { date:'2026-06-01', title:'Housing Secured', desc:'UB dorm or off-campus confirmed', status:'active' },
  { date:'2026-06-05', title:'Financial Prep', desc:'Forex loaded, banks notified, Wise setup', status:'future' },
  { date:'2026-06-07', title:'Final Pack', desc:'Bags weighed, documents in cabin bag', status:'future' },
  { date:'2026-06-08', title:'Day Before', desc:'Triple-check: DS-2019, passport, SEVIS receipt', status:'future' },
  { date:'2026-06-09', title:'🛫 DEPARTURE DAY', desc:'BOM → JFK (23:10 IST). Cabin bag: all critical docs', status:'future', highlight:true },
  { date:'2026-06-10', title:'🛬 Arrive JFK', desc:'Immigration → collect bags → transit to Buffalo', status:'future', highlight:true },
  { date:'2026-06-10', title:'Arrive Buffalo', desc:'Check in to housing, buy essentials', status:'future' },
  { date:'2026-06-11', title:'WiRES Lab Day 1', desc:'Meet Prof. Ayyalasomayajula, lab orientation', status:'future', highlight:true },
  { date:'2026-06-17', title:'ISS Registration', desc:'Register with J-1 office at Talbert Hall', status:'future' },
  { date:'2026-07-01', title:'Month 1 Review', desc:'Budget check, lab routine settled', status:'future' },
  { date:'2026-08-05', title:'Internship Ends', desc:'Wrap up research, final presentations', status:'future' },
  { date:'2026-08-08', title:'🛫 Return Flight', desc:'JFK → BOM', status:'future', highlight:true },
];

const Timeline = (() => {
  function render(container) {
    const today = new Date().toISOString().slice(0, 10);

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="emoji">⏱️</span> Journey Timeline</h1>
          <p class="page-subtitle">Every milestone from application to return</p>
        </div>
      </div>

      <div class="card mb-6">
        <div class="flex items-center gap-6 justify-center" style="padding:12px 0">
          <div class="text-center">
            <div class="stat-value text-2xl">${Timer.getDaysUntilDeparture()}</div>
            <div class="stat-label">days to departure</div>
          </div>
          <div class="countdown-separator" style="font-size:40px;opacity:0.2">|</div>
          <div class="text-center">
            <div class="stat-value text-2xl" style="color:var(--accent-2)">${TIMELINE_EVENTS.filter(e => e.status === 'completed').length}</div>
            <div class="stat-label">milestones done</div>
          </div>
          <div class="countdown-separator" style="font-size:40px;opacity:0.2">|</div>
          <div class="text-center">
            <div class="stat-value text-2xl" style="color:var(--amber)">${TIMELINE_EVENTS.filter(e => e.status !== 'completed').length}</div>
            <div class="stat-label">upcoming</div>
          </div>
        </div>
      </div>

      <div class="timeline">
        ${TIMELINE_EVENTS.map((event, i) => {
          const dotClass = event.status === 'completed' ? 'completed' : event.status === 'active' ? 'active' : 'future';
          const dateObj = new Date(event.date);
          return `
            <div class="timeline-item" style="animation-delay:${i * 0.05}s">
              <div class="timeline-dot ${dotClass}">
                ${event.status === 'completed' ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </div>
              <div class="timeline-content" style="${event.highlight ? 'border-color:var(--accent);box-shadow:var(--shadow-glow)' : ''}">
                <div class="timeline-date">${Timer.formatDateFull(dateObj)}</div>
                <div class="timeline-title">${event.title}</div>
                <div class="timeline-desc">${event.desc}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  return { render };
})();
export default Timeline;
