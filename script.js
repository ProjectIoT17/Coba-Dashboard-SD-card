// ===== MQTT CONFIG =====
const broker = "wss://aa6a9d81bddf4c58a5260ba0024532a4.s1.eu.hivemq.cloud:8884/mqtt";

const options = {
  username: "Coba_SDCard",
  password: "Cobasd1244*"
};

// ===== CONNECT =====
const client = mqtt.connect(broker, options);

const statusEl = document.getElementById("status");

// ===== CHART =====
let dataChart = [];
let labelChart = [];

const ctx = document.getElementById("chart").getContext("2d");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labelChart,
    datasets: [{
      label: "Kelembapan (%)",
      data: dataChart,
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.2)",
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100
      }
    }
  }
});

// ===== MQTT EVENT =====
client.on("connect", () => {
  console.log("MQTT Connected");
  statusEl.innerText = "Connected";
  statusEl.style.background = "green";
  client.subscribe("soil/data");
});

client.on("error", (err) => {
  console.log("MQTT Error:", err);
  statusEl.innerText = "Error";
  statusEl.style.background = "red";
});

client.on("message", (topic, message) => {
  try {
    let data = JSON.parse(message.toString());

    let moisture = data.moisture;
    let time = new Date().toLocaleTimeString();

    document.getElementById("moisture").innerText = moisture + " %";
    document.getElementById("time").innerText = "Update: " + time;

    dataChart.push(moisture);
    labelChart.push(time);

    if (dataChart.length > 20) {
      dataChart.shift();
      labelChart.shift();
    }

    chart.update();

  } catch (e) {
    console.log("JSON Error:", e);
  }
});
