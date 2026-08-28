/* ---------- Settings ---------- */
function initSettingsPage() {
  const settingsPage = document.querySelector("[data-settings-page]");
  if (!settingsPage) return;

  let settings = loadData(STORAGE_KEYS.settings, defaultSettings);
  const preferencesForm = document.getElementById("preferencesForm");
  const securityForm = document.getElementById("securityForm");
 Object.entries(settings).forEach(([key, value]) => {
    const control = settingsPage.querySelector([name="${key}"]);
    if (!control) return;
    if (control.type === "checkbox") control.checked = Boolean(value);
    else control.value = value;
  });