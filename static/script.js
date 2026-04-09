// 1. Initialize Map
var map = L.map("map").setView([40.4167, -3.7033], 11);

// 2. Add OpenStreetMap Tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// 3. Fetch Data and Calculate Averages
fetch("/static/weather_history.json")
  .then((response) => {
    if (!response.ok) throw new Error("Check if JSON is in the static folder!");
    return response.json();
  })
  .then((data) => {
    let t = 0,
      h = 0,
      w = 0;
    const count = data.length;

    data.forEach((station) => {
      // Accumulate totals
      t += parseFloat(station.temp || 0);
      h += parseFloat(station.humidity || 0);
      w += parseFloat(station.wind || 0);

      // Add markers to map for visual reference
      L.marker([station.lat, station.lon])
        .addTo(map)
        .bindPopup(`<b>${station.name}</b><br>ID: ${station.id}`);
    });

    // Create array for the 3 summary cards
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

    // Inject content with the "Project Card" design
    stats.forEach((s) => {
      const element = document.getElementById(s.id);
      if (element) {
        element.innerHTML = `
              <div class="card-top">
                <span class="station-name">MADRID TOTAL</span>
                <div class="icon-circle"><i class="fas fa-chart-line"></i></div>
              </div>
              <div class="main-stats">
                <span class="stat-value">${s.val}</span>
                <div class="stat-label">
                    <i class="fas ${s.icon}"></i> ${s.label}
                </div>
              </div>
            `;
      }
    });
  })
  .catch((err) => console.error(err));

// 4. Handle Layout Shifts
window.addEventListener("load", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 500);
});

// 1. Create the Card Template
function createPopupContent(name, id, temp, hum, wind) {
  // We use ternary operators to show '--' if data is missing from DB
  return `
        <div class="hover-card">
            <div class="card-header">${name}</div>
            <div class="card-body">
                <div class="stat-row">
                    <i class="fas fa-thermometer-half temp-icon"></i>
                    <span>${temp ? temp + "°C" : "--"}</span>
                </div>
                <div class="stat-row">
                    <i class="fas fa-tint hum-icon"></i>
                    <span>${hum ? hum + "%" : "--"}</span>
                </div>
                <div class="stat-row">
                    <i class="fas fa-wind wind-icon"></i>
                    <span>${wind ? wind + " km/h" : "--"}</span>
                </div>
            </div>
            <div class="card-footer">ID: ${id} | Real-time Data</div>
        </div>
    `;
}

// 2. Fetch from your local JSON (which your DB will write to)
async function loadStations() {
  try {
    const response = await fetch("/static/weather_history.json");
    const stations = await response.json();

    stations.forEach((station) => {
      // These variable names should match the keys your database creates
      const cardHtml = createPopupContent(
        station.name,
        station.id,
        station.temperature, // DB Column: temperature
        station.humidity, // DB Column: humidity
        station.wind_speed, // DB Column: wind_speed
      );

      L.marker([station.lat, station.lon]).addTo(map).bindTooltip(cardHtml, {
        className: "custom-card-tooltip",
        sticky: true,
        direction: "top",
      });
    });
  } catch (error) {
    console.error("Database connection error or file missing:", error);
  }
}

loadStations();

// Example listener for CSV upload
document.getElementById("csv-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    console.log("CSV detectado:", file.name);
    // Add your parsing logic here to update the weather_history.json
    // or refresh the table view.
  }
});

// Example listener for JSON upload
document.getElementById("json-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    console.log("JSON detectado:", file.name);
    // Add your parsing logic here.
  }
});
