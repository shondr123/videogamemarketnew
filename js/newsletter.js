import { getSubscribersRecord, updateSubscribersRecord } from './jsonbin-helper.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const response = document.getElementById("newsletter-response");

  emailjs.init("9TPOlHWBM_c-MQiLd");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!email || !email.includes("@")) {
      response.textContent = "❌ כתובת מייל לא תקינה.";
      return;
    }

    try {
      const current = await getSubscribersRecord();
      const existingEmails = current.subscribers.map(sub => sub.email.toLowerCase());

      if (existingEmails.includes(email.toLowerCase())) {
        response.textContent = "⚠️ אתה כבר רשום.";
        return;
      }

      const newList = [...current.subscribers, { email }];
      await updateSubscribersRecord({ subscribers: newList });

      await emailjs.send("service_2niea85", "template_xv3e69i", {
        email,
      });

      response.textContent = "✅ נרשמת בהצלחה!";
      form.reset();
    } catch (err) {
      console.error("Error subscribing:", err);
      response.textContent = "❌ שגיאה בהרשמה.";
    }
  });
});
