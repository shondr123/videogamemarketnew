document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-theme');
  const currentTheme = localStorage.getItem('theme');

  // החל נושא כהה אם קיים
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    toggleBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
});
