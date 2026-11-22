// Endpoint base para operaciones relacionadas con recetas médicas
const API_RECETAS = "http://localhost:8081/api/recetas";

// Almacena temporalmente la cita para la cual se está emitiendo una receta
let citaActualReceta = null;

// Caché local de las recetas consultadas en la vista actual
let recetasCache = [];

// Recupera los datos del usuario logueado desde sessionStorage (o null si no existe)
function getSesionRecetas() {
  return JSON.parse(sessionStorage.getItem("usuario") || "null");
}

// Muestra un mensaje usando mostrarMensajeLocal si está disponible, o un alert como respaldo
function mensajeReceta(texto) {
  if (typeof mostrarMensajeLocal === "function") {
    mostrarMensajeLocal(texto);
  } else {
    alert(texto);
  }
}

// Abre un modal usando abrirModalLocal si existe, o agrega directamente la clase "activo"
function abrirModalRecetaLocal(id) {
  if (typeof abrirModalLocal === "function") {
    abrirModalLocal(id);
  } else {
    document.getElementById(id)?.classList.add("activo");
  }
}

// Cierra modales usando cerrarModalesLocal si existe, o quita "activo" a todos los .modal
function cerrarModalesRecetaLocal() {
  if (typeof cerrarModalesLocal === "function") {
    cerrarModalesLocal();
  } else {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
  }
}

// Consulta las recetas emitidas a un paciente/usuario por su ID (regresa [] si falla)
async function obtenerRecetasUsuarioBackend(idUsuario) {
  try {
    const resp = await fetch(`${API_RECETAS}/usuario/${idUsuario}`);
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Error al obtener recetas del usuario:", err);
    return [];
  }
}

// Consulta las recetas emitidas por un médico por su ID (regresa [] si falla)
async function obtenerRecetasMedicoBackend(idMedico) {
  try {
    const resp = await fetch(`${API_RECETAS}/medico/${idMedico}`);
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Error al obtener recetas del médico:", err);
    return [];
  }
}

// Obtiene el detalle completo de una receta específica por su ID (regresa null si falla)
async function obtenerRecetaPorIdBackend(idReceta) {
  try {
    const resp = await fetch(`${API_RECETAS}/${idReceta}`);
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Error al obtener receta por ID:", err);
    return null;
  }
}

// Envía una nueva receta al backend (POST) y retorna la respuesta o lanza error si falla
async function emitirRecetaBackend(payload) {
  const resp = await fetch(API_RECETAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(txt || `Error HTTP: ${resp.status}`);
  }
  return await resp.json();
}

// Prepara el modal de emisión de receta con los datos del paciente y fecha de la cita
function abrirEmisionReceta(cita) {
  citaActualReceta = cita;
  const form = document.getElementById("form-receta");
  if (form) form.reset();

  const nombrePac = cita.usuario?.nombre || cita.idPaciente || "Paciente";
  const info = document.getElementById("receta-info");
  if (info) info.textContent = `Paciente: ${nombrePac} · ${cita.fecha}`;

  abrirModalRecetaLocal("modal-receta");
}

// Maneja el envío del formulario para armar la descripción de la receta y guardarla en el backend
const formReceta = document.getElementById("form-receta");
if (formReceta) {
  formReceta.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = getSesionRecetas();
    if (!sesion || !citaActualReceta) return;

    const diagnostico = document.getElementById("diagnostico").value.trim();
    const tratamiento = document.getElementById("tratamiento").value.trim();
    const indicaciones = document.getElementById("indicaciones").value.trim();

    // Unifica diagnóstico, tratamiento e indicaciones opcionales en un solo texto
    const descripcionCompleta =
      `Diagnóstico: ${diagnostico}\n` +
      `Tratamiento: ${tratamiento}` +
      (indicaciones ? `\nIndicaciones: ${indicaciones}` : "");

    const idCitaNum = citaActualReceta.idCita ?? citaActualReceta.id;
    const idPacienteNum = citaActualReceta.usuario?.idUsuario ?? citaActualReceta.usuario?.id ?? citaActualReceta.idPaciente;

    try {
      await emitirRecetaBackend({
        idCita: idCitaNum,
        idMedico: sesion.id,
        idUsuario: idPacienteNum,
        descripcion: descripcionCompleta,
        fecha: new Date().toISOString().slice(0, 10)
      });

      cerrarModalesRecetaLocal();
      mensajeReceta("Receta emitida");
      // Refresca agenda y listado de recetas si existen en la vista actual
      if (typeof cargarAgenda === "function") await cargarAgenda();
      if (typeof cargarRecetas === "function") await cargarRecetas();
    } catch (err) {
      mensajeReceta(err.message || "Error al emitir receta");
    }
  });
}

