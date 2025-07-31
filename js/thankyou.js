document.addEventListener("DOMContentLoaded", () => {
  const summaryContainer = document.getElementById("order-summary");
  const data = JSON.parse(sessionStorage.getItem("purchaseData"));

  if (!data) {
    summaryContainer.innerHTML = "<p>אין נתוני רכישה להצגה.</p>";
    return;
  }

  summaryContainer.innerHTML = `
    <h2>תודה על ההזמנה!</h2>
    <img src="${data.image}" alt="${data.title}" style="width: 150px; border-radius: 8px;" />
    <p><strong>שם המשחק:</strong> ${data.title}</p>
    <p><strong>מחיר:</strong> ₪${data.price}</p>
    <p><strong>שם הלקוח:</strong> ${data.name}</p>
    <p><strong>אימייל:</strong> ${data.email}</p>
    <p><strong>מספר הזמנה:</strong> ${data.orderCode}</p>
  `;
});
