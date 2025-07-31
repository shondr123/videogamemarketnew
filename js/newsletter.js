const BIN_ID = "68647fee8a456b7966b9c5f1";
const ACCESS_KEY = "$2a$10$rvA.0zaHcORjO/lh3jlvLOVSGkJbnSk4nRsANzSKCdawWu09prSJi";
const MASTER_KEY = "$2a$10$r3JROibQVtotu7ZvhZoiF.Z.Rn3M/zc1mGC.HPxfaqsci8unJx9d6";

// שליפת רשימת נרשמים
async function getSubscribersRecord() {
  const res = await fetch(https://api.jsonbin.io/v3/b/${BIN_ID}/latest, {
    headers: { "X-Access-Key": ACCESS_KEY }
  });
  const data = await res.json();
  const record = data.record;

  if (Array.isArray(record)) {
    return { subscribers: record };
  }

  return record || { subscribers: [] };
}

// עדכון הרשימה
async function updateSubscribersRecord(updatedRecord) {
  await fetch(https://api.jsonbin.io/v3/b/${BIN_ID}, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY
    },
    body: JSON.stringify(updatedRecord)
  });
}

// הוספת נרשם חדש
async function addNewsletterSubscriber(name, email) {
  let record = await getSubscribersRecord();
  if (!record.subscribers) {
    record.subscribers = [];
  }

  if (record.subscribers.some(sub => sub.email === email)) {
    throw new Error("כתובת זו כבר רשומה.");
  }

  record.subscribers.push({
    name: name,
    email: email,
    date: new Date().toISOString()
  });

  await updateSubscribersRecord(record);
}

// אתחול EmailJS
emailjs.init("9TPOlHWBM_c-MQiLd");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const responseEl = document.getElementById("newsletter-response");
  const spinner = document.getElementById("newsletter-spinner");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value.trim();
    const email = form.querySelector('input[name="email"]').value.trim();

    if (!email || !email.includes("@")) {
      responseEl.textContent = "נא להזין כתובת אימייל תקינה.";
      responseEl.style.color = "red";
      return;
    }

    spinner.style.display = "block";
    responseEl.textContent = "";

    try {
      await addNewsletterSubscriber(name, email);

     const welcomeMessage = `
Welcome to the Game Store family! We're excited to have you on board.

Your subscription has been successfully noted, and you're now ready to explore all the great features we offer.

You will be the first to know about everything!

Keep your eyes up for secret discounts and more!
`;


      await emailjs.send("service_2niea85", "template_fe3q71v", {
        email: email,
        message: welcomeMessage
      });

      responseEl.textContent = "🎉 תודה שנרשמת לניוזלטר!";
      responseEl.style.color = "green";
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      responseEl.textContent = error.message || "❌ אירעה שגיאה, אנא נסה שוב מאוחר יותר.";
      responseEl.style.color = "red";
    } finally {
      spinner.style.display = "none";
      setTimeout(() => {
        responseEl.textContent = "";
      }, 5000);
    }
  });
});
