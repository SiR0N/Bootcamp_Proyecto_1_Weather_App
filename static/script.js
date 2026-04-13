// ==========================================
// 1. DASHBOARD MAP & STATS LOGIC
// ==========================================
const mapElement = document.getElementById("map");

if (mapElement) {
  // Initialize Map only if the map div exists on the page
  var map = L.map("map").setView([40.4167, -3.7033], 11);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Template for Map Hover Cards
  function createPopupContent(name, id, temp, hum, wind) {
    return `
      <div class="hover-card">
        <div class="card-header">${name}</div>
        <div class="card-body">
          <div class="stat-row"><i class="fas fa-thermometer-half temp-icon"></i> <span>${temp ? temp + "°C" : "--"}</span></div>
          <div class="stat-row"><i class="fas fa-tint hum-icon"></i> <span>${hum ? hum + "%" : "--"}</span></div>
          <div class="stat-row"><i class="fas fa-wind wind-icon"></i> <span>${wind ? wind + " km/h" : "--"}</span></div>
        </div>
        <div class="card-footer">ID: ${id} | Real-time Data</div>
      </div>
    `;
  }

  // Fetch Data ONCE for both Map and Stats
  fetch("/static/weather_history.json")
    .then((response) => response.json())
    .then((data) => {
      let t = 0,
        h = 0,
        w = 0;
      const count = data.length;

      data.forEach((station) => {
        // Accumulate totals for cards
        t += parseFloat(station.temperature || station.temp || 0);
        h += parseFloat(station.humidity || 0);
        w += parseFloat(station.wind_speed || station.wind || 0);

        // Draw Map Markers with the nice Hover Card
        const cardHtml = createPopupContent(
          station.name || station.estacion,
          station.id || "N/A",
          station.temperature || station.temp,
          station.humidity,
          station.wind_speed || station.wind,
        );

        L.marker([station.lat, station.lon])
          .addTo(map)
          .bindTooltip(cardHtml, {
            className: "custom-card-tooltip",
            sticky: true,
            direction: "top",
          });
      });

      // Update Summary Cards
      const stats = [
        {
          id: "avg-temp",
          val: (t / count).toFixed(1) + "°C",
          label: "Temperatura Media",
          icon: "fa-temperature-high",
        },
        {
          id: "avg-hum",
          val: (h / count).toFixed(0) + "%",
          label: "Humedad Media",
          icon: "fa-tint",
        },
        {
          id: "avg-wind",
          val: (w / count).toFixed(1) + " km/h",
          label: "Viento Medio",
          icon: "fa-wind",
        },
      ];

      stats.forEach((s) => {
        const element = document.getElementById(s.id);
        if (element) {
          element.innerHTML = `
            <div class="card-top"><span class="station-name">MADRID TOTAL</span><div class="icon-circle"><i class="fas fa-chart-line"></i></div></div>
            <div class="main-stats"><span class="stat-value">${s.val}</span><div class="stat-label"><i class="fas ${s.icon}"></i> ${s.label}</div></div>
          `;
        }
      });
    })
    .catch((err) =>
      console.error("Database connection error or file missing:", err),
    );

  // Handle Layout Shifts
  window.addEventListener("load", () => {
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  });
}

// ==========================================
// 2. AÑADIR DATOS PAGE LOGIC (FORMS & MODALS)
// ==========================================
const formContainer = document.getElementById("registro-form-container");

if (formContainer) {
  // Toggle the Add Data Form
  function toggleForm() {
    const form = document.getElementById("registro-form-container");
    const tableView = document.querySelector(".data-view-container");
    const actionBar = document.querySelector(".action-bar");

    if (form.style.display === "none") {
      form.style.display = "block";
      tableView.style.display = "none";
      actionBar.style.display = "none";
    } else {
      form.style.display = "none";
      tableView.style.display = "block";
      actionBar.style.display = "flex";
    }
  }

  // Handle Form Submission
  document
    .querySelector(".weather-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Safely capture data
      const estacion = document.getElementById("estacion").value;
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora_picker").value;
      const temp = document.getElementById("input-temp")
        ? document.getElementById("input-temp").value
        : document.querySelector('input[placeholder="0.0"]').value;
      const hum = document.getElementById("input-hum")
        ? document.getElementById("input-hum").value
        : document.querySelector('input[placeholder="0"]').value;
      const wind = document.getElementById("input-wind")
        ? document.getElementById("input-wind").value
        : document.querySelectorAll('input[placeholder="0"]')[1].value;

      const tableBody = document.getElementById("table-body");
      const newRow = document.createElement("div");
      newRow.className = "view-row";
      newRow.innerHTML = `
      <span class="cell-date">${fecha} ${hora}</span>
      <span class="cell-station">${estacion}</span>
      <span class="cell-temp">${temp}</span>
      <span class="cell-hum">${hum}</span>
      <span class="cell-wind">${wind}</span>
      <div class="cell-actions"><i class="fas fa-edit"></i><i class="fas fa-trash"></i></div>
    `;

      tableBody.prepend(newRow);
      toggleForm();
      this.reset();
      alert("¡Registro añadido con éxito!");
    });

  // --- CSV Modal Logic ---
  function openCsvModal() {
    document.getElementById("csv-modal").style.display = "flex";
  }

  function closeCsvModal() {
    document.getElementById("csv-modal").style.display = "none";
    document.getElementById("real-csv-input").value = "";
    document.getElementById("file-name-display").innerText = "";
  }

  document
    .getElementById("real-csv-input")
    .addEventListener("change", function (e) {
      if (e.target.files.length > 0) {
        document.getElementById("file-name-display").innerText =
          "📁 " + e.target.files[0].name;
      }
    });

  function processCsvUpload() {
    const fileInput = document.getElementById("real-csv-input");
    if (fileInput.files.length === 0) {
      alert("Por favor, selecciona o arrastra un archivo CSV primero.");
      return;
    }
    alert(
      "Simulando subida... Archivo [" +
        fileInput.files[0].name +
        "] listo para enviar al servidor.",
    );
    closeCsvModal();
  }
}
