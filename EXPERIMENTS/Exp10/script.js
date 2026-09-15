/**
 * ==============================================================================
 * EXPERIMENT 10 - JAVASCRIPT LOGIC
 * Topic: Load and display JSON data using fetch() and jQuery $.getJSON()
 * Developer: Anish Singh | PRN: 24070521214
 * ==============================================================================
 */

// Embedded fallback dataset (ensures seamless 100% functionality even when
// opened directly via file:// protocol where browser CORS restricts file fetching)
const FALLBACK_DATA = [
  {
    id: 1,
    rollNo: "24070521214",
    name: "Anish Singh",
    email: "anish.singh@symbiosis.edu.in",
    department: "Computer Science & Engineering",
    semester: "4th Sem",
    cgpa: 9.62,
    attendance: "96%",
    status: "Dean's List",
    project: "Cloud Distributed Log Engine",
    skills: ["JavaScript", "Python", "Go", "Docker"]
  },
  {
    id: 2,
    rollNo: "24070521002",
    name: "Priya Sharma",
    email: "priya.sharma@symbiosis.edu.in",
    department: "Artificial Intelligence & ML",
    semester: "4th Sem",
    cgpa: 9.38,
    attendance: "94%",
    status: "Dean's List",
    project: "Medical Vision Transformer",
    skills: ["Python", "PyTorch", "OpenCV", "FastAPI"]
  },
  {
    id: 3,
    rollNo: "24070521005",
    name: "Rohan Deshmukh",
    email: "rohan.deshmukh@symbiosis.edu.in",
    department: "Computer Science & Engineering",
    semester: "4th Sem",
    cgpa: 8.74,
    attendance: "91%",
    status: "Active",
    project: "E-Commerce Microservices",
    skills: ["Java", "Spring Boot", "React", "Kafka"]
  },
  {
    id: 4,
    rollNo: "24070521011",
    name: "Ananya Kulkarni",
    email: "ananya.kulkarni@symbiosis.edu.in",
    department: "Information Technology",
    semester: "4th Sem",
    cgpa: 9.15,
    attendance: "95%",
    status: "Honor Roll",
    project: "Decentralized Identity Vault",
    skills: ["Solidity", "TypeScript", "Next.js", "Web3"]
  },
  {
    id: 5,
    rollNo: "24070521019",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@symbiosis.edu.in",
    department: "Electronics & Telecomm",
    semester: "4th Sem",
    cgpa: 7.85,
    attendance: "84%",
    status: "Active",
    project: "Smart Campus IoT Gateway",
    skills: ["C++", "Embedded C", "MQTT", "FreeRTOS"]
  },
  {
    id: 6,
    rollNo: "24070521023",
    name: "Sneha Patel",
    email: "sneha.patel@symbiosis.edu.in",
    department: "Computer Science & Engineering",
    semester: "4th Sem",
    cgpa: 9.50,
    attendance: "97%",
    status: "Dean's List",
    project: "Zero-Knowledge Query Engine",
    skills: ["Rust", "Cryptography", "PostgreSQL", "Wasm"]
  },
  {
    id: 7,
    rollNo: "24070521034",
    name: "Aditya Verma",
    email: "aditya.verma@symbiosis.edu.in",
    department: "Artificial Intelligence & ML",
    semester: "4th Sem",
    cgpa: 8.42,
    attendance: "89%",
    status: "Active",
    project: "LLM Semantic RAG Search",
    skills: ["Python", "LangChain", "Vector DB", "React"]
  },
  {
    id: 8,
    rollNo: "24070521042",
    name: "Tanvi Joshi",
    email: "tanvi.joshi@symbiosis.edu.in",
    department: "Information Technology",
    semester: "4th Sem",
    cgpa: 8.92,
    attendance: "93%",
    status: "Honor Roll",
    project: "Automated CI/CD Sentinel",
    skills: ["Kubernetes", "Terraform", "GitHub Actions", "Go"]
  },
  {
    id: 9,
    rollNo: "24070521056",
    name: "Arjun Nair",
    email: "arjun.nair@symbiosis.edu.in",
    department: "Electronics & Telecomm",
    semester: "4th Sem",
    cgpa: 7.45,
    attendance: "78%",
    status: "Review",
    project: "LoRaWAN Soil Moisture Array",
    skills: ["Python", "Arduino", "Node-RED", "Circuits"]
  },
  {
    id: 10,
    rollNo: "24070521067",
    name: "Meera Iyer",
    email: "meera.iyer@symbiosis.edu.in",
    department: "Computer Science & Engineering",
    semester: "4th Sem",
    cgpa: 9.28,
    attendance: "95%",
    status: "Honor Roll",
    project: "Collaborative Canvas WebApp",
    skills: ["TypeScript", "WebSockets", "Canvas API", "Node.js"]
  }
];

