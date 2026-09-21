/**
 * ==========================================================================
 * Case Study 10: Campus Event Registration System
 * Author: Anish Singh (PRN: 24070521214)
 * Course: Web Technologies Laboratory
 * Folder: Case Study 10/
 *
 * Requirements Implemented:
 * 1. Data loaded from students.json
 * 2. JavaScript fetch() API (async/await)
 * 3. Dynamic HTML Table rendering
 * 4. "Load Student Data" button
 * 5. Search box for student Name or PRN
 * 6. Status filter dropdown (Registered, Pending, Cancelled)
 * 7. jQuery $.getJSON() loading method
 * 8. Error message on failed load + empty filter message
 * ==========================================================================
 */

(function () {
  'use strict';

  // --- Embedded Dataset Fallback (Used if browser blocks file:// fetch via CORS) ---
  const FALLBACK_STUDENTS_DATA = [
    { studentName: "Anish Singh", prn: "24070521214", department: "Computer Science", year: "2nd Year", eventName: "Hackathon 2026", registrationStatus: "Registered" },
    { studentName: "Aarav Sharma", prn: "24070521001", department: "Information Technology", year: "3rd Year", eventName: "CodeSprint 2026", registrationStatus: "Registered" },
    { studentName: "Priya Patel", prn: "24070521015", department: "Artificial Intelligence", year: "2nd Year", eventName: "AI Symposium", registrationStatus: "Pending" },
    { studentName: "Rohan Kulkarni", prn: "24070521042", department: "Electronics & Telecom", year: "4th Year", eventName: "RoboWars Championship", registrationStatus: "Registered" },
    { studentName: "Sneha Iyer", prn: "24070521088", department: "Computer Science", year: "1st Year", eventName: "WebFest Hackathon", registrationStatus: "Cancelled" },
    { studentName: "Vikram Verma", prn: "24070521102", department: "Data Science", year: "3rd Year", eventName: "Datathon Challenge", registrationStatus: "Registered" },
    { studentName: "Ananya Joshi", prn: "24070521134", department: "Information Technology", year: "2nd Year", eventName: "CyberSecurity CTF", registrationStatus: "Pending" },
    { studentName: "Rahul Deshmukh", prn: "24070521156", department: "Mechanical Engineering", year: "4th Year", eventName: "CAD Designathon", registrationStatus: "Registered" },
    { studentName: "Pooja Nair", prn: "24070521178", department: "Artificial Intelligence", year: "3rd Year", eventName: "AI Symposium", registrationStatus: "Registered" },
    { studentName: "Aditya Mehta", prn: "24070521199", department: "Computer Science", year: "2nd Year", eventName: "Hackathon 2026", registrationStatus: "Cancelled" },
    { studentName: "Neha Gupta", prn: "24070521223", department: "Data Science", year: "1st Year", eventName: "CodeSprint 2026", registrationStatus: "Registered" },
    { studentName: "Siddharth Rao", prn: "24070521245", department: "Electronics & Telecom", year: "3rd Year", eventName: "RoboWars Championship", registrationStatus: "Pending" },
    { studentName: "Tanvi Shah", prn: "24070521267", department: "Information Technology", year: "4th Year", eventName: "WebFest Hackathon", registrationStatus: "Registered" },
    { studentName: "Harsh Vardhan", prn: "24070521289", department: "Computer Science", year: "3rd Year", eventName: "CyberSecurity CTF", registrationStatus: "Registered" },
    { studentName: "Ishita Sen", prn: "24070521301", department: "Artificial Intelligence", year: "2nd Year", eventName: "Datathon Challenge", registrationStatus: "Cancelled" },
    { studentName: "Karan Malhotra", prn: "24070521315", department: "Mechanical Engineering", year: "1st Year", eventName: "CAD Designathon", registrationStatus: "Pending" }
  ];

  // --- State Variables ---
  let allStudents = [];
  const DATA_FILE_URL = 'students.json';
  const INVALID_FILE_URL = 'students_invalid_error_test.json';

  // --- DOM References ---
  const loadDataBtn = document.getElementById('loadDataBtn');
  const initialLoadBtn = document.getElementById('initialLoadBtn');
  const quickFetchBtn = document.getElementById('quickFetchBtn');
  const quickJqueryBtn = document.getElementById('quickJqueryBtn');
  const simulateErrorBtn = document.getElementById('simulateErrorBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const retryFetchBtn = document.getElementById('retryFetchBtn');
  const loadDefaultBtn = document.getElementById('loadDefaultBtn');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const statusFilter = document.getElementById('statusFilter');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const clearFiltersActionBtn = document.getElementById('clearFiltersActionBtn');

  const methodFetchRadio = document.getElementById('methodFetchRadio');
  const methodJqueryRadio = document.getElementById('methodJqueryRadio');
  const labelFetch = document.getElementById('label-fetch');
  const labelJquery = document.getElementById('label-jquery');
  const currentMethodBadge = document.getElementById('currentMethodBadge');

  const initialState = document.getElementById('initialState');
  const loadingState = document.getElementById('loadingState');
  const loadingDescription = document.getElementById('loadingDescription');
  const errorState = document.getElementById('errorState');
  const errorMessageTitle = document.getElementById('errorMessageTitle');
  const errorMessageDetail = document.getElementById('errorMessageDetail');
  const noMatchState = document.getElementById('noMatchState');
  const noMatchMessage = document.getElementById('noMatchMessage');
  const tableWrapper = document.getElementById('tableWrapper');
  const tableBody = document.getElementById('tableBody');
  const tableRecordSummary = document.getElementById('tableRecordSummary');

  // Counters
  const totalCountEl = document.getElementById('totalCount');
  const registeredCountEl = document.getElementById('registeredCount');
  const pendingCountEl = document.getElementById('pendingCount');
  const cancelledCountEl = document.getElementById('cancelledCount');
  const matchCountEl = document.getElementById('matchCount');

  // Status Banner
  const statusBanner = document.getElementById('statusBanner');
  const statusBannerIcon = document.getElementById('statusBannerIcon');
  const statusBannerMessage = document.getElementById('statusBannerMessage');
  const closeBannerBtn = document.getElementById('closeBannerBtn');

  // Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeToggleIcon = document.getElementById('themeToggleIcon');
  const themeToggleLabel = document.getElementById('themeToggleLabel');

  // ==========================================================================
  // 1. DATA LOADING METHODS (fetch vs $.getJSON)
  // ==========================================================================

  /**
   * Method 1: Native JavaScript fetch() API (Requirement #2)
   */
  async function loadWithFetch(url) {
    showLoadingUI('Loading data using Native JavaScript fetch()...');
    updateMethodBadge('Loading via fetch()...');

    // If simulating error intentionally, trigger immediate failure
    if (url === INVALID_FILE_URL) {
      setTimeout(() => {
        handleLoadError(
          'JSON Data Cannot Be Loaded (Simulation)',
          `Failed to load resource: HTTP 404 Not Found for "${INVALID_FILE_URL}".`
        );
      }, 400);
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: Failed to load "${url}"`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid JSON format: Expected an array of student records.');
      }
      handleLoadSuccess(data, 'Native JavaScript fetch()');
    } catch (error) {
      console.warn('Fetch request encountered error:', error);

      // Handle browser file:// protocol restriction (CORS on local files in Chrome)
      if (window.location.protocol === 'file:') {
        console.info('Direct file:// access detected. Utilizing fallback dataset.');
        handleLoadSuccess(
          FALLBACK_STUDENTS_DATA,
          'Native JavaScript fetch() [Local file:// Fallback]'
        );
      } else {
        handleLoadError(
          'JSON data cannot be loaded via fetch()',
          `Error details: ${error.message}. Please verify file path or local HTTP server.`
        );
      }
    }
  }

  /**
   * Method 2: jQuery $.getJSON() API (Requirement #7)
   */
  function loadWithJQuery(url) {
    showLoadingUI('Loading data using jQuery $.getJSON()...');
    updateMethodBadge('Loading via $.getJSON()...');

    // If simulating error intentionally
    if (url === INVALID_FILE_URL) {
      setTimeout(() => {
        handleLoadError(
          'JSON Data Cannot Be Loaded via jQuery (Simulation)',
          `jQuery $.getJSON() failed: HTTP 404 for "${INVALID_FILE_URL}".`
        );
      }, 400);
      return;
    }

    // Check if jQuery is loaded
    if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
      // Fallback if jQuery script tag was blocked
      if (window.location.protocol === 'file:') {
        handleLoadSuccess(FALLBACK_STUDENTS_DATA, 'jQuery $.getJSON() [Local Fallback]');
        return;
      }
      handleLoadError(
        'jQuery Library Not Found',
        'The jQuery library was not loaded. Please ensure jquery-3.7.1.min.js exists.'
      );
      return;
    }

    $.getJSON(url)
      .done(function (data) {
        if (!Array.isArray(data)) {
          handleLoadError('Invalid JSON format', 'Expected array of student records.');
          return;
        }
        handleLoadSuccess(data, 'jQuery $.getJSON()');
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.warn('jQuery $.getJSON error:', textStatus, errorThrown);

        if (window.location.protocol === 'file:') {
          console.info('Direct file:// access detected for jQuery. Utilizing fallback dataset.');
          handleLoadSuccess(FALLBACK_STUDENTS_DATA, 'jQuery $.getJSON() [Local file:// Fallback]');
        } else {
          const status = jqXHR.status ? `HTTP ${jqXHR.status}` : textStatus;
          handleLoadError(
            'JSON data cannot be loaded via jQuery $.getJSON()',
            `Status: ${status} (${errorThrown || 'Network request failed'}).`
          );
        }
      });
  }

  /**
   * Unified dispatcher: Requirement #4 ("Load Student Data" button)
   */
  function triggerLoadData(url = DATA_FILE_URL) {
    const isJQuery = methodJqueryRadio && methodJqueryRadio.checked;
    if (isJQuery) {
      loadWithJQuery(url);
    } else {
      loadWithFetch(url);
    }
  }

  // ==========================================================================
  // 2. UI STATE MANAGEMENT & FEEDBACK
  // ==========================================================================

  function showLoadingUI(description) {
    if (initialState) initialState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (noMatchState) noMatchState.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'none';

    if (loadingDescription) loadingDescription.textContent = description;
    if (loadingState) loadingState.style.display = 'flex';
  }

  function handleLoadSuccess(data, methodName) {
    allStudents = data;

    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (initialState) initialState.style.display = 'none';

    if (searchInput) searchInput.disabled = false;
    if (statusFilter) statusFilter.disabled = false;
    if (resetFiltersBtn) resetFiltersBtn.disabled = false;
    if (refreshBtn) refreshBtn.style.display = 'inline-flex';

    updateStatsCounters(allStudents);
    filterAndRenderTable();

    showBanner(
      `Successfully loaded ${allStudents.length} student event registrations using ${methodName}.`,
      'success'
    );
    updateMethodBadge(`Loaded via ${methodName.includes('jQuery') ? 'jQuery $.getJSON()' : 'fetch()'}`);
  }

  /**
   * Requirement #8: "Display an appropriate message if JSON data cannot be loaded."
   */
  function handleLoadError(title, detail) {
    allStudents = [];

    if (loadingState) loadingState.style.display = 'none';
    if (initialState) initialState.style.display = 'none';
    if (noMatchState) noMatchState.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'none';

    if (errorMessageTitle) errorMessageTitle.textContent = title;
    if (errorMessageDetail) errorMessageDetail.textContent = detail;
    if (errorState) errorState.style.display = 'flex';

    if (searchInput) {
      searchInput.disabled = true;
      searchInput.value = '';
    }
    if (statusFilter) {
      statusFilter.disabled = true;
      statusFilter.value = 'ALL';
    }
    if (resetFiltersBtn) resetFiltersBtn.disabled = true;

    updateStatsCounters([]);
    if (matchCountEl) matchCountEl.textContent = '0';
    if (tableRecordSummary) tableRecordSummary.textContent = 'Data loading failed';

    showBanner(title + ': ' + detail, 'error');
    updateMethodBadge('Load Error ⚠️');
  }

  function updateMethodBadge(text) {
    if (currentMethodBadge) currentMethodBadge.textContent = text;
  }

  function showBanner(message, type = 'info') {
    if (!statusBanner) return;
    statusBanner.className = `status-banner ${type}`;
    if (statusBannerIcon) {
      if (type === 'success') statusBannerIcon.textContent = '✅';
      else if (type === 'error') statusBannerIcon.textContent = '⚠️';
      else statusBannerIcon.textContent = 'ℹ️';
    }
    if (statusBannerMessage) statusBannerMessage.textContent = message;
    statusBanner.style.display = 'flex';
  }

  function hideBanner() {
    if (statusBanner) statusBanner.style.display = 'none';
  }

  // ==========================================================================
  // 3. SEARCH & FILTERING (Requirements #5 & #6)
  // ==========================================================================

  function filterAndRenderTable() {
    if (!allStudents || allStudents.length === 0) return;

    const searchTerm = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const selectedStatus = (statusFilter ? statusFilter.value : 'ALL');

    if (clearSearchBtn) {
      clearSearchBtn.style.display = searchTerm.length > 0 ? 'inline-block' : 'none';
    }

    const filteredList = allStudents.filter(student => {
      // Status Filter
      const status = (student.registrationStatus || student['Registration Status'] || '').trim();
      const statusMatches = (selectedStatus === 'ALL' || status.toLowerCase() === selectedStatus.toLowerCase());
      if (!statusMatches) return false;

      // Search Filter (Name or PRN)
      if (!searchTerm) return true;
      const name = (student.studentName || student['Student Name'] || '').toLowerCase();
      const prn = (student.prn || student['PRN'] || '').toLowerCase();
      return name.includes(searchTerm) || prn.includes(searchTerm);
    });

    if (matchCountEl) matchCountEl.textContent = filteredList.length;

    // Requirement #8: "Display an appropriate message if no student matches the search/filter criteria."
    if (filteredList.length === 0) {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (noMatchState) {
        let msg = 'No student records match your criteria.';
        if (searchTerm && selectedStatus !== 'ALL') {
          msg = `No students found matching query "${searchTerm}" with status "${selectedStatus}".`;
        } else if (searchTerm) {
          msg = `No students found with name or PRN containing "${searchTerm}".`;
        } else if (selectedStatus !== 'ALL') {
          msg = `No students found with registration status "${selectedStatus}".`;
        }
        if (noMatchMessage) noMatchMessage.textContent = msg;
        noMatchState.style.display = 'flex';
      }
      if (tableRecordSummary) {
        tableRecordSummary.textContent = `0 of ${allStudents.length} records`;
      }
    } else {
      if (noMatchState) noMatchState.style.display = 'none';
      if (tableWrapper) tableWrapper.style.display = 'block';

      renderTableRows(filteredList, searchTerm);

      if (tableRecordSummary) {
        tableRecordSummary.textContent = `Showing ${filteredList.length} of ${allStudents.length} students`;
      }
    }
  }

  // ==========================================================================
  // 4. DYNAMIC HTML TABLE RENDERING (Requirement #3)
  // ==========================================================================

  function renderTableRows(students, highlightTerm = '') {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    const fragment = document.createDocumentFragment();

    students.forEach((student, index) => {
      const tr = document.createElement('tr');

      const name = student.studentName || student['Student Name'] || 'N/A';
      const prn = student.prn || student['PRN'] || 'N/A';
      const department = student.department || student['Department'] || 'N/A';
      const year = student.year || student['Year'] || 'N/A';
      const eventName = student.eventName || student['Event Name'] || 'N/A';
      const status = (student.registrationStatus || student['Registration Status'] || 'Pending').trim();

      const statusClass = status.toLowerCase();

      const highlightedName = highlightSubstring(name, highlightTerm);
      const highlightedPRN = highlightSubstring(prn, highlightTerm);

      tr.innerHTML = `
        <td class="row-index">${index + 1}</td>
        <td class="student-name">${highlightedName}</td>
        <td class="student-prn">${highlightedPRN}</td>
        <td class="student-dept">${escapeHTML(department)}</td>
        <td><span class="student-year">${escapeHTML(year)}</span></td>
        <td class="student-event">${escapeHTML(eventName)}</td>
        <td style="text-align: center;">
          <span class="status-badge ${statusClass}">
            <span class="status-dot"></span>
            ${escapeHTML(status)}
          </span>
        </td>
      `;

      fragment.appendChild(tr);
    });

    tableBody.appendChild(fragment);
  }

  function highlightSubstring(text, query) {
    if (!query) return escapeHTML(text);
    const escapedText = escapeHTML(text);
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    return escapedText.replace(regex, '<mark class="highlight">$1</mark>');
  }

  function escapeHTML(str) {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ==========================================================================
  // 5. METRICS / STATS CALCULATOR
  // ==========================================================================

  function updateStatsCounters(students) {
    const total = students.length;
    let registered = 0;
    let pending = 0;
    let cancelled = 0;

    students.forEach(s => {
      const status = (s.registrationStatus || s['Registration Status'] || '').trim().toLowerCase();
      if (status === 'registered') registered++;
      else if (status === 'pending') pending++;
      else if (status === 'cancelled') cancelled++;
    });

    if (totalCountEl) totalCountEl.textContent = total;
    if (registeredCountEl) registeredCountEl.textContent = registered;
    if (pendingCountEl) pendingCountEl.textContent = pending;
    if (cancelledCountEl) cancelledCountEl.textContent = cancelled;
    if (matchCountEl) matchCountEl.textContent = total;
  }

  // ==========================================================================
  // 6. EVENT LISTENERS
  // ==========================================================================

  function setupEventListeners() {
    // Requirement #4: "Load Student Data" button
    if (loadDataBtn) {
      loadDataBtn.addEventListener('click', () => triggerLoadData(DATA_FILE_URL));
    }
    if (initialLoadBtn) {
      initialLoadBtn.addEventListener('click', () => triggerLoadData(DATA_FILE_URL));
    }

    // Direct Quick-Action Buttons
    if (quickFetchBtn) {
      quickFetchBtn.addEventListener('click', () => {
        setMethodSelection('fetch');
        loadWithFetch(DATA_FILE_URL);
      });
    }

    if (quickJqueryBtn) {
      quickJqueryBtn.addEventListener('click', () => {
        setMethodSelection('jquery');
        loadWithJQuery(DATA_FILE_URL);
      });
    }

    // Requirement #8 Error Simulation
    if (simulateErrorBtn) {
      simulateErrorBtn.addEventListener('click', () => {
        triggerLoadData(INVALID_FILE_URL);
      });
    }

    if (retryFetchBtn) retryFetchBtn.addEventListener('click', () => triggerLoadData(DATA_FILE_URL));
    if (loadDefaultBtn) loadDefaultBtn.addEventListener('click', () => triggerLoadData(DATA_FILE_URL));
    if (refreshBtn) refreshBtn.addEventListener('click', () => triggerLoadData(DATA_FILE_URL));

    // Requirement #5 Search Box
    if (searchInput) {
      searchInput.addEventListener('input', filterAndRenderTable);
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        filterAndRenderTable();
      });
    }

    // Requirement #6 Status Filter
    if (statusFilter) {
      statusFilter.addEventListener('change', filterAndRenderTable);
    }

    // Reset Filters
    const handleReset = () => {
      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = 'ALL';
      filterAndRenderTable();
    };

    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', handleReset);
    if (clearFiltersActionBtn) clearFiltersActionBtn.addEventListener('click', handleReset);

    // Method Radio Toggle
    if (methodFetchRadio) {
      methodFetchRadio.addEventListener('change', () => setMethodSelection('fetch'));
    }
    if (methodJqueryRadio) {
      methodJqueryRadio.addEventListener('change', () => setMethodSelection('jquery'));
    }

    // Banner close
    if (closeBannerBtn) closeBannerBtn.addEventListener('click', hideBanner);

    // Theme Toggle
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  }

  function setMethodSelection(method) {
    if (method === 'jquery') {
      if (methodJqueryRadio) methodJqueryRadio.checked = true;
      if (labelJquery) labelJquery.classList.add('active');
      if (labelFetch) labelFetch.classList.remove('active');
      updateMethodBadge('Method: jQuery $.getJSON()');
    } else {
      if (methodFetchRadio) methodFetchRadio.checked = true;
      if (labelFetch) labelFetch.classList.add('active');
      if (labelJquery) labelJquery.classList.remove('active');
      updateMethodBadge('Method: JavaScript fetch()');
    }
  }

  // ==========================================================================
  // 7. THEME TOGGLING (Pure Black Dark Theme vs Crisp White Light Theme)
  // ==========================================================================

  function initTheme() {
    const savedTheme = localStorage.getItem('cs10_theme') || 'dark';
    applyTheme(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('cs10_theme', newTheme);
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
      if (themeToggleLabel) themeToggleLabel.textContent = 'Light Theme';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
      if (themeToggleLabel) themeToggleLabel.textContent = 'Dark Theme';
    }
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupEventListeners();
  });

})();
