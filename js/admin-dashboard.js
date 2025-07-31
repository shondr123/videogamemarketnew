import { getFullRecord, updateFullRecord } from "./jsonbin-helper.js";

// טעינת המשחקים ונרשמים
document.addEventListener("DOMContentLoaded", async () => {
  await renderGames();
  await renderSubscribers();
});

async function renderGames() {
  const { games } = await getFullRecord();
  const container = document.getElementById("game-list");
  container.innerHTML = "";

  if (!games || games.length === 0) {
    container.innerHTML = "<p>לא קיימים משחקים.</p>";
    return;
  }

  games.forEach((game, index) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}" />
      <h3>${game.title}</h3>
      <p>${game.price}₪ | Rating: ${game.rating} ⭐</p>
      <button class="btn delete-btn" data-id="${game.id}">❌ מחק</button>
    `;
    container.appendChild(card);
  });

  // מחיקה עם אישור
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.dataset.id);
      const modal = document.getElementById("confirm-modal");
      modal.classList.remove("hidden");

      document.getElementById("confirm-yes").onclick = async () => {
        const data = await getFullRecord();
        const updated = data.games.filter(g => g.id !== id);
        await updateFullRecord({ ...data, games: updated });
        modal.classList.add("hidden");
        await renderGames();
      };

      document.getElementById("confirm-no").onclick = () => {
        modal.classList.add("hidden");
      };
    });
  });
}

document.getElementById("add-game-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const rating = parseFloat(document.getElementById("rating").value);
  const image = document.getElementById("image").value.trim();
  const description = document.getElementById("description").value.trim();
  const video = document.getElementById("video").value.trim();

  const newGame = {
    id: Date.now(),
    title,
    price,
    rating,
    image,
    description,
    video,
  };

  const data = await getFullRecord();
  const updatedGames = [...(data.games || []), newGame];
  await updateFullRecord({ ...data, games: updatedGames });

  document.getElementById("admin-response").textContent = "✅ Game added successfully!";
  e.target.reset();
  document.getElementById("preview").innerHTML = "";
  await renderGames();
});

// תצוגה מקדימה לתמונה
document.getElementById("image").addEventListener("input", (e) => {
  const url = e.target.value.trim();
  const preview = document.getElementById("preview");
  preview.innerHTML = url ? `<img src="${url}" style="width: 100px; border-radius: 5px;" />` : "";
});

// טעינת רשימת נרשמים
async function renderSubscribers() {
  const subs = await getSubscribers();
  const list = document.getElementById("newsletter-list");
  if (!subs || subs.length === 0) {
    list.innerHTML = "<p>אין נרשמים עדיין.</p>";
    return;
  }

  const ul = document.createElement("ul");
  subs.forEach(s => {
    const li = document.createElement("li");
    li.textContent = s.email;
    ul.appendChild(li);
  });

  list.innerHTML = "";
  list.appendChild(ul);
}

// שליחת מייל לכל המנויים
document.getElementById("broadcast-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = document.getElementById("broadcast-message").value.trim();
  const status = document.getElementById("broadcast-status");
  const subs = await getSubscribers();

  if (!message || subs.length === 0) {
    status.textContent = "לא ניתן לשלוח – אין נרשמים או תוכן ריק.";
    return;
  }

  emailjs.init("9TPOlHWBM_c-MQiLd");

  for (const s of subs) {
    await emailjs.send("service_2niea85", "template_1ly1khq", {
      email: s.email,
      subject: "עדכון מחנות Game Market",
      message,
    });
  }

  status.textContent = "✅ נשלח לכל המנויים בהצלחה!";
  e.target.reset();
});

// קבלת נרשמים מ־JSONBin
async function getSubscribers() {
  const res = await fetch("https://api.jsonbin.io/v3/b/68647fee8a456b7966b9c5f1/latest", {
    headers: {
      "X-Master-Key": "$2a$10$r3JROibQVtotu7ZvhZoiF.Z.Rn3M/zc1mGC.HPxfaqsci8unJx9d6",
    }
  });
  const data = await res.json();
  return data.record.subscribers || [];
}
