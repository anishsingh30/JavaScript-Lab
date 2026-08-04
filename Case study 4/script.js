/**
 * Real-Time Case Study 4: ATM Card PIN Verification Using JavaScript Functions
 * 
 * Technical Concepts Demonstrated:
 * 1. Function Declaration (reversePIN)
 * 2. Function Expression (checkIsPalindrome)
 * 3. Arrow Function (generateSecurityAlert)
 * 4. Scope Concepts (Global Scope, Function Scope, Block Scope)
 * 5. Closure Concepts (createATMSessionTracker)
 */

// ==========================================
// 1. GLOBAL SCOPE DEMONSTRATION
// ==========================================
// Global scope variables accessible anywhere in this script
const BANK_SYSTEM_NAME = "SecureBank ATM Gateway v4.2";
let globalTotalVerificationsCount = 0;

// ==========================================
// 2. CLOSURE DEMONSTRATION
// ==========================================
/**
 * Closure Creator: createATMSessionTracker
 * Returns an object with methods that maintain access to private variables
 * (totalAttempts, palindromeCount, historyLog) via Closure.
 */
function createATMSessionTracker() {
    // Private variables encapsulated within the closure
    let totalAttempts = 0;
    let palindromeCount = 0;
    let nonPalindromeCount = 0;
    const historyLog = [];

    return {
        recordVerification: function(pin, reversedPin, isPalindrome, securityNotice) {
            totalAttempts++;
            if (isPalindrome) {
                palindromeCount++;
            } else {
                nonPalindromeCount++;
            }

            const record = {
                id: totalAttempts,
                pin: pin,
                reversedPin: reversedPin,
                isPalindrome: isPalindrome,
                message: securityNotice.message,
                securityCode: securityNotice.securityCode,
                timestamp: new Date().toLocaleTimeString()
            };

            historyLog.unshift(record); // Insert at beginning
            return record;
        },

        getStats: function() {
            return {
                totalAttempts: totalAttempts,
                palindromeCount: palindromeCount,
                nonPalindromeCount: nonPalindromeCount
            };
        },

        getHistory: function() {
            return historyLog;
        },

        resetSession: function() {
            totalAttempts = 0;
            palindromeCount = 0;
            nonPalindromeCount = 0;
            historyLog.length = 0;
        }
    };
}

// Instantiate the closure instance
const atmSession = createATMSessionTracker();


// ==========================================
// 3. FUNCTION DECLARATION DEMONSTRATION
// ==========================================
/**
 * Reverses the entered PIN string.
 * Syntax: Function Declaration
 * @param {string} pin - Input PIN
 * @returns {string} Reversed PIN string
 */
function reversePIN(pin) {
    // --- FUNCTION SCOPE DEMONSTRATION ---
    // 'executionMessage' is scoped exclusively to the reversePIN function.
    var executionMessage = "Executing reversePIN function declaration...";
    console.log(executionMessage);

    let reversedStr = "";

    // --- BLOCK SCOPE DEMONSTRATION ---
    // 'i' and 'digit' exist only inside this for-loop block
    for (let i = pin.length - 1; i >= 0; i--) {
        const digit = pin[i]; // Block-scoped constant
        reversedStr += digit;
    }

    return reversedStr;
}


// ==========================================
// 4. FUNCTION EXPRESSION DEMONSTRATION
// ==========================================
/**
 * Compares the original PIN and reversed PIN to determine palindrome status.
 * Syntax: Function Expression
 */
const checkIsPalindrome = function(originalPin, reversedPin) {
    if (!originalPin || originalPin.length === 0) {
        return false;
    }
    // Simple exact match check between original string and reversed string
    return originalPin === reversedPin;
};


// ==========================================
// 5. ARROW FUNCTION DEMONSTRATION
// ==========================================
/**
 * Generates security response payload based on palindrome status.
 * Syntax: Arrow Function
 */
