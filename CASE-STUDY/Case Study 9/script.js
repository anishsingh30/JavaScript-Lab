/**
 * Case Study 9: Multi-Tab Practical 1–8 Integrated Web Application
 * Developer: ANISH SINGH (PRN: 24070521214)
 * Includes persistent Light/Dark theme via localStorage and unified Practical 1-8 modules.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. UNIVERSAL THEME MANAGER (LIGHT / DARK THEME + LOCALSTORAGE PERSISTENCE)
  // ==========================================================================
  const THEME_STORAGE_KEY = 'case9_app_theme';
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  function getStoredTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark Mode';
    } else {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light Mode';
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  // Toggle on button click
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
  });

  // Initialize saved theme
  applyTheme(getStoredTheme());


  // ==========================================================================
  // 2. COLLAPSIBLE MENU & MULTI-TAB NAVIGATION SYSTEM
  // ==========================================================================
  const TAB_STORAGE_KEY = 'case9_active_tab';
  const MENU_COLLAPSE_KEY = 'case9_menu_collapsed';
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const currentPracticalTag = document.getElementById('currentPracticalTag');
  const toggleMenuBtn = document.getElementById('toggleMenuBtn');
  const menuToggleText = document.getElementById('menuToggleText');
  const collapsibleMenuBody = document.getElementById('collapsibleMenuBody');

  // Toggle Collapse / Expand
  function setMenuCollapsed(collapsed) {
    if (collapsed) {
      collapsibleMenuBody.classList.add('collapsed');
      toggleMenuBtn.classList.add('collapsed');
      menuToggleText.textContent = 'Expand Menu';
      toggleMenuBtn.setAttribute('aria-expanded', 'false');
    } else {
      collapsibleMenuBody.classList.remove('collapsed');
      toggleMenuBtn.classList.remove('collapsed');
      menuToggleText.textContent = 'Collapse Menu';
      toggleMenuBtn.setAttribute('aria-expanded', 'true');
    }
    localStorage.setItem(MENU_COLLAPSE_KEY, collapsed ? 'true' : 'false');
  }

  if (toggleMenuBtn) {
    toggleMenuBtn.addEventListener('click', () => {
      const isCurrentlyCollapsed = collapsibleMenuBody.classList.contains('collapsed');
      setMenuCollapsed(!isCurrentlyCollapsed);
    });

    const isSavedCollapsed = localStorage.getItem(MENU_COLLAPSE_KEY) === 'true';
    if (isSavedCollapsed) {
      setMenuCollapsed(true);
    }
  }

  function activateTab(tabId) {
    let activeName = '';
    tabButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      if (isTarget) {
        activeName = btn.getAttribute('data-name') || btn.querySelector('strong')?.textContent || 'Practical';
      }
    });

    if (currentPracticalTag && activeName) {
      currentPracticalTag.textContent = activeName;
    }

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    localStorage.setItem(TAB_STORAGE_KEY, tabId);
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      activateTab(targetTab);
    });
  });

  // Restore previous active tab or default to tab-1 (Practical 1)
  const savedTab = localStorage.getItem(TAB_STORAGE_KEY) || 'tab-1';
  if (document.getElementById(savedTab)) {
    activateTab(savedTab);
  }


  // ==========================================================================
  // 3. TAB 7: STUDENT TASK MANAGEMENT (PRACTICAL 7 & CORE CASE STUDY)
  // ==========================================================================
  const TASK_STORAGE_KEY = 'case9_student_tasks_list';
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const categorySelect = document.getElementById('category-select');
  const prioritySelect = document.getElementById('priority-select');
  const searchInput = document.getElementById('search-input');
  const filterButtons = document.querySelectorAll('#filter-tabs .filter-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const itemsLeftCount = document.getElementById('items-left-count');
  const itemsCompletedCount = document.getElementById('items-completed-count');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  let currentFilter = 'all';
  let searchQuery = '';

  function loadInitialTasks() {
    const saved = localStorage.getItem(TASK_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [
      { id: 'task_1', title: 'Submit Case Study 9 with Light & Dark Theme', category: 'Study', priority: 'High', completed: true },
      { id: 'task_2', title: 'Review JavaScript Closures and Scope (Case Study 4)', category: 'Study', priority: 'Medium', completed: false },
      { id: 'task_3', title: 'Test Form Validation DOM Events (Case Study 8)', category: 'Work', priority: 'Low', completed: false }
    ];
  }

  let tasks = loadInitialTasks();

  function saveTasks() {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = '';

    const filtered = tasks.filter(task => {
      const matchesFilter = currentFilter === 'all' ||
        (currentFilter === 'active' && !task.completed) ||
        (currentFilter === 'completed' && task.completed);
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
          <div class="task-left">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-title">${escapeHTML(task.title)}</span>
          </div>
          <div class="task-meta">
            <span class="task-pill pill-${task.category}">${task.category}</span>
            <span class="task-pill priority-${task.priority}">${task.priority}</span>
          </div>
          <div class="task-actions">
            <button type="button" class="btn-icon edit-btn" data-id="${task.id}" title="Edit Task">✏️</button>
            <button type="button" class="btn-icon delete delete-btn" data-id="${task.id}" title="Delete Task">🗑️</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }

    // Update counters
    const activeCount = tasks.filter(t => !t.completed).length;
    const compCount = tasks.filter(t => t.completed).length;
    itemsLeftCount.textContent = `${activeCount} task${activeCount === 1 ? '' : 's'} left`;
    itemsCompletedCount.textContent = `${compCount} completed`;
  }

  // Add Task
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    tasks.unshift({
      id: 'task_' + Date.now(),
      title: title,
      category: categorySelect.value,
      priority: prioritySelect.value,
      completed: false
    });

    taskInput.value = '';
    saveTasks();
  });

  // Task list events (Checkbox toggle, Edit, Delete)
  taskList.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    if (e.target.classList.contains('task-checkbox')) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = e.target.checked;
        saveTasks();
      }
    } else if (e.target.closest('.delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
    } else if (e.target.closest('.edit-btn')) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const newTitle = prompt('Edit Task Description:', task.title);
        if (newTitle !== null && newTitle.trim() !== '') {
          task.title = newTitle.trim();
          saveTasks();
        }
      }
    }
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTasks();
  });

  // Filter tabs
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });

  // Clear completed
  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
  });

  renderTasks();


  // ==========================================================================
  // 4. TAB 1: PRACTICAL 1 (COLLEGE & STUDENT INFO)
  // ==========================================================================
  window.cs1DisplayWelcome = function() {
    alert("Welcome to Symbiosis Institute of Technology, Nagpur!\n\nStudent: Anish Singh\nPRN: 24070521214\nDepartment: Computer Science and Engineering (2nd Year)");
  };

  window.cs1ShowFullDetails = function() {
    const infoBox = document.getElementById('cs1-full-info');
    infoBox.classList.toggle('hidden');
  };


  // ==========================================================================
  // 5. TAB 2: PRACTICAL 2 (ONLINE SHOPPING BILL CALCULATOR)
  // ==========================================================================
  window.cs2CalculateBill = function() {
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const ratePerKg = parseFloat(document.getElementById('ratePerKg').value) || 0;
    const discountPercent = parseFloat(document.getElementById('discount').value) || 0;
    const gstPercent = parseFloat(document.getElementById('gst').value) || 0;
    const packingCharges = parseFloat(document.getElementById('packingCharges').value) || 0;

    const productCost = quantity * ratePerKg;
    const discountAmount = (productCost * discountPercent) / 100;
    const subtotal = productCost - discountAmount;
    const gstAmount = (subtotal * gstPercent) / 100;
    const totalBill = subtotal + gstAmount + packingCharges;

    document.getElementById('productCost').textContent = productCost.toFixed(2);
    document.getElementById('discountPercent').textContent = discountPercent.toFixed(2);
    document.getElementById('discountAmount').textContent = discountAmount.toFixed(2);
    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('gstPercent').textContent = gstPercent.toFixed(2);
    document.getElementById('gstAmount').textContent = gstAmount.toFixed(2);
    document.getElementById('packingAmount').textContent = packingCharges.toFixed(2);
    document.getElementById('totalBill').textContent = totalBill.toFixed(2);
  };

  window.cs2ResetBill = function() {
    document.getElementById('shoppingForm').reset();
    cs2CalculateBill();
  };

  ['quantity', 'ratePerKg', 'discount', 'gst', 'packingCharges'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', cs2CalculateBill);
  });
  cs2CalculateBill();


  // ==========================================================================
  // 6. TAB 3: PRACTICAL 3 (SCHOLARSHIP ELIGIBILITY CHECKER)
  // ==========================================================================
  window.cs3SetMarks = function(val) {
    document.getElementById('marks').value = val;
    cs3CheckScholarship();
  };

  window.cs3CheckScholarship = function() {
    const marksInput = document.getElementById('marks');
    const resultDiv = document.getElementById('cs3-result');
    const marks = parseInt(marksInput.value, 10);

    if (isNaN(marks) || marks < 0 || marks > 100) {
      resultDiv.textContent = 'Please enter a valid mark between 0 and 100.';
      resultDiv.className = 'cs3-result-card not-eligible';
      resultDiv.classList.remove('hidden');
      return;
    }

    let scholarship = '';
    let tierClass = '';
    let perk = '';

    if (marks >= 95) {
      scholarship = 'Platinum Scholarship';
      tierClass = 'platinum';
      perk = 'Award: 100% Full Tuition Waiver';
    } else if (marks >= 85) {
      scholarship = 'Gold Scholarship';
      tierClass = 'gold';
      perk = 'Award: 75% Tuition Fee Waiver';
    } else if (marks >= 70) {
      scholarship = 'Silver Scholarship';
      tierClass = 'silver';
      perk = 'Award: 50% Tuition Fee Waiver';
    } else if (marks >= 50) {
      scholarship = 'Bronze Scholarship';
      tierClass = 'bronze';
      perk = 'Award: 25% Tuition Fee Waiver';
    } else {
      scholarship = 'Not Eligible';
      tierClass = 'not-eligible';
      perk = 'Requires minimum 50 marks to qualify.';
    }

    resultDiv.textContent = `Marks Scored: ${marks}/100\nResult: ${scholarship}\n(${perk})`;
    resultDiv.className = `cs3-result-card ${tierClass}`;
    resultDiv.classList.remove('hidden');
  };

  const marksInputEl = document.getElementById('marks');
  if (marksInputEl) {
    marksInputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') cs3CheckScholarship();
    });
  }


  // ==========================================================================
  // 7. TAB 4: PRACTICAL 4 (ATM PIN PALINDROME & SECURITY MODULE)
  // ==========================================================================
  // Closure Session Tracker
  function createAtmTracker() {
    let checksCount = 0;
    let palCount = 0;
    let stdCount = 0;

    return {
      logAttempt: function(isPal) {
        checksCount++;
        if (isPal) palCount++; else stdCount++;
        return { total: checksCount, pal: palCount, std: stdCount };
      },
      reset: function() {
        checksCount = 0;
        palCount = 0;
        stdCount = 0;
        return { total: 0, pal: 0, std: 0 };
      }
    };
  }

  const atmTracker = createAtmTracker();
  const pinInput = document.getElementById('pinInput');
  const toggleMaskBtn = document.getElementById('toggleMaskBtn');
  let isMasked = true;

  toggleMaskBtn.addEventListener('click', () => {
    isMasked = !isMasked;
    pinInput.type = isMasked ? 'password' : 'text';
    toggleMaskBtn.textContent = isMasked ? '👁️ Show PIN' : '🔒 Hide PIN';
  });

  window.cs4TypeKey = function(key) {
    if (pinInput.value.length < 8) {
      pinInput.value += key;
    }
  };

  window.cs4DeleteKey = function() {
    pinInput.value = pinInput.value.slice(0, -1);
  };

  window.cs4ClearPIN = function() {
    pinInput.value = '';
    document.getElementById('cs4-orig-pin').textContent = '----';
    document.getElementById('cs4-rev-pin').textContent = '----';
    document.getElementById('cs4-verdict-text').textContent = 'Waiting';
    document.getElementById('cs4-badge').textContent = 'READY FOR INPUT';
    document.getElementById('cs4-badge').className = 'verdict-status-badge';
    document.getElementById('cs4-title').textContent = 'Enter PIN to begin check';
    document.getElementById('cs4-message').textContent = 'Input your PIN on the keypad and click "Verify PIN Symmetry".';
  };

  window.cs4SetPIN = function(val) {
    pinInput.value = val;
    cs4VerifyPIN();
  };

  window.cs4VerifyPIN = function() {
    const pin = pinInput.value.trim();
    if (pin.length < 4) {
      alert('Please enter at least a 4-digit PIN for verification.');
      return;
    }

    const reversed = pin.split('').reverse().join('');
    const isPalindrome = pin === reversed;
    const stats = atmTracker.logAttempt(isPalindrome);

    document.getElementById('cs4-orig-pin').textContent = pin;
    document.getElementById('cs4-rev-pin').textContent = reversed;
    document.getElementById('cs4-verdict-text').textContent = isPalindrome ? 'PALINDROME DETECTED' : 'Standard Non-Symmetric';
    
    const badge = document.getElementById('cs4-badge');
    const title = document.getElementById('cs4-title');
    const msg = document.getElementById('cs4-message');

    if (isPalindrome) {
      badge.textContent = 'PALINDROMIC SYMMETRY DETECTED';
      badge.className = 'verdict-status-badge palindromic';
      title.textContent = 'High-Symmetry Security Alert';
      msg.textContent = `The entered PIN ${pin} reads identically forwards and backward (${reversed}).`;
    } else {
      badge.textContent = 'STANDARD ASYMMETRIC PIN';
      badge.className = 'verdict-status-badge standard';
      title.textContent = 'Standard Authentication Format';
      msg.textContent = `The entered PIN ${pin} reverses to ${reversed}, fulfilling standard asymmetry.`;
    }

    document.getElementById('cs4-stat-total').textContent = stats.total;
    document.getElementById('cs4-stat-pal').textContent = stats.pal;
    document.getElementById('cs4-stat-std').textContent = stats.std;
  };


  // ==========================================================================
  // 8. TAB 5: PRACTICAL 5 (ARRAYS & MIN/MAX PLAYGROUND)
  // ==========================================================================
  let arrayData = [25, 10, 45, 5, 30, 15];
  const pillsContainer = document.getElementById('arrayPillsContainer');
  const statMinVal = document.getElementById('statMinVal');
  const statMaxVal = document.getElementById('statMaxVal');
  const statCountVal = document.getElementById('statCountVal');
  const statSumVal = document.getElementById('statSumVal');
  const cs5AddInput = document.getElementById('cs5AddInput');
  const cs5MethodOutput = document.getElementById('cs5-method-output');

  function updateCs5UI(bannerMsg) {
    pillsContainer.innerHTML = '';

    if (arrayData.length === 0) {
      pillsContainer.innerHTML = '<span style="color: var(--text-muted); font-size: 0.9rem;">Array is currently empty.</span>';
      statMinVal.textContent = '-';
      statMaxVal.textContent = '-';
      statCountVal.textContent = '0';
      statSumVal.textContent = '0';
      return;
    }

    const min = Math.min(...arrayData);
    const max = Math.max(...arrayData);
    const sum = arrayData.reduce((acc, curr) => acc + curr, 0);

    statMinVal.textContent = min;
    statMaxVal.textContent = max;
    statCountVal.textContent = arrayData.length;
    statSumVal.textContent = sum;

    arrayData.forEach(num => {
      const pill = document.createElement('div');
      pill.className = 'array-pill';
      if (num === min) pill.classList.add('is-min');
      if (num === max) pill.classList.add('is-max');
      pill.textContent = num;
      pillsContainer.appendChild(pill);
    });

    if (bannerMsg) {
      cs5MethodOutput.textContent = bannerMsg;
      cs5MethodOutput.classList.remove('hidden');
    }
  }

  window.cs5LoadPreset = function(arr) {
    arrayData = [...arr];
    updateCs5UI(`Loaded slide preset array: [${arrayData.join(', ')}]`);
  };

  window.cs5Randomize = function() {
    arrayData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
    updateCs5UI(`Generated random array: [${arrayData.join(', ')}]`);
  };

  window.cs5SortAsc = function() {
    arrayData.sort((a, b) => a - b);
    updateCs5UI(`Sorted ascending: [${arrayData.join(', ')}]`);
  };

  window.cs5SortDesc = function() {
    arrayData.sort((a, b) => b - a);
    updateCs5UI(`Sorted descending: [${arrayData.join(', ')}]`);
  };

  window.cs5Push = function() {
    const val = parseInt(cs5AddInput.value, 10);
    if (isNaN(val)) return alert('Enter a valid number to push.');
    arrayData.push(val);
    cs5AddInput.value = '';
    updateCs5UI(`Executed push(${val})`);
  };

  window.cs5Unshift = function() {
    const val = parseInt(cs5AddInput.value, 10);
    if (isNaN(val)) return alert('Enter a valid number to unshift.');
    arrayData.unshift(val);
    cs5AddInput.value = '';
    updateCs5UI(`Executed unshift(${val})`);
  };

  window.cs5Pop = function() {
    if (arrayData.length === 0) return;
    const removed = arrayData.pop();
    updateCs5UI(`Executed pop() -> removed ${removed}`);
  };

  window.cs5Shift = function() {
    if (arrayData.length === 0) return;
    const removed = arrayData.shift();
    updateCs5UI(`Executed shift() -> removed ${removed}`);
  };

  window.cs5Reset = function() {
    arrayData = [25, 10, 45, 5, 30, 15];
    updateCs5UI('Reset array to default [25, 10, 45, 5, 30, 15]');
  };

  window.cs5MapDouble = function() {
    arrayData = arrayData.map(n => n * 2);
    updateCs5UI('Executed map(n => n * 2)');
  };

  window.cs5FilterEvens = function() {
    arrayData = arrayData.filter(n => n % 2 === 0);
    updateCs5UI('Executed filter(n => n % 2 === 0)');
  };

  window.cs5ReduceSum = function() {
    const sum = arrayData.reduce((acc, curr) => acc + curr, 0);
    updateCs5UI(`Executed reduce((acc, curr) => acc + curr, 0) -> Sum is ${sum}`);
  };

  updateCs5UI();


  // ==========================================================================
  // 9. TAB 6: PRACTICAL 6 (VOWEL COUNTER & STRING REVERSER)
  // ==========================================================================
  const paragraphInput = document.getElementById('paragraph-input');
  const totalVowelsCount = document.getElementById('total-vowels-count');
  const countA = document.getElementById('count-a');
  const countE = document.getElementById('count-e');
  const countI = document.getElementById('count-i');
  const countO = document.getElementById('count-o');
  const countU = document.getElementById('count-u');
  const highlightedOutput = document.getElementById('highlighted-output');

  function scanVowels() {
    const text = paragraphInput.value;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const counts = { a: 0, e: 0, i: 0, o: 0, u: 0 };
    let total = 0;
    let html = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const lower = char.toLowerCase();
      if (vowels.includes(lower)) {
        counts[lower]++;
        total++;
        html += `<span class="vowel-mark">${escapeHTML(char)}</span>`;
      } else {
        html += escapeHTML(char);
      }
    }

    totalVowelsCount.textContent = total;
    countA.textContent = counts.a;
    countE.textContent = counts.e;
    countI.textContent = counts.i;
    countO.textContent = counts.o;
    countU.textContent = counts.u;
    highlightedOutput.innerHTML = html.replace(/\n/g, '<br>') || '<span style="color: var(--text-muted);">No text entered...</span>';
  }

  paragraphInput.addEventListener('input', scanVowels);

  window.cs6SetSample = function(idx) {
    if (idx === 1) {
      paragraphInput.value = "Symbiosis Institute of Technology Nagpur provides world class education in Computer Science and Engineering.";
    } else {
      paragraphInput.value = "The quick brown fox jumps over the lazy dog. Programming in JavaScript is engaging and versatile.";
    }
    scanVowels();
  };

  window.cs6ClearText = function() {
    paragraphInput.value = '';
    scanVowels();
  };

  scanVowels();

  // String Reverser
  const reverserInput = document.getElementById('reverser-input');
  const reversedOutput = document.getElementById('reversed-output');
  const strLengthVal = document.getElementById('str-length-val');
  const palindromeVerdict = document.getElementById('palindrome-verdict');

  window.cs6Reverse = function(type) {
    const raw = reverserInput.value;
    strLengthVal.textContent = raw.length;

    let result = '';
    if (type === 'char') {
      result = raw.split('').reverse().join('');
    } else {
      result = raw.split(' ').reverse().join(' ');
    }

    reversedOutput.textContent = result || '--';

    // Palindrome check (ignoring spaces and case)
    const cleaned = raw.replace(/\s+/g, '').toLowerCase();
    const cleanedRev = cleaned.split('').reverse().join('');
    const isPal = cleaned.length > 0 && cleaned === cleanedRev;

    if (isPal) {
      palindromeVerdict.textContent = 'Palindrome Match!';
      palindromeVerdict.className = 'tier-badge platinum';
    } else {
      palindromeVerdict.textContent = 'Not a Palindrome';
      palindromeVerdict.className = 'tier-badge not-eligible';
    }
  };

  reverserInput.addEventListener('input', () => cs6Reverse('char'));
  cs6Reverse('char');


  // ==========================================================================
  // 10. TAB 8: PRACTICAL 8 (ADMISSION FORM VALIDATION)
  // ==========================================================================
  const cs8Name = document.getElementById('cs8-name');
  const cs8Email = document.getElementById('cs8-email');
  const cs8Mobile = document.getElementById('cs8-mobile');
  const cs8Age = document.getElementById('cs8-age');
  const cs8Slot = document.getElementById('cs8-slot');
  const cs8Plan = document.getElementById('cs8-plan');

  const prevName = document.getElementById('prev-name');
  const prevEmail = document.getElementById('prev-email');
  const prevPhone = document.getElementById('prev-phone');
  const prevAge = document.getElementById('prev-age');
  const prevSlot = document.getElementById('prev-slot');
  const prevPlan = document.getElementById('prev-plan');

  const progressBar = document.getElementById('cs8-progress-bar');
  const progressPercent = document.getElementById('cs8-progress-percent');
  const submitAlert = document.getElementById('cs8-submit-alert');

  function validateCs8Field(input, validatorFn, iconId, msgId, successText, errorText) {
    const val = input.value.trim();
    const isValid = validatorFn(val);
    const icon = document.getElementById(iconId);
    const msg = document.getElementById(msgId);

    if (!val) {
      icon.textContent = '';
      msg.textContent = errorText;
      msg.className = 'help-msg';
      return false;
    }

    if (isValid) {
      icon.textContent = '✅';
      msg.textContent = successText;
      msg.className = 'help-msg success';
      return true;
    } else {
      icon.textContent = '❌';
      msg.textContent = errorText;
      msg.className = 'help-msg error';
      return false;
    }
  }

  function updateCs8Progress() {
    let validCount = 0;
    const totalFields = 4;

    if (validateCs8Field(cs8Name, v => /^[A-Za-z\s]{3,}$/.test(v), 'icon-name', 'msg-name', 'Valid name', 'Name must be at least 3 letters.')) validCount++;
    if (validateCs8Field(cs8Email, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'icon-email', 'msg-email', 'Valid email address', 'Enter a valid email address.')) validCount++;
    if (validateCs8Field(cs8Mobile, v => /^[6-9]\d{9}$/.test(v), 'icon-mobile', 'msg-mobile', 'Valid mobile number', 'Enter a 10-digit mobile number starting 6-9.')) validCount++;
    if (validateCs8Field(cs8Age, v => { const n = parseInt(v, 10); return n >= 16 && n <= 80; }, 'icon-name', 'msg-age', 'Valid age', 'Age must be between 16 and 80.')) validCount++;

    const pct = Math.round((validCount / totalFields) * 100);
    progressBar.style.width = pct + '%';
    progressPercent.textContent = pct + '%';

    // Live preview update
    prevName.textContent = cs8Name.value.trim() || 'Your Full Name';
    prevEmail.textContent = cs8Email.value.trim() || 'email@example.com';
    prevPhone.textContent = cs8Mobile.value.trim() || '----------';
    prevAge.textContent = (cs8Age.value.trim() || '--') + ' yrs';
    prevSlot.textContent = cs8Slot.value.split(' ')[0];
    prevPlan.textContent = cs8Plan.value.split(' ')[0];

    return validCount === totalFields;
  }

  [cs8Name, cs8Email, cs8Mobile, cs8Age].forEach(input => {
    input.addEventListener('input', updateCs8Progress);
  });
  [cs8Slot, cs8Plan].forEach(select => {
    select.addEventListener('change', updateCs8Progress);
  });

  window.cs8HandleSubmit = function(e) {
    e.preventDefault();
    const isAllValid = updateCs8Progress();

    if (isAllValid) {
      submitAlert.textContent = `Registration Confirmed for ${cs8Name.value.trim()}! Membership Pass is active.`;
      submitAlert.classList.remove('hidden');
    } else {
      alert('Please fill all required fields correctly before submitting.');
    }
  };

  window.cs8ResetForm = function() {
    document.getElementById('admissionForm').reset();
    ['name', 'email', 'mobile'].forEach(id => {
      document.getElementById('icon-' + id).textContent = '';
      const msg = document.getElementById('msg-' + id);
      if (msg) msg.className = 'help-msg';
    });
    submitAlert.classList.add('hidden');
    updateCs8Progress();
  };

  updateCs8Progress();


  // --- Helper utility ---
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

});
