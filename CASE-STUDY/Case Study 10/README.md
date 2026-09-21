# Case Study 10: Campus Event Registration System

**Developer:** Anish Singh  
**PRN:** 24070521214  
**Course:** Web Technologies Laboratory  
**Directory:** `Case Study 10/`

---

## 📌 Case Study Scenario & Problem Statement

A college maintains student registration data for various campus events in a JSON file (`students.json`). The event coordinator wants a web application that can load this information dynamically and display it in an interactive table without manually entering the data.

### Required Tasks & Implementation Mapping

| # | Case Study Requirement | Implementation in Project |
|---|------------------------|---------------------------|
| **1** | Create a `students.json` file containing details: Student Name, PRN, Department, Year, Event Name, Registration Status | Created `students.json` containing 16 comprehensive student records across various branches and events. |
| **2** | Use JavaScript `fetch()` to load the JSON data | Implemented `loadWithFetch()` using modern ES6 `async/await` and `response.json()`. |
| **3** | Display the retrieved data dynamically in an HTML table | Implemented `renderTableRows()` using dynamic DOM generation with high-performance `DocumentFragment`. |
| **4** | Add a **"Load Student Data"** button to fetch and display the information | Implemented `#loadDataBtn` (plus quick-action buttons for direct testing of both `fetch` and jQuery). |
| **5** | Provide a search box to search students by **name or PRN** | Real-time interactive search with `<input id="searchInput">` and substring match highlighting. |
| **6** | Add a dropdown to filter students by **Registration Status** (`Registered`, `Pending`, `Cancelled`) | Implemented `<select id="statusFilter">` with reactive multi-criteria filtering combined with search. |
| **7** | Implement the same JSON loading functionality using jQuery **`$.getJSON()`** instead of `fetch()` | Implemented `loadWithJQuery()` utilizing jQuery's shorthand AJAX method with `.done()` and `.fail()`. |
| **8** | Display an appropriate message if: <br>a) JSON data cannot be loaded.<br>b) No student matches the search/filter criteria. | Implemented custom error state `#errorState` with retry button, plus `#noMatchState` when filters yield 0 results. |

---

## 📂 File Structure

```text
Case Study 10/
│
├── index.html            # Main UI layout, control toolbar, KPI cards, table container & technical reference
├── styles.css            # Modern glassmorphic design, dark/light themes, status pills, responsive layout
├── script.js             # Core logic for fetch(), $.getJSON(), dynamic table rendering, search & filters
├── students.json         # Structured JSON dataset containing campus event registrations
├── jquery-3.7.1.min.js   # Local jQuery library for full offline functionality
└── README.md             # Detailed documentation and verification instructions
```

---

## 🔬 Technical Comparison: `fetch()` vs `jQuery $.getJSON()`

### 1. Native JavaScript `fetch()` (Requirement #2)
```javascript
async function loadWithFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    const data = await response.json(); // Explicit stream parsing to JSON object
    handleLoadSuccess(data, 'Native JavaScript fetch()');
  } catch (error) {
    handleLoadError('JSON data cannot be loaded via fetch()', error.message);
  }
}
```
- **Standard:** Built directly into modern browsers (ES6+), requires no external dependencies.
- **Promise Behavior:** Does not reject on HTTP error statuses (such as 404 or 500); requires explicit manual check on `response.ok`.
- **Parsing:** Body stream must be explicitly parsed using `response.json()`.

### 2. jQuery `$.getJSON()` (Requirement #7)
```javascript
function loadWithJQuery(url) {
  $.getJSON(url)
    .done(function (data) {
      // jQuery automatically deserializes the JSON string into an Object/Array
      handleLoadSuccess(data, 'jQuery $.getJSON()');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      handleLoadError('JSON data cannot be loaded via jQuery $.getJSON()', errorThrown);
    });
}
```
- **Convenience:** Automatically deserializes the JSON response; no secondary `.json()` step required.
- **Fail Handling:** Automatically rejects the Deferred promise on HTTP 4xx/5xx errors, calling the `.fail()` handler.

---

## 🚀 How to Run & Verify

1. **Start a Local HTTP Server** (required for `fetch()` / AJAX security policies):
   In the project folder or root directory, start any local web server:
   ```bash
   # Option A: Using Python built-in server
   python -m http.server 8000

   # Option B: Using VS Code Live Server extension
   # Right-click on "Case Study 10/index.html" -> "Open with Live Server"
   ```
2. Navigate to:
   ```text
   http://localhost:8000/Case%20Study%2010/
   ```

3. **Verify Each Requirement:**
   - **Load via fetch():** Select "JavaScript `fetch()`" and click **"Load Student Data"** (or click **"Load via fetch()"**). Verify that 16 student records render in the table.
   - **Load via jQuery:** Select "jQuery `$.getJSON()`" and click **"Load Student Data"** (or click **"Load via $.getJSON()"**). Verify successful loading.
   - **Search Box:** Type a name (e.g., `Anish`) or PRN (e.g., `24070521214`) into the search bar. Observe immediate filtering and text highlighting.
   - **Status Dropdown Filter:** Select `Registered`, `Pending`, or `Cancelled`. The table instantly displays only matching records.
   - **No Match Message:** Type an arbitrary search string like `xyz999`. The UI displays the custom "No Matching Students Found" state.
   - **Simulate Load Error:** Click the **"⚠️ Simulate Error"** button. The UI immediately displays the "JSON Data Cannot Be Loaded" card with retry actions.
   - **Theme Toggle:** Click the theme toggle button in the upper right to switch between Dark and Light modes.
