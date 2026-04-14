// 1. Initialize Map
var map = L.map("map").setView([40.4167, -3.7033], 11);

// 2. Add OpenStreetMap Tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

fetch("/get_data")
  .then(r => r.json())
  .then(data => renderTable(data));

document.addEventListener("DOMContentLoaded", () => {
  fetch("/get_data")
    .then(r => r.json())
    .then(data => renderTable(data));
});

async function cargarDashboard() {
  const resp = await fetch("/api/dashboard");
  const data = await resp.json();

  // --- MAPA ---
  data.estaciones.forEach(st => {
    const fecha = new Date(st.fecha);
    const fechaFormateada = fecha.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const popup = createPopupContent(
      st.name, st.id, st.temperature, st.humidity, st.wind_speed, fechaFormateada
    );

    L.marker([st.lat, st.lon])
      .addTo(map)
      .bindTooltip(popup, {
        className: "custom-card-tooltip",
        sticky: true,
        direction: "top",
      });
  });

  // --- MEDIAS ---
  const m = data.medias;
  document.getElementById("avg-temp-value").textContent =
    `${m.avg_temp.toFixed(1)} °C`;

  document.getElementById("avg-hum-value").textContent =
    `${m.avg_hum.toFixed(0)} %`;

  document.getElementById("avg-wind-value").textContent =
    `${m.avg_wind.toFixed(1)} km/h`;

  // --- RANKING ---
  const k = data.ranking;
  document.getElementById("top-temp-name").textContent = k.top_temp.name;
  document.getElementById("top-temp-val").textContent = `${k.top_temp.value}°C`;

  document.getElementById("top-hum-name").textContent = k.top_hum.name;
  document.getElementById("top-hum-val").textContent = `${k.top_hum.value}%`;

  document.getElementById("top-wind-name").textContent = k.top_wind.name;
  document.getElementById("top-wind-val").textContent = `${k.top_wind.value} km/h`;
}

cargarDashboard();


// 4. Handle Layout Shifts
window.addEventListener("load", () => {
  setTimeout(() => {
    map.invalidateSize();
  }, 500);
});

// 1. Create the Card Template
function createPopupContent(name, id, temp, hum, wind, fecha) {
  // We use ternary operators to show '--' if data is missing from DB
  return `
        <div class="hover-card">
            <div class="card-header">${name}</div>
            <div class="card-date">📅 ${fecha}</div>

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



// Example listener for CSV upload
document.getElementById("csv-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload_csv", {
    method: "POST",
    body: formData
  })
  .then(r => r.json())
  .then(data => console.log("Servidor:", data));

});

// Example listener for JSON upload
document.getElementById("json-upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload_json", {
    method: "POST",
    body: formData
  })
    .then(r => r.json())
    .then(data => {
      console.log("Servidor:", data);
      alert("JSON procesado correctamente");
    });

});
