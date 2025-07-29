import { getFullRecord } from './jsonbin-helper.js';

// פונקציה להמרת URL רגיל של יוטיוב ל-embed URL
function getEmbedUrl(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url; // אם כבר מוטמע או לא מתאים, תחזיר אותו כמו שהוא
}

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get("id");

  const gameTitleEl = document.getElementById("game-title");
  const gameImageEl = document.getElementById("game-image");
  const gamePriceEl = document.getElementById("game-price");
  const gameDescriptionEl = document.getElementById("game-description");
  const videoContainer = document.getElementById("video-container");

  const data = await getFullRecord();
  const games = data.games || [];
  const game = games.find(g => g.id == gameId);

  if (!game) {
    gameTitleEl.textContent = "Game not found";
    return;
  }

  gameTitleEl.textContent = game.title;
  gameImageEl.src = game.image;
  gamePriceEl.textContent = `Price: ₪${game.price}`;
  gameDescriptionEl.textContent = game.description || "";

  if (game.video) {
    const embedUrl = getEmbedUrl(game.video);
    videoContainer.innerHTML = `
      <iframe
        src="${embedUrl}"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        width="560"
        height="315"
        frameborder="0"
      ></iframe>
    `;
  } else {
    videoContainer.innerHTML = "";
  }
});