// Carga las recetas según el rol (médico o paciente) y renderiza sus tarjetas en #lista-recetas
async function cargarRecetas() {
  const sesion = getSesionRecetas();
  const cont = document.getElementById("lista-recetas");
  if (!cont || !sesion) return;

  const esMedico = (sesion.rol || "").toUpperCase() === "MEDICO";
  recetasCache = esMedico
    ? await obtenerRecetasMedicoBackend(sesion.id)
    : await obtenerRecetasUsuarioBackend(sesion.id);

  if (!recetasCache.length) {
    cont.innerHTML = `<p class="texto-suave">No hay recetas registradas.</p>`;
    return;
  }

  let html = "";
  recetasCache.forEach(r => {
    const idRec = r.idReceta ?? r.id;
    const titulo = esMedico
      ? (r.usuario?.nombre || "Paciente")
      : (r.medico?.usuario?.nombre || r.medico?.nombre || "Médico");

    html += `
      <article class="tarjeta">
        <h3>${titulo}</h3>
        <p class="texto-suave">Fecha: ${r.fecha || ""}</p>
        <p>${r.descripcion || ""}</p>
        <div class="acciones">
          <button type="button" class="boton chico" onclick="verDetalleReceta(${idRec})">Ver detalle / PDF</button>
        </div>
      </article>
    `;
  });

  cont.innerHTML = html;
}

// Crea dinámicamente en el DOM el modal de detalle de receta si aún no existe
function asegurarModalDetalleReceta() {
  if (document.getElementById("receta-tratamiento")) return;

  const existente = document.getElementById("modal-detalle-receta");
  if (existente) return;

  const div = document.createElement("div");
  div.id = "modal-detalle-receta";
  div.className = "modal";
  div.innerHTML = `
    <div class="modal-caja">
      <div class="hoja-receta">
        <h3>Receta médica</h3>
        <p><b id="receta-medico"></b><br><span class="texto-suave" id="receta-especialidad"></span></p>
        <p class="texto-suave">Paciente: <span id="receta-paciente"></span> · Fecha: <span id="receta-fecha"></span></p>
        <p><b>Diagnóstico / Detalle</b><br><span id="receta-diagnostico"></span></p>
        <p><b>Tratamiento</b><br><span id="receta-tratamiento"></span></p>
        <p><b>Indicaciones</b><br><span id="receta-indicaciones"></span></p>
        <p class="firma">______________________<br>Firma del médico</p>
      </div>
      <div class="acciones">
        <button type="button" class="boton" id="btn-pdf">⬇ Descargar PDF</button>
        <button type="button" class="boton secundario" onclick="document.getElementById('modal-detalle-receta').classList.remove('activo')">Cerrar</button>
      </div>
    </div>
  `;
  document.body.appendChild(div);
}

