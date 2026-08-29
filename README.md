# DanaPanel Dashboard

DanaPanel is a responsive education-management dashboard built for the final JavaScript group project. It uses Bootstrap 5 for the page structure and responsive layout, custom CSS for the glass effect and visual identity, and vanilla JavaScript for all interactive behavior.

## Main Features

- Responsive multi-page dashboard with Bootstrap Grid and Offcanvas navigation
- Overview statistics calculated from stored student data
- Student CRUD: create, read, update and delete accounts
- Live search, role/status filters and sorting
- JavaScript and Bootstrap form validation
- Interactive task checklist
- Dynamic Chart.js reports and course summaries
- CSV report export
- Editable administrator profile with image preview
- Saved preferences and compact mode
- Browser persistence with `localStorage`
- Accessible labels, feedback messages, empty states and responsive tables

## Technologies

- HTML5
- Bootstrap 5.3.8
- Bootstrap Icons 1.13.1
- Custom CSS3
- Vanilla JavaScript (ES6+)
- Chart.js 4.5.1
- Vite (development and production build only)

## Project Pages

| File            | Purpose                                                           |
| --------------- | ----------------------------------------------------------------- |
| `index.html`    | Overview statistics, activity chart, progress, tasks and messages |
| `users.html`    | Student CRUD, search, filters, sorting and form validation        |
| `reports.html`  | Report filters, dynamic charts, course summaries and CSV export   |
| `profile.html`  | Editable administrator information and avatar preview             |
| `settings.html` | Notification preferences, compact mode and password validation    |

## Run the Project

The simplest option is to open `index.html` in a browser. An internet connection is needed for the Bootstrap, Bootstrap Icons and Chart.js CDNs.

For a local development server:

```bash
npm install
npm run dev
```

To verify the production build:

```bash
npm run build
```

## JavaScript Rubric Mapping

| Rubric item      | Where it appears                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Conditions       | Validation rules, filters, empty states, account status and password checks                         |
| Loops            | `forEach` loops initialize controls, preferences, profile fields and UI elements                    |
| Functions        | Small reusable functions such as `loadData`, `renderStudents`, `buildCourseSummary` and `showToast` |
| Array Methods    | `map`, `filter`, `find`, `some`, `reduce`, `sort` and spread syntax                                 |
| Objects          | Student, task, profile, settings and report-summary objects                                         |
| DOM Manipulation | Dynamic table rows, statistics, tasks, charts, profile content and toast messages                   |
| Events           | Submit, click, input, change and file-reader events                                                 |
| Form Validation  | Student, profile and password forms use HTML validation plus custom JavaScript rules                |
| Arrays           | Student and task collections are stored and updated in `localStorage`                               |

## Data Model Example

```js
const student = {
  id: "student-101",
  firstName: "Shine",
  lastName: "Smith",
  email: "shine@danapanel.io",
  role: "Student",
  course: "UI/UX Design",
  status: "Active",
  enrolled: "2026-08-03",
};
```

## Git Workflow

Use one branch per member or feature. Do not let everyone code directly on `main`.

Suggested branches:

- `feature/dashboard`
- `feature/students-crud`
- `feature/reports`
- `feature/profile-settings`
- `docs/readme`

Example workflow:

```bash
git checkout -b feature/students-crud
git add users.html main.js style.css
git commit -m "feat: add student CRUD and validation"
git push -u origin feature/students-crud
```

The project manager should review each branch, resolve conflicts, test the full project, and merge it into `main`. Use clear commits such as:

- `feat: build Bootstrap dashboard layout`
- `feat: add student search and filters`
- `fix: validate duplicate student emails`
- `style: apply DanaPanel glass theme`
- `docs: complete project README`

## Team Contributions

Replace the placeholder rows with the real member names and exact work before submission. Git commits should support every contribution listed here.

| Member                        | Branch                     | Contribution                                                  |
| ----------------------------- | -------------------------- | ------------------------------------------------------------- |
| Adela Ahmadi _(confirm/edit)_ | `feature/dashboard`        | Project coordination, dashboard integration and final testing |
| Susan Sultani                 | `feature/students-crud`    | Student table, CRUD and validation                            |
| Forough Ahadi                 | `feature/reports`          | Reports, charts, filters and CSV export                       |
| Oleya Fazely                  | `feature/profile-settings` | Profile, settings and responsive QA                           |
| Atefa Amini                   | `feature/profile-settings` | Reports, charts, filters and CSV export                           |


## Important Before Submission

1. Replace every placeholder in the Team Contributions table.
2. Make sure each member has meaningful commits on their own branch.
3. Merge and test every page from the final `main` branch.
4. Be ready to explain the functions and array methods in `main.js`.
5. Do not claim backend authentication: login/logout and password update are front-end demonstrations only.

## Reset Demo Data

Open the browser console and run the following command, then refresh the page:

```js
localStorage.clear();
```

The default student, task, profile and settings data will be created again automatically.
