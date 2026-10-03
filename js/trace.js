/**
 * Cloudflare Edge Trace Parser ("How you got here" Panel)
 * 
 * Securely inspects connection metadata returned by Cloudflare's /cdn-cgi/trace endpoint.
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

  const coloEl = document.getElementById('traceColo');
  const httpEl = document.getElementById('traceHttp');
  const tlsEl = document.getElementById('traceTls');
  const schemeEl = document.getElementById('traceScheme');

  // If the panel markup is not on the current page, exit early
  if (!loadingEl || !dataListEl) return;

  // Use AbortController for a 3.5-second timeout (prevents hanging in local dev or offline)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

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
      // Parse key=value plain text lines
      const parsedData = {};

      // Split text into individual lines
      const lines = rawText.split('
');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split each line at the first equals sign
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

      // Verify that at least one allowed field was found
      if (!parsedData.colo && !parsedData.http && !parsedData.tls && !parsedData.visit_scheme) {
        showFallback();
        return;
      }

      // Populate UI with formatted values
      if (coloEl) coloEl.textContent = (parsedData.colo || 'N/A').toUpperCase();
      if (httpEl) httpEl.textContent = (parsedData.http || 'N/A').toUpperCase();
      if (tlsEl) tlsEl.textContent = (parsedData.tls || 'N/A');
      if (schemeEl) schemeEl.textContent = (parsedData.visit_scheme || 'N/A').toUpperCase();

      // Show metrics list, hide loading state
      loadingEl.style.display = 'none';
      dataListEl.style.display = 'grid';
    })
    .catch(() => {
      clearTimeout(timeoutId);
      showFallback();
    });

  function showFallback() {
    if (loadingEl) loadingEl.style.display = 'none';
    if (dataListEl) dataListEl.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'block';
  }
})();
