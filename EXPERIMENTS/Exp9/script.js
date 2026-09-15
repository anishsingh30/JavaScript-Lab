/**
 * Experiment 9: Web Storage API (localStorage & sessionStorage)
 * Dynamic Theme Settings Manager
 * Student: ANISH SINGH (PRN: 24070521214)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const THEME_KEY = 'preferredTheme';
  const DEFAULT_THEME = 'light';

  // DOM Elements
  const themeSelect = document.getElementById('themeSelect');
  const saveLocalStorageBtn = document.getElementById('saveLocalStorageBtn');
  const saveSessionStorageBtn = document.getElementById('saveSessionStorageBtn');
  const clearPreferencesBtn = document.getElementById('clearPreferencesBtn');
  const statusBox = document.getElementById('statusBox');
  const statusMessage = document.getElementById('statusMessage');
  const statusIcon = document.getElementById('statusIcon');
  const badgeText = document.getElementById('badgeText');

  /**
   * Applies the theme and updates visual badges dynamically.
   * @param {string} theme - 'light' or 'dark'
   */
  function applyTheme(theme) {
    const isDark = (theme === 'dark');
    const selectedTheme = isDark ? 'dark' : 'light';

    // Set HTML attribute & body class for theme
    document.documentElement.setAttribute('data-theme', selectedTheme);
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    // Update select dropdown value
    if (themeSelect) {
      themeSelect.value = selectedTheme;
    }

    // Dynamic UI Updates
    if (badgeText) {
      badgeText.textContent = isDark ? 'Dark Theme Active' : 'White Theme Active';
    }
  }

  /**
   * Triggers an animated feedback message in the status container.
   * @param {string} message 
   * @param {string} icon 
   */
  function showStatus(message, icon = '✨') {
    if (!statusMessage || !statusBox) return;

    statusMessage.textContent = message;
    if (statusIcon) statusIcon.textContent = icon;

    // Trigger pop micro-animation
    statusBox.classList.remove('animate-pop');
    void statusBox.offsetWidth; // Force DOM reflow
    statusBox.classList.add('animate-pop');
  }

  /**
   * Save theme using localStorage (Persistent across sessions/tabs)
   */
  saveLocalStorageBtn.addEventListener('click', () => {
    const selectedTheme = themeSelect.value;
    try {
      localStorage.setItem(THEME_KEY, selectedTheme);
      applyTheme(selectedTheme);
      showStatus('Theme saved using localStorage.', '💾');
    } catch (e) {
      console.error('LocalStorage error:', e);
      showStatus('Error saving to localStorage.', '⚠️');
    }
  });

  /**
   * Save theme using sessionStorage (Active only for current browser tab)
   */
  saveSessionStorageBtn.addEventListener('click', () => {
    const selectedTheme = themeSelect.value;
    try {
      sessionStorage.setItem(THEME_KEY, selectedTheme);
      applyTheme(selectedTheme);
      showStatus('Theme saved using sessionStorage.', '⏱️');
    } catch (e) {
      console.error('SessionStorage error:', e);
      showStatus('Error saving to sessionStorage.', '⚠️');
    }
  });

  /**
   * Clear saved preferences and restore default white theme
   */
  clearPreferencesBtn.addEventListener('click', () => {
    try {
      localStorage.removeItem(THEME_KEY);
      sessionStorage.removeItem(THEME_KEY);
      applyTheme(DEFAULT_THEME);
      showStatus('Preferences cleared. Reverted to default White theme.', '🗑️');
    } catch (e) {
      console.error('Clear preferences error:', e);
      showStatus('Error clearing preferences.', '⚠️');
    }
  });

  /**
   * Live preview when changing dropdown option
   */
  themeSelect.addEventListener('change', (e) => {
    const previewTheme = e.target.value;
    applyTheme(previewTheme);
    showStatus(`Previewing ${previewTheme === 'dark' ? 'Dark' : 'White'} theme (click a save button to persist).`, '👀');
  });

  /**
   * Cross-tab storage synchronization listener
   */
  window.addEventListener('storage', (e) => {
    if (e.key === THEME_KEY) {
      if (!sessionStorage.getItem(THEME_KEY) && e.newValue) {
        applyTheme(e.newValue);
        showStatus(`Theme synced from another tab: ${e.newValue}`, '🔄');
      }
    }
  });

  /**
   * Initialize theme on load (sessionStorage takes precedence over localStorage)
   */
  function initTheme() {
    const sessionTheme = sessionStorage.getItem(THEME_KEY);
    const localTheme = localStorage.getItem(THEME_KEY);

    if (sessionTheme) {
      applyTheme(sessionTheme);
      showStatus(`Theme restored from sessionStorage (${sessionTheme.toUpperCase()}).`, '⏱️');
    } else if (localTheme) {
      applyTheme(localTheme);
      showStatus(`Theme restored from localStorage (${localTheme.toUpperCase()}).`, '💾');
    } else {
      applyTheme(DEFAULT_THEME);
      showStatus('Theme set to default (White Theme).', '✨');
    }
  }

  // Run on startup
  initTheme();
});