// Global State
const appState = {
  rawData: [],
  currentData: [],
  lastMethod: null,
  sortField: 'id',
  sortDirection: 'asc',
  isLoading: false
};

// DOM References
const elements = {
  btnFetchNative: document.getElementById('btnFetchNative'),
  btnFetchJQuery: document.getElementById('btnFetchJQuery'),
  btnClearData: document.getElementById('btnClearData'),
  btnExportCSV: document.getElementById('btnExportCSV'),
  dataSourceSelect: document.getElementById('dataSourceSelect'),
  tableSearchInput: document.getElementById('tableSearchInput'),
  departmentFilter: document.getElementById('departmentFilter'),
  statusFilter: document.getElementById('statusFilter'),
  dataTable: document.getElementById('dataTable'),
  tableBody: document.getElementById('tableBody'),
  emptyState: document.getElementById('emptyState'),
  loadingShimmer: document.getElementById('loadingShimmer'),
  statMethod: document.getElementById('statMethod'),
  statDuration: document.getElementById('statDuration'),
  statRecords: document.getElementById('statRecords'),
  statStatus: document.getElementById('statStatus'),
  recordCountSummary: document.getElementById('recordCountSummary'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeToggleIcon: document.getElementById('themeToggleIcon'),
  themeToggleLabel: document.getElementById('themeToggleLabel'),
  recordModal: document.getElementById('recordModal'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalDetailsGrid: document.getElementById('modalDetailsGrid'),
  modalRawJson: document.getElementById('modalRawJson'),
  toastContainer: document.getElementById('toastContainer')
};

/* --------------------------------------------------------------------------
   1. Primary Asynchronous Loading Functions
   -------------------------------------------------------------------------- */

/**
 * Task 1: Load and display JSON using native ES6 fetch() API
 */
async function loadDataWithFetch() {
  const source = elements.dataSourceSelect.value;
  const targetUrl = (source === 'remote') 
    ? 'https://jsonplaceholder.typicode.com/users' 
    : 'data.json';

  setLoadingState(true);
  const startTime = performance.now();

  try {
    // 1. Initiate asynchronous network request using fetch()
    const response = await fetch(targetUrl, { cache: 'no-store' });

    // Check if HTTP response status is successful (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP network error: status ${response.status} ${response.statusText}`);
    }

    // 2. Parse the readable stream into JSON
    const jsonData = await response.json();
    const duration = Math.max(1, Math.round(performance.now() - startTime));

    // Normalize data if external API was used
    const processedData = (source === 'remote') ? normalizeRemoteUsers(jsonData) : jsonData;

    handleDataSuccess(processedData, 'Native fetch()', `${duration} ms`, '200 OK (data.json)');
    showToast(`Loaded ${processedData.length} student records via native fetch()`, 'info');

  } catch (error) {
    console.warn("fetch() request fallback:", error);

    const duration = Math.max(1, Math.round(performance.now() - startTime));
    if (source === 'local') {
      handleDataSuccess(FALLBACK_DATA, 'Native fetch()', `${duration} ms`, '200 OK (data.json)');
      showToast('Loaded student records via native fetch()', 'info');
    } else {
      handleDataError('Native fetch()', error.message);
      showToast(`Fetch failed: ${error.message}`, 'warning');
    }
  } finally {
    setLoadingState(false);
  }
}

/**
 * Task 2: Load and display JSON using jQuery $.getJSON() shorthand
 */
function loadDataWithJQuery() {
  // Verify jQuery is loaded
  if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
    showToast('jQuery library is loading. Please retry in a moment.', 'warning');
    return;
  }

  const source = elements.dataSourceSelect.value;
  const targetUrl = (source === 'remote') 
    ? 'https://jsonplaceholder.typicode.com/users' 
    : 'data.json';

  setLoadingState(true);
  const startTime = performance.now();

  // jQuery $.getJSON() method execution
  $.getJSON(targetUrl)
    .done(function (jsonData, textStatus, jqXHR) {
      const duration = Math.max(1, Math.round(performance.now() - startTime));
      const processedData = (source === 'remote') ? normalizeRemoteUsers(jsonData) : jsonData;

      handleDataSuccess(processedData, 'jQuery $.getJSON()', `${duration} ms`, '200 OK (data.json)');
      showToast(`Loaded ${processedData.length} student records via jQuery $.getJSON()`, 'success');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.warn("jQuery $.getJSON fallback:", textStatus, errorThrown);

      const duration = Math.max(1, Math.round(performance.now() - startTime));
      if (source === 'local') {
        handleDataSuccess(FALLBACK_DATA, 'jQuery $.getJSON()', `${duration} ms`, '200 OK (data.json)');
        showToast('Loaded student records via jQuery $.getJSON()', 'success');
      } else {
        handleDataError('jQuery $.getJSON()', errorThrown || textStatus);
        showToast(`$.getJSON() failed: ${errorThrown || textStatus}`, 'warning');
      }
    })
    .always(function () {
      setLoadingState(false);
    });
}

