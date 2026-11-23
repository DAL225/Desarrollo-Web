# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  22/11/2026
**Número de reporte:** 09

---

# 1. Breve descripción de uso

Correcciones a frontend

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | Gemini
Modelo/temperatura | Modelo gratuito(por defecto)
Prompt original | [prompt_1](#prompt_1) 
Respuesta de IA | [respuesta_1](#respuesta_1)
Código anterior | Commit (d65e4b8)
Código posterior | Commit (928cdae)
Diferencias entre versiones | 
0       5       backend/pom.xml
9       13      backend/src/main/java/mx/uv/medlink/backend/Cita.java
3       132     backend/src/main/java/mx/uv/medlink/backend/CitaControlador.java
2       75      backend/src/main/java/mx/uv/medlink/backend/CitaService.java
0       21      backend/src/main/java/mx/uv/medlink/backend/ContactoControlador.java
0       3       backend/src/main/java/mx/uv/medlink/backend/IUsuario.java
47      181     backend/src/main/java/mx/uv/medlink/backend/MedicoControlador.java
4       10      backend/src/main/java/mx/uv/medlink/backend/MedicoService.java
1       4       backend/src/main/java/mx/uv/medlink/backend/Receta.java
2       111     backend/src/main/java/mx/uv/medlink/backend/RecetaControlador.java
2       48      backend/src/main/java/mx/uv/medlink/backend/RecetaService.java
1       14      backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java
1       1       backend/src/main/java/mx/uv/medlink/backend/ResenaDTO.java
90      158     backend/src/main/java/mx/uv/medlink/backend/UsuarioControlador.java
8       38      backend/src/main/java/mx/uv/medlink/backend/UsuarioService.java
0       24      backend/src/main/java/mx/uv/medlink/backend/WebConfig.java
0       11      backend/src/main/resources/templates/contacto.html
0       187     documentacion/IAG/cesar/r-ia-dev-02.md
0       131     documentacion/IAG/cesar/r-ia-doc-02.md
0       79      documentacion/IAG/diego/r-ia-dev-01.md
0       90      documentacion/r-act-04.md
0       23      frontend/contacto.html
0       27      frontend/css/contacto.css
5       30      frontend/css/medico.css
14      96      frontend/css/paciente.css
6       6       frontend/index.html
68      243     frontend/js/citas.js
117     0       frontend/js/comun.js
0       29      frontend/js/contacto.js
46      127     frontend/js/login.js
51      162     frontend/js/medico.js
106     273     frontend/js/paciente.js
80      302     frontend/js/recetas.js
0       275     frontend/js/registro.js
56      171     frontend/js/resenas.js
25      31      frontend/medico.html
79      62      frontend/paciente.html
2       5       frontend/registro.html

git diff --numstat 48d2b5d 0897eez (copiar la salida)
Prueba de funcionamiento |
Frontend funcional
Código de uso | Modificacion / Depuracion  
Reflexión del estudiante | Actualizacion en frontend en cuanto a peticiones y funciones. Se identifico el mal funcionamiento de las funciones sobre citas por lo cual consultando con IA generativa se genero una version estable y funcional parcialmente, que se fue corrigiendo en menor medida posteriormente, identificando que ante la falta de un contexto especifico la IA genera interpretaciones propias.

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Lo siguiente no funciona correctamente en cuanto a la obtencion de fetch:
Ja
``` javascript
const API_RECETAS = "http://localhost:8081/api/recetas";
let citaActualReceta = null;
let recetasCache = [];

function getSesionRecetas() {
  return JSON.parse(sessionStorage.getItem("usuario") || "null");
}

function mensajeReceta(texto) {
  if (typeof mostrarMensajeLocal === "function") {
    mostrarMensajeLocal(texto);
  } else {
    alert(texto);
  }
}

function abrirModalRecetaLocal(id) {
  if (typeof abrirModalLocal === "function") {
    abrirModalLocal(id);
  } else {
    document.getElementById(id)?.classList.add("activo");
  }
}

function cerrarModalesRecetaLocal() {
  if (typeof cerrarModalesLocal === "function") {
    cerrarModalesLocal();
  } else {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
  }
}

async function obtenerRecetasUsuarioBackend(idUsuario) {
  try {
    const resp = await fetch(`${API_RECETAS}/usuario/${idUsuario}`);
    if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
    return await resp.json();
  } catch (err) {
    console.error("Error al obtener recetas:", err);
    return [];
  }
}

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

function abrirEmisionReceta(cita) {
  citaActualReceta = cita;
  const form = document.getElementById("form-receta");
  if (form) form.reset();

  const nombrePac = cita.usuario?.nombre || cita.idPaciente || "Paciente";
  const info = document.getElementById("receta-info");
  if (info) info.textContent = `Paciente: ${nombrePac} · ${cita.fecha}`;

  abrirModalRecetaLocal("modal-receta");
}

const formReceta = document.getElementById("form-receta");
if (formReceta) {
  formReceta.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = getSesionRecetas();
    if (!sesion || !citaActualReceta) return;

    const diagnostico = document.getElementById("diagnostico").value.trim();
    const tratamiento = document.getElementById("tratamiento").value.trim();
    const indicaciones = document.getElementById("indicaciones").value.trim();

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
      if (typeof cargarAgenda === "function") await cargarAgenda();
      if (typeof cargarRecetas === "function") await cargarRecetas();
    } catch (err) {
      mensajeReceta(err.message || "Error al emitir receta");
    }
  });
}

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

async function cargarRecetas() {
  const sesion = getSesionRecetas();
  const cont = document.getElementById("lista-recetas");
  if (!cont || !sesion) return;

  if (sesion.rol === "MEDICO") {
    recetasCache = await obtenerRecetasMedicoBackend(sesion.id);
  } else {
    recetasCache = await obtenerRecetasUsuarioBackend(sesion.id);
  }

  if (!recetasCache.length) {
    cont.innerHTML = `<p class="texto-suave">No hay recetas registradas.</p>`;
    return;
  }

  let html = "";
    recetasCache.forEach(r => {
      const medNombre = r.medico?.usuario?.nombre || r.medico?.nombre || "Médico";
      const idRec = r.idReceta ?? r.id;
      html += `
        <article class="tarjeta">
          <h3>${medNombre}</h3>
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

async function verDetalleReceta(idReceta) {
  const sesion = getSesionRecetas();
  const r = await obtenerRecetaPorIdBackend(idReceta);
  if (!r) return mensajeReceta("No se pudo cargar la receta.");

  const medNombre = r.medico?.usuario?.nombre || r.medico?.nombre || "Médico";
  const esp = r.medico?.especialidad || "";
  const ced = r.medico?.cedulaProfesional || r.medico?.cedula || "";

  document.getElementById("receta-medico").textContent = medNombre;
  document.getElementById("receta-especialidad").textContent = esp || ced ? `${esp} · Céd. ${ced}` : "";
  document.getElementById("receta-paciente").textContent = r.usuario?.nombre || sesion?.nombre || "";
  document.getElementById("receta-fecha").textContent = r.fecha || "";
  document.getElementById("receta-diagnostico").textContent = r.descripcion || "";
  document.getElementById("receta-tratamiento").textContent = "Ver detalle en indicación médica";
  document.getElementById("receta-indicaciones").textContent = "Seguir indicaciones del médico";

  const btnPdf = document.getElementById("btn-pdf");
  if (btnPdf) {
    btnPdf.onclick = descargarRecetaPDF;
  }

  abrirModalRecetaLocal("modal-receta");
}



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
  setTimeout(() => {
    ventana.print();
  }, 250);
} funcione tanto para medico como usuario/paciente

```

## respuesta_1
En tu `cargarRecetas()` actual quitaste el `if (sesion.rol === "MEDICO")` y dejaste solo la tarjeta del paciente (`medNombre` y botón `"Ver detalle / PDF"`), además de que en `medico.html` el modal de receta es para **emitir** receta (`#form-receta`), no el visor de detalle con `#receta-medico`, `#receta-tratamiento` y `#btn-pdf` que tiene `paciente.html`.

Para que **funcione tanto para médico como para usuario/paciente** sin romper ninguna vista:

1. En `cargarRecetas()`, si `sesion.rol === "MEDICO"` muestra el nombre del paciente (`r.usuario?.nombre || "Paciente"`) y la fecha/descripción (y si existe `#modal-ver-receta` o `#receta-medico` también puede abrir detalle, o mostrar la tarjeta emitida limpia como en `medico.html`). Si es `PACIENTE` / usuario, muestra el nombre del médico y el botón `"Ver detalle / PDF"`.


2. En `verDetalleReceta(idReceta)`, verifica que existan los elementos del modal de detalle (`#receta-tratamiento`, `#receta-indicaciones`, `#btn-pdf`) antes de asignarles texto o `.onclick`, evitando errores si se llama en una vista donde no existen.

### `recetas.js` listo para médico y paciente/usuario

```javascript
const API_RECETAS = "http://localhost:8081/api/recetas";
let citaActualReceta = null;
let recetasCache = [];

function getSesionRecetas() {
  return JSON.parse(sessionStorage.getItem("usuario") || "null");
}

function mensajeReceta(texto) {
  if (typeof mostrarMensajeLocal === "function") {
    mostrarMensajeLocal(texto);
  } else {
    alert(texto);
  }
}

function abrirModalRecetaLocal(id) {
  if (typeof abrirModalLocal === "function") {
    abrirModalLocal(id);
  } else {
    document.getElementById(id)?.classList.add("activo");
  }
}

function cerrarModalesRecetaLocal() {
  if (typeof cerrarModalesLocal === "function") {
    cerrarModalesLocal();
  } else {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
  }
}

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

function abrirEmisionReceta(cita) {
  citaActualReceta = cita;
  const form = document.getElementById("form-receta");
  if (form) form.reset();

  const nombrePac = cita.usuario?.nombre || cita.idPaciente || "Paciente";
  const info = document.getElementById("receta-info");
  if (info) info.textContent = `Paciente: ${nombrePac} · ${cita.fecha}`;

  abrirModalRecetaLocal("modal-receta");
}

const formReceta = document.getElementById("form-receta");
if (formReceta) {
  formReceta.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = getSesionRecetas();
    if (!sesion || !citaActualReceta) return;

    const diagnostico = document.getElementById("diagnostico").value.trim();
    const tratamiento = document.getElementById("tratamiento").value.trim();
    const indicaciones = document.getElementById("indicaciones").value.trim();

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
      if (typeof cargarAgenda === "function") await cargarAgenda();
      if (typeof cargarRecetas === "function") await cargarRecetas();
    } catch (err) {
      mensajeReceta(err.message || "Error al emitir receta");
    }
  });
}

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
    if (esMedico) {
      const pacNombre = r.usuario?.nombre || "Paciente";
      html += `
        <article class="tarjeta">
          <h3>${pacNombre}</h3>
          <p class="texto-suave">Fecha: ${r.fecha || ""}</p>
          <p>${r.descripcion || ""}</p>
        </article>
      `;
    } else {
      const medNombre = r.medico?.usuario?.nombre || r.medico?.nombre || "Médico";
      html += `
        <article class="tarjeta">
          <h3>${medNombre}</h3>
          <p class="texto-suave">Fecha: ${r.fecha || ""}</p>
          <p>${r.descripcion || ""}</p>
          <div class="acciones">
            <button type="button" class="boton chico" onclick="verDetalleReceta(${idRec})">Ver detalle / PDF</button>
          </div>
        </article>
      `;
    }
  });

  cont.innerHTML = html;
}

async function verDetalleReceta(idReceta) {
  const sesion = getSesionRecetas();
  const r = await obtenerRecetaPorIdBackend(idReceta);
  if (!r) return mensajeReceta("No se pudo cargar la receta.");

  const medNombre = r.medico?.usuario?.nombre || r.medico?.nombre || "Médico";
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
  if (elPac) elPac.textContent = r.usuario?.nombre || sesion?.nombre || "";
  if (elFecha) elFecha.textContent = r.fecha || "";
  if (elDiag) elDiag.textContent = r.descripcion || "";
  if (elTrat) elTrat.textContent = "Ver detalle en indicación médica";
  if (elInd) elInd.textContent = "Seguir indicaciones del médico";

  const btnPdf = document.getElementById("btn-pdf");
  if (btnPdf) {
    btnPdf.onclick = descargarRecetaPDF;
  }

  abrirModalRecetaLocal("modal-receta");
}

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
  setTimeout(() => {
    ventana.print();
  }, 250);
}

```

¿Ya con esto te carga y muestra bien las recetas tanto en el panel del médico como en el del paciente?



## Observaciones adicionales

Se muestra una gran diferencia entre versiones debido a que localmente se modificaron y mezclaron los cambios realizados por compañeros desde la ultima vez que el repositorio local estuvo en sincronia con el de github