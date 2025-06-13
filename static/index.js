document.addEventListener("DOMContentLoaded", function () {
  const PRODUCTION_URI = "https://kdbvglw2-5000.asse.devtunnels.ms";
  const TESTING_URI = "http://127.0.0.1:5000";

  function loadHistoricalData() {
    fetch(TESTING_URI + "/api/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch historical data");
        }
        return response.json();
      })
      .then((historyData) => {
        updateChartWithHistoricalData(historyData);
      })
      .catch((error) => {
        console.error("Error loading historical data:", error);
      });
  }

  // Intersection Observer for fade-in animations
  const fadeElements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((element) => {
    observer.observe(element);
  });

  function fetchSensorData() {
    fetch(TESTING_URI + "/api/latest")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById("loadingState").classList.add("hidden");
        document.getElementById("dataState").classList.remove("hidden");
        updateUI(data);
        setTimeout(fetchSensorData, 30000); // Update every 30 seconds
      })
      .catch((error) => {
        console.error("Error fetching sensor data:", error);
        document
          .getElementById("statusIndicator")
          .classList.remove("bg-green-500");
        document.getElementById("statusIndicator").classList.add("bg-red-500");
        setTimeout(fetchSensorData, 5000);
      });
  }

  function updateUI(data) {
    document.getElementById("temperature").textContent =
      data.temperature.toFixed(1) + "°C";
    document.getElementById("humidity").textContent =
      data.humidity.toFixed(1) + "%";
    document.getElementById("airQuality").textContent = data.air_quality;

    const timestamp = new Date(data.timestamp);
    document.getElementById("timestamp").textContent =
      timestamp.toLocaleTimeString();

    updateGauge("tempGaugeFill", "tempGaugeValue", data.temperature, 40, "°C");
    updateGauge(
      "humidityGaugeFill",
      "humidityGaugeValue",
      data.humidity,
      100,
      "%"
    );
    updateGauge("aqGaugeFill", "aqGaugeValue", data.air_quality, 300, "");

    updateStatusMessages(data);
  }

  function updateGauge(fillId, valueId, value, max, unit) {
    const percentage = Math.min(value / max, 1);
    const rotation = percentage * 180;
    document.getElementById(fillId).style.transform = `rotate(${rotation}deg)`;
    document.getElementById(valueId).textContent = value.toFixed(1) + unit;
  }

  function updateStatusMessages(data) {
    const tempStatus = document.getElementById("tempStatus");
    if (data.temperature > 30) {
      tempStatus.textContent = "Too Hot";
      tempStatus.className = "font-medium mt-2 text-red-600";
    } else if (data.temperature < 18) {
      tempStatus.textContent = "Too Cold";
      tempStatus.className = "font-medium mt-2 text-blue-600";
    } else {
      tempStatus.textContent = "Optimal";
      tempStatus.className = "font-medium mt-2 text-green-600";
    }

    const humidityStatus = document.getElementById("humidityStatus");
    if (data.humidity > 60) {
      humidityStatus.textContent = "Too Humid";
      humidityStatus.className = "font-medium mt-2 text-blue-600";
    } else if (data.humidity < 30) {
      humidityStatus.textContent = "Too Dry";
      humidityStatus.className = "font-medium mt-2 text-yellow-600";
    } else {
      humidityStatus.textContent = "Optimal";
      humidityStatus.className = "font-medium mt-2 text-green-600";
    }

    const aqStatus = document.getElementById("aqStatus");
    if (data.air_quality < 50) {
      aqStatus.textContent = "Good";
      aqStatus.className = "font-medium mt-2 text-green-600";
      document.getElementById("aqGaugeFill").className =
        "gauge-fill bg-gradient-to-t from-green-600 to-lime-400";
    } else if (data.air_quality < 100) {
      aqStatus.textContent = "Moderate";
      aqStatus.className = "font-medium mt-2 text-yellow-600";
      document.getElementById("aqGaugeFill").className =
        "gauge-fill bg-gradient-to-t from-yellow-600 to-yellow-400";
    } else if (data.air_quality < 150) {
      aqStatus.textContent = "Unhealthy for Sensitive Groups";
      aqStatus.className = "font-medium mt-2 text-orange-600";
      document.getElementById("aqGaugeFill").className =
        "gauge-fill bg-gradient-to-t from-orange-600 to-orange-400";
    } else {
      aqStatus.textContent = "Unhealthy";
      aqStatus.className = "font-medium mt-2 text-red-600";
      document.getElementById("aqGaugeFill").className =
        "gauge-fill bg-gradient-to-t from-red-600 to-red-400";
    }
  }

  function updateChartWithHistoricalData(dataArray) {
    const labels = [];
    const tempData = [];
    const humidityData = [];
    const aqData = [];

    dataArray.forEach((entry) => {
      const time = new Date(entry.timestamp);
      labels.push(
        time.getHours().toString().padStart(2, "0") +
          ":" +
          time.getMinutes().toString().padStart(2, "0")
      );
      tempData.push(entry.temperature.toFixed(1));
      humidityData.push(entry.humidity.toFixed(1));
      aqData.push(entry.air_quality.toFixed(0));
    });

    const ctx = document.getElementById("historyChart").getContext("2d");

    if (window.sensorChart) {
      window.sensorChart.data.labels = labels;
      window.sensorChart.data.datasets[0].data = tempData;
      window.sensorChart.data.datasets[1].data = humidityData;
      window.sensorChart.data.datasets[2].data = aqData;
      window.sensorChart.update();
    } else {
      window.sensorChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: tempData,
              borderColor: "rgb(239, 68, 68)",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Humidity (%)",
              data: humidityData,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              fill: true,
            },
            {
              label: "Air Quality",
              data: aqData,
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              usePointStyle: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  // ✅ Start fetching data
  loadHistoricalData(); // ← This was missing
  fetchSensorData();
});
