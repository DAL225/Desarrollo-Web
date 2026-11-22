// Variables globales de estado para la vista del paciente y el médico seleccionado
let usuario = null;
let medicoActual = null;
let medicoIdActual = null;
let listaMedicos = [];

// Referencias a controles de búsqueda, filtro por especialidad y contenedor del directorio
const inpBarraBusqueda = document.getElementById("inpBarraBusqueda") || document.getElementById("buscar");
const selectEspecialidad = document.getElementById("selectEspecialidad") || document.getElementById("filtro-especialidad");
const divListaMedicos = document.getElementById("divListaMedicos") || document.getElementById("lista-medicos");

// Abre un modal agregando la clase "activo" al elemento con el id indicado
function abrirModalLocal(id) {
  document.getElementById(id)?.classList.add("activo");
}

// Cierra todos los modales quitando la clase "activo"
function cerrarModalesLocal() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
}

// Cambia la sección visible y resalta el botón de navegación correspondiente
function mostrarSeccionLocal(id) {
  document.querySelectorAll(".seccion").forEach(s => s.classList.toggle("activo", s.id === id));
  document.querySelectorAll("[data-seccion]").forEach(b => b.classList.toggle("activo", b.dataset.seccion === id));
}

// Muestra un mensaje temporal en #mensaje durante 2.4 segundos
function mostrarMensajeLocal(texto) {
  const m = document.getElementById("mensaje");
  if (!m) return;
  m.textContent = texto;
  m.classList.add("activo");
  setTimeout(() => m.classList.remove("activo"), 2400);
}

// Delegación global de clics para abrir/cerrar modales y cambiar de sección
document.addEventListener("click", e => {
  const abrir = e.target.closest("[data-abrir]");
  if (abrir) abrirModalLocal(abrir.dataset.abrir);

  if (e.target.closest("[data-cerrar]") || e.target.classList.contains("modal")) {
    cerrarModalesLocal();
  }

  const sec = e.target.closest("[data-seccion]");
  if (sec) mostrarSeccionLocal(sec.dataset.seccion);
});

// Consulta al backend el catálogo completo de médicos (regresa [] si ocurre un error)
async function fetchMedicosBackend() {
  try {
    const resp = await fetch("http://localhost:8081/api/medicos");
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Error al obtener médicos:", err);
    return [];
  }
}

// Inicializa la vista del paciente: valida sesión, configura logout y carga directorio, citas y recetas
document.addEventListener("DOMContentLoaded", async () => {
  const raw = sessionStorage.getItem("usuario");
  usuario = raw ? JSON.parse(raw) : null;

  // Redirige al login si no hay sesión o el rol no es PACIENTE
  if (!usuario || (usuario.rol || "").toUpperCase() !== "PACIENTE") {
    location.href = "index.html";
    return;
  }

  document.getElementById("nombre-usuario").textContent = usuario.nombre;
  document.getElementById("btn-salir").onclick = () => {
    sessionStorage.removeItem("usuario");
    location.href = "index.html";
  };

  cargarEspecialidades();
  await renderizarDirectorio();
  await cargarCitas();
  if (typeof cargarRecetas === "function") {
    await cargarRecetas();
  }
});

// Llena el <select> de especialidades médicas con opciones predefinidas
function cargarEspecialidades() {
  if (!selectEspecialidad) return;
  const lista = [
    "Dermatología", "Cardiología", "Ginecología", "Neurología",
    "Pediatría", "Psiquiatría", "Traumatología", "Medicina general"
  ];
  let html = `<option value="">Todas las especialidades</option>`;
  lista.forEach(e => {
    html += `<option value="${e}">${e}</option>`;
  });
  selectEspecialidad.innerHTML = html;
}

