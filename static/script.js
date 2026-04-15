// =====================================================================
// MADRID WEATHER DASHBOARD - MASTER SCRIPT
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------------
  // 1. DASHBOARD PAGE LOGIC (Map & Stats)
  // ---------------------------------------------------------
  const mapElement = document.getElementById("map");

  if (mapElement) {
    var map = L.map("map").setView([40.4167, -3.7033], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

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

    fetch("/static/weather_history.json")
      .then((response) => response.json())
      .then((data) => {
        let t = 0,
          h = 0,
          w = 0;
        const count = data.length;

        data.forEach((station) => {
          t += parseFloat(station.temperatura || station.temp || 0);
          h += parseFloat(station.humedad || station.humidity || 0);
          w += parseFloat(
            station.velocidad_viento || station.wind_speed || station.wind || 0,
          );

          const cardHtml = createPopupContent(
            station.estacion || station.name,
            station.id || "N/A",
            station.temperatura || station.temp,
            station.humedad || station.humidity,
            station.velocidad_viento || station.wind_speed || station.wind,
          );

          L.marker([station.lat, station.lon])
            .addTo(map)
            .bindTooltip(cardHtml, {
              className: "custom-card-tooltip",
              sticky: true,
              direction: "top",
            });
        });

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
      .catch((err) => console.error("Database connection error:", err));

    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }

  // ---------------------------------------------------------
  // 2. AÑADIR DATOS PAGE LOGIC (Event Listeners)
  // ---------------------------------------------------------

  // Protect the form submission so it only runs on the Add Data page
  const addDataForm = document.querySelector(
    "#registro-form-container .weather-form",
  );
  if (addDataForm) {
    addDataForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const estacion = document.getElementById("estacion").value;
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora_picker").value;
      const temp = document.getElementById("input-temp").value;
      const hum = document.getElementById("input-hum").value;
      const wind = document.getElementById("input-wind").value;

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
  }

  // CSV File Input Listener
  const csvInput = document.getElementById("real-csv-input");
  if (csvInput) {
    csvInput.addEventListener("change", function (e) {
      if (e.target.files.length > 0) {
        document.getElementById("file-name-display").innerText =
          "📁 " + e.target.files[0].name;
      }
    });
  }

  // ---------------------------------------------------------
  // 3. SETTINGS PAGE LOGIC (Profile Form Listener)
  // ---------------------------------------------------------
  const btnSaveProfile = document.querySelector(".btn-save");
  if (btnSaveProfile) {
    btnSaveProfile.addEventListener("click", function () {
      alert("¡Perfil actualizado correctamente!");
    });
  }
});

// =====================================================================
// GLOBAL FUNCTIONS (Available to HTML buttons on any page)
// =====================================================================

// --- ADD DATA FUNCTIONS ---
function toggleForm() {
  const form = document.getElementById("registro-form-container");
  const tableView = document.querySelector(".data-view-container");
  const actionBar = document.querySelector(".action-bar");

  if (form && tableView && actionBar) {
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
}

function openCsvModal() {
  document.getElementById("csv-modal").style.display = "flex";
}

function closeCsvModal() {
  document.getElementById("csv-modal").style.display = "none";
  document.getElementById("real-csv-input").value = "";
  document.getElementById("file-name-display").innerText = "";
}

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

// --- SETTINGS TABS & MODALS ---
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }

  const tablinks = document.getElementsByClassName("tab-btn");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  document.getElementById(tabName).classList.add("active");
  evt.currentTarget.classList.add("active");
}

function openStaffModal() {
  document.getElementById("staff-modal").style.display = "flex";
}

function closeStaffModal() {
  document.getElementById("staff-modal").style.display = "none";
  document.getElementById("new-staff-form").reset();
}

// --- SETTINGS USER MANAGEMENT ---
function submitNewStaff(e) {
  e.preventDefault();

  const name = document.getElementById("staff-name").value;
  const email = document.getElementById("staff-email").value;
  const phone = document.getElementById("staff-phone").value;
  const roleValue = document.getElementById("staff-role").value;

  let roleText = "";
  let roleClass = "";

  if (roleValue === "admin") {
    roleText = "Ayuntamiento (Admin)";
    roleClass = "role-admin";
  } else if (roleValue === "trabajador") {
    roleText = "Técnico (Trabajador)";
    roleClass = "role-trabajador";
  } else if (roleValue === "viewer") {
    roleText = "Emergencias (Viewer)";
    roleClass = "role-viewer";
  }

  const tbody = document.getElementById("staff-table-body");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td><strong>${name}</strong><br><small>${email}</small></td>
    <td>${phone}</td>
    <td><span class="role-badge ${roleClass}">${roleText}</span></td>
    <td><button class="btn-delete" onclick="deleteUser(this)"><i class="fas fa-trash"></i></button></td>
  `;

  tbody.appendChild(tr);
  closeStaffModal();
  alert(
    `Usuario ${name} creado con éxito. Se ha enviado un SMS de invitación al ${phone}.`,
  );
}

function deleteUser(btn) {
  if (
    confirm("¿Estás seguro de que deseas revocar el acceso a este usuario?")
  ) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
  }
}
