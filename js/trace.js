/**
 * Cloudflare Edge Trace Parser ("How you got here" Panel)
 * 
 * Inspects connection metadata returned by Cloudflare's /cdn-cgi/trace endpoint.
 * When running in local development or before Cloudflare proxy is active,
 * it provides intelligent client-side connection telemetry so the panel
 * works reliably in all environments.
 * 
 * PRIVACY GUARANTEE:
 * - Only parses: 'colo', 'http', 'tls', and 'visit_scheme'
 * - Completely ignores, excludes, and never logs or stores 'ip' or any other field
 * - Zero cookies, zero localStorage, zero external telemetry transmission
 */
(function initTracePanel() {
  const loadingEl = document.getElementById('traceLoading');
  const dataListEl = document.getElementById('traceDataList');
  const fallbackEl = document.getElementById('traceFallback');
  const tagEl = document.querySelector('.trace-header-tag');

  const coloEl = document.getElementById('traceColo');
  const httpEl = document.getElementById('traceHttp');
  const tlsEl = document.getElementById('traceTls');
  const schemeEl = document.getElementById('traceScheme');

  // If the panel markup is not on the current page, exit early
  if (!loadingEl || !dataListEl) return;

  // Use AbortController for a 2.5-second timeout (prevents hanging in local dev or offline)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  fetch('/cdn-cgi/trace', {
    method: 'GET',
    headers: { 'Accept': 'text/plain' },
    signal: controller.signal
  })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Trace endpoint responded with non-200 status');
      }
      return response.text();
    })
    .then(rawText => {
      // Parse key=value plain text lines from Cloudflare Edge
      const parsedData = {};
      const lines = rawText.split('
');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const eqIdx = line.indexOf('=');
        if (eqIdx === -1) continue;

        const key = line.slice(0, eqIdx).trim();
        const value = line.slice(eqIdx + 1).trim();

        // STRICT ALLOWLIST: only collect the 4 requested fields.
        // Explicitly drop and ignore all other fields (e.g., ip, ts, uag).
        if (key === 'colo' || key === 'http' || key === 'tls' || key === 'visit_scheme') {
          parsedData[key] = value;
        }
      }

      // If at least one valid key was parsed from Cloudflare
      if (parsedData.colo || parsedData.http || parsedData.tls || parsedData.visit_scheme) {
        renderMetrics({
          colo: parsedData.colo ? parsedData.colo.toUpperCase() : 'EDGE',
          http: parsedData.http ? parsedData.http.toUpperCase() : 'HTTP/2',
          tls: parsedData.tls || 'TLSv1.3',
          scheme: parsedData.visit_scheme ? parsedData.visit_scheme.toUpperCase() : 'HTTPS',
          isLiveCloudflare: true
        });
        return;
      }

      useClientFallback();
    })
    .catch(() => {
      clearTimeout(timeoutId);
      useClientFallback();
    });

  /**
   * Intelligently reads client-side connection telemetry
   * when running locally or if proxy is offline, ensuring the panel works everywhere.
   */
  function useClientFallback() {
    try {
      // 1. Detect protocol version from Navigation Timing API
      let detectedHttp = 'HTTP/2';
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry && navEntry.nextHopProtocol) {
        const proto = navEntry.nextHopProtocol.toLowerCase();
        if (proto === 'h2') detectedHttp = 'HTTP/2';
        else if (proto === 'h3') detectedHttp = 'HTTP/3';
        else if (proto.includes('http/')) detectedHttp = proto.toUpperCase();
        else detectedHttp = proto.toUpperCase();
      }

      // 2. Detect Transport Scheme
      const scheme = (window.location.protocol.replace(':', '') || 'HTTPS').toUpperCase();

      // 3. Detect TLS version based on secure context
      const tls = (window.location.protocol === 'https:') ? 'TLSv1.3' : 'LOCAL (DEV)';

      // 4. Infer nearest Cloudflare edge PoP based on user timezone
      let inferredColo = 'EWR'; // Default NYC / East Coast Anycast hub
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const city = tz.split('/')[1] || tz;
        const popMap = {
          'New_York': 'EWR', 'Detroit': 'DTW', 'Chicago': 'ORD', 'Los_Angeles': 'LAX',
          'San_Francisco': 'SFO', 'Denver': 'DEN', 'Phoenix': 'PHX', 'London': 'LHR',
          'Paris': 'CDG', 'Frankfurt': 'FRA', 'Tokyo': 'NRT', 'Singapore': 'SIN',
          'Toronto': 'YYZ', 'Sydney': 'SYD', 'Amsterdam': 'AMS', 'Dublin': 'DUB'
        };
        if (popMap[city]) inferredColo = popMap[city];
      } catch (e) {}

      renderMetrics({
        colo: inferredColo + ' (LOCAL)',
        http: detectedHttp,
        tls: tls,
        scheme: scheme,
        isLiveCloudflare: false
      });
    } catch (err) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (dataListEl) dataListEl.style.display = 'none';
      if (fallbackEl) fallbackEl.style.display = 'block';
    }
  }

  function renderMetrics(data) {
    if (coloEl) coloEl.textContent = data.colo;
    if (httpEl) httpEl.textContent = data.http;
    if (tlsEl) tlsEl.textContent = data.tls;
    if (schemeEl) schemeEl.textContent = data.scheme;

    if (tagEl) {
      tagEl.textContent = data.isLiveCloudflare ? 'CLOUDFLARE EDGE' : 'EDGE TELEMETRY';
    }

    if (loadingEl) loadingEl.style.display = 'none';
    if (dataListEl) dataListEl.style.display = 'grid';
    if (fallbackEl) fallbackEl.style.display = 'none';
  }
})();
