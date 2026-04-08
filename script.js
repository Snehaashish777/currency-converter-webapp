let container = document.getElementById("container");
let searchInput = document.getElementById("search");
let sortSelect = document.getElementById("sort");

let fromSelect = document.getElementById("from");
let toSelect = document.getElementById("to");

let allRates = {};
let favorites = JSON.parse(localStorage.getItem("fav")) || {};

// Load currencies in dropdown
async function loadCurrencies() {
  let res = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json");
  let data = await res.json();

  Object.entries(data).map(([code]) => {
    let opt1 = new Option(code.toUpperCase(), code);
    let opt2 = new Option(code.toUpperCase(), code);
    fromSelect.add(opt1);
    toSelect.add(opt2);
  });

  fromSelect.value = "inr";
  toSelect.value = "usd";

  getRates();
}

// Fetch rates
async function getRates() {
  let base = fromSelect.value;

  document.getElementById("base-label").innerText =
    "Base Currency: " + base.toUpperCase();

  let res = await fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`
  );

  let data = await res.json();

  allRates = data[base];

  displayData(allRates);
}

// Display currencies
function displayData(rates) {
  container.innerHTML = "";

  Object.entries(rates)
    .filter(([cur]) =>
      cur.toLowerCase().includes(searchInput.value.toLowerCase())
    )
    .sort((a, b) => {
      if (sortSelect.value === "asc") return a[1] - b[1];
      if (sortSelect.value === "desc") return b[1] - a[1];
      return 0;
    })
    .slice(0, 40)
    .map(([cur, val]) => {

      let card = document.createElement("div");
      card.className = "currency-card";

      let name = document.createElement("h4");
      name.innerText = cur.toUpperCase();

      let rate = document.createElement("p");
      rate.innerText = val < 1 ? val.toFixed(7) : val.toFixed(2);

      let favBtn = document.createElement("button");
      favBtn.innerText = favorites[cur] ? "⭐" : "☆";

      favBtn.onclick = () => {
        favorites[cur] = !favorites[cur];
        localStorage.setItem("fav", JSON.stringify(favorites));
        displayData(allRates);
      };

      card.append(name, rate, favBtn);
      container.appendChild(card);
    });
}

// Convert currency
async function convert() {
  let amount = document.getElementById("amount").value;
  let from = fromSelect.value;
  let to = toSelect.value;

  let loading = document.getElementById("loading");
  let result = document.getElementById("result");

  if (!amount) {
    result.innerText = "Enter amount";
    return;
  }

  loading.innerText = "Fetching...";

  let res = await fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`
  );

  let data = await res.json();

  let converted = amount * data[from][to];

  loading.innerText = "";
  result.innerText =
    `${amount} ${from.toUpperCase()} = ${converted.toFixed(2)} ${to.toUpperCase()}`;
}

// Events
searchInput.addEventListener("input", () => displayData(allRates));
sortSelect.addEventListener("change", () => displayData(allRates));
fromSelect.addEventListener("change", getRates);

// Dark mode
document.getElementById("theme-btn").onclick = () => {
  document.body.classList.toggle("dark");
};

// Init
loadCurrencies();