// Filtra y renderiza las tarjetas de médicos según el texto buscado y la especialidad seleccionada
async function renderizarDirectorio() {
  if (!divListaMedicos) return;

  const texto = inpBarraBusqueda ? inpBarraBusqueda.value.trim().toLowerCase() : "";
  const esp = selectEspecialidad ? selectEspecialidad.value : "";

  if (!listaMedicos.length) {
    listaMedicos = await fetchMedicosBackend();
  }

  const filtrados = listaMedicos.filter(doc => {
    const nombre = (doc.usuario?.nombre || "").toLowerCase();
    const especialidad = (doc.especialidad || "");
    const coincideTexto = !texto || nombre.includes(texto) || especialidad.toLowerCase().includes(texto);
    const coincideEsp = !esp || especialidad === esp;
    return coincideTexto && coincideEsp;
  });

  if (!filtrados.length) {
    divListaMedicos.innerHTML = `<p class="texto-suave">Sin resultados.</p>`;
    return;
  }

  let html = "";
  filtrados.forEach(doctor => {
    const nombre = doctor.usuario?.nombre || "Médico";
    const inicial = nombre.charAt(0).toUpperCase();
    const correo = doctor.usuario?.correo || "";
    const idMed = doctor.idMedico ?? doctor.id;

    html += `
      <article class="tarjeta">
        <div class="med-cabecera">
          <div class="avatar">${inicial}</div>
          <div>
            <h3>${nombre}</h3>
            <p class="texto-suave">${doctor.especialidad} · Céd. ${doctor.cedulaProfesional}</p>
          </div>
        </div>
        <p class="texto-suave">📍 ${doctor.direccion}</p>
        <div class="fila-pie">
          <button type="button" class="boton chico" onclick="verResenas(${idMed})">Ver reseñas</button>
          <button type="button" class="boton chico" onclick="abrirMedico('${correo}')">Ver horarios</button>
        </div>
      </article>
    `;
  });

  divListaMedicos.innerHTML = html;
}

// Actualiza el directorio en tiempo real al escribir o cambiar la especialidad
inpBarraBusqueda?.addEventListener("input", renderizarDirectorio);
selectEspecialidad?.addEventListener("change", renderizarDirectorio);

// Selecciona un médico por correo, llena sus datos en el modal, carga horarios libres y abre el modal
async function abrirMedico(correo) {
  const m = listaMedicos.find(element => element.usuario?.correo === correo);
  if (!m) return;

  medicoActual = correo;
  medicoIdActual = m.idMedico ?? m.id;

  document.getElementById("medico-nombre").textContent = m.usuario?.nombre || "";
  document.getElementById("medico-datos").textContent = `${m.especialidad} · Céd. ${m.cedulaProfesional}`;
  document.getElementById("medico-direccion").textContent = `📍 ${m.direccion}`;

  await cargarHorarios(medicoIdActual);
  abrirModalLocal("modal-medico");
}

// Consulta las citas de un médico, filtra las DISPONIBLE y renderiza los botones para reservar
async function cargarHorarios(idMedico) {
  const cont = document.getElementById("lista-horarios");
  if (!cont) return;

  const citasMed = await obtenerCitasMedico(idMedico);
  const libres = citasMed.filter(c => c.estado === "DISPONIBLE");

  if (!libres.length) {
    cont.innerHTML = `<p class="texto-suave">Sin horarios disponibles.</p>`;
    return;
  }

  let html = "";
  libres.forEach(c => {
    const idCita = c.idCita ?? c.id;
    const hIni = c.hora_inicio || c.inicio || "";
    const hFin = c.hora_fin || c.fin || "";

    html += `
      <div class="fila-resena fila-pie sin-margen">
        <div>
          <b>${c.fecha}</b>
          <p class="texto-suave">${hIni} – ${hFin}</p>
        </div>
        <button type="button" class="boton chico" onclick="reservarCita(${idCita})">Reservar</button>
      </div>
    `;
  });

  cont.innerHTML = html;
}

// Caché local de las citas del paciente
let citasPacienteCache = [];

// Busca una cita en citasPacienteCache por id y abre el modal para dejar reseña
function abrirModalResenaPorId(idCita) {
  const cita = citasPacienteCache.find(x => (x.idCita ?? x.id) == idCita);
  if (cita && typeof abrirModalResena === "function") {
    abrirModalResena(cita);
  }
}

