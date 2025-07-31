document.getElementById('login').addEventListener('click', validatePassword);
document.getElementById('password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    validatePassword();
  }
});

function validatePassword() {
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value.trim();
  const hashed = btoa(password); // base64 encode פשוט

  const correctHash = 'YWRtaW4xMjM='; // base64 של "admin123"

  if (hashed === correctHash) {
    window.location.href = 'admin-dashboard.html';
  } else {
    const card = document.querySelector('.admin-login-card');
    const error = document.getElementById('error');

    card.classList.add('shake');
    error.textContent = 'Incorrect password!';
    passwordInput.classList.add('input-error');

    setTimeout(() => {
      card.classList.remove('shake');
      passwordInput.classList.remove('input-error');
    }, 500);
  }
}
