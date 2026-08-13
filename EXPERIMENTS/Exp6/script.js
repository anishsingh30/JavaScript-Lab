/**
 * EXPERIMENT 6: STRING FUNCTIONS & REGEX PROCESSING STUDIO
 * Comprehensive JavaScript implementation utilizing String Methods & RegExp API
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize App Modules
  initTabs();
  initEmailValidator();
  initDataExtractor();
  initStringFunctionStudio();
  initTextAnalytics();
  initRegexTester();

  // Populate Initial Default Data
  loadInitialDefaults();
});

/* ==========================================================================
   GLOBAL UTILITIES & TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, icon = 'fa-circle-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg, 'fa-copy');
  }).catch(() => {
    showToast('Failed to copy text', 'fa-triangle-exclamation');
  });
}

let activeTransformCount = 0;
function incrementTransformStat() {
  activeTransformCount++;
  const el = document.getElementById('stat-transforms-count');
  if (el) el.textContent = activeTransformCount;
}

/* ==========================================================================
   TAB NAVIGATION SYSTEM
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetTabId);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

/* ==========================================================================
   MODULE 1: EMAIL VALIDATION & SECURITY INSPECTOR
   ========================================================================== */
function initEmailValidator() {
  const emailInput = document.getElementById('email-input');
  const clearBtn = document.getElementById('email-clear-btn');
  const presetBtns = document.querySelectorAll('.btn-preset');
  const applyTypoBtn = document.getElementById('apply-typo-btn');
  const copyCodeBtn = document.getElementById('copy-email-code-btn');

  if (!emailInput) return;

  emailInput.addEventListener('input', () => {
    runEmailValidation(emailInput.value);
  });

  clearBtn.addEventListener('click', () => {
    emailInput.value = '';
    runEmailValidation('');
    emailInput.focus();
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sample = btn.getAttribute('data-email');
      emailInput.value = sample;
      runEmailValidation(sample);
    });
  });

  applyTypoBtn.addEventListener('click', () => {
    const sug = document.getElementById('typo-suggestion').textContent;
    emailInput.value = sug;
    runEmailValidation(sug);
    showToast('Applied domain typo correction!', 'fa-wand-magic-sparkles');
  });

  copyCodeBtn.addEventListener('click', () => {
    const code = document.getElementById('email-code-snippet').textContent;
    copyToClipboard(code, 'Validation JS logic copied!');
  });
}

// Common Domain Typo Mapping
const TYPO_DOMAINS = {
  'gnail.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'gmai.co.in': 'gmail.com'
};

// Disposable Email Domains
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'tempmail.com', '10minutemail.com', 'yopmail.com', 
  'trashmail.com', 'guerrillamail.com', 'sharklasers.com', 'getnada.com'
];

function runEmailValidation(rawEmail) {
  const email = rawEmail.trim();
  const overallBadge = document.getElementById('email-overall-badge');
  const statBadge = document.getElementById('stat-email-status');
  const typoAlert = document.getElementById('typo-alert');
  const typoSug = document.getElementById('typo-suggestion');
  const codeSnippet = document.getElementById('email-code-snippet');

  // Token Pill Elements
  const tokUser = document.getElementById('token-username');
  const tokDomain = document.getElementById('token-domain');
  const tokTld = document.getElementById('token-tld');

  if (!email) {
    overallBadge.className = 'badge badge-neutral';
    overallBadge.textContent = 'Awaiting Input';
    statBadge.textContent = 'Idle';
    statBadge.style.color = 'var(--slate-900)';
    resetChecklist();
    tokUser.textContent = 'username';
    tokDomain.textContent = 'domain';
    tokTld.textContent = 'tld';
    typoAlert.classList.add('hidden');
    codeSnippet.textContent = '// Enter an email to inspect JavaScript validation logic';
    return;
  }

  // --- String Methods Analysis ---
  const atIndex = email.indexOf('@');
  const lastAtIndex = email.lastIndexOf('@');
  const hasSingleAt = (atIndex > 0 && atIndex === lastAtIndex);
  
  let username = '';
  let domain = '';
  let tld = '';

  if (atIndex !== -1) {
    username = email.slice(0, atIndex);
    domain = email.slice(atIndex + 1);
    const dotIndex = domain.lastIndexOf('.');
    if (dotIndex !== -1) {
      tld = domain.slice(dotIndex + 1);
    }
  }

  // Update Visual Tokens
  tokUser.textContent = username || 'username';
  tokDomain.textContent = domain ? (domain.split('.')[0] || 'domain') : 'domain';
  tokTld.textContent = tld || 'tld';

  // --- Validation Rules ---
  // Rule 1: RFC 5322 Regex Syntax Check
  const rfcRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passSyntax = rfcRegex.test(email);

  // Rule 2: Length Constraints (Username >= 1, Total <= 254)
  const passLength = username.length >= 1 && email.length <= 254 && !email.includes('..');

  // Rule 3: Domain Structure
  const passDomain = hasSingleAt && domain.includes('.') && domain.indexOf('.') > 0 && !domain.endsWith('.');

  // Rule 4: TLD Extension check (>= 2 chars)
  const passTld = tld.length >= 2 && /^[a-zA-Z]{2,}$/.test(tld);

  // Rule 5: Disposable Email Provider Check
  const domainLower = domain.toLowerCase();
  const isDisposable = DISPOSABLE_DOMAINS.some(d => domainLower === d || domainLower.endsWith('.' + d));
  const passDisposable = !isDisposable;

  // Update Checklist Items in UI
  setCheckStatus('chk-syntax', passSyntax);
  setCheckStatus('chk-length', passLength);
  setCheckStatus('chk-domain', passDomain);
  setCheckStatus('chk-tld', passTld);
  setCheckStatus('chk-disposable', passDisposable);

  // Check Typo Suggestion
  const typoFixedDomain = TYPO_DOMAINS[domainLower];
  if (typoFixedDomain && username) {
    typoSug.textContent = `${username}@${typoFixedDomain}`;
    typoAlert.classList.remove('hidden');
  } else {
    typoAlert.classList.add('hidden');
  }

  // Overall Integrity Evaluation
  const isValid = passSyntax && passLength && passDomain && passTld && passDisposable;

  if (isValid) {
    overallBadge.className = 'badge badge-valid';
    overallBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> VALID EMAIL';
    statBadge.textContent = 'Pass (Valid)';
    statBadge.style.color = 'var(--emerald-600)';
  } else {
    overallBadge.className = 'badge badge-invalid';
    overallBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> INVALID EMAIL';
    statBadge.textContent = 'Fail (Invalid)';
    statBadge.style.color = 'var(--rose-600)';
  }

  // Render JS Logic Snippet
  codeSnippet.textContent = `// Evaluated via JS String API & RegExp
const raw = "${email}";
const email = raw.trim().toLowerCase();

const atIdx = email.indexOf('@'); // ${atIndex}
const username = email.slice(0, atIdx); // "${username}"
const domain = email.slice(atIdx + 1); // "${domain}"

const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
const isSyntaxValid = regexPattern.test(email); // ${passSyntax}
const isDisposable = ${isDisposable}; // ${isDisposable ? 'BLOCKED' : 'Clean'}`;
}

