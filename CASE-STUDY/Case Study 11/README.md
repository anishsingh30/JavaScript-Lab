# Case Study 11: Smart Class Scheduler

**Student:** Anish Singh  
**PRN:** 24070521214  
**Course:** Web Technologies / Advanced Client-Side Scripting  
**Directory:** `Case Study 11/`  
**Theme:** Classic Academic White Theme  

---

## 📌 Problem Statement & Objectives

A college wants to develop a **Smart Class Scheduler** for students. The webpage displays:
1. The **current class** in session.
2. The **next scheduled class**.
3. A **real-time countdown** showing how much time is left before the current class ends or the next class begins.
4. Automatic updates without refreshing the webpage.

### Task Specifications & Implementation Mapping

| # | Specification | Implementation in Code |
|---|---------------|-------------------------|
| **1.1** | Store at least 5 classes in a JavaScript array | Defined `defaultScheduleData` array in `script.js` containing 5 comprehensive academic classes. |
| **1.2** | Each class contains: Subject name, Faculty name, Classroom, Start time, End time | Stored in each object: `subject`, `faculty`, `classroom`, `startTime`, and `endTime`. |
| **2.1** | Use `setInterval()` to update the countdown every second | `setInterval(updateScheduler, 1000)` executes every second to update the clock, calculate remaining seconds, and refresh DOM elements. |
| **2.2** | Display format: <br>&bull; `Class in progress - 00:25:36 remaining`<br>OR<br>&bull; `Next class starts in - 00:12:45` | Formatted via `formatRemainingDuration()` and rendered into `#countdownDisplay` following the prompt's exact format. |
| **2.3** | Automatically move to next class when countdown reaches zero | Scheduler automatically detects the transition when remaining seconds reach `0` and switches state to the next scheduled lecture or break. |
| **3.1** | Use `setTimeout()` to display a notification such as: *"Your class will start in 5 minutes."* | `displayNotification()` dynamically shows a notification banner and schedules auto-dismissal using `setTimeout()`. |
| **3.2** | Notification automatically disappears after a few seconds | `setTimeout(() => { toast.classList.remove('show'); }, durationMs)` automatically dismisses the toast notification without requiring page refresh. |

---

## 📂 File Structure

```text
Case Study 11/
│
├── index.html     # Semantic HTML5 layout (Header, Live Clock, Countdown Banner, Split Cards, Routine Table)
├── styles.css     # Classic academic white theme (Clean slate/navy palette, high contrast, responsive)
├── script.js      # JavaScript array (5+ classes), setInterval() countdown ticker, setTimeout() notifications
└── README.md      # Comprehensive academic submission documentation
```

---

## 🛠️ Key Implementation Highlights

### 1. Class Schedule Array (Requirement 1)
```javascript
const defaultScheduleData = [
  {
    id: 1,
    subject: "Data Structures & Algorithms",
    faculty: "Dr. Rajesh Sharma",
    classroom: "Lab 3 (Ground Floor)",
    startTime: "09:00:00",
    endTime: "10:00:00"
  },
  {
    id: 2,
    subject: "Web Technologies",
    faculty: "Prof. Neha Gupta",
    classroom: "Room 405 (Academic Block B)",
    startTime: "10:15:00",
    endTime: "11:15:00"
  },
  {
    id: 3,
    subject: "Database Management Systems",
    faculty: "Dr. Arvind Kumar",
    classroom: "Seminar Hall 2",
    startTime: "11:30:00",
    endTime: "12:30:00"
  },
  {
    id: 4,
    subject: "Computer Networks",
    faculty: "Prof. Priya Verma",
    classroom: "Network & Security Lab",
    startTime: "13:30:00",
    endTime: "14:30:00"
  },
  {
    id: 5,
    subject: "Operating Systems",
    faculty: "Dr. Suresh Patel",
    classroom: "Room 302 (Academic Block A)",
    startTime: "14:45:00",
    endTime: "15:45:00"
  }
];
```

### 2. Real-Time Countdown Engine via `setInterval()` (Requirement 2)
The scheduler calculates elapsed and remaining seconds against the active class or upcoming class every 1000 milliseconds:
```javascript
setInterval(updateScheduler, 1000);
```
- When a class is active:
  `countdownDisplay.textContent = \`Class in progress - \${formatRemainingDuration(remainingSecs)} remaining\`;`
- When waiting between sessions:
  `countdownDisplay.textContent = \`Next class starts in - \${formatRemainingDuration(secondsUntilStart)}\`;`
- When timer reaches 0, the next second's update cycle seamlessly moves to the next class state.

### 3. Temporary Notification via `setTimeout()` (Requirement 3)
```javascript
function displayNotification(message, title = "Class Reminder", durationMs = 4500) {
  toastTitleEl.textContent = title;
  toastMessageEl.textContent = message;

  if (notificationTimeoutId) {
    clearTimeout(notificationTimeoutId);
  }

  notificationToastEl.classList.add("show");

  // Automatically dismisses after durationMs using setTimeout()
  notificationTimeoutId = setTimeout(() => {
    notificationToastEl.classList.remove("show");
    notificationTimeoutId = null;
  }, durationMs);
}
```

---

## 🚀 How to Run & Test

1. **Direct Browser Open:**
   - Double-click `Case Study 11/index.html` or drag it into any modern web browser (Edge, Chrome, Firefox).
   - Zero dependencies or local build tools required.

2. **Evaluation Controls Provided in UI:**
   - **Sync Schedule to Current Time:** Calibrates the 5 classes around the current clock time so live countdowns and transitions can be evaluated at any hour.
   - **Test 10s Countdown:** Sets the current lecture to end in 10 seconds to quickly verify automatic class progression at `00:00:00`.
   - **Test 5-Min Notification:** Manually triggers the temporary banner: *"Your class will start in 5 minutes."* and proves that `setTimeout()` automatically dismisses it after 4 seconds.
   - **Reset Schedule:** Restores the standard 09:00 AM &ndash; 03:45 PM academic routine.

---
&copy; Academic Session &bull; Smart Class Scheduler &bull; Anish Singh (PRN: 24070521214)
