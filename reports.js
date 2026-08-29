
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