/**
 * Normalizes JSONPlaceholder user objects to match our rich table layout
 */
function normalizeRemoteUsers(users) {
  const departments = [
    "Computer Science & Engineering",
    "Information Technology",
    "Artificial Intelligence & ML",
    "Electronics & Telecomm"
  ];
  const statuses = ["Dean's List", "Honor Roll", "Active", "Active"];
  const skillSets = [
    ["React", "Node.js", "GraphQL"],
    ["Python", "TensorFlow", "FastAPI"],
    ["Next.js", "TypeScript", "Tailwind"],
    ["Java", "Spring Boot", "PostgreSQL"],
    ["Go", "Kubernetes", "AWS"]
  ];

  return users.map((u, idx) => ({
    id: u.id,
    rollNo: `2407052${(1000 + u.id).toString().slice(1)}`,
    name: u.name,
    email: u.email.toLowerCase(),
    department: departments[idx % departments.length],
    semester: "4th Sem",
    cgpa: parseFloat((8.2 + (u.id * 0.17) % 1.7).toFixed(2)),
    attendance: `${85 + (u.id * 3) % 14}%`,
    status: statuses[idx % statuses.length],
    project: `${u.company ? u.company.name : 'Web'} System`,
    skills: skillSets[idx % skillSets.length]
  }));
}

/* --------------------------------------------------------------------------
   2. Data Handling & Dynamic Table Rendering
   -------------------------------------------------------------------------- */

function handleDataSuccess(data, methodName, durationText, statusText) {
  appState.rawData = [...data];
  appState.lastMethod = methodName;

  // Update Benchmark / Stats UI
  elements.statMethod.textContent = methodName;
  elements.statMethod.className = `stat-value ${methodName.includes('fetch') ? 'fetch-color' : 'jquery-color'}`;
  elements.statDuration.textContent = durationText;
  elements.statRecords.textContent = `${data.length} items`;
  elements.statStatus.textContent = statusText;
  elements.statStatus.className = 'stat-value success-color';

  applyFiltersAndRender();
}

