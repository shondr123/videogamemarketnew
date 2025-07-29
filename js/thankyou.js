document.addEventListener('DOMContentLoaded', () => {
  const purchaseData = JSON.parse(sessionStorage.getItem('purchaseData'));

  if (!purchaseData) return;

  document.getElementById('name').textContent = `Hi ${purchaseData.name}, your purchase was successful.`;
  document.getElementById('order-code').textContent = purchaseData.orderCode;

  const container = document.getElementById('purchased-game');
  container.innerHTML = `
    <h3>${purchaseData.title}</h3>
    <img src="${purchaseData.image}" alt="${purchaseData.title}" style="width: 150px; border-radius: 8px;" />
    <p>Price: ₪${purchaseData.price}</p>
  `;
});
