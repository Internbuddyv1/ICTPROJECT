// ===== SIMPLE ROLE-BASED "AUTH" (PROTOTYPE) =====

// Demo users per role (you can change these)
const DEMO_USERS = {
    employee: {
      email: "employee@demo.com",
      password: "employee123",
      name: "John Doe",
      role: "employee"
    },
    manager: {
      email: "manager@demo.com",
      password: "manager123",
      name: "Alicia Patel",
      role: "manager"
    },
    hr: {
      email: "hr@demo.com",
      password: "hr123",
      name: "Sara Ahmed",
      role: "hr"
    }
  };
  
  // Landing page per role
  const ROLE_ROUTES = {
    employee: "index.html",
    manager: "manager-dashboard.html",
    hr: "hr-dashboard.html"
  };
  
  // ---- session helpers ----
  function setSession(user) {
    localStorage.setItem("tp_user", JSON.stringify(user));
  }
  
  function getSession() {
    try {
      const raw = localStorage.getItem("tp_user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to parse session", e);
      return null;
    }
  }
  
  function clearSession() {
    localStorage.removeItem("tp_user");
  }
  
  // Require certain role(s) to view page
  function requireRole(allowedRoles) {
    const user = getSession();
    if (!user) {
      window.location.href = "login.html?reason=unauthenticated";
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      window.location.href = "login.html?reason=unauthorized";
    }
  }
  
  // Update user name display in header if available
  function populateUserName() {
    const user = getSession();
    const nameEls = document.querySelectorAll("[data-user-name]");
    if (user && nameEls.length) {
      nameEls.forEach(el => {
        el.textContent = `${user.name} (${user.role.toUpperCase()})`;
      });
    }
  }
  
  // ---- LOGIN PAGE LOGIC ----
  function initLoginPage() {
    const roleCards = document.querySelectorAll(".role-card");
    const formTitle = document.getElementById("formTitle");
    const loginForm = document.getElementById("loginForm");
    const acceptTerms = document.getElementById("acceptTerms");
    const loginMessage = document.getElementById("loginMessage");
  
    let selectedRole = "employee";
  
    const roleTitles = {
      employee: "Employee login",
      manager: "Manager login",
      hr: "HR login"
    };
  
    // Role card selection
    roleCards.forEach(card => {
      card.addEventListener("click", () => {
        roleCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        selectedRole = card.getAttribute("data-role");
        formTitle.textContent = roleTitles[selectedRole] || "Login";
        loginMessage.textContent = "";
      });
    });
  
    // URL reason message (from route guards)
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");
    if (reason === "unauthenticated") {
      loginMessage.textContent = "Please log in to continue.";
      loginMessage.style.color = "red";
    } else if (reason === "unauthorized") {
      loginMessage.textContent = "You do not have access to that area with this role.";
      loginMessage.style.color = "red";
    }
  
    // Login submit
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      loginMessage.textContent = "";
      loginMessage.style.color = "red";
  
      if (!acceptTerms.checked) {
        loginMessage.textContent = "Please agree to the Terms & Conditions before logging in.";
        return;
      }
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
  
      const demoUser = DEMO_USERS[selectedRole];
      if (!demoUser) {
        loginMessage.textContent = "Unknown role. Please refresh the page.";
        return;
      }
  
      if (email === demoUser.email && password === demoUser.password) {
        setSession(demoUser);
        loginMessage.style.color = "green";
        loginMessage.textContent = "Login successful. Redirecting...";
        const target = ROLE_ROUTES[selectedRole] || "index.html";
        setTimeout(() => {
          window.location.href = target;
        }, 600);
      } else {
        loginMessage.textContent =
          "Invalid credentials for " +
          selectedRole +
          ". Try the demo:\n" +
          demoUser.email +
          " / " +
          demoUser.password;
      }
    });
  }
  
  // ---- GENERIC BUTTON ACTIONS (PROTOTYPE INTERACTIONS) ----
  function initPrototypeButtons() {
    document.querySelectorAll("[data-action]").forEach(el => {
      el.addEventListener("click", (e) => {
        const action = el.getAttribute("data-action");
        if (!action) return;
  
        // prevent navigation for "#" links
        if (el.tagName === "A" && el.getAttribute("href") === "#") {
          e.preventDefault();
        }
  
        switch (action) {
          case "logout":
            clearSession();
            window.location.href = "login.html";
            break;
          case "send-team-reminder":
            alert("Prototype: a reminder email would be sent to all team members who are not complete.");
            break;
          case "view-anonymised-paths":
            alert("Prototype: a chart of anonymised choice paths for this scenario would appear here.");
            break;
          case "view-themes":
            alert("Prototype: this would show key themes summarised from scenario responses.");
            break;
          case "export-report":
            alert("Prototype: an anonymised CSV/PDF report would be generated for HR.");
            break;
          case "download-data":
            alert("Prototype: a JSON/CSV export of your personal training data would be generated.");
            break;
          case "request-correction":
            alert("Prototype: a data correction request form would be sent to the DPO.");
            break;
          case "request-deletion":
            alert("Prototype: a data deletion request would be submitted for review.");
            break;
          case "review-choices":
            alert("Prototype: you would see your decisions compared with alternative inclusive options.");
            break;
          case "replay-scenario":
            window.location.href = "scenario-training.html";
            break;
          case "save-settings":
            alert("Prototype: your notification and privacy settings would be saved.");
            break;
          case "cancel-settings":
            window.location.href = "index.html";
            break;
          case "forgot-password":
            alert("Prototype: a password reset link would be emailed to your work address.");
            break;
          case "open-culture-report":
            window.location.href = "culture-report.html";
            break;
          case "print-report":
            alert("Prototype: use your browser's 'Save as PDF' to export this report.");
            window.print();
            break;
          case "save-reflection": {
            const textarea = document.getElementById("reflectionText");
            const text = textarea ? textarea.value.trim() : "";
            if (!text) {
              alert("Please write a short reflection before saving.");
            } else {
              alert("Prototype: your reflection would be saved to your learning record.");
            }
            break;
          }
          case "api-placeholder":
            alert("Prototype: this is a placeholder for future integration with HR or LMS APIs.");
            break;
          default:
            console.log("No handler implemented for action:", action);
        }
      });
    });
  }
  
  // ---- TERMS FLASHCARDS ----
  function initTermsFlashcards() {
    const cards = document.querySelectorAll(".tc-card");
    if (!cards.length) return;
  
    let index = 0;
    function updateCards() {
      cards.forEach((card, i) => {
        card.style.display = i === index ? "block" : "none";
      });
      const stepLabel = document.getElementById("tcStep");
      if (stepLabel) {
        stepLabel.textContent = (index + 1) + " / " + cards.length;
      }
    }
  
    const nextBtn = document.getElementById("tcNext");
    const prevBtn = document.getElementById("tcPrev");
  
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (index < cards.length - 1) index++;
        updateCards();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (index > 0) index--;
        updateCards();
      });
    }
  
    updateCards();
  }
  
  // ---- PAGE ROUTER ----
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
  
    // Always wire generic stuff if present
    initPrototypeButtons();
    populateUserName();
  
    switch (page) {
      case "login":
        clearSession(); // start clean each time you hit the login page
        initLoginPage();
        break;
      case "employee-dashboard":
        requireRole(["employee"]);
        break;
      case "manager-dashboard":
        requireRole(["manager"]);
        break;
      case "hr-dashboard":
        requireRole(["hr"]);
        break;
      case "scenario-training":
        requireRole(["employee"]); // employees run scenarios in this prototype
        break;
      case "scenario-results":
        requireRole(["employee"]);
        break;
      case "settings-privacy":
        requireRole(["employee", "manager", "hr"]);
        break;
      case "terms":
        initTermsFlashcards();
        break;
      case "culture-report":
        requireRole(["manager", "hr"]);
        break;
      default:
        // no special routing
        break;
    }
  });
  
  