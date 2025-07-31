import { getFullRecord } from './jsonbin-helper.js';

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = parseInt(params.get("id"));

  const data = await getFullRecord();
  const game = (data.games || []).find(g => g.id === gameId);

  const container = document.getElementById("game-details");

  if (!game) {
    container.innerHTML = "<p>Game not found.</p>";
    return;
  }

  container.innerHTML = `
    <div class="game-info">
      <img src="${game.image}" alt="${game.title}" class="game-img" />
      <div class="game-meta">
        <h2>${game.title}</h2>
        <p><strong>Price:</strong> ₪${game.price}</p>
        <p><strong>Rating:</strong> ${game.rating} ⭐</p>
        <p>${game.description}</p>
        <a href="buy.html?id=${game.id}" class="btn">Buy Now</a>
      </div>
    </div>

    <div class="game-video">
      <h3>Gameplay Video</h3>
      <iframe src="${game.video}" frameborder="0" allowfullscreen></iframe>
    </div>
  `;
});
