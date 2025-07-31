import { getFeedbacksRecord, updateFeedbacksRecord } from "./jsonbin-helper.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const response = document.getElementById("contact-response");

  emailjs.init("9TPOlHWBM_c-MQiLd");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      response.textContent = "❌ נא למלא את כל השדות";
      return;
    }

    // שליחה עם EmailJS
    try {
      await emailjs.send("service_2niea85", "template_gkyp2id", {
        name,
        email,
        message,
      });

      // שמירת פידבק ב־JSONBin
      const feedbacks = await getFeedbacksRecord();
      const newFeedback = { name, email, message, date: new Date().toISOString() };
      feedbacks.push(newFeedback);
      await updateFeedbacksRecord(feedbacks);

      response.textContent = "✅ ההודעה נשלחה בהצלחה!";
      form.reset();
    } catch (error) {
      console.error("Error sending contact form:", error);
      response.textContent = "❌ שגיאה בשליחת הטופס";
    }
  });
});