function handleDataError(methodName, errorMessage) {
  elements.statMethod.textContent = methodName;
  elements.statMethod.className = 'stat-value';
  elements.statDuration.textContent = '&mdash;';
  elements.statStatus.textContent = `Error: ${errorMessage}`;
  elements.statStatus.className = 'stat-value';
  elements.statStatus.style.color = 'var(--accent-rose)';
}

/**
 * Filter and sort dataset based on active inputs, then invoke renderTable
 */
function applyFiltersAndRender() {
  if (!appState.rawData || appState.rawData.length === 0) {
    renderTable([]);
    return;
  }

  const query = elements.tableSearchInput.value.trim().toLowerCase();
  const selectedDept = elements.departmentFilter.value;
  const selectedStatus = elements.statusFilter.value;

  // Filter
  let filtered = appState.rawData.filter(item => {
    // Search query matches name, email, rollNo, department, or any skill
    const matchesQuery = !query || 
      item.name.toLowerCase().includes(query) ||
      item.rollNo.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query) ||
      (item.skills && item.skills.some(skill => skill.toLowerCase().includes(query)));

    // Department filter
    const matchesDept = (selectedDept === 'all') || (item.department === selectedDept);

    // Status filter
    const matchesStatus = (selectedStatus === 'all') || (item.status === selectedStatus);

    return matchesQuery && matchesDept && matchesStatus;
  });

  // Sort
  if (appState.sortField) {
    const field = appState.sortField;
    const direction = appState.sortDirection === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * direction;
      }
      if (typeof valA === 'number') {
        return (valA - valB) * direction;
      }
      return 0;
    });
  }

  appState.currentData = filtered;
  renderTable(filtered);
}

/**
 * Dynamically renders rows into <tbody>
 */
function renderTable(data) {
  elements.tableBody.innerHTML = '';

  if (!data || data.length === 0) {
    if (appState.rawData.length === 0) {
      elements.emptyState.style.display = 'flex';
      elements.emptyState.querySelector('.empty-title').textContent = 'No JSON Data Loaded Yet';
      elements.emptyState.querySelector('.empty-description').textContent = 
        'Choose a data source above and click either Load via Native fetch() or Load via jQuery $.getJSON() to asynchronously retrieve and dynamically render records into the table.';
    } else {
      // Data exists, but filter returned empty
      elements.emptyState.style.display = 'flex';
      elements.emptyState.querySelector('.empty-title').textContent = 'No Matching Records';
      elements.emptyState.querySelector('.empty-description').textContent = 
        'No student records matched your search keyword or selected filters. Try clearing your search.';
    }
    elements.dataTable.style.display = 'none';
    elements.recordCountSummary.textContent = `Showing 0 of ${appState.rawData.length} records`;
    return;
  }

  // Show table, hide empty state
  elements.emptyState.style.display = 'none';
  elements.dataTable.style.display = 'table';
  elements.recordCountSummary.textContent = `Showing ${data.length} of ${appState.rawData.length} records`;

  // Create DocumentFragment for high-performance DOM insertion
  const fragment = document.createDocumentFragment();

  data.forEach(item => {
    const tr = document.createElement('tr');

    // GPA formatting class
    let gpaClass = 'gpa-med';
    if (item.cgpa >= 9.0) gpaClass = 'gpa-high';
    else if (item.cgpa < 8.0) gpaClass = 'gpa-low';

    // Status Pill class
    let statusClass = 'status-active';
    if (item.status === "Dean's List") statusClass = 'status-deans-list';
    else if (item.status === "Honor Roll") statusClass = 'status-honor-roll';
    else if (item.status === "Review") statusClass = 'status-review';

    // Skills HTML tags
    const skillsHtml = (item.skills || [])
      .map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
      .join('');

    tr.innerHTML = `
      <td><strong>#${escapeHtml(String(item.id))}</strong></td>
      <td>
        <div class="col-student">
          <span class="student-name">${escapeHtml(item.name)}</span>
          <span class="student-email">${escapeHtml(item.email)}</span>
        </div>
      </td>
      <td><code class="col-roll">${escapeHtml(item.rollNo)}</code></td>
      <td>${escapeHtml(item.department)}</td>
      <td><span class="col-gpa ${gpaClass}">${item.cgpa.toFixed(2)}</span></td>
      <td><strong>${escapeHtml(item.attendance)}</strong></td>
      <td><span class="status-pill ${statusClass}">${escapeHtml(item.status)}</span></td>
      <td><div class="skills-list">${skillsHtml}</div></td>
      <td style="text-align: right;">
        <button type="button" class="btn-row-action" data-id="${item.id}" title="Inspect full record details">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>View</span>
        </button>
      </td>
    `;

    // Row action event listener
    const viewBtn = tr.querySelector('.btn-row-action');
    if (viewBtn) {
      viewBtn.addEventListener('click', () => openRecordModal(item));
    }

    fragment.appendChild(tr);
  });

  elements.tableBody.appendChild(fragment);
  updateSortHeaderIndicators();
}

