import {
  getFeedbacksRecord,
  updateFeedbacksRecord
} from "./jsonbin-helper.js";

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('review-form');
  const testimonialsSection = document.getElementById('testimonials');

  // טעינת תגובות קיימות מ-JSONBin
  try {
    const feedbacks = await getFeedbacksRecord();
    feedbacks.forEach(({ name, message }) => {
      const div = document.createElement('div');
      div.className = 'testimonial';
      div.textContent = `"${message}" - ${name}`;
      testimonialsSection.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load feedbacks from JSONBin:", err);
  }

  // שליחת תגובה חדשה
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !message) return;

    try {
      const currentFeedbacks = await getFeedbacksRecord();
      const newFeedback = { name, message };
      currentFeedbacks.push(newFeedback);

      await updateFeedbacksRecord(currentFeedbacks);

      const newDiv = document.createElement('div');
      newDiv.className = 'testimonial';
      newDiv.textContent = `"${message}" - ${name}`;
      testimonialsSection.appendChild(newDiv);

      form.reset();
    } catch (err) {
      console.error("Failed to save feedback:", err);
    }
  });

  // Newsletter שמירה (עדיין ב-localStorage, תוכל לשדרג בהמשך ל-JSONBin גם כן)
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
});
