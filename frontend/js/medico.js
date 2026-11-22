// Guarda los datos del médico autenticado en la sesión actual
let usuarioM = null;

// Abre un modal agregando la clase "activo" al elemento con el id indicado
function abrirModalLocal(id) {
  document.getElementById(id)?.classList.add("activo");
}

// Cierra todos los modales quitando la clase "activo"
function cerrarModalesLocal() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
}

// Cambia la sección visible y marca como activo el botón de navegación correspondiente
function mostrarSeccionLocal(id) {
  document.querySelectorAll(".seccion").forEach(s => s.classList.toggle("activo", s.id === id));
  document.querySelectorAll("[data-seccion]").forEach(b => b.classList.toggle("activo", b.dataset.seccion === id));
}

// Muestra una notificación temporal en #mensaje durante 2.4 segundos
function mostrarMensajeLocal(texto) {
  const m = document.getElementById("mensaje");
  if (!m) return;
  m.textContent = texto;
  m.classList.add("activo");
  setTimeout(() => m.classList.remove("activo"), 2400);
}

// Muestra u oculta un texto de error en el elemento indicado según haya o no mensaje
function mostrarErrorLocal(id, texto) {
  const e = document.getElementById(id);
  if (!e) return;
  e.textContent = texto;
  e.classList.toggle("oculto", !texto);
}

// Delegación global de clics para abrir modales, cerrarlos o cambiar de sección
document.addEventListener("click", e => {
  const abrir = e.target.closest("[data-abrir]");
  if (abrir) abrirModalLocal(abrir.dataset.abrir);

  if (e.target.closest("[data-cerrar]") || e.target.classList.contains("modal")) {
    cerrarModalesLocal();
  }

  const sec = e.target.closest("[data-seccion]");
  if (sec) mostrarSeccionLocal(sec.dataset.seccion);
});

// Inicializa la vista del médico: valida sesión, configura logout/fecha mínima y carga datos
document.addEventListener("DOMContentLoaded", async () => {
  const raw = sessionStorage.getItem("usuario");
  usuarioM = raw ? JSON.parse(raw) : null;

  // Redirige al inicio si no hay sesión o el rol no es MEDICO
  if (!usuarioM || (usuarioM.rol || "").toUpperCase() !== "MEDICO") {
    location.href = "index.html";
    return;
  }

  document.getElementById("nombre-usuario").textContent = usuarioM.nombre;
  document.getElementById("btn-salir").onclick = () => {
    sessionStorage.removeItem("usuario");
    location.href = "index.html";
  };

  // Impide seleccionar fechas anteriores a hoy en el campo de fecha
  const inpFecha = document.getElementById("fecha");
  if (inpFecha) inpFecha.min = new Date().toISOString().slice(0, 10);

  await cargarAgenda();
  if (typeof cargarRecetas === "function") {
    await cargarRecetas();
  }
});

// Caché local de las citas cargadas en la agenda del médico
let agendaCache = [];

// Busca una cita en agendaCache por su id y abre el modal/flujo para emitir su receta
function abrirEmisionRecetaPorId(idCita) {
  const cita = agendaCache.find(x => (x.idCita ?? x.id) == idCita);
  if (cita && typeof abrirEmisionReceta === "function") {
    abrirEmisionReceta(cita);
  }
}

// Consulta las citas del médico y sus recetas emitidas, renderiza las tarjetas y actualiza contadores
async function cargarAgenda() {
  const cont = document.getElementById("lista-agenda");
  if (!cont || !usuarioM) return;

  const mias = await obtenerCitasMedico(usuarioM.id);
  agendaCache = Array.isArray(mias) ? mias : [];

  // Obtiene las recetas para saber cuáles citas atendidas ya tienen receta emitida
  const recetasEmitidas = typeof obtenerRecetasMedicoBackend === "function"
    ? await obtenerRecetasMedicoBackend(usuarioM.id)
    : (typeof recetasCache !== "undefined" ? recetasCache : []);

  if (!agendaCache.length) {
    cont.innerHTML = `<p class="texto-suave">Aún no has publicado citas.</p>`;
    cargarContadores(agendaCache);
    return;
  }

  let html = "";
  agendaCache.forEach(c => {
    const idCita = c.idCita ?? c.id;
    const hIni = c.hora_inicio || c.inicio || "";
    const hFin = c.hora_fin || c.fin || "";
    const pacNombre = c.usuario?.nombre ? `Paciente: ${c.usuario.nombre}` : "Sin paciente";

    const tieneReceta = (recetasEmitidas || []).some(r => {
      const idRecetaCita = r.cita?.idCita ?? r.cita?.id ?? r.idCita ?? r.id_cita;
      return idRecetaCita == idCita;
    });

    // Acciones disponibles según el estado de la cita
    let botones = "";
    if (c.estado === "RESERVADA") {
      botones += `<button type="button" class="boton chico" onclick="cambiarEstadoCita(${idCita}, 'ATENDIDA')">Marcar atendida</button>`;
      botones += `<button type="button" class="boton secundario chico" onclick="cambiarEstadoCita(${idCita}, 'CANCELADA')">Cancelar</button>`;
    }

    // Solo permite emitir receta si está ATENDIDA y aún no tiene receta asociada
    if (c.estado === "ATENDIDA" && !tieneReceta) {
      botones += `<button type="button" class="boton chico" onclick="abrirEmisionRecetaPorId(${idCita})">Emitir receta</button>`;
    }

    html += `
      <article class="tarjeta">
        <div class="fila-pie sin-margen">
          <h3>${c.fecha}</h3>
          <span class="estado ${c.estado}">${c.estado}</span>
        </div>
        <p class="texto-suave">${hIni} – ${hFin}</p>
        <p class="texto-suave">${pacNombre}</p>
        <div class="acciones">${botones}</div>
      </article>
    `;
  });

  cont.innerHTML = html;
  cargarContadores(agendaCache);
}

// Actualiza los contadores numéricos de citas por estado (disponibles, reservadas, atendidas)
function cargarContadores(mias) {
  const cuenta = e => mias.filter(c => c.estado === e).length;
  document.getElementById("cont-disponibles").textContent = cuenta("DISPONIBLE");
  document.getElementById("cont-reservadas").textContent = cuenta("RESERVADA");
  document.getElementById("cont-atendidas").textContent = cuenta("ATENDIDA");
}

// Calcula el promedio de calificaciones del médico y actualiza los indicadores/modal de reseñas
async function mostrarResenas() {
  if (!usuarioM) return;
  const resenasMedico = await obtenerResenas(Number(usuarioM.id));

  const promedio = resenasMedico.length
    ? resenasMedico.reduce((suma, r) => suma + Number(r.calificacion), 0) / resenasMedico.length
    : 0;

  const promEl = document.getElementById("promedio-resenas");
  if (promEl) promEl.textContent = promedio.toFixed(1);

  const contProm = document.getElementById("cont-promedio");
  if (contProm) contProm.textContent = resenasMedico.length ? promedio.toFixed(1) : "-";

  if (typeof cargarResenasModal === "function") {
    cargarResenasModal(resenasMedico);
  }
}