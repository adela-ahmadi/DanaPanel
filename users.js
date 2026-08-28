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
