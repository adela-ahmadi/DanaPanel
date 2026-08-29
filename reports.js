
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