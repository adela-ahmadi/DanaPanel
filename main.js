/* =========================================================
   DanaPanel — Vanilla JavaScript functionality
   Concepts demonstrated: arrays, objects, conditions, loops,
   functions, array methods, DOM manipulation, events and
   form validation.
   ========================================================= */

"use strict";

const STORAGE_KEYS = {
  students: "danapanel_students",
  tasks: "danapanel_tasks",
  profile: "danapanel_profile",
  settings: "danapanel_settings",
};

const defaultStudents = [
  {
    id: "student-101",
    firstName: "Shine",
    lastName: "Smith",
    email: "shine@danapanel.io",
    role: "Student",
    course: "UI/UX Design",
    status: "Active",
    enrolled: "2026-08-03",
  },
  {
    id: "student-102",
    firstName: "Mikel",
    lastName: "Anders",
    email: "mikel@danapanel.io",
    role: "Mentor",
    course: "Digital Marketing",
    status: "Active",
    enrolled: "2026-07-18",
  },
  {
    id: "student-103",
    firstName: "Tohid",
    lastName: "Golakar",
    email: "tohid@danapanel.io",
    role: "Student",
    course: "Web Development",
    status: "Inactive",
    enrolled: "2026-06-22",
  },
  {
    id: "student-104",
    firstName: "Sakib",
    lastName: "Mahmud",
    email: "sakib@danapanel.io",
    role: "Student",
    course: "Data Science",
    status: "Active",
    enrolled: "2026-08-12",
  },
  {
    id: "student-105",
    firstName: "Ariana",
    lastName: "Brown",
    email: "ariana@danapanel.io",
    role: "Student",
    course: "Business Strategy",
    status: "Active",
    enrolled: "2026-05-09",
  },
  {
    id: "student-106",
    firstName: "Nava",
    lastName: "Rahimi",
    email: "nava@danapanel.io",
    role: "Admin",
    course: "Web Development",
    status: "Active",
    enrolled: "2026-04-27",
  },
];

const defaultTasks = [
  {
    id: 1,
    title: "Review pending course enrollments",
    due: "Today",
    priority: "high",
    completed: false,
  },
  {
    id: 2,
    title: "Publish the August grading report",
    due: "Today",
    priority: "medium",
    completed: true,
  },
  {
    id: 3,
    title: "Approve three mentor applications",
    due: "Tomorrow",
    priority: "low",
    completed: false,
  },
  {
    id: 4,
    title: "Prepare the final project presentation",
    due: "Aug 30",
    priority: "high",
    completed: false,
  },
];

const defaultProfile = {
  firstName: "Adela",
  lastName: "Ahmadi",
  email: "adela@danapanel.io",
  phone: "+93 700 000 000",
  role: "Administrator",
  bio: "Education platform administrator and web developer.",
  avatar: "",
};

const defaultSettings = {
  emailNotifications: true,
  courseUpdates: true,
  weeklyReport: false,
  compactMode: false,
  language: "English",
  timezone: "Asia/Kabul",
};

document.addEventListener("DOMContentLoaded", () => {
  seedStorage();
  hydrateProfileUI();
  initCurrentDate();
  initGlobalSearch();
  initLogoutDemo();
  initDashboard();
  initStudentsPage();
  initReportsPage();
  initProfilePage();
  initSettingsPage();
});

/* ---------- Storage and shared helpers ---------- */
function seedStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.students))
    saveData(STORAGE_KEYS.students, defaultStudents);
  if (!localStorage.getItem(STORAGE_KEYS.tasks))
    saveData(STORAGE_KEYS.tasks, defaultTasks);
  if (!localStorage.getItem(STORAGE_KEYS.profile))
    saveData(STORAGE_KEYS.profile, defaultProfile);
  if (!localStorage.getItem(STORAGE_KEYS.settings))
    saveData(STORAGE_KEYS.settings, defaultSettings);
}