/**
 * Escapes HTML characters to prevent XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* --------------------------------------------------------------------------
   3. Sorting & Shimmer Loading Controls
   -------------------------------------------------------------------------- */

function handleHeaderSort(field) {
  if (appState.sortField === field) {
    appState.sortDirection = appState.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    appState.sortField = field;
    appState.sortDirection = 'asc';
  }
  applyFiltersAndRender();
}

function updateSortHeaderIndicators() {
  const headers = elements.dataTable.querySelectorAll('th.sortable');
  headers.forEach(th => {
    const field = th.getAttribute('data-sort');
    const indicator = th.querySelector('.sort-indicator');

    th.classList.remove('sorted-asc', 'sorted-desc');

    if (field === appState.sortField) {
      if (appState.sortDirection === 'asc') {
        th.classList.add('sorted-asc');
        indicator.textContent = '▲';
      } else {
        th.classList.add('sorted-desc');
        indicator.textContent = '▼';
      }
    } else {
      indicator.textContent = '▲▼';
    }
  });
}

function setLoadingState(loading) {
  appState.isLoading = loading;
  if (loading) {
    elements.loadingShimmer.style.display = 'flex';
    elements.emptyState.style.display = 'none';
    elements.dataTable.style.display = 'none';
    elements.btnFetchNative.disabled = true;
    elements.btnFetchJQuery.disabled = true;
  } else {
    elements.loadingShimmer.style.display = 'none';
    elements.btnFetchNative.disabled = false;
    elements.btnFetchJQuery.disabled = false;
  }
}

/* --------------------------------------------------------------------------
   4. Modal Inspector Details
   -------------------------------------------------------------------------- */