function setCheckStatus(id, isPass) {
  const item = document.getElementById(id);
  if (!item) return;
  const icon = item.querySelector('.check-icon i');
  if (isPass) {
    item.className = 'check-item pass';
    icon.className = 'fa-solid fa-circle-check';
  } else {
    item.className = 'check-item fail';
    icon.className = 'fa-solid fa-circle-xmark';
  }
}

function resetChecklist() {
  ['chk-syntax', 'chk-length', 'chk-domain', 'chk-tld', 'chk-disposable'].forEach(id => {
    const item = document.getElementById(id);
    if (!item) return;
    item.className = 'check-item';
    const icon = item.querySelector('.check-icon i');
    icon.className = 'fa-solid fa-circle-question';
  });
}

/* ==========================================================================
   MODULE 2: UNSTRUCTURED DATA EXTRACTION HUB
   ========================================================================== */
let currentExtractedEntities = [];
let currentFilter = 'all';

function initDataExtractor() {
  const input = document.getElementById('extractor-input');
  const clearBtn = document.getElementById('clear-extractor-btn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const presetLog = document.getElementById('preset-log-btn');
  const presetContact = document.getElementById('preset-contact-btn');
  const presetInvoice = document.getElementById('preset-invoice-btn');

  const exportJsonBtn = document.getElementById('export-json-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');
  const copyExtractedBtn = document.getElementById('copy-extracted-btn');

  if (!input) return;

  input.addEventListener('input', () => {
    processExtraction(input.value);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    processExtraction('');
    input.focus();
  });

  // Presets
  presetLog.addEventListener('click', () => {
    input.value = `[2026-08-13 10:15:22] WARN server.js: Failed login attempt for admin@company.org from IP 192.168.1.45.
[2026-08-13 10:18:05] INFO auth.js: Password reset request sent to user.smith@gmail.com. Token expire 2026-08-14.
[2026-08-13 10:25:00] SUCCESS billing.js: Refund processed amount ₹4,999.00 for order #88412 by support@payment-gateway.io.
Contact devops@cloudinfra.net or call +91 98765 43210 for emergency rollback. Documentation: https://docs.infra.internal/logs`;
    processExtraction(input.value);
  });

  presetContact.addEventListener('click', () => {
    input.value = `ACME Global Corp Directory - Executive Contacts:
1. Anish Singh (Lead Architect)
   Email: anish.singh2407@gmail.com | Phone: +91 98765-43210
   Web: https://anishsingh.dev | Social: @anish_dev #techlead #webdev

2. Sarah Connor (Operations Director)
   Email: sarah.connor@acme-corp.com | Phone: +1 (555) 234-5678
   LinkedIn: https://linkedin.com/in/sarah-connor | Tag: @sarah_op

Billing support desk: payments@acme-corp.com or call toll-free 1800-425-1000. Last updated: 2026-08-01.`;
    processExtraction(input.value);
  });

  presetInvoice.addEventListener('click', () => {
    input.value = `INVOICE #INV-2026-9941
Date: 2026-08-12 | Due Date: 2026-09-12
Billed To: TechSolutions Pvt Ltd (contact@techsolutions.in)
Vendor Support: billing-support@softwarevendor.com / +91-9123456789

Line Items:
- Enterprise Cloud SaaS Subscription (12 months): ₹1,25,000.00
- Custom API Integration Service: $1,500.00
- Premium 24/7 SLA Support Addon: €450.00

Subtotal: ₹1,50,000.00 | Tax (GST 18%): ₹27,000.00 | Grand Total: ₹1,77,000.00
Payment Portal Link: https://pay.softwarevendor.com/invoice/9941
Hashtags: #invoice #paid #cloudservices`;
    processExtraction(input.value);
  });

  // Filter Buttons
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.getAttribute('data-filter');
      renderExtractedGrid();
    });
  });

  // Export Buttons
  exportJsonBtn.addEventListener('click', () => {
    if (currentExtractedEntities.length === 0) {
      showToast('No entities to export', 'fa-triangle-exclamation');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentExtractedEntities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `extracted_entities_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported entities to JSON!', 'fa-file-code');
  });

  exportCsvBtn.addEventListener('click', () => {
    if (currentExtractedEntities.length === 0) {
      showToast('No entities to export', 'fa-triangle-exclamation');
      return;
    }
    let csv = "Category,Value\n";
    currentExtractedEntities.forEach(e => {
      csv += `"${e.type}","${e.value.replace(/"/g, '""')}"\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `extracted_entities_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported entities to CSV!', 'fa-file-csv');
  });

  copyExtractedBtn.addEventListener('click', () => {
    if (currentExtractedEntities.length === 0) {
      showToast('No entities to copy', 'fa-triangle-exclamation');
      return;
    }
    const textList = currentExtractedEntities.map(e => `[${e.type.toUpperCase()}] ${e.value}`).join('\n');
    copyToClipboard(textList, `Copied ${currentExtractedEntities.length} entities!`);
  });
}

