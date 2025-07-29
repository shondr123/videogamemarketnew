// --- BIN IDs ---
const GAMES_BIN_ID = "686422298561e97a502fcac4";
const SUBSCRIBERS_BIN_ID = "68647fee8a456b7966b9c5f1";

const ACCESS_KEY = "$2a$10$rvA.0zaHcORjO/lh3jlvLOVSGkJbnSk4nRsANzSKCdawWu09prSJi";
const MASTER_KEY = "$2a$10$r3JROibQVtotu7ZvhZoiF.Z.Rn3M/zc1mGC.HPxfaqsci8unJx9d6";

// --- Games ---
async function getFullRecord() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${GAMES_BIN_ID}/latest`, {
    headers: {
      "X-Access-Key": ACCESS_KEY,
    },
  });
  const data = await res.json();
  return data.record || {};
}

async function updateFullRecord(updatedRecord) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${GAMES_BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY,
    },
    body: JSON.stringify(updatedRecord),
  });
  return res.json();
}

// --- Subscribers ---
async function getSubscribersRecord() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${SUBSCRIBERS_BIN_ID}/latest`, {
    headers: {
      "X-Access-Key": ACCESS_KEY,
    },
  });
  const data = await res.json();
  const record = data.record;

  // אם JSONBin שומר את זה כמערך נטו
  if (Array.isArray(record)) {
    return { subscribers: record };
  }

  // אם זה עטוף בתוך אובייקט כמו { subscribers: [...] }
  return record || { subscribers: [] };
}

async function updateSubscribersRecord(updatedRecord) {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${SUBSCRIBERS_BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": MASTER_KEY,
    },
    body: JSON.stringify(updatedRecord),
  });
  return res.json();
}

export {
  getFullRecord,
  updateFullRecord,
  getSubscribersRecord,
  updateSubscribersRecord
};
