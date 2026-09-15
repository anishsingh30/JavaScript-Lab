# Experiment 10: Asynchronous JSON Data Loading & Dynamic Table Rendering

**Developer:** Anish Singh  
**PRN:** 24070521214  
**Course:** Web Technologies Laboratory  
**Directory:** `Exp_10/`

---

## 📌 Experiment Objective
To load and display JSON data asynchronously using both:
1. Native JavaScript **`fetch()`** API (ES6 standard Promises).
2. jQuery **`$.getJSON()`** shorthand AJAX method.

And dynamically render the retrieved JSON records into an interactive, sortable, searchable, and responsive HTML `<table>`.

---

## 🛠️ Key Technologies & Concepts Implemented

- **Native `fetch()` API:**
  - Modern ES6 promise-based HTTP network requests.
  - Streaming response handling and explicit `.json()` body parsing.
  - `async/await` syntax with `try...catch` error handling.
- **jQuery `$.getJSON()`:**
  - Shorthand method for `$.ajax({ dataType: 'json', ... })`.
  - Automatic JSON deserialization into native JavaScript objects.
  - Integration with jQuery Deferred object (`.done()`, `.fail()`, `.always()`).
- **Dynamic DOM Generation:**
  - Dynamic generation of `<tr>` and `<td>` elements using `DocumentFragment` for performance.
  - Reactive search filtering across multiple fields (Name, Roll No, Department, Skills).
  - Multi-column dynamic ascending/descending sorting.
  - Detail modal inspector displaying structured fields and syntax-highlighted raw JSON.
- **Data Export:**
  - Export dynamically filtered table rows to CSV directly in the browser.
- **UI & Aesthetics:**
  - Dark / Light mode with smooth CSS variables and `localStorage` persistence.
  - Glassmorphic card styling, sticky table headers, animated hover states, and status pills.

---

## 📂 File Structure

```text
Exp_10/
│
├── index.html        # Main HTML layout, controls, table container, and comparison cards
├── styles.css        # Responsive CSS styling, CSS variables, dark/light themes, animations
├── script.js         # JavaScript logic for fetch(), $.getJSON(), dynamic rendering, sorting & filtering
├── data.json         # Structured JSON dataset containing student academic records
└── README.md         # Experiment documentation and theoretical breakdown
```

---

## 🔬 Code Comparison: `fetch()` vs `$.getJSON()`

### 1. Native `fetch()` Implementation
```javascript
async function loadDataWithFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // Explicit stream parsing
    renderTable(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

### 2. jQuery `$.getJSON()` Implementation
```javascript
function loadDataWithJQuery(url) {
  $.getJSON(url)
    .done(function (data, textStatus, jqXHR) {
      // Automatically parses JSON response
      renderTable(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.error('jQuery error:', textStatus, errorThrown);
    });
}
```

---

## 🚀 How to Run

1. Open the project folder in VS Code.
2. Right-click on `Exp_10/index.html` and choose **"Open with Live Server"** (or run a lightweight local HTTP server, e.g., `python -m http.server 8000`).
3. Click **"Load via Native fetch()"** or **"Load via jQuery $.getJSON()"** to fetch and render the student data.
4. Interact with the live search box, filter dropdowns, sort headers, and record view modals.