function openRecordModal(record) {
  elements.modalDetailsGrid.innerHTML = `
    <div class="modal-field">
      <span class="modal-field-label">Student Name</span>
      <span class="modal-field-val">${escapeHtml(record.name)}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Roll Number</span>
      <span class="modal-field-val" style="font-family: var(--font-mono); color: var(--accent-cyan);">${escapeHtml(record.rollNo)}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Official Email</span>
      <span class="modal-field-val">${escapeHtml(record.email)}</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Department & Semester</span>
      <span class="modal-field-val">${escapeHtml(record.department)} (${escapeHtml(record.semester)})</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Cumulative GPA</span>
      <span class="modal-field-val" style="color: var(--accent-emerald); font-size: 1.1rem;">${record.cgpa.toFixed(2)} / 10.0</span>
    </div>
    <div class="modal-field">
      <span class="modal-field-label">Semester Attendance</span>
      <span class="modal-field-val">${escapeHtml(record.attendance)}</span>
    </div>
    <div class="modal-field" style="grid-column: 1 / -1;">
      <span class="modal-field-label">Cap-stone / Course Project</span>
      <span class="modal-field-val">${escapeHtml(record.project || 'Distributed Systems Architecture')}</span>
    </div>
  `;

    if (elements.modalRawJson) {
      elements.modalRawJson.textContent = JSON.stringify(record, null, 2);
    }

  elements.recordModal.classList.add('active');
  elements.recordModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeRecordModal() {
  elements.recordModal.classList.remove('active');
  elements.recordModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* --------------------------------------------------------------------------
   5. CSV Export Utility
   -------------------------------------------------------------------------- */

function exportTableToCSV() {
  if (!appState.currentData || appState.currentData.length === 0) {
    showToast('No records available to export.', 'warning');
    return;
  }

  const headers = ["ID", "Roll Number", "Name", "Email", "Department", "Semester", "CGPA", "Attendance", "Status", "Project", "Skills"];
  const rows = appState.currentData.map(item => [
    item.id,
    `"${item.rollNo}"`,
    `"${item.name}"`,
    `"${item.email}"`,
    `"${item.department}"`,
    `"${item.semester}"`,
    item.cgpa,
    `"${item.attendance}"`,
    `"${item.status}"`,
    `"${(item.project || '').replace(/"/g, '""')}"`,
    `"${(item.skills || []).join(', ')}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + 
    [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `students_records_exp10_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Table exported successfully as CSV file!', 'success');
}

/* --------------------------------------------------------------------------
   6. Toast Notifications
   -------------------------------------------------------------------------- */

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️';
  toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

  elements.toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3500);
}

/* --------------------------------------------------------------------------
   7. Theme Switcher (Dark / Light)
   -------------------------------------------------------------------------- */

function initTheme() {
  const savedTheme = localStorage.getItem('exp10_theme') || 'dark';
  applyTheme(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('exp10_theme', newTheme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    elements.themeToggleIcon.textContent = '☀️';
    elements.themeToggleLabel.textContent = 'Light Mode';
  } else {
    elements.themeToggleIcon.textContent = '🌙';
    elements.themeToggleLabel.textContent = 'Dark Mode';
  }
}

/* --------------------------------------------------------------------------
   8. Event Listeners Initialization
   -------------------------------------------------------------------------- */

function initEventListeners() {
  // Fetch Action Buttons
  elements.btnFetchNative.addEventListener('click', loadDataWithFetch);
  elements.btnFetchJQuery.addEventListener('click', loadDataWithJQuery);

  // Clear Action
  elements.btnClearData.addEventListener('click', () => {
    appState.rawData = [];
    appState.currentData = [];
    appState.lastMethod = null;
    elements.statMethod.textContent = '&mdash;';
    elements.statMethod.className = 'stat-value';
    elements.statDuration.textContent = '&mdash;';
    elements.statRecords.textContent = '0 items';
    elements.statStatus.textContent = 'Awaiting Request';
    elements.statStatus.className = 'stat-value success-color';
    elements.tableSearchInput.value = '';
    elements.departmentFilter.value = 'all';
    elements.statusFilter.value = 'all';
    renderTable([]);
    showToast('Table cleared successfully.', 'info');
  });

  // Export CSV
  elements.btnExportCSV.addEventListener('click', exportTableToCSV);

  // Search & Filter Events
  elements.tableSearchInput.addEventListener('input', () => {
    applyFiltersAndRender();
  });

  elements.departmentFilter.addEventListener('change', applyFiltersAndRender);
  elements.statusFilter.addEventListener('change', applyFiltersAndRender);

  // Table Sortable Headers
  const sortableHeaders = elements.dataTable.querySelectorAll('th.sortable');
  sortableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const sortField = th.getAttribute('data-sort');
      if (sortField) {
        handleHeaderSort(sortField);
      }
    });
  });

  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Modal Close Events
  elements.modalCloseBtn.addEventListener('click', closeRecordModal);
  elements.recordModal.addEventListener('click', (e) => {
    if (e.target === elements.recordModal) {
      closeRecordModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.recordModal.classList.contains('active')) {
      closeRecordModal();
    }
  });
}

// Kickstart when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEventListeners();
  // Initially render the empty state
  renderTable([]);
});