const generateSecurityAlert = (pin, isPalindrome) => {
    // --- BLOCK SCOPE DEMONSTRATION inside arrow function ---
    if (isPalindrome) {
        const alertCode = "PAL-SEC-" + Math.floor(1000 + Math.random() * 9000);
        return {
            title: "🔒 SPECIAL BANK SECURITY ALERT",
            message: `PALINDROMIC PIN DETECTED ('${pin}'). This PIN reads identically forward and backward. Special security protocol activated!`,
            statusClass: "status-palindrome",
            badgeText: "PALINDROMIC SYMMETRY DETECTED",
            securityCode: alertCode
        };
    } else {
        const reversed = reversePIN(pin);
        const alertCode = "STD-SEC-" + Math.floor(1000 + Math.random() * 9000);
        return {
            title: "✅ STANDARD SECURITY CLEARANCE",
            message: `PIN '${pin}' successfully verified. Reversed PIN is '${reversed}'. Standard ATM transaction authorized.`,
            statusClass: "status-standard",
            badgeText: "STANDARD NON-PALINDROME PIN",
            securityCode: alertCode
        };
    }
};


// ==========================================
// UI INTERACTION & DOM BINDINGS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const pinInput = document.getElementById("pinInput");
    const verifyBtn = document.getElementById("verifyBtn");
    const clearBtn = document.getElementById("clearBtn");
    const toggleMaskBtn = document.getElementById("toggleMaskBtn");
    const sampleBtns = document.querySelectorAll(".sample-pin-btn");
    const keypadBtns = document.querySelectorAll(".keypad-btn");

    // Display elements
    const resultCard = document.getElementById("resultCard");
    const badgeElement = document.getElementById("palindromeBadge");
    const securityTitle = document.getElementById("securityTitle");
    const securityMessage = document.getElementById("securityMessage");
    const securityCodeEl = document.getElementById("securityCode");

    // Breakdown elements
    const origPinDisplay = document.getElementById("origPinDisplay");
    const revPinDisplay = document.getElementById("revPinDisplay");
    const symmetryStatus = document.getElementById("symmetryStatus");
    const visualizerContainer = document.getElementById("digitVisualizer");

    // Stats elements (Closure state)
    const totalAttemptsEl = document.getElementById("totalAttempts");
    const palindromeCountEl = document.getElementById("palindromeCount");
    const nonPalindromeCountEl = document.getElementById("nonPalindromeCount");
    const globalCountEl = document.getElementById("globalTotalCount");

    // History & Concepts
    const historyTableBody = document.getElementById("historyTableBody");
    const emptyHistoryMsg = document.getElementById("emptyHistoryMsg");

    let isMasked = false;

    // Toggle Masking
    if (toggleMaskBtn) {
        toggleMaskBtn.addEventListener("click", () => {
            isMasked = !isMasked;
            pinInput.type = isMasked ? "password" : "text";
            toggleMaskBtn.innerHTML = isMasked ? "👁️ Show PIN" : "🙈 Mask PIN";
        });
    }

    // Keypad Button Clicks
    keypadBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.getAttribute("data-val");
            if (val === "CLEAR") {
                pinInput.value = "";
            } else if (val === "DEL") {
                pinInput.value = pinInput.value.slice(0, -1);
            } else if (pinInput.value.length < 8) {
                pinInput.value += val;
            }
            // Trigger pulse effect
            btn.classList.add("pressed");
            setTimeout(() => btn.classList.remove("pressed"), 150);
        });
    });

    // Sample PIN Buttons
    sampleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const pinVal = btn.getAttribute("data-pin");
            pinInput.value = pinVal;
            handlePINVerification();
        });
    });

    // Clear Button
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            pinInput.value = "";
            resultCard.classList.add("hidden");
        });
    }

    // Verify Button
    if (verifyBtn) {
        verifyBtn.addEventListener("click", handlePINVerification);
    }

    // Enter Key Listener
    if (pinInput) {
        pinInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                handlePINVerification();
            }
        });
    }

    // Main Verification Function
    function handlePINVerification() {
        const pin = pinInput.value.trim();

        if (!pin) {
            alert("Please enter or select a PIN number to verify.");
            return;
        }

        // 1. Increment Global Scope counter
        globalTotalVerificationsCount++;

        // 2. Call Function Declaration to reverse PIN
        const reversedPin = reversePIN(pin);

        // 3. Call Function Expression to check palindrome
        const isPal = checkIsPalindrome(pin, reversedPin);

        // 4. Call Arrow Function to build security notice
        const notice = generateSecurityAlert(pin, isPal);

        // 5. Record inside Closure Instance
        const record = atmSession.recordVerification(pin, reversedPin, isPal, notice);

        // Update UI Visualizations
        renderResult(pin, reversedPin, isPal, notice);
        renderDigitVisualizer(pin, reversedPin);
        updateClosureStatsUI();
        renderHistoryUI();
    }

    // Render Verdict Result Card
    function renderResult(pin, reversedPin, isPal, notice) {
        resultCard.classList.remove("hidden");

        // Set Badge and Classes
        badgeElement.textContent = notice.badgeText;
        badgeElement.className = "badge " + notice.statusClass;

        securityTitle.textContent = notice.title;
        securityMessage.textContent = notice.message;
        securityCodeEl.textContent = notice.securityCode;

        origPinDisplay.textContent = pin;
        revPinDisplay.textContent = reversedPin;

        if (isPal) {
            symmetryStatus.textContent = "MATCH (Symmetric / Palindrome)";
            symmetryStatus.style.color = "#059669";
            resultCard.style.borderColor = "#10b981";
        } else {
            symmetryStatus.textContent = "NO MATCH (Asymmetric)";
            symmetryStatus.style.color = "#dc2626";
            resultCard.style.borderColor = "#3b82f6";
        }
    }

    // Render Digit Comparison Visualizer
    function renderDigitVisualizer(pin, reversedPin) {
        visualizerContainer.innerHTML = "";

        const length = pin.length;
        for (let i = 0; i < length; i++) {
            const origDigit = pin[i];
            const revDigit = reversedPin[i];
            const isMatch = (origDigit === revDigit);

            const card = document.createElement("div");
            card.className = `digit-card ${isMatch ? 'match' : 'mismatch'}`;

            card.innerHTML = `
                <div class="digit-index">Pos ${i+1}</div>
                <div class="digit-pair">
                    <span class="orig">${origDigit}</span>
                    <span class="arrow">↔</span>
                    <span class="rev">${revDigit}</span>
                </div>
                <div class="digit-status">${isMatch ? '✓ Equal' : '✗ Diff'}</div>
            `;

            visualizerContainer.appendChild(card);
        }
    }

    // Update Closure & Global Stats in UI
    function updateClosureStatsUI() {
        const stats = atmSession.getStats();

        totalAttemptsEl.textContent = stats.totalAttempts;
        palindromeCountEl.textContent = stats.palindromeCount;
        nonPalindromeCountEl.textContent = stats.nonPalindromeCount;
        globalCountEl.textContent = globalTotalVerificationsCount;
    }

    // Render Audit History Table
    function renderHistoryUI() {
        const history = atmSession.getHistory();

        if (history.length === 0) {
            emptyHistoryMsg.style.display = "block";
            historyTableBody.innerHTML = "";
            return;
        }

        emptyHistoryMsg.style.display = "none";
        historyTableBody.innerHTML = history.map(item => `
            <tr>
                <td>#${item.id}</td>
                <td><strong>${item.pin}</strong></td>
                <td><code>${item.reversedPin}</code></td>
                <td>
                    <span class="status-pill ${item.isPalindrome ? 'pill-palindrome' : 'pill-standard'}">
                        ${item.isPalindrome ? 'Palindromic' : 'Standard'}
                    </span>
                </td>
                <td><small>${item.securityCode}</small></td>
                <td>${item.timestamp}</td>
            </tr>
        `).join("");
    }
});
