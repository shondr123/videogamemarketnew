import { getFullRecord } from './jsonbin-helper.js';

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const gameId = parseInt(params.get('id'));
  const selectedGameContainer = document.getElementById("selected-game");
  const form = document.getElementById("purchase-form");
  const paymentSelect = document.getElementById("payment");
  const paymentDetails = document.getElementById("payment-details");
  const paymentInfoInput = document.getElementById("payment-info");
  const responseMsg = document.getElementById("purchase-response");

  emailjs.init("9TPOlHWBM_c-MQiLd");

  // שליפת משחק מהרשומות
  const data = await getFullRecord();
  const game = (data.games || []).find(g => g.id === gameId);

  if (!game) {
    selectedGameContainer.innerHTML = "<p>Game not found.</p>";
    return;
  }

  selectedGameContainer.innerHTML = `
    <img src="${game.image}" alt="${game.title}" style="width: 150px; border-radius: 8px;" />
    <h3>${game.title}</h3>
    <p>Price: ₪${game.price}</p>
  `;

  // הצגת שדה תשלום נוסף לפי אמצעי שנבחר
  paymentSelect.addEventListener("change", () => {
    const method = paymentSelect.value;
    if (method === "Credit Card") {
      paymentInfoInput.placeholder = "Card Number";
      paymentDetails.style.display = "block";
    } else if (method === "PayPal") {
      paymentInfoInput.placeholder = "PayPal Email";
      paymentDetails.style.display = "block";
    } else {
      paymentDetails.style.display = "none";
    }
  });

  // שליחת טופס רכישה
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = paymentSelect.value;
    const paymentInfo = paymentInfoInput.value.trim();
    const orderCode = `GM${Math.floor(Math.random() * 1000000)}`;

    emailjs.send("service_2niea85", "template_ou4acvp", {
      order_id: orderCode,
      game_name: game.title,
      game_price: game.price,
      email,
      name,
      address,
      payment_method: paymentMethod,
      extra_field: paymentInfo
    })
    .then(() => {
      const purchaseData = {
        title: game.title,
        price: game.price,
        image: game.image,
        name,
        email,
        orderCode,
      };
      sessionStorage.setItem("purchaseData", JSON.stringify(purchaseData));
      window.location.href = "thankyou.html";
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      responseMsg.textContent = "❌ Failed to send order confirmation.";
    });
  });
});
