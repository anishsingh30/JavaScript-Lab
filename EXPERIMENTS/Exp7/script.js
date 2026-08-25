/**
 * EXPERIMENT 7: DOM TRAVERSAL AND UPDATES - TO-DO LIST APPLICATION
 * Developer: ANISH SINGH (PRN: 24070521214)
 * Features: Add, Edit, Delete, Toggle Complete, Search, Filter & Live DOM Traversal Monitoring.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE MANAGEMENT ---
  const STORAGE_KEY = 'exp7_todo_tasks_v1';
  let tasks = loadInitialTasks();
  let currentFilter = 'all';
  let searchQuery = '';

  // --- DOM ELEMENT SELECTION ---
  const todoForm = document.getElementById('todo-form');
  const taskInput = document.getElementById('task-input');
  const categorySelect = document.getElementById('category-select');
  const prioritySelect = document.getElementById('priority-select');
  
  const searchInput = document.getElementById('search-input');
  const filterTabsContainer = document.getElementById('filter-tabs');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  
  const itemsLeftCount = document.getElementById('items-left-count');
  const itemsCompletedCount = document.getElementById('items-completed-count');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const traversalLogsContainer = document.getElementById('traversal-logs');

  // --- INITIAL RENDER & EVENT LISTENERS ---
  renderTasks();
  
  // 1. ADD TASK EVENT (DOM Node Creation & Insertion)
  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: 'task_' + Date.now(),
      title: text,
      category: categorySelect.value,
      priority: prioritySelect.value,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    saveTasksToStorage();

    // DOM Update: Create and prepend new DOM node directly
    const newDOMNode = createTaskDOMNode(newTask);
    
    // Traversal & Insertion: prepend element to taskList children
    if (taskList.firstChild) {
      taskList.insertBefore(newDOMNode, taskList.firstChild);
    } else {
      taskList.appendChild(newDOMNode);
    }

    logDOMAction(
      'ADD TASK (DOM Node Created)',
      `document.createElement('li') -> inserted at top of #task-list (ID: ${newTask.id})`,
      `taskList.insertBefore(newNode, taskList.firstChild);`,
      'action-add'
    );

    // Reset Form
    taskInput.value = '';
    updateStatsAndEmptyState();
  });

  // 2. TASK LIST DELEGATED EVENT HANDLER (DOM Traversal on Click)
  taskList.addEventListener('click', (e) => {
    // DOM Traversal: Find nearest parent .todo-item from event target
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const taskId = todoItem.dataset.id;
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    // Check if clicked inside Checkbox Container / Checkbox Toggle
    if (e.target.closest('.checkbox-container')) {
      toggleTaskCompletion(todoItem, tasks[taskIndex]);
      return;
    }

    // Check if clicked on Edit Button
    if (e.target.closest('.btn-edit')) {
      enterInlineEditMode(todoItem, tasks[taskIndex]);
      return;
    }

    // Check if clicked on Delete Button
    if (e.target.closest('.btn-delete')) {
      deleteTaskItem(todoItem, taskId);
      return;
    }
  });

  // 3. SEARCH & FILTER EVENTS
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderTasks();
  });

  filterTabsContainer.addEventListener('click', (e) => {
    const filterBtn = e.target.closest('.filter-btn');
    if (!filterBtn) return;

    // DOM Traversal: Update active class on siblings
    Array.from(filterTabsContainer.children).forEach(btn => btn.classList.remove('active'));
    filterBtn.classList.add('active');

    currentFilter = filterBtn.dataset.filter;
    
    logDOMAction(
      'FILTER APPLIED',
      `Filter changed to "${currentFilter}". Traversed filterTabsContainer.children to toggle .active class.`,
      `filterTabsContainer.children -> classList.toggle('active');`,
      'action-toggle'
    );

    renderTasks();
  });

  clearCompletedBtn.addEventListener('click', () => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) return;

    // DOM Updates: Remove completed items from DOM & Array
    tasks = tasks.filter(t => !t.completed);
    saveTasksToStorage();

    logDOMAction(
      'CLEAR COMPLETED',
      `Removed ${completedCount} completed task nodes from DOM and state.`,
      `tasks.filter(t => !t.completed) -> renderTasks()`,
      'action-delete'
    );

    renderTasks();
  });


  // ==========================================================================
  // --- DOM TRAVERSAL & MUTATION HELPER FUNCTIONS ---
  // ==========================================================================

  /**
   * Creates a full HTML <li> DOM element for a task object using DOM Creation methods.
   */
  function createTaskDOMNode(task) {
    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    // Build internal HTML structure
    li.innerHTML = `
      <div class="item-left">
        <label class="checkbox-container" title="Mark complete">
          <div class="checkbox-custom">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </label>
        
        <div class="task-details">
          <div class="task-title-row">
            <span class="task-text">${escapeHTML(task.title)}</span>
            <span class="tag-badge cat-${task.category}">${task.category}</span>
          </div>
          <div class="priority-indicator priority-${task.priority}">
            Priority: <strong>${task.priority}</strong>
          </div>
        </div>
      </div>

      <div class="item-actions">
        <button class="btn-icon btn-edit" title="Edit Task (DOM replaceChild)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-icon btn-delete" title="Delete Task (DOM remove)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    `;

    return li;
  }

  /**
   * Toggles completion status of a task using DOM classList mutation.
   */
  function toggleTaskCompletion(todoItemNode, taskObj) {
    taskObj.completed = !taskObj.completed;
    saveTasksToStorage();

    // DOM Update: toggle class on node
    todoItemNode.classList.toggle('completed', taskObj.completed);

    logDOMAction(
      'TOGGLE COMPLETE',
      `Traversed from click event -> item.closest('.todo-item') -> toggled .completed class (Status: ${taskObj.completed ? 'Completed' : 'Active'})`,
      `todoItem.classList.toggle('completed', ${taskObj.completed});`,
      'action-toggle'
    );

    updateStatsAndEmptyState();

    // Re-filter if viewing specific tab
    if (currentFilter !== 'all') {
      setTimeout(() => renderTasks(), 200);
    }
  }

  /**
   * Demonstrates DOM Node Replacement: Replaces title text node with an inline Edit Form.
   */
  function enterInlineEditMode(todoItemNode, taskObj) {
    // DOM Traversal: Find task details container and current task-text span
    const taskDetailsDiv = todoItemNode.querySelector('.task-details');
    const titleRow = todoItemNode.querySelector('.task-title-row');
    const actionsDiv = todoItemNode.querySelector('.item-actions');

    if (!titleRow) return;

    // Prevent duplicate edit mode
    if (todoItemNode.querySelector('.edit-input-wrapper')) return;

    // Save original inner HTML to restore if cancelled
    const originalTitleRowHTML = titleRow.innerHTML;
    const originalActionsHTML = actionsDiv.innerHTML;

    // DOM Creation: Create inline edit wrapper
    const editWrapper = document.createElement('div');
    editWrapper.className = 'edit-input-wrapper';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = taskObj.title;

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-save';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-cancel';
    cancelBtn.textContent = 'Cancel';

    editWrapper.appendChild(editInput);
    editWrapper.appendChild(saveBtn);
    editWrapper.appendChild(cancelBtn);

    // DOM Update: Replace original titleRow with editWrapper using replaceChild
    taskDetailsDiv.replaceChild(editWrapper, titleRow);
    actionsDiv.style.display = 'none';

    editInput.focus();
    editInput.select();

    logDOMAction(
      'IN-PLACE EDIT STARTED (DOM replaceChild)',
      `Traversed: todoItemNode.querySelector('.task-details') -> taskDetailsDiv.replaceChild(editWrapper, titleRow)`,
      `taskDetailsDiv.replaceChild(editWrapper, titleRow);`,
      'action-edit'
    );

    // Function to save edits
    const saveEdit = () => {
      const updatedText = editInput.value.trim();
      if (!updatedText) return;

      taskObj.title = updatedText;
      saveTasksToStorage();

      // Create new updated title row node
      const newTitleRow = document.createElement('div');
      newTitleRow.className = 'task-title-row';
      newTitleRow.innerHTML = `
        <span class="task-text">${escapeHTML(taskObj.title)}</span>
        <span class="tag-badge cat-${taskObj.category}">${taskObj.category}</span>
      `;

      // DOM Update: Replace editWrapper back with newTitleRow
      taskDetailsDiv.replaceChild(newTitleRow, editWrapper);
      actionsDiv.style.display = 'flex';

      logDOMAction(
        'EDIT SAVED (DOM Update)',
        `Updated task title to "${updatedText}". Traversed and executed replaceChild back to title row.`,
        `taskDetailsDiv.replaceChild(newTitleRow, editWrapper);`,
        'action-edit'
      );
    };

    // Function to cancel edits
    const cancelEdit = () => {
      taskDetailsDiv.replaceChild(titleRow, editWrapper);
      actionsDiv.style.display = 'flex';
      logDOMAction(
        'EDIT CANCELLED',
        `Restored original DOM child node in taskDetailsDiv.`,
        `taskDetailsDiv.replaceChild(originalTitleRow, editWrapper);`,
        'action-edit'
      );
    };

    // Event Handlers for Save / Cancel
    saveBtn.addEventListener('click', saveEdit);
    cancelBtn.addEventListener('click', cancelEdit);
    
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') cancelEdit();
    });
  }

  /**
   * Deletes a task element from the DOM and state array.
   */
  function deleteTaskItem(todoItemNode, taskId) {
    logDOMAction(
      'DELETE TASK (DOM Element Removal)',
      `Traversed up from delete button target -> found parent item (ID: ${taskId}). Removing node from DOM.`,
      `todoItemNode.remove();`,
      'action-delete'
    );

    // Fade Out Animation before DOM removal
    todoItemNode.style.animation = 'fadeOut 0.2s ease-out forwards';
    
    setTimeout(() => {
      // DOM Update: Node Removal
      todoItemNode.remove();

      // State Update
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasksToStorage();

      updateStatsAndEmptyState();
    }, 200);
  }

  /**
   * Main Render function to populate task list based on current filters and search query.
   */
  function renderTasks() {
    // Clear DOM task list children
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(t => {
      // Filter tab check
      if (currentFilter === 'active' && t.completed) return false;
      if (currentFilter === 'completed' && !t.completed) return false;
      
      // Search query check
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery)) return false;

      return true;
    });

    if (filteredTasks.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      // DOM Traversal & Creation: Append created task nodes
      filteredTasks.forEach(task => {
        const node = createTaskDOMNode(task);
        taskList.appendChild(node);
      });
    }

    updateStatsAndEmptyState();
  }

  /**
   * Updates task counter badges in footer.
   */
  function updateStatsAndEmptyState() {
    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    itemsLeftCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} left`;
    itemsCompletedCount.textContent = `${completedCount} completed`;

    clearCompletedBtn.style.display = completedCount > 0 ? 'inline-block' : 'none';
  }

  /**
   * Appends an entry to the DOM Traversal Inspector log panel.
   */
  function logDOMAction(title, desc, codeSnippet, actionClass = '') {
    // Create Log Item Element
    const logItem = document.createElement('div');
    logItem.className = `log-item ${actionClass}`;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    logItem.innerHTML = `
      <span class="log-time">[${timeStr}] ${escapeHTML(title)}</span>
      <span class="log-text">${escapeHTML(desc)}</span>
      <span class="log-code"><code>${escapeHTML(codeSnippet)}</code></span>
    `;

    // DOM Traversal & Prepend to Inspector Log Box
    const defaultLog = traversalLogsContainer.querySelector('.default-log');
    if (defaultLog) defaultLog.remove();

    if (traversalLogsContainer.firstChild) {
      traversalLogsContainer.insertBefore(logItem, traversalLogsContainer.firstChild);
    } else {
      traversalLogsContainer.appendChild(logItem);
    }

    // Limit log count to 15 items
    while (traversalLogsContainer.children.length > 15) {
      traversalLogsContainer.lastChild.remove();
    }
  }

  // --- LOCAL STORAGE HELPERS ---
  function loadInitialTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse localStorage tasks:', e);
      }
    }
    // Default preset tasks for first-time experience
    return [
      {
        id: 'task_1',
        title: 'Review DOM Traversal methods (closest, children, parentNode)',
        category: 'Study',
        priority: 'High',
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_2',
        title: 'Implement in-place task editing using replaceChild()',
        category: 'Work',
        priority: 'Medium',
        completed: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'task_3',
        title: 'Organize project repository for Experiment 7 submission',
        category: 'Personal',
        priority: 'Low',
        completed: false,
        createdAt: new Date().toISOString()
      }
    ];
  }

  function saveTasksToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Helper utility to prevent XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

});