function processExtraction(text) {
  currentExtractedEntities = [];

  if (!text.trim()) {
    updateFilterCounts();
    renderExtractedGrid();
    document.getElementById('stat-entities-count').textContent = '0';
    return;
  }

  // 1. Emails Extraction Regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  emails.forEach(val => currentExtractedEntities.push({ type: 'email', value: val }));

  // 2. Phone Numbers Extraction Regex
  const phoneRegex = /(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
  const rawPhones = text.match(phoneRegex) || [];
  // Filter phone matches so they don't capture plain dates/numbers
  const phones = rawPhones.filter(p => p.trim().length >= 7 && !/\d{4}[/-]\d{2}/.test(p));
  phones.forEach(val => currentExtractedEntities.push({ type: 'phone', value: val.trim() }));

  // 3. URLs Extraction Regex
  const urlRegex = /https?:\/\/[^\s"'>]+/g;
  const urls = text.match(urlRegex) || [];
  urls.forEach(val => currentExtractedEntities.push({ type: 'url', value: val }));

  // 4. Dates Extraction Regex
  const dateRegex = /\b(?:\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/g;
  const dates = text.match(dateRegex) || [];
  dates.forEach(val => currentExtractedEntities.push({ type: 'date', value: val }));

  // 5. Money Amounts Extraction Regex
  const moneyRegex = /(?:[₹$€£]\s*\d+(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:USD|INR|EUR))/gi;
  const money = text.match(moneyRegex) || [];
  money.forEach(val => currentExtractedEntities.push({ type: 'money', value: val.trim() }));

  // 6. Tags & Mentions Extraction Regex
  const tagRegex = /[#@][a-zA-Z0-9_]+/g;
  const tags = text.match(tagRegex) || [];
  tags.forEach(val => currentExtractedEntities.push({ type: 'tag', value: val }));

  // Deduplicate array by type + value
  currentExtractedEntities = currentExtractedEntities.filter((item, index, self) =>
    index === self.findIndex((t) => (t.type === item.type && t.value === item.value))
  );

  document.getElementById('stat-entities-count').textContent = currentExtractedEntities.length;
  updateFilterCounts();
  renderExtractedGrid();
}

function updateFilterCounts() {
  const counts = { all: currentExtractedEntities.length, email: 0, phone: 0, url: 0, date: 0, money: 0, tag: 0 };
  currentExtractedEntities.forEach(e => {
    if (counts[e.type] !== undefined) counts[e.type]++;
  });

  Object.keys(counts).forEach(key => {
    const el = document.getElementById(`cnt-${key}`);
    if (el) el.textContent = counts[key];
  });
}

function renderExtractedGrid() {
  const grid = document.getElementById('extracted-results-grid');
  if (!grid) return;

  const filtered = currentExtractedEntities.filter(e => currentFilter === 'all' || e.type === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-magnifying-glass icon-faded"></i>
        <p>No ${currentFilter === 'all' ? '' : currentFilter} entities found in the provided text.</p>
      </div>`;
    return;
  }

  const iconMap = {
    email: { icon: 'fa-envelope', class: 'type-email', label: 'Email' },
    phone: { icon: 'fa-phone', class: 'type-phone', label: 'Phone' },
    url: { icon: 'fa-link', class: 'type-url', label: 'URL' },
    date: { icon: 'fa-calendar-days', class: 'type-date', label: 'Date' },
    money: { icon: 'fa-indian-rupee-sign', class: 'type-money', label: 'Amount' },
    tag: { icon: 'fa-hashtag', class: 'type-tag', label: 'Tag/Mention' }
  };

  grid.innerHTML = filtered.map(item => {
    const meta = iconMap[item.type] || { icon: 'fa-cube', class: '', label: item.type };
    return `
      <div class="entity-card">
        <div class="entity-left">
          <div class="entity-type-icon ${meta.class}">
            <i class="fa-solid ${meta.icon}"></i>
          </div>
          <div class="entity-details">
            <span class="entity-val" title="${escapeHtml(item.value)}">${escapeHtml(item.value)}</span>
            <span class="entity-lbl">${meta.label}</span>
          </div>
        </div>
        <button class="btn-icon-copy" onclick="copyToClipboard('${escapeHtml(item.value)}')" title="Copy item">
          <i class="fa-regular fa-copy"></i>
        </button>
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ==========================================================================
   MODULE 3: STRING FUNCTIONS & METHOD STUDIO
   ========================================================================== */
function initStringFunctionStudio() {
  const inputEl = document.getElementById('str-func-input');
  const methodSelect = document.getElementById('string-method-select');
  const param1 = document.getElementById('method-param-1');
  const param2 = document.getElementById('method-param-2');
  const codeExpr = document.getElementById('method-code-expression');
  const outputResult = document.getElementById('method-output-result');

  if (!inputEl || !methodSelect) return;

  function updateStringMethodResult() {
    const rawVal = inputEl.value;
    const method = methodSelect.value;
    const p1 = param1 ? param1.value : '';
    const p2 = param2 ? param2.value : '';

    let expr = `str.${method}()`;
    let result = '';

    try {
      switch (method) {
        case 'toUpperCase':
          expr = `str.toUpperCase()`;
          result = rawVal.toUpperCase();
          break;
        case 'toLowerCase':
          expr = `str.toLowerCase()`;
          result = rawVal.toLowerCase();
          break;
        case 'trim':
          expr = `str.trim()`;
          result = rawVal.trim();
          break;
        case 'slice':
          {
            const start = parseInt(p1) || 0;
            const end = p2 !== '' ? parseInt(p2) : undefined;
            expr = end !== undefined ? `str.slice(${start}, ${end})` : `str.slice(${start})`;
            result = rawVal.slice(start, end);
          }
          break;
        case 'substring':
          {
            const from = parseInt(p1) || 0;
            const to = p2 !== '' ? parseInt(p2) : undefined;
            expr = to !== undefined ? `str.substring(${from}, ${to})` : `str.substring(${from})`;
            result = rawVal.substring(from, to);
          }
          break;
        case 'split':
          {
            const sep = p1 || ' ';
            expr = `str.split(${JSON.stringify(sep)})`;
            result = JSON.stringify(rawVal.split(sep));
          }
          break;
        case 'includes':
          {
            const q = p1 || 'Studio';
            expr = `str.includes(${JSON.stringify(q)})`;
            result = rawVal.includes(q) ? 'true (Contains substring)' : 'false (Does not contain)';
          }
          break;
        case 'indexOf':
          {
            const q = p1 || 'Studio';
            expr = `str.indexOf(${JSON.stringify(q)})`;
            result = rawVal.indexOf(q);
          }
          break;
        case 'replace':
          {
            const search = p1 || '2026';
            const rep = p2 || 'Pro';
            expr = `str.replace(${JSON.stringify(search)}, ${JSON.stringify(rep)})`;
            result = rawVal.replace(search, rep);
          }
          break;
        case 'replaceAll':
          {
            const search = p1 || 'e';
            const rep = p2 || '3';
            expr = `str.replaceAll(${JSON.stringify(search)}, ${JSON.stringify(rep)})`;
            result = rawVal.replaceAll ? rawVal.replaceAll(search, rep) : rawVal.split(search).join(rep);
          }
          break;
        case 'padStart':
          {
            const len = parseInt(p1) || 45;
            const padStr = p2 || '*';
            expr = `str.padStart(${len}, ${JSON.stringify(padStr)})`;
            result = rawVal.padStart(len, padStr);
          }
          break;
        case 'concat':
          {
            const add = p1 || ' [Updated]';
            expr = `str.concat(${JSON.stringify(add)})`;
            result = rawVal.concat(add);
          }
          break;
        case 'charAt':
          {
            const idx = parseInt(p1) || 5;
            expr = `str.charAt(${idx})`;
            result = rawVal.charAt(idx) ? JSON.stringify(rawVal.charAt(idx)) : "'' (out of bounds)";
          }
          break;
        case 'startsWith':
          {
            const q = p1 || '  Java';
            expr = `str.startsWith(${JSON.stringify(q)})`;
            result = rawVal.startsWith(q) ? 'true' : 'false';
          }
          break;
        case 'endsWith':
          {
            const q = p1 || '!  ';
            expr = `str.endsWith(${JSON.stringify(q)})`;
            result = rawVal.endsWith(q) ? 'true' : 'false';
          }
          break;
        default:
          result = rawVal;
      }
    } catch (err) {
      result = 'Error: ' + err.message;
    }

    if (codeExpr) codeExpr.textContent = expr;
    if (outputResult) outputResult.textContent = typeof result === 'string' ? `"${result}"` : result;
  }

  inputEl.addEventListener('input', updateStringMethodResult);
  methodSelect.addEventListener('change', updateStringMethodResult);
  if (param1) param1.addEventListener('input', updateStringMethodResult);
  if (param2) param2.addEventListener('input', updateStringMethodResult);

  updateStringMethodResult();
}

/* ==========================================================================
   MODULE 4: TEXT ANALYTICS & MAIL PRESENCE DETECTOR
   ========================================================================== */
function initTextAnalytics() {
  const textArea = document.getElementById('analytics-text');
  const transformBtns = document.querySelectorAll('.btn-transform');
  const findInput = document.getElementById('find-query');
  const replaceInput = document.getElementById('replace-query');
  const caseSensCheck = document.getElementById('find-case-sens');
  const isRegexCheck = document.getElementById('find-is-regex');
  const doReplaceBtn = document.getElementById('btn-do-replace');
  const mailYesBtn = document.getElementById('preset-mail-yes');
  const mailNoBtn = document.getElementById('preset-mail-no');

  if (!textArea) return;

  textArea.addEventListener('input', () => {
    analyzeText(textArea.value);
    updateFindMatches();
  });

  if (mailYesBtn) {
    mailYesBtn.addEventListener('click', () => {
      textArea.value = "Hello team, please send your lab reports to developer Anish Singh at anish.singh2407@gmail.com and support@university.edu.in by Friday. Visit https://anishsingh.dev for reference.";
      analyzeText(textArea.value);
      showToast('Loaded text sample WITH Mail addresses!', 'fa-envelope-circle-check');
    });
  }

  if (mailNoBtn) {
    mailNoBtn.addEventListener('click', () => {
      textArea.value = "JavaScript String methods and Regular Expressions allow developers to perform search, replace, extraction, and text analytics efficiently without any mail content in text.";
      analyzeText(textArea.value);
      showToast('Loaded text sample WITHOUT Mail!', 'fa-envelope-open');
    });
  }

  transformBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-transform');
      applyStringTransformation(mode);
    });
  });

  if (findInput) {
    findInput.addEventListener('input', updateFindMatches);
    if (replaceInput) replaceInput.addEventListener('input', updateFindMatches);
    if (caseSensCheck) caseSensCheck.addEventListener('change', updateFindMatches);
    if (isRegexCheck) isRegexCheck.addEventListener('change', updateFindMatches);

    if (doReplaceBtn) {
      doReplaceBtn.addEventListener('click', () => {
        executeFindAndReplace();
      });
    }
  }
}

function analyzeText(text) {
  const trimmed = text.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const charCount = text.length;
  const noSpaceCount = text.replace(/\s/g, '').length;
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphCount = text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const readTime = Math.ceil(wordCount / 200);

  // Update Main Metrics Elements
  if (document.getElementById('metric-words')) document.getElementById('metric-words').textContent = wordCount.toLocaleString();
  if (document.getElementById('metric-chars')) document.getElementById('metric-chars').textContent = charCount.toLocaleString();
  if (document.getElementById('metric-nospaces')) document.getElementById('metric-nospaces').textContent = noSpaceCount.toLocaleString();
  if (document.getElementById('metric-sentences')) document.getElementById('metric-sentences').textContent = sentenceCount.toLocaleString();
  if (document.getElementById('metric-paragraphs')) document.getElementById('metric-paragraphs').textContent = paragraphCount.toLocaleString();
  if (document.getElementById('metric-readtime')) document.getElementById('metric-readtime').textContent = `${readTime} min`;

  // Update Global Header Counter
  if (document.getElementById('stat-words-count')) document.getElementById('stat-words-count').textContent = wordCount.toLocaleString();

  // =========================================================================
  // MAIL / EMAIL PRESENCE DETECTOR (Primary User Requirement)
  // =========================================================================
  const emailRegex = /[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}/g;
  const emailsFound = text.match(emailRegex) || [];
  const banner = document.getElementById('mail-presence-banner');
  const titleEl = document.getElementById('mail-presence-status-title');
  const descEl = document.getElementById('mail-presence-status-desc');
  const iconEl = document.getElementById('mail-presence-icon');
  const listContainer = document.getElementById('mail-detected-container');
  const listEl = document.getElementById('mail-detected-list');

  if (banner && titleEl) {
    if (emailsFound.length > 0) {
      banner.style.background = '#d1fae5';
      banner.style.color = '#065f46';
      banner.style.border = '1px solid #a7f3d0';
      if (iconEl) {
        iconEl.className = 'fa-solid fa-envelope-circle-check';
        iconEl.style.color = '#059669';
      }
      titleEl.innerHTML = `MAIL DETECTED: <span style="color: #047857;">YES</span> (${emailsFound.length} email address(es) found)`;
      if (descEl) descEl.textContent = `Analyzed text contains valid email/mail address data.`;
      
      if (listContainer && listEl) {
        listContainer.style.display = 'block';
        listEl.innerHTML = emailsFound.map(e => `
          <span style="background: #ffffff; color: #065f46; border: 1px solid #6ee7b7; padding: 0.35rem 0.65rem; border-radius: 6px; font-size: 0.85rem; font-family: var(--font-mono); display: inline-flex; align-items: center; gap: 0.4rem;">
            <i class="fa-solid fa-envelope" style="color: #059669;"></i> ${escapeHtml(e)}
          </span>
        `).join('');
      }
    } else {
      banner.style.background = '#f8fafc';
      banner.style.color = '#475569';
      banner.style.border = '1px solid #cbd5e1';
      if (iconEl) {
        iconEl.className = 'fa-solid fa-circle-xmark';
        iconEl.style.color = '#94a3b8';
      }
      titleEl.innerHTML = `MAIL DETECTED: <span style="color: #64748b;">NO</span>`;
      if (descEl) descEl.textContent = `No email address found in the analyzed text.`;
      if (listContainer) listContainer.style.display = 'none';
    }
  }

  // Other Entity Presence Indicators
  const phoneRegex = /\+?\d{1,4}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;
  const urlRegex = /https?:\/\/[^\s"'>]+/g;
  const tagRegex = /[#@]\w+/g;

  const phonesFound = text.match(phoneRegex) || [];
  const urlsFound = text.match(urlRegex) || [];
  const tagsFound = text.match(tagRegex) || [];

  const presencePhone = document.getElementById('presence-phone');
  const presenceUrl = document.getElementById('presence-url');
  const presenceTag = document.getElementById('presence-tag');

  if (presencePhone) presencePhone.innerHTML = phonesFound.length > 0 ? `<span style="color: #059669;">YES (${phonesFound.length})</span>` : '<span style="color: #94a3b8;">NO</span>';
  if (presenceUrl) presenceUrl.innerHTML = urlsFound.length > 0 ? `<span style="color: #059669;">YES (${urlsFound.length})</span>` : '<span style="color: #94a3b8;">NO</span>';
  if (presenceTag) presenceTag.innerHTML = tagsFound.length > 0 ? `<span style="color: #059669;">YES (${tagsFound.length})</span>` : '<span style="color: #94a3b8;">NO</span>';

  // Character Set Counts
  const uppercaseCount = (text.match(/[A-Z]/g) || []).length;
  const lowercaseCount = (text.match(/[a-z]/g) || []).length;
  const digitCount = (text.match(/[0-9]/g) || []).length;
  const symbolCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const spaceCount = (text.match(/\s/g) || []).length;

  if (document.getElementById('cnt-uppercase')) document.getElementById('cnt-uppercase').textContent = uppercaseCount;
  if (document.getElementById('cnt-lowercase')) document.getElementById('cnt-lowercase').textContent = lowercaseCount;
  if (document.getElementById('cnt-digit')) document.getElementById('cnt-digit').textContent = digitCount;
  if (document.getElementById('cnt-symbol')) document.getElementById('cnt-symbol').textContent = symbolCount;
  if (document.getElementById('cnt-space')) document.getElementById('cnt-space').textContent = spaceCount;

  // Character Bar Percentages
  const total = charCount || 1;
  if (document.getElementById('bar-uppercase')) document.getElementById('bar-uppercase').style.width = `${(uppercaseCount / total) * 100}%`;
  if (document.getElementById('bar-lowercase')) document.getElementById('bar-lowercase').style.width = `${(lowercaseCount / total) * 100}%`;
  if (document.getElementById('bar-digit')) document.getElementById('bar-digit').style.width = `${(digitCount / total) * 100}%`;
  if (document.getElementById('bar-symbol')) document.getElementById('bar-symbol').style.width = `${(symbolCount / total) * 100}%`;
  if (document.getElementById('bar-space')) document.getElementById('bar-space').style.width = `${(spaceCount / total) * 100}%`;

  // Flesch Reading Ease Readability Formula
  let flesch = 0;
  let fleschLabel = 'N/A';
  if (wordCount > 0 && sentenceCount > 0) {
    const syllableCount = countSyllables(text);
    flesch = Math.round(206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllableCount / wordCount)));
    if (flesch >= 90) fleschLabel = 'Very Easy';
    else if (flesch >= 70) fleschLabel = 'Easy / Casual';
    else if (flesch >= 50) fleschLabel = 'Fair / Standard';
    else if (flesch >= 30) fleschLabel = 'Difficult / Academic';
    else fleschLabel = 'Very Confusing';
  }
  const readBadge = document.getElementById('readability-badge');
  if (readBadge) readBadge.textContent = `Flesch Score: ${flesch} (${fleschLabel})`;

  // Keyword Frequency Distribution
  renderKeywordFrequencies(trimmed);
}

function countSyllables(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  let count = 0;
  words.forEach(w => {
    if (w.length <= 3) { count += 1; return; }
    const matches = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
                     .replace(/^y/, '')
                     .match(/[aeiouy]{1,2}/g);
    count += matches ? matches.length : 1;
  });
  return count || 1;
}

function renderKeywordFrequencies(text) {
  const container = document.getElementById('keywords-list');
  if (!container) return;

  if (!text) {
    container.innerHTML = '<p class="text-faded">Enter text to calculate keyword density.</p>';
    return;
  }

  // Split into words and normalize
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2); // Exclude trivial 1-2 char words

  if (words.length === 0) {
    container.innerHTML = '<p class="text-faded">No significant keywords found.</p>';
    return;
  }

  const freqMap = {};
  words.forEach(w => {
    freqMap[w] = (freqMap[w] || 0) + 1;
  });

  const sortedKeywords = Object.keys(freqMap)
    .map(key => ({ word: key, count: freqMap[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8

  const maxCount = sortedKeywords[0].count;

  container.innerHTML = sortedKeywords.map(k => {
    const pct = Math.round((k.count / maxCount) * 100);
    return `
      <div class="kw-row">
        <span class="kw-text">${escapeHtml(k.word)}</span>
        <div class="kw-progress-wrap">
          <div class="kw-progress-bar" style="width: ${pct}%;"></div>
        </div>
        <span class="kw-count">${k.count}x</span>
      </div>`;
  }).join('');
}

function applyStringTransformation(mode) {
  const textArea = document.getElementById('analytics-text');
  if (!textArea || !textArea.value) return;

  let val = textArea.value;
  switch (mode) {
    case 'uppercase':
      val = val.toUpperCase();
      break;
    case 'lowercase':
      val = val.toLowerCase();
      break;
    case 'titlecase':
      val = val.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
      break;
    case 'camelcase':
      val = val.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
      break;
    case 'snakecase':
      val = val.trim().toLowerCase().replace(/[\s\W]+/g, '_');
      break;
    case 'kebabcase':
      val = val.trim().toLowerCase().replace(/[\s\W]+/g, '-');
      break;
    case 'reverse':
      val = val.split('').reverse().join('');
      break;
    case 'strip':
      val = val.replace(/\s+/g, ' ').trim();
      break;
    case 'base64enc':
      try { val = btoa(unescape(encodeURIComponent(val))); } catch (e) { showToast('Base64 Encode error', 'fa-triangle-exclamation'); }
      break;
    case 'base64dec':
      try { val = decodeURIComponent(escape(atob(val))); } catch (e) { showToast('Invalid Base64 string', 'fa-triangle-exclamation'); }
      break;
    case 'urlenc':
      val = encodeURIComponent(val);
      break;
    case 'urldec':
      try { val = decodeURIComponent(val); } catch (e) { showToast('URL Decode error', 'fa-triangle-exclamation'); }
      break;
  }

  textArea.value = val;
  analyzeText(val);
  incrementTransformStat();
  showToast(`Applied ${mode} transformation!`, 'fa-wand-magic-sparkles');
}

function updateFindMatches() {
  const textArea = document.getElementById('analytics-text');
  const findQuery = document.getElementById('find-query');
  const countBadge = document.getElementById('matches-count-badge');
  const isRegex = document.getElementById('find-is-regex').checked;
  const isCaseSens = document.getElementById('find-case-sens').checked;

  if (!textArea || !findQuery || !countBadge) return;
  const text = textArea.value;
  const query = findQuery.value;

  if (!text || !query) {
    countBadge.textContent = '0 matches found';
    return;
  }

  let matchCount = 0;
  try {
    if (isRegex) {
      const flags = 'g' + (isCaseSens ? '' : 'i');
      const regex = new RegExp(query, flags);
      const matches = text.match(regex);
      matchCount = matches ? matches.length : 0;
    } else {
      let tempText = isCaseSens ? text : text.toLowerCase();
      let tempQuery = isCaseSens ? query : query.toLowerCase();
      let pos = tempText.indexOf(tempQuery);
      while (pos !== -1) {
        matchCount++;
        pos = tempText.indexOf(tempQuery, pos + tempQuery.length);
      }
    }
  } catch (e) {
    matchCount = 0;
  }

  countBadge.textContent = `${matchCount} match${matchCount === 1 ? '' : 'es'} found`;
}

function executeFindAndReplace() {
  const textArea = document.getElementById('analytics-text');
  const findQuery = document.getElementById('find-query').value;
  const replaceQuery = document.getElementById('replace-query').value;
  const isRegex = document.getElementById('find-is-regex').checked;
  const isCaseSens = document.getElementById('find-case-sens').checked;

  if (!textArea || !findQuery) return;
  const text = textArea.value;

  let newText = text;
  try {
    if (isRegex) {
      const flags = 'g' + (isCaseSens ? '' : 'i');
      const regex = new RegExp(findQuery, flags);
      newText = text.replace(regex, replaceQuery);
    } else {
      if (isCaseSens) {
        newText = text.replaceAll(findQuery, replaceQuery);
      } else {
        const regex = new RegExp(escapeRegex(findQuery), 'gi');
        newText = text.replace(regex, replaceQuery);
      }
    }
    textArea.value = newText;
    analyzeText(newText);
    updateFindMatches();
    incrementTransformStat();
    showToast('Find & Replace completed!', 'fa-repeat');
  } catch (e) {
    showToast('Replace error: check regex syntax', 'fa-triangle-exclamation');
  }
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ==========================================================================
   MODULE 4: LIVE REGEX TESTER & CHEATSHEET
   ========================================================================== */
function initRegexTester() {
  const patternInput = document.getElementById('regex-pattern-input');
  const flagsInput = document.getElementById('regex-flags-input');
  const corpusInput = document.getElementById('regex-test-text');
  const usePatternBtns = document.querySelectorAll('.btn-use-pattern');

  if (!patternInput) return;

  const runTester = () => {
    evaluateCustomRegex();
  };

  patternInput.addEventListener('input', runTester);
  flagsInput.addEventListener('input', runTester);
  corpusInput.addEventListener('input', runTester);

  usePatternBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pat = btn.getAttribute('data-pattern');
      const flg = btn.getAttribute('data-flags') || 'g';
      patternInput.value = pat;
      flagsInput.value = flg;
      runTester();
      showToast('Loaded pattern into Regex Tester!', 'fa-terminal');
    });
  });
}

function evaluateCustomRegex() {
  const patVal = document.getElementById('regex-pattern-input').value;
  const flagsVal = document.getElementById('regex-flags-input').value;
  const textVal = document.getElementById('regex-test-text').value;

  const matchCountEl = document.getElementById('regex-match-count');
  const errorBadge = document.getElementById('regex-error-badge');
  const highlightBox = document.getElementById('regex-highlight-box');
  const groupsList = document.getElementById('regex-groups-list');

  if (!patVal || !textVal) {
    matchCountEl.textContent = '0';
    errorBadge.className = 'regex-status-badge';
    errorBadge.textContent = 'Awaiting Pattern';
    highlightBox.textContent = textVal;
    groupsList.innerHTML = '';
    return;
  }

  try {
    // Make sure global flag 'g' is set for multi-match highlight
    let effectiveFlags = flagsVal;
    if (!effectiveFlags.includes('g')) effectiveFlags += 'g';

    const regex = new RegExp(patVal, effectiveFlags);
    errorBadge.className = 'regex-status-badge';
    errorBadge.textContent = 'Valid Pattern';

    const matches = Array.from(textVal.matchAll(new RegExp(patVal, effectiveFlags)));
    matchCountEl.textContent = matches.length;

    // Render Highlighted Text
    let lastIndex = 0;
    let htmlOutput = '';

    matches.forEach(m => {
      const matchText = m[0];
      const matchIndex = m.index;

      // Unmatched prefix
      htmlOutput += escapeHtml(textVal.slice(lastIndex, matchIndex));
      // Highlighted match
      htmlOutput += `<span class="regex-hl">${escapeHtml(matchText)}</span>`;
      lastIndex = matchIndex + matchText.length;
    });
    htmlOutput += escapeHtml(textVal.slice(lastIndex));

    highlightBox.innerHTML = htmlOutput || escapeHtml(textVal);

    // Render Detailed Match List
    if (matches.length > 0) {
      groupsList.innerHTML = matches.slice(0, 15).map((m, idx) => `
        <div class="match-detail-item">
          <span><strong>Match #${idx + 1}:</strong> <code>${escapeHtml(m[0])}</code></span>
          <span>Index: ${m.index}</span>
        </div>
      `).join('');
    } else {
      groupsList.innerHTML = '<p class="text-faded">No match groups found in target text.</p>';
    }

  } catch (err) {
    errorBadge.className = 'regex-status-badge error';
    errorBadge.textContent = 'Invalid Syntax';
    matchCountEl.textContent = '0';
    highlightBox.textContent = textVal;
    groupsList.innerHTML = `<p class="text-rose">${escapeHtml(err.message)}</p>`;
  }
}

/* ==========================================================================
   INITIAL PRE-POPULATED DATA LOADER
   ========================================================================== */
function loadInitialDefaults() {
  // Load Default Email Test
  const defaultEmail = 'anish.singh2407@gmail.com';
  const emailInput = document.getElementById('email-input');
  if (emailInput) {
    emailInput.value = defaultEmail;
    runEmailValidation(defaultEmail);
  }

  // Load Extractor Sample Text
  const extractorInput = document.getElementById('extractor-input');
  if (extractorInput) {
    extractorInput.value = `ACME Corporation System Audit & Contact Directory:
[2026-08-13 09:30:11] Log entry: Admin user anish.singh2407@gmail.com authenticated from IP 192.168.1.10.
Support Hotline: +91 98765-43210 or 1800-555-0199.
Official Site: https://acme-corp.org/portal | Billing Portal: https://payments.acme-corp.org/pay

Customer Orders & Subscriptions:
- Order #100492: Amount ₹14,999.00 processed on 2026-08-10 for client.support@partner.co.in.
- Order #100493: Amount $450.00 USD processed on 2026-08-11.
Social Hashtags: #acme #cloud #webdev | Team Mentions: @anish_dev @operations_lead`;
    processExtraction(extractorInput.value);
  }

  // Load Text Analytics Corpus
  const analyticsInput = document.getElementById('analytics-text');
  if (analyticsInput) {
    analyticsInput.value = `Welcome to Experiment 6! Please send your questions to developer Anish Singh at anish.singh2407@gmail.com and support@university.edu.in. Regular expressions and string methods allow developers to easily parse, sanitize, and analyze textual data for mail presence.`;
    analyzeText(analyticsInput.value);
    updateFindMatches();
  }

  // Evaluate Custom Regex Tester
  evaluateCustomRegex();
}
