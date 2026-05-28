// TravelBase — Transport Comparison (JFK → Buffalo)
import Store from '../store.js';
import Auth from '../auth.js';

const TRANSPORT_OPTIONS = [
  {
    id: 'amtrak',
    name: 'Amtrak Empire Service',
    emoji: '🚆',
    type: 'Train',
    route: 'Penn Station (NYC) → Buffalo-Exchange St',
    duration: '8h 30m',
    price: '$49–89',
    frequency: '1 daily departure (morning)',
    luggagePolicy: {
      carryOn: '2 personal items + 2 carry-ons (25 lbs each)',
      checked: '2 bags free (50 lbs / 23 kg each)',
      total: '~53 kg total capacity',
      overweight: '$20 per excess bag'
    },
    pros: [
      '✅ Best luggage policy — 53 kg easily covered',
      '✅ Scenic Hudson Valley route',
      '✅ Power outlets + WiFi at every seat',
      '✅ Legroom & walk-around space',
      '✅ Direct to downtown Buffalo',
      '✅ No TSA security lines'
    ],
    cons: [
      '⚠️ 8.5 hours travel time',
      '⚠️ Only 1 departure/day from Penn Station',
      '⚠️ Need to get from JFK → Penn Station first (~1h)',
      '⚠️ Can sell out in summer'
    ],
    jfkTransfer: 'AirTrain ($8.25) + LIRR/subway to Penn Station (~60 min)',
    bestFor: 'Heavy luggage travelers (you!)',
    bookingUrl: 'https://www.amtrak.com',
    recommended: true,
    verdict: 'RECOMMENDED — Your 53 kg luggage fits comfortably within the 2 free checked bags (23 kg each) + carry-on allowance. The 8.5-hour ride is long but comfortable with WiFi, power, and scenery.'
  },
  {
    id: 'greyhound',
    name: 'Greyhound / FlixBus',
    emoji: '🚌',
    type: 'Bus',
    route: 'Port Authority (NYC) → Buffalo Bus Terminal',
    duration: '7h 30m – 9h',
    price: '$25–65',
    frequency: '3-5 departures daily',
    luggagePolicy: {
      carryOn: '1 personal item + 1 carry-on',
      checked: '1 bag free (50 lbs / 23 kg), 2nd bag $20',
      total: '~30–35 kg practical max',
      overweight: '$20 for extra bags; strict enforcement'
    },
    pros: [
      '✅ Cheapest option ($25-40 if booked early)',
      '✅ Multiple departures daily',
      '✅ WiFi and power on newer coaches',
      '✅ Port Authority easy from JFK'
    ],
    cons: [
      '❌ STRICT luggage limits — 53 kg is a problem',
      '⚠️ Only 1 free checked bag (23 kg)',
      '⚠️ Extra bags cost $20 each, may be refused',
      '⚠️ Cramped seats on long ride',
      '⚠️ Rest stops can add time',
      '⚠️ Can be delayed in traffic'
    ],
    jfkTransfer: 'AirTrain + subway to Port Authority (~75 min)',
    bestFor: 'Budget travelers with light luggage',
    bookingUrl: 'https://www.greyhound.com',
    recommended: false,
    verdict: 'NOT IDEAL — Your 53 kg total luggage exceeds comfortable bus limits. You\'d need to pay for 2 extra bags ($40 total) and risk being turned away if overhead is full.'
  },
  {
    id: 'jetblue',
    name: 'JetBlue / Breeze Airways',
    emoji: '✈️',
    type: 'Flight',
    route: 'JFK → Buffalo Niagara (BUF)',
    duration: '1h 15m flight + transit time',
    price: '$79–180',
    frequency: '2-3 flights daily (varies)',
    luggagePolicy: {
      carryOn: '1 personal item free (Blue Basic) or + carry-on (Blue)',
      checked: '1st bag $35-40, 2nd bag $50',
      total: '~46 kg (2 × 23 kg checked)',
      overweight: '$100 per overweight bag (>50 lbs)'
    },
    pros: [
      '✅ Fastest door-to-door option',
      '✅ JFK departure — no transit needed',
      '✅ Comfortable with more legroom',
      '✅ WiFi available'
    ],
    cons: [
      '❌ Most expensive with luggage fees ($80-90 extra)',
      '⚠️ Total cost: $160-270 with bags',
      '⚠️ TSA security + check-in adds 2-3 hours',
      '⚠️ Overweight bag fees are brutal ($100)',
      '⚠️ Buffalo airport is 20 min from UB campus',
      '⚠️ Flight delays/cancellations possible'
    ],
    jfkTransfer: 'Already at JFK! Just transfer terminals if needed',
    bestFor: 'Speed priority, willing to pay premium',
    bookingUrl: 'https://www.jetblue.com',
    recommended: false,
    verdict: 'EXPENSIVE — Fast but total cost with 2 checked bags ($75-90 fees) makes this $160-270. After adding airport overhead time, savings vs. train are minimal.'
  }
];