function loadData(key, fallback) {
  try {
    const storedValue = JSON.parse(localStorage.getItem(key));
    return storedValue ?? structuredClone(fallback);
  } catch (error) {
    console.warn(`Could not read ${key}:`, error);
    return structuredClone(fallback);
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix) {
  const uniquePart =
    window.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return `${prefix}-${uniquePart}`;
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "DP";
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${dateString}T00:00:00`));
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function showToast(message, icon = "bi-check-circle-fill") {
  let container = document.querySelector(".toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    document.body.appendChild(container);
  }

  const toastElement = document.createElement("div");
  toastElement.className = "toast dana-toast";
  toastElement.setAttribute("role", "status");
  toastElement.setAttribute("aria-live", "polite");
  toastElement.innerHTML = `
    <div class="toast-body d-flex align-items-center gap-2">
      <i class="bi ${escapeHTML(icon)}"></i>
      <span class="flex-grow-1">${escapeHTML(message)}</span>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>`;
  container.appendChild(toastElement);

  if (window.bootstrap?.Toast) {
    const toast = new bootstrap.Toast(toastElement, { delay: 2600 });
    toastElement.addEventListener("hidden.bs.toast", () =>
      toastElement.remove(),
    );
    toast.show();
  }
}

function hydrateProfileUI() {
  const profile = loadData(STORAGE_KEYS.profile, defaultProfile);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  setText("[data-admin-name]", fullName);
  setText("[data-admin-role]", profile.role);

  document.querySelectorAll("[data-admin-avatar]").forEach((avatar) => {
    avatar.textContent = getInitials(profile.firstName, profile.lastName);
    if (profile.avatar) {
      avatar.innerHTML = `<img src="${profile.avatar}" alt="${escapeHTML(fullName)}">`;
    }
  });

  const settings = loadData(STORAGE_KEYS.settings, defaultSettings);
  document.body.classList.toggle("compact-mode", Boolean(settings.compactMode));
}

function initCurrentDate() {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
  setText("[data-current-date]", formattedDate);
}

function initGlobalSearch() {
  document.querySelectorAll("[data-global-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = form.querySelector("input")?.value.trim();

      if (!query) {
        showToast("Type a student name or email first.", "bi-info-circle-fill");
        return;
      }

      window.location.href = `users.html?search=${encodeURIComponent(query)}`;
    });
  });
}

function initLogoutDemo() {
  document.querySelectorAll("[data-logout]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast(
        "Logout is a front-end demo in this project.",
        "bi-shield-lock-fill",
      );
    });
  });
}

/* ---------- Dashboard ---------- */
function initDashboard() {
  const dashboard = document.querySelector("[data-dashboard-page]");
  if (!dashboard) return;

  const students = loadData(STORAGE_KEYS.students, defaultStudents);
  const activeStudents = students.filter(
    (student) => student.status === "Active",
  );
  const studentAccounts = students.filter(
    (student) => student.role === "Student",
  );
  const courseCount = new Set(students.map((student) => student.course)).size;
  const activeRate = students.length
    ? Math.round((activeStudents.length / students.length) * 100)
    : 0;

  const stats = {
    students: studentAccounts.length,
    courses: courseCount,
    activeRate: `${activeRate}%`,
    reviews: students.filter((student) => student.status === "Inactive").length,
  };

  Object.entries(stats).forEach(([name, value]) =>
    setText(`[data-stat="${name}"]`, value),
  );
  document.querySelectorAll("[data-progress]").forEach((ring) => {
    const progress = Number(ring.dataset.progress);
    ring.style.setProperty("--progress", Math.min(100, Math.max(0, progress)));
  });

  renderTasks();
  renderDashboardChart(students);
}

function renderTasks() {
  const taskList = document.querySelector("[data-task-list]");
  if (!taskList) return;

  let tasks = loadData(STORAGE_KEYS.tasks, defaultTasks);

  const drawTasks = () => {
    taskList.innerHTML = tasks
      .map(
        (task) => `
      <div class="task-item ${task.completed ? "completed" : ""}">
        <button class="task-check" type="button" data-task-id="${task.id}" aria-label="${task.completed ? "Mark incomplete" : "Mark complete"}">
          <i class="bi bi-check-lg"></i>
        </button>
        <span class="priority-dot priority-${escapeHTML(task.priority)}"></span>
        <span class="task-title">${escapeHTML(task.title)}</span>
        <small class="text-muted-custom">${escapeHTML(task.due)}</small>
      </div>`,
      )
      .join("");
  };

  drawTasks();
  taskList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-task-id]");
    if (!button) return;

    const taskId = Number(button.dataset.taskId);
    tasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    saveData(STORAGE_KEYS.tasks, tasks);
    drawTasks();
  });
}

function renderDashboardChart(students) {
  const canvas = document.getElementById("activityChart");
  if (!canvas || typeof Chart === "undefined") return;

  const monthlyEnrollments = [4, 7, 5, 9, 8, students.length];
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 0, 270);
  gradient.addColorStop(0, "rgba(29, 75, 159, 0.28)");
  gradient.addColorStop(1, "rgba(29, 75, 159, 0)");

  new Chart(context, {
    type: "line",
    data: {
      labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          label: "New enrollments",
          data: monthlyEnrollments,
          borderColor: "#1d4b9f",
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: "#ff5d57",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          tension: 0.38,
        },
      ],
    },
    options: getChartOptions(),
  });
}

/* ---------- Students CRUD ---------- */
function initStudentsPage() {
  const tableBody = document.querySelector("[data-student-table]");
  if (!tableBody) return;

  let students = loadData(STORAGE_KEYS.students, defaultStudents);
  let pendingDeleteId = null;

  const searchInput = document.querySelector("[data-student-search]");
  const roleFilter = document.querySelector("[data-role-filter]");
  const statusFilter = document.querySelector("[data-status-filter]");
  const sortSelect = document.querySelector("[data-student-sort]");
  const emptyState = document.querySelector("[data-student-empty]");
  const resultCount = document.querySelector("[data-result-count]");
  const form = document.getElementById("studentForm");
  const modalElement = document.getElementById("studentModal");
  const deleteModalElement = document.getElementById("deleteStudentModal");
  const studentModal =
    modalElement && window.bootstrap
      ? bootstrap.Modal.getOrCreateInstance(modalElement)
      : null;
  const deleteModal =
    deleteModalElement && window.bootstrap
      ? bootstrap.Modal.getOrCreateInstance(deleteModalElement)
      : null;

  const queryFromUrl = new URLSearchParams(window.location.search).get(
    "search",
  );
  if (queryFromUrl && searchInput) searchInput.value = queryFromUrl;

  function updateStudentStats() {
    const studentOnly = students.filter(
      (student) => student.role === "Student",
    );
    const active = students.filter((student) => student.status === "Active");
    const inactive = students.filter(
      (student) => student.status === "Inactive",
    );
    const newThisMonth = students.filter((student) => {
      const enrolledDate = new Date(`${student.enrolled}T00:00:00`);
      const now = new Date();
      return (
        enrolledDate.getMonth() === now.getMonth() &&
        enrolledDate.getFullYear() === now.getFullYear()
      );
    });

    setText('[data-student-stat="total"]', studentOnly.length);
    setText('[data-student-stat="active"]', active.length);
    setText('[data-student-stat="inactive"]', inactive.length);
    setText('[data-student-stat="new"]', newThisMonth.length);
  }

  function getFilteredStudents() {
    const query = searchInput?.value.toLowerCase().trim() || "";
    const selectedRole = roleFilter?.value || "All";
    const selectedStatus = statusFilter?.value || "All";
    const sortBy = sortSelect?.value || "name-asc";

    const filtered = students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch =
        !query ||
        fullName.includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.course.toLowerCase().includes(query);
      const matchesRole =
        selectedRole === "All" || student.role === selectedRole;
      const matchesStatus =
        selectedStatus === "All" || student.status === selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });

    return filtered.sort((first, second) => {
      if (sortBy === "name-desc")
        return second.firstName.localeCompare(first.firstName);
      if (sortBy === "newest")
        return new Date(second.enrolled) - new Date(first.enrolled);
      return first.firstName.localeCompare(second.firstName);
    });
  }

  function renderStudents() {
    const visibleStudents = getFilteredStudents();
    tableBody.innerHTML = visibleStudents
      .map((student) => {
        const isActive = student.status === "Active";
        return `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <span class="avatar">${getInitials(student.firstName, student.lastName)}</span>
              <div>
                <div class="student-name">${escapeHTML(student.firstName)} ${escapeHTML(student.lastName)}</div>
                <div class="student-email">${escapeHTML(student.email)}</div>
              </div>
            </div>
          </td>
          <td><span class="badge-soft-blue">${escapeHTML(student.role)}</span></td>
          <td>${escapeHTML(student.course)}</td>
          <td>${formatDate(student.enrolled)}</td>
          <td><span class="${isActive ? "badge-soft-green" : "badge-soft-gray"}"><i class="bi bi-circle-fill" style="font-size:.35rem"></i>${escapeHTML(student.status)}</span></td>
          <td class="text-end text-nowrap">
            <button class="btn btn-sm btn-soft" type="button" data-edit-student="${student.id}" aria-label="Edit ${escapeHTML(student.firstName)}">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger ms-1" type="button" data-delete-student="${student.id}" aria-label="Delete ${escapeHTML(student.firstName)}">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>`;
      })
      .join("");

    if (emptyState)
      emptyState.classList.toggle("d-none", visibleStudents.length > 0);
    if (resultCount)
      resultCount.textContent = `${visibleStudents.length} result${visibleStudents.length === 1 ? "" : "s"}`;
    updateStudentStats();
  }

  function resetStudentForm() {
    form?.reset();
    form?.classList.remove("was-validated");
    if (form?.elements.studentId) form.elements.studentId.value = "";
    const title = document.querySelector("[data-student-modal-title]");
    if (title) title.textContent = "Add New Student";
    clearCustomValidation(form);
  }

  function openEditModal(studentId) {
    const student = students.find((item) => item.id === studentId);
    if (!student || !form) return;

    form.elements.studentId.value = student.id;
    form.elements.firstName.value = student.firstName;
    form.elements.lastName.value = student.lastName;
    form.elements.email.value = student.email;
    form.elements.role.value = student.role;
    form.elements.course.value = student.course;
    form.elements.status.value = student.status;
    form.elements.enrolled.value = student.enrolled;
    form.classList.remove("was-validated");
    document.querySelector("[data-student-modal-title]").textContent =
      "Edit Student";
    studentModal?.show();
  }

  function validateStudentForm() {
    if (!form) return false;

    clearCustomValidation(form);
    const firstName = form.elements.firstName;
    const lastName = form.elements.lastName;
    const email = form.elements.email;
    const studentId = form.elements.studentId.value;
    const namePattern = /^[A-Za-zÀ-ÿ' -]{2,30}$/;

    if (!namePattern.test(firstName.value.trim()))
      firstName.setCustomValidity("Enter at least two letters.");
    if (!namePattern.test(lastName.value.trim()))
      lastName.setCustomValidity("Enter at least two letters.");

    const duplicateEmail = students.some(
      (student) =>
        student.email.toLowerCase() === email.value.trim().toLowerCase() &&
        student.id !== studentId,
    );
    if (duplicateEmail)
      email.setCustomValidity("This email already belongs to another account.");

    form.classList.add("was-validated");
    return form.checkValidity();
  }

  [searchInput, roleFilter, statusFilter, sortSelect].forEach((control) => {
    control?.addEventListener(
      control === searchInput ? "input" : "change",
      renderStudents,
    );
  });

  document
    .querySelector("[data-add-student]")
    ?.addEventListener("click", resetStudentForm);

  tableBody.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit-student]");
    const deleteButton = event.target.closest("[data-delete-student]");

    if (editButton) openEditModal(editButton.dataset.editStudent);
    if (deleteButton) {
      pendingDeleteId = deleteButton.dataset.deleteStudent;
      const student = students.find((item) => item.id === pendingDeleteId);
      setText(
        "[data-delete-student-name]",
        student ? `${student.firstName} ${student.lastName}` : "this student",
      );
      deleteModal?.show();
    }
  });

  document
    .querySelector("[data-confirm-delete]")
    ?.addEventListener("click", () => {
      if (!pendingDeleteId) return;
      students = students.filter((student) => student.id !== pendingDeleteId);
      saveData(STORAGE_KEYS.students, students);
      pendingDeleteId = null;
      deleteModal?.hide();
      renderStudents();
      showToast("Student deleted successfully.", "bi-trash3-fill");
    });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateStudentForm()) return;

    const formData = new FormData(form);
    const studentId = formData.get("studentId");
    const studentRecord = {
      id: studentId || makeId("student"),
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      email: formData.get("email").trim().toLowerCase(),
      role: formData.get("role"),
      course: formData.get("course"),
      status: formData.get("status"),
      enrolled: formData.get("enrolled"),
    };

    if (studentId) {
      students = students.map((student) =>
        student.id === studentId ? studentRecord : student,
      );
    } else {
      students = [...students, studentRecord];
    }

    saveData(STORAGE_KEYS.students, students);
    studentModal?.hide();
    resetStudentForm();
    renderStudents();
    showToast(
      studentId
        ? "Student updated successfully."
        : "Student added successfully.",
    );
  });

  form?.querySelectorAll("input, select").forEach((control) => {
    control.addEventListener("input", () => control.setCustomValidity(""));
  });

  renderStudents();
}

