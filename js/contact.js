document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const response = document.getElementById('response');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    response.textContent = 'Message sent successfully!';
    response.style.color = 'green';
    form.reset();
  });
});
