import {
  getFullRecord,
  updateFullRecord,
  getSubscribersRecord
} from './jsonbin-helper.js';

emailjs.init("9TPOlHWBM_c-MQiLd");

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("add-game-form");
  const preview = document.getElementById("preview");
  const modal = document.getElementById("confirm-modal");
  const confirmYesBtn = document.getElementById("confirm-yes");
  const confirmNoBtn = document.getElementById("confirm-no");
  const broadcastForm = document.getElementById("broadcast-form");
  const broadcastTextarea = document.getElementById("broadcast-message");
  const broadcastStatus = document.getElementById("broadcast-status");

  let fullRecord = await getFullRecord();
  let existingGames = fullRecord.games || [];

  let subscriberRecord = await getSubscribersRecord();
  let subscribers = subscriberRecord.subscribers || [];

  let gameToDeleteId = null;

  displayGames(existingGames);
  displaySubscribers(subscribers);

  document.getElementById("image").addEventListener("change", (e) => {
    let url = e.target.value.trim();
    if (url.startsWith("https://imgur.com/")) {
      url = url.replace("https://imgur.com/", "https://i.imgur.com/");
      e.target.value = url;
    }
    if (url && url.startsWith("http")) {
      preview.innerHTML = `<img src="${url}" alt="Preview" style="width: 120px; border-radius: 8px;" />`;
    } else {
      preview.innerHTML = "";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const rating = parseFloat(document.getElementById("rating").value);
    const image = document.getElementById("image").value.trim();
    const description = document.getElementById("description").value.trim();
    const video = document.getElementById("video").value.trim();

    if (!title || isNaN(price) || isNaN(rating) || !image || !image.startsWith("http")) {
      document.getElementById("admin-response").textContent = "Please fill all fields with valid data.";
      return;
    }

    const newGame = {
      id: Date.now(),
      title,
      price,
      rating,
      image,
      description,
      video
    };

    existingGames = [...existingGames, newGame];
    fullRecord.games = existingGames;

    await updateFullRecord(fullRecord);

    document.getElementById("admin-response").textContent = "✅ Game saved to server!";
    form.reset();
    preview.innerHTML = "";
    displayGames(existingGames);
  });

  function displayGames(games) {
    const container = document.getElementById("game-list");
    container.innerHTML = "";

    games.forEach((game) => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <img src="${game.image}" alt="${game.title}" />
        <h3>${game.title}</h3>
        <p>${game.price}₪</p>
        <p>Rating: ${game.rating} ⭐</p>
        <button class="btn edit-btn">Edit</button>
        <button class="btn delete-btn">Delete</button>
      `;
      container.appendChild(card);

      card.querySelector(".edit-btn").addEventListener("click", () => {
        document.getElementById("title").value = game.title;
        document.getElementById("price").value = game.price;
        document.getElementById("rating").value = game.rating;
        document.getElementById("image").value = game.image;
        document.getElementById("description").value = game.description || "";
        document.getElementById("video").value = game.video || "";
        preview.innerHTML = `<img src="${game.image}" alt="Preview" style="width: 120px; border-radius: 8px;" />`;

        existingGames = existingGames.filter(g => g.id !== game.id);
        fullRecord.games = existingGames;
      });

      card.querySelector(".delete-btn").addEventListener("click", () => {
        gameToDeleteId = game.id;
        modal.classList.remove("hidden");
      });
    });
  }

  function displaySubscribers(subscribers) {
    const section = document.getElementById("newsletter-list");
    section.innerHTML = "<h2>Newsletter Subscribers</h2>";

    if (!subscribers.length) {
      section.innerHTML += "<p>No subscribers yet.</p>";
      return;
    }

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.innerHTML = `
      <thead>
        <tr>
          <th style="border-bottom: 2px solid #ccc; padding: 8px; text-align: left;">Name</th>
          <th style="border-bottom: 2px solid #ccc; padding: 8px; text-align: left;">Email</th>
        </tr>
      </thead>
      <tbody>
        ${subscribers.map(sub => `
          <tr>
            <td style="padding: 8px;">${sub.name || "-"}</td>
            <td style="padding: 8px;">${sub.email}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
    section.appendChild(table);
  }

  confirmYesBtn.addEventListener("click", async () => {
    if (gameToDeleteId !== null) {
      existingGames = existingGames.filter(g => g.id !== gameToDeleteId);
      fullRecord.games = existingGames;
      await updateFullRecord(fullRecord);
      displayGames(existingGames);
      gameToDeleteId = null;
      modal.classList.add("hidden");
    }
  });

  confirmNoBtn.addEventListener("click", () => {
    gameToDeleteId = null;
    modal.classList.add("hidden");
  });

  // ✅ שליחת מייל כללי
  if (broadcastForm) {
    broadcastForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const message = broadcastTextarea.value.trim();
      if (!message) {
        broadcastStatus.textContent = "נא להזין הודעה לשליחה.";
        broadcastStatus.style.color = "red";
        return;
      }

      broadcastStatus.textContent = "שולח הודעה... ⏳";
      broadcastStatus.style.color = "#fff";

      try {
        for (const subscriber of subscribers) {
          await emailjs.send("service_2niea85", "template_fe3q71v", {
            email: subscriber.email,
            message: message
          });
        }

        broadcastStatus.textContent = "✅ ההודעה נשלחה לכל הנרשמים בהצלחה!";
        broadcastStatus.style.color = "green";
        broadcastTextarea.value = "";
      } catch (error) {
        console.error("Error sending broadcast:", error);
        broadcastStatus.textContent = "❌ אירעה שגיאה בשליחה.";
        broadcastStatus.style.color = "red";
      }

      setTimeout(() => {
        broadcastStatus.textContent = "";
      }, 6000);
    });
  }
});