function clearCustomValidation(form) {
  form
    ?.querySelectorAll("input, select, textarea")
    .forEach((control) => control.setCustomValidity(""));
}

/* ---------- Reports ---------- */
let enrollmentChart;
let performanceChart;

function initReportsPage() {
  const reportsPage = document.querySelector("[data-reports-page]");
  if (!reportsPage) return;

  const periodSelect = document.querySelector("[data-report-period]");
  const courseFilter = document.querySelector("[data-report-course]");

  const refreshReports = () => {
    const students = loadData(STORAGE_KEYS.students, defaultStudents);
    const selectedCourse = courseFilter?.value || "All";
    const period = periodSelect?.value || "6";
    const relevantStudents =
      selectedCourse === "All"
        ? students
        : students.filter((student) => student.course === selectedCourse);

    const active = relevantStudents.filter(
      (student) => student.status === "Active",
    ).length;
    const activeRate = relevantStudents.length
      ? Math.round((active / relevantStudents.length) * 100)
      : 0;
    const completionRate = Math.min(96, 72 + relevantStudents.length * 2);
    const mentorCount = relevantStudents.filter(
      (student) => student.role === "Mentor",
    ).length;

    setText('[data-report-stat="enrollment"]', relevantStudents.length);
    setText('[data-report-stat="active"]', `${activeRate}%`);
    setText('[data-report-stat="completion"]', `${completionRate}%`);
    setText('[data-report-stat="mentors"]', mentorCount);

    renderReportTable(relevantStudents);
    renderReportCharts(relevantStudents, Number(period));
  };

  [periodSelect, courseFilter].forEach((control) =>
    control?.addEventListener("change", refreshReports),
  );
  document
    .querySelector("[data-export-report]")
    ?.addEventListener("click", exportReportCSV);
  refreshReports();
}