// Obtiene y unifica en un solo arreglo las reseñas de distintos IDs de médicos sin duplicar consultas
async function obtenerResenasDeMedicos(idsMedicos) {
  const unicos = [...new Set(idsMedicos.map(Number).filter(Boolean))];
  const resultados = await Promise.all(
    unicos.map(async idMed => {
      const lista = typeof obtenerResenas === "function" ? await obtenerResenas(idMed) : [];
      return Array.isArray(lista) ? lista : [];
    })
  );
  return resultados.flat();
}

// Carga las citas del paciente, muestra el contador de citas activas y renderiza tarjetas (con opción a reseñar si está ATENDIDA)
async function cargarCitas() {
  const cont = document.getElementById("lista-citas");
  if (!cont || !usuario) return;

  if (!listaMedicos.length) {
    listaMedicos = await fetchMedicosBackend();
  }

  const mias = await obtenerCitasUsuario(usuario.id);
  citasPacienteCache = Array.isArray(mias) ? mias : [];

  const activas = citasPacienteCache.filter(c => c.estado === "RESERVADA").length;
  const infoLimite = document.getElementById("info-limite");
  if (infoLimite) {
    infoLimite.textContent = `Tienes ${activas} citas activas de 3 permitidas.`;
  }

  if (!citasPacienteCache.length) {
    cont.innerHTML = `<p class="texto-suave">No tienes citas registradas.</p>`;
    return;
  }

  const idsMedicosAtendidos = citasPacienteCache
    .filter(c => c.estado === "ATENDIDA")
    .map(c => c.medico?.idMedico ?? c.idMedico);

  const todasResenas = await obtenerResenasDeMedicos(idsMedicosAtendidos);
  const miId = usuario.idUsuario ?? usuario.id;

  let html = "";
  citasPacienteCache.forEach(c => {
    const idCita = c.idCita ?? c.id;
    const hIni = c.hora_inicio || c.inicio || "";
    const hFin = c.hora_fin || c.fin || "";
    const idMedCita = c.medico?.idMedico ?? c.idMedico;
    const medObj = listaMedicos.find(m => (m.idMedico ?? m.id) == idMedCita);
    const nombreMed = c.medico?.usuario?.nombre || medObj?.usuario?.nombre || `Médico #${idMedCita}`;

    // Verifica si el paciente ya dejó reseña para esta cita (o para el médico en esa cita)
    const yaDejoResena = todasResenas.some(r => {
      const idResenaCita = r.cita?.idCita ?? r.cita?.id ?? r.idCita ?? r.id_cita;
      if (idResenaCita != null) {
        return idResenaCita == idCita;
      }
      // Respaldo si la reseña se vincula por id de médico y usuario en lugar de id de cita
      const idResenaMed = r.medico?.idMedico ?? r.idMedico;
      const idResenaUsr = r.usuario?.idUsuario ?? r.usuario?.id ?? r.idUsuario;
      return idResenaMed == idMedCita && idResenaUsr == miId;
    });

    let acciones = "";
    if (c.estado === "ATENDIDA" && !yaDejoResena) {
      acciones += `<button type="button" class="boton chico" onclick="abrirModalResenaPorId(${idCita})">Dejar reseña</button>`;
    }

    html += `
      <article class="tarjeta">
        <div class="fila-pie sin-margen">
          <h3>${nombreMed}</h3>
          <span class="estado ${c.estado}">${c.estado}</span>
        </div>
        <p class="texto-suave">${c.fecha} (${hIni} – ${hFin})</p>
        <div class="acciones">${acciones}</div>
      </article>
    `;
  });

  cont.innerHTML = html;
}

// Consulta las reseñas de un médico, calcula su promedio y abre el modal con el listado
async function verResenas(idMedico) {
  const resenasMedico = await obtenerResenas(Number(idMedico));
  abrirModalLocal("modal-lista-resenas");

  const promedio = resenasMedico.length
    ? resenasMedico.reduce((suma, r) => suma + Number(r.calificacion), 0) / resenasMedico.length
    : 0;

  document.getElementById("promedio-resenas").textContent = promedio.toFixed(1);
  if (typeof cargarResenasModal === "function") {
    cargarResenasModal(resenasMedico);
  }
}