// Consulta una receta por ID, rellena el modal de detalle y conecta el botón de descargar PDF
async function verDetalleReceta(idReceta) {
  asegurarModalDetalleReceta();

  const sesion = getSesionRecetas();
  const r = await obtenerRecetaPorIdBackend(idReceta);
  if (!r) return mensajeReceta("No se pudo cargar la receta.");

  const medNombre = r.medico?.usuario?.nombre || r.medico?.nombre || sesion?.nombre || "Médico";
  const esp = r.medico?.especialidad || "";
  const ced = r.medico?.cedulaProfesional || r.medico?.cedula || "";

  const elMedico = document.getElementById("receta-medico");
  const elEsp = document.getElementById("receta-especialidad");
  const elPac = document.getElementById("receta-paciente");
  const elFecha = document.getElementById("receta-fecha");
  const elDiag = document.getElementById("receta-diagnostico");
  const elTrat = document.getElementById("receta-tratamiento");
  const elInd = document.getElementById("receta-indicaciones");

  if (elMedico) elMedico.textContent = medNombre;
  if (elEsp) elEsp.textContent = esp || ced ? `${esp} · Céd. ${ced}` : "";
  if (elPac) elPac.textContent = r.usuario?.nombre || "";
  if (elFecha) elFecha.textContent = r.fecha || "";
  if (elDiag) elDiag.textContent = r.descripcion || "";
  if (elTrat) elTrat.textContent = "Ver detalle en indicación médica";
  if (elInd) elInd.textContent = "Seguir indicaciones del médico";

  const btnPdf = document.getElementById("btn-pdf");
  if (btnPdf) {
    btnPdf.onclick = descargarRecetaPDF;
  }

  const modalId = document.getElementById("modal-detalle-receta") ? "modal-detalle-receta" : "modal-receta";
  abrirModalRecetaLocal(modalId);
}

// Genera una ventana nueva con formato imprimible de receta y dispara el diálogo de impresión/PDF
function descargarRecetaPDF() {
  const medico = document.getElementById("receta-medico")?.textContent || "Médico";
  const especialidad = document.getElementById("receta-especialidad")?.textContent || "";
  const paciente = document.getElementById("receta-paciente")?.textContent || "Paciente";
  const fecha = document.getElementById("receta-fecha")?.textContent || "";
  const diagnostico = document.getElementById("receta-diagnostico")?.textContent || "";
  const tratamiento = document.getElementById("receta-tratamiento")?.textContent || "";
  const indicaciones = document.getElementById("receta-indicaciones")?.textContent || "Ninguna";

  const ventana = window.open("", "_blank", "width=800,height=600");
  if (!ventana) {
    mensajeReceta("Permite las ventanas emergentes para descargar el PDF.");
    return;
  }

  // Escribe el HTML estilizado para impresión dentro de la nueva ventana
  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Receta Médica - MedLink</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #222; }
        .encabezado { border-bottom: 2px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .encabezado h2 { margin: 0 0 6px 0; }
        .meta { color: #555; font-size: 14px; margin-bottom: 20px; }
        .bloque { margin-bottom: 16px; }
        .bloque b { display: block; margin-bottom: 4px; }
        .texto-multilinea { white-space: pre-line; }
        .firma { margin-top: 48px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <h2>✚ MedLink — Receta Médica</h2>
        <div><b>${medico}</b></div>
        <div>${especialidad}</div>
      </div>
      <div class="meta">
        <b>Paciente:</b> ${paciente} &nbsp;·&nbsp; <b>Fecha:</b> ${fecha}
      </div>
      <div class="bloque">
        <b>Diagnóstico</b>
        <div class="texto-multilinea">${diagnostico}</div>
      </div>
      <div class="bloque">
        <b>Tratamiento</b>
        <div class="texto-multilinea">${tratamiento}</div>
      </div>
      <div class="bloque">
        <b>Indicaciones</b>
        <div class="texto-multilinea">${indicaciones}</div>
      </div>
      <div class="firma">
        ______________________<br>
        Firma del médico
      </div>
    </body>
    </html>
  `);

  ventana.document.close();
  ventana.focus();
  // Pequeña pausa para asegurar que estilos y contenido carguen antes de imprimir
  setTimeout(() => {
    ventana.print();
  }, 250);
}