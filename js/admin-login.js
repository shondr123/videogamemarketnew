document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("admin-login-form");
  const response = document.getElementById("admin-response");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("admin-email").value.trim();
    const password = document.getElementById("admin-password").value.trim();

    const ADMIN_EMAIL = "admin@admin.com";
    const ADMIN_PASSWORD = "123456";

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminLoggedIn", "true");
      window.location.href = "admin-dashboard.html";
    } else {
      response.textContent = "❌ פרטי התחברות שגויים";
    }
  });
});
