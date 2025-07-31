import { getFeedbacksRecord, updateFeedbacksRecord } from './jsonbin-helper.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const response = document.getElementById("feedback-response");

  if (!form) return; // אם אין טופס פידבק – לא נדרש

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("feedback-name").value.trim();
    const message = document.getElementById("feedback-message").value.trim();

    if (!name || !message) {
      response.textContent = "❌ נא למלא שם והודעה.";
      return;
    }

    try {
      const feedbacks = await getFeedbacksRecord();
      const newFeedback = { name, message, date: new Date().toISOString() };
      feedbacks.push(newFeedback);
      await updateFeedbacksRecord(feedbacks);

      response.textContent = "✅ תודה על המשוב!";
      form.reset();
    } catch (err) {
      console.error("Error saving feedback:", err);
      response.textContent = "❌ שגיאה בשליחת הפידבק.";
    }
  });
});
