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