const Transport = (() => {
  function render(container) {
    const choice = Store.load('transport_choice', null);
    const canEdit = Auth.canEdit();

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="emoji">🚌</span> JFK → Buffalo Transport Guide</h1>
          <p class="page-subtitle">Comparing all options for your 53 kg luggage load</p>
        </div>
      </div>

      ${choice ? `<div class="reminder-banner success">✅ You've decided on: <strong>${choice}</strong> ${canEdit ? `<button class="btn btn-sm btn-ghost" id="btn-clear-choice" style="margin-left:auto">Change</button>` : ''}</div>` : ''}

      <div class="card mb-6">
        <div class="card-header">
          <span class="card-title"><span class="emoji">⚖️</span> Your Luggage Profile</span>
        </div>
        <div class="flex gap-6 wrap">
          <div class="flex items-center gap-3">
            <span class="badge badge-info">Cabin</span>
            <span class="font-mono text-sm">~7 kg</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge badge-purple">Checked 1</span>
            <span class="font-mono text-sm">~23 kg</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge badge-purple">Checked 2</span>
            <span class="font-mono text-sm">~23 kg</span>
          </div>
          <div class="flex items-center gap-3" style="margin-left:auto">
            <span class="font-semibold">Total:</span>
            <span class="font-mono text-lg text-accent font-bold">53 kg</span>
          </div>
        </div>
      </div>

      <div class="transport-grid">
        ${TRANSPORT_OPTIONS.map(opt => renderTransportCard(opt, choice, canEdit)).join('')}
      </div>

      <div class="card mt-8">
        <div class="card-header"><span class="card-title"><span class="emoji">📊</span> Side-by-Side Comparison</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Factor</th>
              ${TRANSPORT_OPTIONS.map(o => `<th>${o.emoji} ${o.name.split(' ')[0]}</th>`).join('')}
            </tr></thead>
            <tbody>
              <tr><td><strong>Price</strong></td>${TRANSPORT_OPTIONS.map(o => `<td class="font-mono">${o.price}</td>`).join('')}</tr>
              <tr><td><strong>+ Bag Fees</strong></td><td class="text-success">$0</td><td class="text-amber">$20-40</td><td class="text-danger">$75-90</td></tr>
              <tr><td><strong>Total Cost</strong></td><td class="text-success font-semibold">$49-89</td><td class="font-mono">$45-105</td><td class="text-danger font-semibold">$154-270</td></tr>
              <tr><td><strong>Duration</strong></td>${TRANSPORT_OPTIONS.map(o => `<td>${o.duration}</td>`).join('')}</tr>
              <tr><td><strong>Luggage Fit</strong></td><td><span class="badge badge-success">Perfect</span></td><td><span class="badge badge-danger">Tight</span></td><td><span class="badge badge-warning">Costly</span></td></tr>
              <tr><td><strong>Comfort</strong></td><td><span class="badge badge-success">Great</span></td><td><span class="badge badge-warning">Fair</span></td><td><span class="badge badge-success">Good</span></td></tr>
              <tr><td><strong>WiFi/Power</strong></td><td>✅ / ✅</td><td>✅ / ✅</td><td>✅ / ✅</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Choose buttons
    container.querySelectorAll('[data-choose]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!canEdit) return;
        const id = btn.getAttribute('data-choose');
        const opt = TRANSPORT_OPTIONS.find(o => o.id === id);
        Store.save('transport_choice', opt.name);
        render(container);
        window.showToast(`Transport set to ${opt.name}`, 'success');
      });
    });

    document.getElementById('btn-clear-choice')?.addEventListener('click', () => {
      Store.remove('transport_choice');
      render(container);
    });
  }

  function renderTransportCard(opt, choice, canEdit) {
    const isSelected = choice === opt.name;
    return `
      <div class="transport-card ${isSelected ? 'selected' : ''} ${opt.recommended ? 'card-accent' : ''}">
        <div class="transport-card-header">
          <span style="font-size:24px">${opt.emoji}</span>
          <div class="flex-1">
            <div class="font-semibold">${opt.name}</div>
            <div class="text-xs text-muted">${opt.type} • ${opt.route}</div>
          </div>
          ${opt.recommended ? '<span class="badge badge-success">★ Recommended</span>' : ''}
        </div>
        <div class="transport-card-body">
          <div class="flex gap-6 mb-4">
            <div><div class="text-xs text-muted">Price</div><div class="font-mono font-semibold text-lg">${opt.price}</div></div>
            <div><div class="text-xs text-muted">Duration</div><div class="font-semibold">${opt.duration}</div></div>
            <div><div class="text-xs text-muted">Frequency</div><div class="text-sm">${opt.frequency}</div></div>
          </div>
          <div class="mb-4">
            <div class="text-sm font-semibold mb-2">🧳 Luggage Policy</div>
            <div class="text-sm text-secondary">Carry-on: ${opt.luggagePolicy.carryOn}</div>
            <div class="text-sm text-secondary">Checked: ${opt.luggagePolicy.checked}</div>
            <div class="text-sm font-semibold mt-1" style="color:${opt.recommended ? 'var(--success)' : 'var(--amber)'}">Capacity: ${opt.luggagePolicy.total}</div>
          </div>
          <div class="flex gap-4 mb-4">
            <div class="flex-1">
              <div class="text-sm font-semibold mb-1 text-success">Pros</div>
              ${opt.pros.map(p => `<div class="text-xs text-secondary" style="padding:2px 0">${p}</div>`).join('')}
            </div>
            <div class="flex-1">
              <div class="text-sm font-semibold mb-1 text-danger">Cons</div>
              ${opt.cons.map(c => `<div class="text-xs text-secondary" style="padding:2px 0">${c}</div>`).join('')}
            </div>
          </div>
          <div class="text-sm" style="background:var(--bg-tertiary);padding:10px 14px;border-radius:var(--radius-sm);border-left:3px solid ${opt.recommended ? 'var(--success)' : 'var(--amber)'}">
            <strong>Verdict:</strong> ${opt.verdict}
          </div>
        </div>
        <div class="transport-card-footer">
          <a href="${opt.bookingUrl}" target="_blank" rel="noopener" class="btn btn-sm btn-ghost">🔗 Book Now</a>
          ${canEdit ? `<button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}" data-choose="${opt.id}">${isSelected ? '✓ Selected' : 'Choose This'}</button>` : ''}
        </div>
      </div>`;
  }

  return { render };
})();
export default Transport;