function buildCourseSummary(students) {
  const courseMap = students.reduce((summary, student) => {
    if (!summary[student.course]) {
      summary[student.course] = {
        course: student.course,
        students: 0,
        active: 0,
        scoreTotal: 0,
      };
    }
    summary[student.course].students += 1;
    summary[student.course].active += student.status === "Active" ? 1 : 0;
    summary[student.course].scoreTotal +=
      78 + (student.firstName.length % 5) * 3;
    return summary;
  }, {});

  return Object.values(courseMap).map((item) => ({
    ...item,
    activeRate: Math.round((item.active / item.students) * 100),
    averageScore: Math.round(item.scoreTotal / item.students),
  }));
}

function renderReportTable(students) {
  const tableBody = document.querySelector("[data-report-table]");
  if (!tableBody) return;

  const courseSummary = buildCourseSummary(students).sort(
    (first, second) => second.students - first.students,
  );
  tableBody.innerHTML = courseSummary
    .map(
      (item, index) => `
    <tr>
      <td><span class="fw-bold me-2 text-muted-custom">0${index + 1}</span>${escapeHTML(item.course)}</td>
      <td>${item.students}</td>
      <td>${item.activeRate}%</td>
      <td>${item.averageScore}%</td>
      <td><span class="${item.activeRate >= 75 ? "badge-soft-green" : "badge-soft-coral"}">${item.activeRate >= 75 ? "On track" : "Needs attention"}</span></td>
    </tr>`,
    )
    .join("");

  document
    .querySelector("[data-report-empty]")
    ?.classList.toggle("d-none", courseSummary.length > 0);
}

