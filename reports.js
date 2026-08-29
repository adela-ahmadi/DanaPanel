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
    setText('[data-report-stat="active"]', ${activeRate}%);
    setText('[data-report-stat="completion"]', ${completionRate}%);
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
      row.map((cell) => "${String(cell).replaceAll('"', '""')}").join(","),
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