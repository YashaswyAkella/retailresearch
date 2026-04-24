/* ============================================================
   RLOAnalytics — privacy-friendly usage tracking
   ============================================================
   1. LOCAL: every event is pushed to localStorage (admin.html
      reads these and shows a dashboard for the site owner).
   2. REMOTE (optional): if a Google Analytics 4 Measurement ID
      is configured below, events are also sent to GA4.

   Tracked events:
      page_view, language_change, designer_place_dept,
      designer_clear, calculator_change, optimizer_run,
      screenshot_export, export_json, 3d_height_change
   ============================================================ */

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";  // ← replace with your GA4 ID

const RLOAnalytics = (function() {
  const STORAGE_KEY = "rlo_events";
  const MAX_EVENTS = 500;

  // ---- Load GA4 if configured -------------------------------
  if (GA_MEASUREMENT_ID && !GA_MEASUREMENT_ID.includes("XXXX")) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  function track(eventName, params = {}) {
    // Local storage
    const events = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    events.push({
      t: Date.now(),
      name: eventName,
      params,
      page: location.pathname,
      lang: localStorage.getItem("rlo_lang") || "auto"
    });
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    // Remote
    if (window.gtag) gtag("event", eventName, params);
  }

  function getEvents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
  function clearEvents() { localStorage.removeItem(STORAGE_KEY); }

  // ---- Cookie notice (once) ---------------------------------
  function maybeShowNotice() {
    if (localStorage.getItem("rlo_notice_ack")) return;
    const div = document.createElement("div");
    div.className = "cookie-notice";
    div.innerHTML = `
      <p data-i18n="cookie_msg">We use anonymous analytics to improve this free tool. No personal data is collected.</p>
      <button class="btn btn-primary" data-i18n="cookie_ok">OK</button>`;
    document.body.appendChild(div);
    div.querySelector("button").onclick = () => {
      localStorage.setItem("rlo_notice_ack", "1");
      div.remove();
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    track("page_view", { path: location.pathname });
    maybeShowNotice();
  });

  return { track, getEvents, clearEvents };
})();
window.RLOAnalytics = RLOAnalytics;