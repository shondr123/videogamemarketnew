import { getFullRecord } from './jsonbin-helper.js';

let allGames = [];

document.addEventListener('DOMContentLoaded', async () => {
  const fullRecord = await getFullRecord();
  allGames = fullRecord.games || [];
  displayGames(allGames);

  document.getElementById('search-input').addEventListener('input', filterAndSortGames);
  document.getElementById('sort-select').addEventListener('change', filterAndSortGames);
});

function filterAndSortGames() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const sortValue = document.getElementById('sort-select').value;

  let filtered = allGames.filter(game =>
    game.title.toLowerCase().includes(searchValue)
  );

  if (sortValue === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'rating-desc') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortValue === 'rating-asc') {
    filtered.sort((a, b) => a.rating - b.rating);
  }

  displayGames(filtered);
}

function displayGames(games) {
  const container = document.getElementById('store');
  container.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <img src="${game.image}" alt="${game.title}" />
      <h3>${game.title}</h3>
      <p>${game.price}₪</p>
      <p>Rating: ${game.rating} ⭐</p>
      <a href="game.html?id=${game.id}" class="btn">View Game</a>
      <a href="buy.html?id=${game.id}" class="btn">Buy Now</a>
    `;
    container.appendChild(card);
  });
}
