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
  settingsPage.querySelectorAll("[data-live-setting]").forEach((control) => {
    control.addEventListener("change", () => {
      const value =
        control.type === "checkbox" ? control.checked : control.value;
      settings = { ...settings, [control.name]: value };
      saveData(STORAGE_KEYS.settings, settings);
      if (control.name === "compactMode")
        document.body.classList.toggle("compact-mode", control.checked);
    });
  });
 preferencesForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(preferencesForm);
    settings = {
      ...settings,
      emailNotifications: formData.has("emailNotifications"),
      courseUpdates: formData.has("courseUpdates"),
      weeklyReport: formData.has("weeklyReport"),
      compactMode: formData.has("compactMode"),
      language: formData.get("language"),
      timezone: formData.get("timezone"),
    };
    saveData(STORAGE_KEYS.settings, settings);
    document.body.classList.toggle("compact-mode", settings.compactMode);
    showToast("Preferences saved.");
  });
securityForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    clearCustomValidation(securityForm);
    const newPassword = securityForm.elements.newPassword;
    const confirmPassword = securityForm.elements.confirmPassword;
    const strongPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!strongPassword.test(newPassword.value)) {
      newPassword.setCustomValidity(
        "Use 8+ characters with one capital letter and one number.",
      );
    }
    if (confirmPassword.value !== newPassword.value) {
      confirmPassword.setCustomValidity("Passwords do not match.");
    }

    securityForm.classList.add("was-validated");
    if (!securityForm.checkValidity()) return;

    securityForm.reset();
    securityForm.classList.remove("was-validated");
    showToast("Password validation passed (demo only).", "bi-shield-check");
  });
 securityForm
    ?.querySelectorAll("input")
    .forEach((input) =>
      input.addEventListener("input", () => input.setCustomValidity("")),
    );
}