// TravelBase — Weather Page (Buffalo, NY)
const Weather = (() => {
  function render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title"><span class="emoji">🌤️</span> Buffalo, NY Weather</h1>
          <p class="page-subtitle">What to expect June – August 2026</p>
        </div>
        <button class="btn btn-sm btn-secondary" id="btn-refresh-weather">🔄 Refresh</button>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header"><span class="card-title"><span class="emoji">🌡️</span> Current Conditions</span></div>
          <div id="weather-current" class="flex items-center justify-center p-6">
            <div class="skeleton" style="width:100%;height:120px"></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title"><span class="emoji">📋</span> Packing Implications</span></div>
          <div class="flex-col gap-3">
            <div class="flex items-center gap-3 p-4" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)">
              <span>☀️</span>
              <div><div class="text-sm font-semibold">Outdoors: 24-32°C (75-90°F)</div><div class="text-xs text-muted">Light cotton tees, shorts, sunglasses, SPF 50+</div></div>
            </div>
            <div class="flex items-center gap-3 p-4" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)">
              <span>❄️</span>
              <div><div class="text-sm font-semibold">Indoors AC: 18-21°C (64-70°F)</div><div class="text-xs text-muted">Hoodie/sweatshirt essential for lab & classroom</div></div>
            </div>
            <div class="flex items-center gap-3 p-4" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)">
              <span>🌧️</span>
              <div><div class="text-sm font-semibold">Rain: Afternoon thunderstorms common</div><div class="text-xs text-muted">Compact umbrella + rain jacket. Quick but intense</div></div>
            </div>
            <div class="flex items-center gap-3 p-4" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)">
              <span>🌙</span>
              <div><div class="text-sm font-semibold">Evenings: 15-20°C (59-68°F)</div><div class="text-xs text-muted">Light layer needed for late campus walks</div></div>
            </div>
            <div class="flex items-center gap-3 p-4" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)">
              <span>🤧</span>
              <div><div class="text-sm font-semibold">Pollen: High (June-July)</div><div class="text-xs text-muted">Pack antihistamines (Cetirizine). Buy Zyrtec locally if needed</div></div>
            </div>
          </div>
        </div>

        <div class="card dashboard-full">
          <div class="card-header"><span class="card-title"><span class="emoji">📅</span> Monthly Averages</span></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Month</th><th>Avg High</th><th>Avg Low</th><th>Rain Days</th><th>Humidity</th><th>UV Index</th><th>Sunset</th></tr></thead>
              <tbody>
                <tr><td><strong>June</strong></td><td>26°C / 79°F</td><td>15°C / 59°F</td><td>10 days</td><td>65%</td><td>7-8 (High)</td><td>~8:55 PM</td></tr>
                <tr><td><strong>July</strong></td><td>29°C / 84°F</td><td>18°C / 64°F</td><td>9 days</td><td>68%</td><td>7-8 (High)</td><td>~8:50 PM</td></tr>
                <tr><td><strong>August</strong></td><td>28°C / 82°F</td><td>17°C / 63°F</td><td>9 days</td><td>70%</td><td>6-7 (High)</td><td>~8:15 PM</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title"><span class="emoji">🌍</span> Time Zone</span></div>
          <div class="flex-col gap-3">
            <div class="flex justify-between"><span class="text-sm">Buffalo (EDT)</span><span class="font-mono text-sm" id="time-buffalo">--:--</span></div>
            <div class="flex justify-between"><span class="text-sm">Mumbai (IST)</span><span class="font-mono text-sm" id="time-mumbai">--:--</span></div>
            <div class="flex justify-between"><span class="text-sm">Difference</span><span class="font-mono text-sm text-accent">IST = EDT + 9:30h</span></div>
            <div class="text-xs text-muted mt-2">💡 When it's 9 AM in Buffalo, it's 6:30 PM in India. Plan family calls for evenings (Buffalo time).</div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title"><span class="emoji">🧳</span> Weather Checklist</span></div>
          <div class="flex-col gap-2">
            ${[
              'Sunscreen SPF 50+ (UV index 7-8)',
              'Sunglasses (UV400 protection)',
              'Baseball cap / hat',
              'Compact umbrella',
              'Light rain jacket / windbreaker',
              'Hoodie for indoor AC',
              'Light scarf for evenings',
              'Antihistamines for pollen season',
              'Moisturizer (AC dries skin)',
              'Reusable water bottle (stay hydrated!)'
            ].map(item => `
              <div class="flex items-center gap-2" style="padding:6px 8px">
                <span style="color:var(--success)">✓</span>
                <span class="text-sm">${item}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    fetchWeather();
    updateClocks();
    const clockInterval = setInterval(updateClocks, 60000);

    document.getElementById('btn-refresh-weather')?.addEventListener('click', fetchWeather);

    // Cleanup on navigate
    window.addEventListener('routechange', function cleanup() {
      clearInterval(clockInterval);
      window.removeEventListener('routechange', cleanup);
    }, { once: true });
  }

  async function fetchWeather() {
    const el = document.getElementById('weather-current');
    if (!el) return;
    try {
      const res = await fetch('https://wttr.in/Buffalo,NY?format=j1');
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const current = data.current_condition?.[0];
      if (current) {
        const tempC = current.temp_C;
        const tempF = current.temp_F;
        const desc = current.weatherDesc?.[0]?.value || 'N/A';
        const humidity = current.humidity;
        const windKph = current.windspeedKmph;
        const feelsLike = current.FeelsLikeC;
        const uv = current.uvIndex;
        const emoji = getWeatherEmoji(desc);

        el.innerHTML = `
          <div class="weather-current">
            <span class="weather-icon">${emoji}</span>
            <div>
              <div class="weather-temp">${tempC}°<span style="font-size:24px;color:var(--text-muted)">C</span></div>
              <div class="text-sm text-secondary">${desc} • Feels like ${feelsLike}°C</div>
            </div>
          </div>
          <div class="weather-details" style="margin-top:20px">
            <div class="weather-detail-card"><div class="text-2xl">💧</div><div class="font-mono font-semibold">${humidity}%</div><div class="text-xs text-muted">Humidity</div></div>
            <div class="weather-detail-card"><div class="text-2xl">💨</div><div class="font-mono font-semibold">${windKph} km/h</div><div class="text-xs text-muted">Wind</div></div>
            <div class="weather-detail-card"><div class="text-2xl">☀️</div><div class="font-mono font-semibold">${uv}</div><div class="text-xs text-muted">UV Index</div></div>
            <div class="weather-detail-card"><div class="text-2xl">🌡️</div><div class="font-mono font-semibold">${tempF}°F</div><div class="text-xs text-muted">Fahrenheit</div></div>
          </div>
        `;
      }
    } catch (e) {
      el.innerHTML = `<div class="text-center text-muted p-6">Weather data unavailable offline. Connect to the internet to see live conditions.</div>`;
    }
  }

  function getWeatherEmoji(desc) {
    const d = desc.toLowerCase();
    if (d.includes('sun') || d.includes('clear')) return '☀️';
    if (d.includes('partly') || d.includes('cloud')) return '⛅';
    if (d.includes('overcast')) return '☁️';
    if (d.includes('rain') || d.includes('drizzle')) return '🌧️';
    if (d.includes('thunder')) return '⛈️';
    if (d.includes('snow')) return '❄️';
    if (d.includes('fog') || d.includes('mist')) return '🌫️';
    return '🌤️';
  }

  function updateClocks() {
    const now = new Date();
    const buffalo = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: true });
    const mumbai = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
    const bEl = document.getElementById('time-buffalo');
    const mEl = document.getElementById('time-mumbai');
    if (bEl) bEl.textContent = buffalo;
    if (mEl) mEl.textContent = mumbai;
  }

  return { render };
})();
export default Weather;
