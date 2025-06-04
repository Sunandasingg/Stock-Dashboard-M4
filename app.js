const API_KEY = '5TE42C1IZSY6UZ4F';
let chart;

async function loadStockData() {
    const symbol = document.getElementById('stock-select').value;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const timeSeries = data["Time Series (Daily)"];

        if (!timeSeries) {
            alert("API limit reached or invalid symbol");
            return;
        }

        const labels = Object.keys(timeSeries).reverse().slice(-30);
        const closingPrices = labels.map(date => parseFloat(timeSeries[date]["4. close"]));

        renderChart(labels, closingPrices, symbol);
        updateTable(symbol, timeSeries[Object.keys(timeSeries)[0]]); // Latest day
    } catch (err) {
        console.error(err);
        alert("Failed to load data.");
    }
}

function renderChart(labels, data, symbol) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${symbol} Closing Prices`,
                data,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${symbol} - Last 30 Days`
                }
            }
        }
    });
}

function updateTable(symbol, dayData) {
    const tbody = document.getElementById('stock-info-body');
    tbody.innerHTML = `
    <tr>
      <td class="p-2 border">${symbol}</td>
      <td class="p-2 border">${parseFloat(dayData["1. open"]).toFixed(2)}</td>
      <td class="p-2 border">${parseFloat(dayData["2. high"]).toFixed(2)}</td>
      <td class="p-2 border">${parseFloat(dayData["3. low"]).toFixed(2)}</td>
      <td class="p-2 border">${parseFloat(dayData["4. close"]).toFixed(2)}</td>
      <td class="p-2 border">${parseInt(dayData["5. volume"]).toLocaleString()}</td>
    </tr>
  `;
}
