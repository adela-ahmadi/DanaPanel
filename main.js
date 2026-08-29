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
    activeRate: `${activeRate}%`,   // ✅ اصلاح شد
    reviews: students.filter((student) => student.status === "Inactive").length,
  };

  Object.entries(stats).forEach(([name, value]) =>
    setText(`[data-stat="${name}"]`, value)   // ✅ اصلاح شد
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
  gradient.addColorStop(0, "rgba(2, 19, 51, 0.74)");
  gradient.addColorStop(1, "rgba(29, 75, 159, 0)");

  new Chart(context, {
    type: "line",
    data: {
      labels: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [
        {
          label: "New enrollments",
          data: monthlyEnrollments,
          borderColor: "#00266c",
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: "#ff453f",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          tension: 0.38,
        },
      ],
    },
    options: getChartOptions(),
  });
}