// index.js - ניהול טפסי ביקורות וניוזלטר עם שמירה ב-localStorage (אפשר לשדרג בעתיד ל-JSONBin)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('review-form');
  const testimonialsSection = document.getElementById('testimonials');

  document.getElementById('newsletter-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('newsletter-name').value.trim();
    const email = document.getElementById('newsletter-email').value.trim();

    if (name && email) {
      const list = JSON.parse(localStorage.getItem('newsletter')) || [];
      list.push({ name, email });
      localStorage.setItem('newsletter', JSON.stringify(list));
      document.getElementById('newsletter-response').textContent = '✅ Getting you on all the news!';
      this.reset();
    }
  });

  const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
  savedReviews.forEach(({ name, message }) => {
    const div = document.createElement('div');
    div.className = 'testimonial';
    div.textContent = `"${message}" - ${name}`;
    testimonialsSection.appendChild(div);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name && message) {
      const review = { name, message };
      savedReviews.push(review);
      localStorage.setItem('reviews', JSON.stringify(savedReviews));

      const newDiv = document.createElement('div');
      newDiv.className = 'testimonial';
      newDiv.textContent = `"${message}" - ${name}`;
      testimonialsSection.appendChild(newDiv);

      form.reset();
    }
  });
});
