/* ---------- Settings ---------- */
function initSettingsPage() {
  const settingsPage = document.querySelector("[data-settings-page]");
  if (!settingsPage) return;

  let settings = loadData(STORAGE_KEYS.settings, defaultSettings);
  const preferencesForm = document.getElementById("preferencesForm");
  const securityForm = document.getElementById("securityForm");