function renderReportCharts(students, months) {
  if (typeof Chart === "undefined") return;

  const enrollmentCanvas = document.getElementById("enrollmentChart");
  const performanceCanvas = document.getElementById("performanceChart");
  const summaries = buildCourseSummary(students);
  const labels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"].slice(-months);
  const baseValues = [3, 5, 4, 7, 6, Math.max(students.length, 1)].slice(
    -months,
  );

  enrollmentChart?.destroy();
  performanceChart?.destroy();

  if (enrollmentCanvas) {
    enrollmentChart = new Chart(enrollmentCanvas, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Enrollments",
            data: baseValues,
            backgroundColor: [
              "#ff5d57",
              "#102d73",
              "#ffa7a3",
              "#1d4b9f",
              "#ff5d57",
              "#102d73",
            ].slice(-months),
            borderRadius: 8,
            maxBarThickness: 38,
          },
        ],
      },
      options: getChartOptions(),
    });
  }

  if (performanceCanvas) {
    performanceChart = new Chart(performanceCanvas, {
      type: "doughnut",
      data: {
        labels: summaries.map((item) => item.course),
        datasets: [
          {
            data: summaries.map((item) => item.students),
            backgroundColor: [
              "#102d73",
              "#ff5d57",
              "#ffa7a3",
              "#1d4b9f",
              "#f2a93b",
            ],
            borderColor: "#ffffff",
            borderWidth: 4,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "68%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 16,
              font: { family: "DM Sans", size: 11 },
            },
          },
        },
      },
    });
  }
}

function getChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(16, 45, 115, .94)",
        padding: 11,
        cornerRadius: 10,
        titleFont: { family: "Manrope", weight: "700" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#7d889e" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(16, 45, 115, .07)" },
        border: { display: false },
        ticks: { color: "#7d889e", precision: 0 },
      },
    },
  };
}

function exportReportCSV() {
  const students = loadData(STORAGE_KEYS.students, defaultStudents);
  const rows = [
    [
      "First name",
      "Last name",
      "Email",
      "Role",
      "Course",
      "Status",
      "Enrolled",
    ],
    ...students.map((student) => [
      student.firstName,
      student.lastName,
      student.email,
      student.role,
      student.course,
      student.status,
      student.enrolled,
    ]),
  ];
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "danapanel-report.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSV report downloaded.", "bi-download");
}

/* ---------- Profile ---------- */
function initProfilePage() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  let profile = loadData(STORAGE_KEYS.profile, defaultProfile);
  const avatarInput = document.getElementById("avatarInput");
  const profileAvatar = document.querySelector("[data-profile-avatar]");

  function fillProfileForm() {
    Object.entries(profile).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value;
    });
    setText("[data-profile-name]", `${profile.firstName} ${profile.lastName}`);
    setText("[data-profile-role]", profile.role);
    renderProfileAvatar();
  }

  function renderProfileAvatar() {
    if (!profileAvatar) return;
    profileAvatar.textContent = getInitials(
      profile.firstName,
      profile.lastName,
    );
    if (profile.avatar)
      profileAvatar.innerHTML = `<img src="${profile.avatar}" alt="Profile preview">`;
  }

  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type) || file.size > 2 * 1024 * 1024) {
      avatarInput.value = "";
      showToast(
        "Choose a JPG, PNG or WebP image under 2 MB.",
        "bi-exclamation-circle-fill",
      );
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      profile.avatar = reader.result;
      renderProfileAvatar();
      showToast("New photo preview is ready.", "bi-image-fill");
    });
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearCustomValidation(form);

    const namePattern = /^[A-Za-zÀ-ÿ' -]{2,30}$/;
    if (!namePattern.test(form.elements.firstName.value.trim()))
      form.elements.firstName.setCustomValidity("Enter at least two letters.");
    if (!namePattern.test(form.elements.lastName.value.trim()))
      form.elements.lastName.setCustomValidity("Enter at least two letters.");

    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const formData = new FormData(form);
    profile = {
      ...profile,
      firstName: formData.get("firstName").trim(),
      lastName: formData.get("lastName").trim(),
      email: formData.get("email").trim().toLowerCase(),
      phone: formData.get("phone").trim(),
      role: formData.get("role"),
      bio: formData.get("bio").trim(),
    };
    saveData(STORAGE_KEYS.profile, profile);
    hydrateProfileUI();
    fillProfileForm();
    showToast("Profile changes saved.");
  });

  form
    .querySelectorAll("input, textarea")
    .forEach((control) =>
      control.addEventListener("input", () => control.setCustomValidity("")),
    );
  fillProfileForm();
}

/* ---------- Settings ---------- */
function initSettingsPage() {
  const settingsPage = document.querySelector("[data-settings-page]");
  if (!settingsPage) return;

  let settings = loadData(STORAGE_KEYS.settings, defaultSettings);
  const preferencesForm = document.getElementById("preferencesForm");
  const securityForm = document.getElementById("securityForm");

  Object.entries(settings).forEach(([key, value]) => {
    const control = settingsPage.querySelector(`[name="${key}"]`);
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
