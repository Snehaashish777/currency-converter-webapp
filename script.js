async function convert() {
  let amount = document.getElementById("amount").value;
  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;

  let result = document.getElementById("result");
  let loading = document.getElementById("loading");

  if (!amount) {
    result.innerText = "Enter amount";
    return;
  }

  loading.innerText = "Fetching rate...";

  try {
    let res = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from}.json`
    );

    if (!res.ok) {
      res = await fetch(
        `https://latest.currency-api.pages.dev/v1/currencies/${from}.json`
      );
    }

    let data = await res.json();
    let rate = data[from][to];

    let converted = amount * rate;

    loading.innerText = "";
    result.innerText = `${amount} ${from.toUpperCase()} = ${converted.toFixed(2)} ${to.toUpperCase()}`;

  } catch (err) {
    loading.innerText = "";
    result.innerText = "Error fetching data";
  }
}