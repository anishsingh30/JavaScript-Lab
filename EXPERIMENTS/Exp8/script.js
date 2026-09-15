/**
 * ==========================================================================
 * Experiment 8 - Gym Admission Form Validation
 * Developer: ANISH SINGH (PRN: 24070521214)
 * 
 * Required Methods & Syntax used:
 * 1. getElementById()        : document.getElementById("id")
 * 2. .value                  : input.value
 * 3. addEventListener()      : element.addEventListener("event", function(){})
 * 4. "input" event           : input.addEventListener("input", function(){})
 * 5. "change" event          : select.addEventListener("change", function(){})
 * 6. "submit" event          : form.addEventListener("submit", function(event){})
 * ==========================================================================
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  
  // ------------------------------------------------------------------------
  // 1. Accessing Form Elements using document.getElementById()
  // ------------------------------------------------------------------------
  const form = document.getElementById("gymAdmissionForm");
  
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobile");
  const ageInput = document.getElementById("age");
  const planSelect = document.getElementById("plan");
  const slotSelect = document.getElementById("slot");

  const resetBtn = document.getElementById("resetBtn");
  const submitBtn = document.getElementById("submitBtn");

  // Group Containers & Feedback Message Elements
  const groupFullName = document.getElementById("group-fullName");
  const msgFullName = document.getElementById("msg-fullName");

  const groupEmail = document.getElementById("group-email");
  const msgEmail = document.getElementById("msg-email");

  const groupMobile = document.getElementById("group-mobile");
  const msgMobile = document.getElementById("msg-mobile");

  const groupAge = document.getElementById("group-age");
  const msgAge = document.getElementById("msg-age");

  const groupPlan = document.getElementById("group-plan");
  const msgPlan = document.getElementById("msg-plan");

  // Progress Bar Elements
  const progressBar = document.getElementById("progress-bar");
  const progressPercent = document.getElementById("progress-percent");

  // Live Member Pass Preview Elements
  const previewName = document.getElementById("preview-name");
  const previewEmail = document.getElementById("preview-email");
  const previewPhone = document.getElementById("preview-phone");
  const previewAge = document.getElementById("preview-age");
  const previewSlot = document.getElementById("preview-slot");
  const previewPlan = document.getElementById("preview-plan");
  const previewStatus = document.getElementById("preview-status");

  // Modal Receipt Elements
  const modalBackdrop = document.getElementById("modalBackdrop");
  const closeModalBtn = document.getElementById("closeModalBtn");

  const receiptId = document.getElementById("receipt-id");
  const receiptName = document.getElementById("receipt-name");
  const receiptEmail = document.getElementById("receipt-email");
  const receiptMobile = document.getElementById("receipt-mobile");
  const receiptAge = document.getElementById("receipt-age");
  const receiptPlan = document.getElementById("receipt-plan");
  const receiptSlot = document.getElementById("receipt-slot");

  // Validation Flags
  let fieldValidity = {
    fullName: false,
    email: false,
    mobile: false,
    age: false,
    plan: false
  };

  // ------------------------------------------------------------------------
  // 2. Validation Functions (Accessing values via .value)
  // ------------------------------------------------------------------------

  /**
   * Validate Full Name field
   */
  function validateFullName() {
    const value = fullNameInput.value.trim();
    // Rule: Must be at least 3 characters and contain only letters and spaces
    const nameRegex = /^[A-Za-z\s]{3,}$/;

    if (value === "") {
      setFieldState(groupFullName, msgFullName, false, "Full name is required.");
      fieldValidity.fullName = false;
    } else if (!nameRegex.test(value)) {
      setFieldState(groupFullName, msgFullName, false, "Name must be at least 3 letters (letters & spaces only).");
      fieldValidity.fullName = false;
    } else {
      setFieldState(groupFullName, msgFullName, true, "✓ Valid name entered.");
      fieldValidity.fullName = true;
    }
  }

  /**
   * Validate Email Address field
   */
  function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === "") {
      setFieldState(groupEmail, msgEmail, false, "Email address is required.");
      fieldValidity.email = false;
    } else if (!emailRegex.test(value)) {
      setFieldState(groupEmail, msgEmail, false, "Please enter a valid email address (e.g. user@domain.com).");
      fieldValidity.email = false;
    } else {
      setFieldState(groupEmail, msgEmail, true, "✓ Valid email format.");
      fieldValidity.email = true;
    }
  }

  /**
   * Validate Mobile Number field (10-digit check)
   */
  function validateMobile() {
    const value = mobileInput.value.trim();
    // Rule: Exactly 10 digits
    const mobileRegex = /^[0-9]{10}$/;

    if (value === "") {
      setFieldState(groupMobile, msgMobile, false, "Mobile number is required.");
      fieldValidity.mobile = false;
    } else if (!mobileRegex.test(value)) {
      setFieldState(groupMobile, msgMobile, false, `Must be exactly 10 digits (${value.length}/10 entered).`);
      fieldValidity.mobile = false;
    } else {
      setFieldState(groupMobile, msgMobile, true, "✓ Valid 10-digit mobile number.");
      fieldValidity.mobile = true;
    }
  }

  /**
   * Validate Age field (range 14 to 90)
   */
  function validateAge() {
    const value = ageInput.value.trim();
    const ageNum = parseInt(value, 10);

    if (value === "") {
      setFieldState(groupAge, msgAge, false, "Age is required.");
      fieldValidity.age = false;
    } else if (isNaN(ageNum) || ageNum < 14 || ageNum > 90) {
      setFieldState(groupAge, msgAge, false, "Age must be a valid number between 14 and 90 years.");
      fieldValidity.age = false;
    } else {
      setFieldState(groupAge, msgAge, true, "✓ Valid age entered.");
      fieldValidity.age = true;
    }
  }

  /**
   * Validate Membership Plan dropdown
   */
  function validatePlan() {
    const value = planSelect.value;

    if (!value || value === "") {
      setFieldState(groupPlan, msgPlan, false, "Please select a membership plan.");
      fieldValidity.plan = false;
    } else {
      setFieldState(groupPlan, msgPlan, true, "✓ Membership plan selected.");
      fieldValidity.plan = true;
    }
  }

  /**
   * Helper function to update input styling & feedback text
   */
  function setFieldState(groupElement, msgElement, isValid, message) {
    if (isValid) {
      groupElement.classList.remove("invalid");
      groupElement.classList.add("valid");
    } else {
      groupElement.classList.remove("valid");
      groupElement.classList.add("invalid");
    }
    msgElement.textContent = message;
  }

  // ------------------------------------------------------------------------
  // 3. Live UI Updates (Preview Card & Progress Bar)
  // ------------------------------------------------------------------------

  /**
   * Synchronize the right-hand side Member Pass Preview
   */
  function updateLivePreview() {
    previewName.textContent = fullNameInput.value.trim() || "-- Not Provided --";
    previewEmail.textContent = emailInput.value.trim() || "--";
    previewPhone.textContent = mobileInput.value.trim() || "--";
    previewAge.textContent = ageInput.value.trim() ? `${ageInput.value.trim()} yrs` : "--";
    previewSlot.textContent = slotSelect.value || "Evening";

    if (planSelect.value) {
      previewPlan.textContent = planSelect.value;
    } else {
      previewPlan.textContent = "Select a plan";
    }

    // Check overall form status
    const allValid = Object.values(fieldValidity).every(val => val === true);
    if (allValid) {
      previewStatus.textContent = "VERIFIED";
      previewStatus.className = "status-pill status-valid";
    } else {
      previewStatus.textContent = "DRAFTING";
      previewStatus.className = "status-pill status-draft";
    }
  }

  /**
   * Calculate and update progress bar
   */
  function updateProgress() {
    const totalFields = Object.keys(fieldValidity).length;
    const validCount = Object.values(fieldValidity).filter(Boolean).length;
    const percentage = Math.round((validCount / totalFields) * 100);

    progressBar.style.width = percentage + "%";
    progressPercent.textContent = percentage + "%";
  }

  // ------------------------------------------------------------------------
  // 4. Attaching Live Event Listeners using addEventListener()
  // ------------------------------------------------------------------------

  // A. Live input validation on typing ("input" event)
  fullNameInput.addEventListener("input", function () {
    validateFullName();
    updateLivePreview();
    updateProgress();
  });

  emailInput.addEventListener("input", function () {
    validateEmail();
    updateLivePreview();
    updateProgress();
  });

  mobileInput.addEventListener("input", function () {
    // Restrict input to digits only
    this.value = this.value.replace(/[^0-9]/g, '');
    validateMobile();
    updateLivePreview();
    updateProgress();
  });

  ageInput.addEventListener("input", function () {
    validateAge();
    updateLivePreview();
    updateProgress();
  });

  // B. Dropdown selection change ("change" event)
  planSelect.addEventListener("change", function () {
    validatePlan();
    updateLivePreview();
    updateProgress();
  });

  slotSelect.addEventListener("change", function () {
    updateLivePreview();
  });

  // C. Form Reset button
  resetBtn.addEventListener("click", function () {
    form.reset();
    
    // Clear validation styling
    [groupFullName, groupEmail, groupMobile, groupAge, groupPlan].forEach(group => {
      group.classList.remove("valid", "invalid");
    });

    msgFullName.textContent = "Full name must contain at least 3 letters.";
    msgEmail.textContent = "Enter a valid email address (e.g., name@domain.com).";
    msgMobile.textContent = "Must be exactly 10 numeric digits.";
    msgAge.textContent = "Age must be between 14 and 90 years.";
    msgPlan.textContent = "Please select a membership plan.";

    fieldValidity = { fullName: false, email: false, mobile: false, age: false, plan: false };
    updateLivePreview();
    updateProgress();
  });

  // ------------------------------------------------------------------------
  // 5. Form Submission Handling ("submit" event)
  // ------------------------------------------------------------------------
  form.addEventListener("submit", function (event) {
    // Prevent standard HTTP page refresh
    event.preventDefault();

    // Trigger validation on all fields
    validateFullName();
    validateEmail();
    validateMobile();
    validateAge();
    validatePlan();

    updateLivePreview();
    updateProgress();

    // Verify all mandatory fields
    const isFormValid = Object.values(fieldValidity).every(status => status === true);

    if (isFormValid) {
      // Generate random registration ID
      const randomID = "PFC-2026-" + Math.floor(1000 + Math.random() * 9000);
      
      receiptId.textContent = randomID;
      receiptName.textContent = fullNameInput.value.trim();
      receiptEmail.textContent = emailInput.value.trim();
      receiptMobile.textContent = mobileInput.value.trim();
      receiptAge.textContent = ageInput.value.trim() + " years";
      receiptPlan.textContent = planSelect.value;
      receiptSlot.textContent = slotSelect.value;

      // Show confirmation modal
      modalBackdrop.classList.add("active");
    } else {
      // Focus on first invalid field
      const firstInvalid = document.querySelector(".form-group.invalid input, .form-group.invalid select");
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  // Close Modal event listener
  closeModalBtn.addEventListener("click", function () {
    modalBackdrop.classList.remove("active");
  });

  // Initial Sync on Page Load
  updateLivePreview();
  updateProgress();
});
