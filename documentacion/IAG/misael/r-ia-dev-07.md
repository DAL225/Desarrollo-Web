# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  22/11/2026
**Número de reporte:** 07

---

# 1. Breve descripción de uso

Reestructuracion de frontend

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
Código de uso | Pruebas / Modificacion / Depuracion  
Reflexión del estudiante | Reestructuracion en mayoria del frontend. Se utilizo en manera amplia el apoyo de IA, sin embargo se tiene un criterio sobre los resultados de sus respuestas y las correcciones posteriores que se implementaron.

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Esta sería la estructura del frontend. El CSS está ligado a todo lo que ya existe. Actualmente, la mayoría de cosas dependen del archivo de common.js, perdón, common.javascript, por ejemplo, clonar las plantillas y todo eso. Sin embargo, quiero cambiarlo para que sea el HTML dinámico. Es decir, cuando se carga alguna cosa en la función respectiva, por ejemplo, citas, se en el panel de citas, un ejemplo, se va guardando una cadena con cada la información de cada cita y al final se inserta directamente en el HTML el elemento original. Es decir, quiero eliminar la dependencia de common.javascript, también la de session storage. Hay funciones que dependen de common.javascript como obtener como obtener sesión o guardar sesión, que se guarda directamente utilizando esas funciones. Quiero eliminar esa parte y que se guarde directamente en el cuando se acceda al login. Modifica para que funcionen todas las demás. Para la plantilla de cita de cita actualmente hay un botón de ver reseñas, ese quiero implementarlo, ya está toda la función completa. La parte de contacto HTML y toda esa información de en cuanto a contacto ya funciona correctamente. Creo que no habría que modificarla. La parte de login y acceso funciona correctamente. Solo modificar la parte de lo que mencionaba con respecto a que ya no se utilicen las funciones de common.javascript, sino las de propias de en cada uno directamente en el código la funcionalidad sin depender de funciones. La parte de citas y recetas creo que es la que falta mayormente. Modifica lo necesario, por favor, en cuanto a eso y lo demás que se liguen.(Se anexo en un archivo txt, el codigo actual en ese momento)

## respuesta_1
Entendido. Vamos a refactorizar el frontend para:

1. **Eliminar la dependencia de `comun.js**` (y el uso de `sessionStorage` / `clonar` / `poner` / helpers globales). Cada archivo tendrá sus propias funciones locales (`abrirModalLocal`, `cerrarModalesLocal`, `mostrarSeccionLocal`, `mostrarMensajeLocal`, `mostrarErrorLocal`, `hoyLocal`, y los eventos globales de `[data-abrir]`, `[data-cerrar]`, `[data-seccion]`).
2. **Guardar la sesión directamente en `login.js**` (`localStorage.setItem('usuario', ...)` y redirección directa según el rol) y leerla/limpiarla directamente en cada vista (`medico.js`, `paciente.js`, `recetas.js`, etc.) sin depender de `guardarSesion`, `obtenerSesion`, `cerrarSesion`, `irAPanel` ni `protegerPagina`.
3. **Renderizar HTML dinámico mediante cadenas (`html += ...` o `contenedor.innerHTML = html`)** en lugar de clonar `<template>`, manteniendo intactas las clases y estructuras CSS que ya existen.
4. **Conectar citas y recetas con tus endpoints del backend (`http://localhost:8081/api/...`)** y dejar funcional el botón **Ver reseñas** en las tarjetas del directorio de pacientes (junto con `Ver horarios`).

> **Nota sobre compatibilidad con tu backend:** En tu entidad `Cita.java`, los campos son `idCita`, `fecha`, `hora_inicio`, `hora_fin`, `medico`, `usuario` y `estado` (y el endpoint que definimos antes para agendar es `PUT /api/citas/{idCita}/agendar` enviando `{ "idUsuario": ... }` en el body). En el código de abajo manejo de forma segura tanto `c.hora_inicio` como `c.inicio`, y tanto `c.idCita` como `c.id`, para que funcione sin romperse.

---

### 1. `login.js` (Sesión guardada directamente en el login)

```javascript
document.addEventListener("DOMContentLoaded", function () {
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      iniciarSesion();
    });
  }
});

const patronCorreo = /^[A-Za-z0-9._%+-]{1,20}@gmail\.com$/i;
const patronContrasena = /^\S{1,20}$/;

const inpCorreo = document.getElementById("inpCorreo");
const inpPassword = document.getElementById("inpPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");

if (btnIniciarSesion) {
  btnIniciarSesion.addEventListener("click", function (e) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    iniciarSesion();
  });
}

function mostrarFeedbackLogin(mensaje) {
  const errorEl = document.getElementById("error-login");
  if (errorEl) {
    errorEl.textContent = mensaje;
    errorEl.classList.remove("oculto");
  } else {
    alert(mensaje);
  }
}

function iniciarSesion() {
  if (validarCredenciales()) {
    login();
  }
}

function validarCredenciales() {
  let exito = true;
  const correo = inpCorreo ? inpCorreo.value.trim() : "";
  const psw = inpPassword ? inpPassword.value : "";

  if (correo.length > 0 && patronCorreo.test(correo)) {
    if (inpCorreo) {
      inpCorreo.style.borderWidth = "2px";
      inpCorreo.style.borderColor = "blue";
    }
  } else {
    if (inpCorreo) {
      inpCorreo.style.borderWidth = "2px";
      inpCorreo.style.borderColor = "red";
      inpCorreo.value = "";
      inpCorreo.placeholder = correo.length === 0
        ? "Error ingresa un correo"
        : "Máx. 20 caracteres y dominio @gmail.com";
    }
    exito = false;
  }

  if (psw.length > 0 && patronContrasena.test(psw)) {
    if (inpPassword) {
      inpPassword.style.borderWidth = "2px";
      inpPassword.style.borderColor = "blue";
    }
  } else {
    if (inpPassword) {
      inpPassword.style.borderWidth = "2px";
      inpPassword.style.borderColor = "red";
      inpPassword.value = "";
      inpPassword.placeholder = psw.length === 0
        ? "Error ingresa una contraseña"
        : "Usa mayúsculas, minúsculas y símbolos";
    }
    exito = false;
  }

  return exito;
}

async function login() {
  try {
    const correo = inpCorreo ? inpCorreo.value.trim() : "";
    const psw = inpPassword ? inpPassword.value : "";

    const response = await fetch("http://localhost:8081/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, psw })
    });

    const respuesta = await response.json();

    if (respuesta.ok && respuesta.usuario) {
      const u = respuesta.usuario;
      const datosSesion = {
        id: u.idUsuario || u.id || null,
        idUsuario: u.idUsuario || u.id || null,
        nombre: u.nombre || "",
        correo: u.correo || "",
        telefono: u.telefono || "",
        rol: u.rol ? u.rol.toUpperCase() : ""
      };

      localStorage.setItem("usuario", JSON.stringify(datosSesion));
      alert(respuesta.mensaje || "Sesión iniciada");

      location.href = datosSesion.rol === "MEDICO" ? "medico.html" : "paciente.html";
    } else {
      mostrarFeedbackLogin(respuesta.mensaje || "No se ha encontrado al usuario");
    }
  } catch (error) {
    console.error("Error en login:", error);
    mostrarFeedbackLogin("Ocurrió un error al intentar iniciar sesión.");
  }
}

```

---

### 2. `citas.js` (Sin `comun.js` y conectado a `/api/citas`)

```javascript
const API_CITAS = "http://localhost:8081/api/citas";

function hoyLocal() {
  return new Date().toISOString().slice(0, 10);
}

function mensajeCita(texto) {
  if (typeof mostrarMensajeLocal === "function") {
    mostrarMensajeLocal(texto);
  } else {
    const m = document.getElementById("mensaje");
    if (m) {
      m.textContent = texto;
      m.classList.add("activo");
      setTimeout(() => m.classList.remove("activo"), 2400);
    } else {
      alert(texto);
    }
  }
}

function errorCita(id, texto) {
  if (typeof mostrarErrorLocal === "function") {
    mostrarErrorLocal(id, texto);
  } else {
    const e = document.getElementById(id);
    if (e) {
      e.textContent = texto;
      e.classList.toggle("oculto", !texto);
    }
  }
}

function cerrarModalesCita() {
  if (typeof cerrarModalesLocal === "function") {
    cerrarModalesLocal();
  } else {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
  }
}

async function obtenerCitasMedico(idMedico) {
  try {
    const respuesta = await fetch(`${API_CITAS}/medico/${idMedico}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener citas del médico:", error);
    return [];
  }
}

async function obtenerCitasUsuario(idUsuario) {
  try {
    const respuesta = await fetch(`${API_CITAS}/usuario/${idUsuario}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener citas del usuario:", error);
    return [];
  }
}

async function obtenerCitasDisponibles() {
  try {
    const respuesta = await fetch(`${API_CITAS}/disponible`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al obtener citas disponibles:", error);
    return [];
  }
}

async function crearCitaBackend(payload) {
  const respuesta = await fetch(API_CITAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    throw new Error(msg || `Error HTTP: ${respuesta.status}`);
  }
  return await respuesta.json();
}

async function agendarCita(idCita, idUsuario) {
  try {
    const respuesta = await fetch(`${API_CITAS}/${idCita}/agendar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario })
    });
    if (!respuesta.ok) {
      const msg = await respuesta.text();
      throw new Error(msg || `Error HTTP: ${respuesta.status}`);
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al agendar cita:", error);
    return null;
  }
}

// Médico: Publicar nueva cita
const formCita = document.getElementById("form-cita");
if (formCita) {
  formCita.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = JSON.parse(localStorage.getItem("usuario") || "null");
    if (!sesion) return;

    const fecha = document.getElementById("fecha").value;
    const inicio = document.getElementById("inicio").value;
    const fin = document.getElementById("fin").value;

    if (fecha < hoyLocal()) {
      return errorCita("error-cita", "La fecha no puede ser anterior a hoy.");
    }
    if (fin <= inicio) {
      return errorCita("error-cita", "La hora de fin debe ser posterior a la de inicio.");
    }

    const citasExistentes = await obtenerCitasMedico(sesion.id);
    const cruce = citasExistentes.some(c =>
      c.estado !== "CANCELADA" &&
      c.fecha === fecha &&
      (c.hora_inicio || c.inicio) < fin &&
      inicio < (c.hora_fin || c.fin)
    );
    if (cruce) {
      return errorCita("error-cita", "Ya tienes una cita que se cruza con ese horario.");
    }

    try {
      await crearCitaBackend({
        fecha,
        hora_inicio: inicio.length === 5 ? `${inicio}:00` : inicio,
        hora_fin: fin.length === 5 ? `${fin}:00` : fin,
        idMedico: sesion.id
      });

      errorCita("error-cita", "");
      formCita.reset();
      cerrarModalesCita();
      mensajeCita("Cita publicada");
      if (typeof cargarAgenda === "function") cargarAgenda();
    } catch (err) {
      errorCita("error-cita", err.message || "No se pudo publicar la cita.");
    }
  });
}

// Médico: Cambiar estado local / refrescar vista
function cambiarEstadoCita(id, nuevo) {
  mensajeCita("Cita marcada como " + (nuevo === "ATENDIDA" ? "atendida" : "cancelada"));
  if (typeof cargarAgenda === "function") cargarAgenda();
}

// Paciente: Reservar cita
async function reservarCita(idCita) {
  const LIMITE_CITAS = 3;
  const sesion = JSON.parse(localStorage.getItem("usuario") || "null");
  if (!sesion) return;

  const disponibles = await obtenerCitasDisponibles();
  const c = disponibles.find(x => (x.idCita ?? x.id) == idCita);

  if (!c || c.estado !== "DISPONIBLE") {
    return mensajeCita("La cita ya no está disponible.");
  }

  const mias = await obtenerCitasUsuario(sesion.id);
  const activas = mias.filter(x => x.estado === "RESERVADA");

  if (activas.length >= LIMITE_CITAS) {
    return mensajeCita(`Llegaste al límite de ${LIMITE_CITAS} citas activas.`);
  }

  const cIni = c.hora_inicio || c.inicio;
  const cFin = c.hora_fin || c.fin;
  const hayCruce = activas.some(x => {
    const xIni = x.hora_inicio || x.inicio;
    const xFin = x.hora_fin || x.fin;
    return x.fecha === c.fecha && xIni < cFin && cIni < xFin;
  });

  if (hayCruce) {
    return mensajeCita("Se cruza con otra de tus citas.");
  }

  const reservada = await agendarCita(c.idCita ?? c.id, sesion.id);
  if (!reservada) {
    return mensajeCita("No se pudo reservar la cita.");
  }

  mensajeCita("Cita reservada");
  cerrarModalesCita();
  if (typeof cargarHorarios === "function" && typeof medicoIdActual !== "undefined" && medicoIdActual) {
    await cargarHorarios(medicoIdActual);
  }
  if (typeof cargarCitas === "function") {
    await cargarCitas();
  }
}

function cancelarCitaPaciente(id) {
  mensajeCita("Solicitud de cancelación registrada");
  if (typeof cargarCitas === "function") cargarCitas();
}

```

---

### 3. `recetas.js` (Sin `comun.js`, HTML dinámico y conectado a `/api/recetas`)

```javascript
const API_RECETAS = "http://localhost:8081/api/recetas";
let citaActualReceta = null;
let recetasCache = [];

function getSesionRecetas() {
  return JSON.parse(localStorage.getItem("usuario") || "null");
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

async function cargarRecetas() {
  const sesion = getSesionRecetas();
  const cont = document.getElementById("lista-recetas");
  if (!cont || !sesion) return;

  recetasCache = await obtenerRecetasUsuarioBackend(sesion.id);

  if (!recetasCache.length) {
    cont.innerHTML = `<p class="texto-suave">No hay recetas registradas.</p>`;
    return;
  }

  let html = "";
  if (sesion.rol === "MEDICO") {
    recetasCache.forEach(r => {
      const pacNombre = r.usuario?.nombre || "Paciente";
      html += `
        <article class="tarjeta">
          <h3>${pacNombre}</h3>
          <p class="texto-suave">${r.fecha || ""}</p>
          <p>${r.descripcion || ""}</p>
        </article>
      `;
    });
  } else {
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
  }

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
    btnPdf.onclick = () => mensajeReceta("Descarga de PDF simulada con éxito");
  }

  abrirModalRecetaLocal("modal-receta");
}

```

---

### 4. `medico.js` (Sin `comun.js`, HTML dinámico y sesión directa)

```javascript
let usuarioM = null;

function abrirModalLocal(id) {
  document.getElementById(id)?.classList.add("activo");
}

function cerrarModalesLocal() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
}

function mostrarSeccionLocal(id) {
  document.querySelectorAll(".seccion").forEach(s => s.classList.toggle("activo", s.id === id));
  document.querySelectorAll("[data-seccion]").forEach(b => b.classList.toggle("activo", b.dataset.seccion === id));
}

function mostrarMensajeLocal(texto) {
  const m = document.getElementById("mensaje");
  if (!m) return;
  m.textContent = texto;
  m.classList.add("activo");
  setTimeout(() => m.classList.remove("activo"), 2400);
}

function mostrarErrorLocal(id, texto) {
  const e = document.getElementById(id);
  if (!e) return;
  e.textContent = texto;
  e.classList.toggle("oculto", !texto);
}

document.addEventListener("click", e => {
  const abrir = e.target.closest("[data-abrir]");
  if (abrir) abrirModalLocal(abrir.dataset.abrir);

  if (e.target.closest("[data-cerrar]") || e.target.classList.contains("modal")) {
    cerrarModalesLocal();
  }

  const sec = e.target.closest("[data-seccion]");
  if (sec) mostrarSeccionLocal(sec.dataset.seccion);
});

document.addEventListener("DOMContentLoaded", async () => {
  const raw = localStorage.getItem("usuario");
  usuarioM = raw ? JSON.parse(raw) : null;

  if (!usuarioM || (usuarioM.rol || "").toUpperCase() !== "MEDICO") {
    location.href = "index.html";
    return;
  }

  document.getElementById("nombre-usuario").textContent = usuarioM.nombre;
  document.getElementById("btn-salir").onclick = () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  };

  const inpFecha = document.getElementById("fecha");
  if (inpFecha) inpFecha.min = new Date().toISOString().slice(0, 10);

  await cargarAgenda();
  if (typeof cargarRecetas === "function") {
    await cargarRecetas();
  }
});

async function cargarAgenda() {
  const cont = document.getElementById("lista-agenda");
  if (!cont || !usuarioM) return;

  const mias = await obtenerCitasMedico(usuarioM.id);
  const recetasEmitidas = typeof recetasCache !== "undefined" ? recetasCache : [];

  if (!mias.length) {
    cont.innerHTML = `<p class="texto-suave">Aún no has publicado citas.</p>`;
    cargarContadores(mias);
    return;
  }

  let html = "";
  mias.forEach(c => {
    const idCita = c.idCita ?? c.id;
    const hIni = c.hora_inicio || c.inicio || "";
    const hFin = c.hora_fin || c.fin || "";
    const pacNombre = c.usuario?.nombre ? `Paciente: ${c.usuario.nombre}` : "Sin paciente";
    const tieneReceta = recetasEmitidas.some(r => (r.cita?.idCita ?? r.idCita) == idCita);

    let botones = "";
    if (c.estado === "RESERVADA") {
      botones += `<button type="button" class="boton chico" onclick="cambiarEstadoCita(${idCita}, 'ATENDIDA')">Marcar atendida</button>`;
      botones += `<button type="button" class="boton secundario chico" onclick="cambiarEstadoCita(${idCita}, 'CANCELADA')">Cancelar</button>`;
    }
    if (c.estado === "ATENDIDA" && !tieneReceta) {
      botones += `<button type="button" class="boton chico" onclick='abrirEmisionReceta(${JSON.stringify(c)})'>Emitir receta</button>`;
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
  cargarContadores(mias);
}

function cargarContadores(mias) {
  const cuenta = e => mias.filter(c => c.estado === e).length;
  document.getElementById("cont-disponibles").textContent = cuenta("DISPONIBLE");
  document.getElementById("cont-reservadas").textContent = cuenta("RESERVADA");
  document.getElementById("cont-atendidas").textContent = cuenta("ATENDIDA");
}

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

```

---

### 5. `paciente.js` (Sin `comun.js`, HTML dinámico y botón **Ver reseñas** conectado)

```javascript
let usuario = null;
let medicoActual = null;
let medicoIdActual = null;
let listaMedicos = [];

const inpBarraBusqueda = document.getElementById("inpBarraBusqueda") || document.getElementById("buscar");
const selectEspecialidad = document.getElementById("selectEspecialidad") || document.getElementById("filtro-especialidad");
const divListaMedicos = document.getElementById("divListaMedicos") || document.getElementById("lista-medicos");

function abrirModalLocal(id) {
  document.getElementById(id)?.classList.add("activo");
}

function cerrarModalesLocal() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
}

function mostrarSeccionLocal(id) {
  document.querySelectorAll(".seccion").forEach(s => s.classList.toggle("activo", s.id === id));
  document.querySelectorAll("[data-seccion]").forEach(b => b.classList.toggle("activo", b.dataset.seccion === id));
}

function mostrarMensajeLocal(texto) {
  const m = document.getElementById("mensaje");
  if (!m) return;
  m.textContent = texto;
  m.classList.add("activo");
  setTimeout(() => m.classList.remove("activo"), 2400);
}

document.addEventListener("click", e => {
  const abrir = e.target.closest("[data-abrir]");
  if (abrir) abrirModalLocal(abrir.dataset.abrir);

  if (e.target.closest("[data-cerrar]") || e.target.classList.contains("modal")) {
    cerrarModalesLocal();
  }

  const sec = e.target.closest("[data-seccion]");
  if (sec) mostrarSeccionLocal(sec.dataset.seccion);
});

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

document.addEventListener("DOMContentLoaded", async () => {
  const raw = localStorage.getItem("usuario");
  usuario = raw ? JSON.parse(raw) : null;

  if (!usuario || (usuario.rol || "").toUpperCase() !== "PACIENTE") {
    location.href = "index.html";
    return;
  }

  document.getElementById("nombre-usuario").textContent = usuario.nombre;
  document.getElementById("btn-salir").onclick = () => {
    localStorage.removeItem("usuario");
    location.href = "index.html";
  };

  cargarEspecialidades();
  await renderizarDirectorio();
  await cargarCitas();
  if (typeof cargarRecetas === "function") {
    await cargarRecetas();
  }
});

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

inpBarraBusqueda?.addEventListener("input", renderizarDirectorio);
selectEspecialidad?.addEventListener("change", renderizarDirectorio);

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

async function cargarCitas() {
  const cont = document.getElementById("lista-citas");
  if (!cont || !usuario) return;

  if (!listaMedicos.length) {
    listaMedicos = await fetchMedicosBackend();
  }

  const mias = await obtenerCitasUsuario(usuario.id);
  const activas = mias.filter(c => c.estado === "RESERVADA").length;

  const infoLimite = document.getElementById("info-limite");
  if (infoLimite) {
    infoLimite.textContent = `Tienes ${activas} citas activas de 3 permitidas.`;
  }

  if (!mias.length) {
    cont.innerHTML = `<p class="texto-suave">No tienes citas registradas.</p>`;
    return;
  }

  let html = "";
  mias.forEach(c => {
    const idCita = c.idCita ?? c.id;
    const hIni = c.hora_inicio || c.inicio || "";
    const hFin = c.hora_fin || c.fin || "";
    const idMedCita = c.medico?.idMedico ?? c.idMedico;
    const medObj = listaMedicos.find(m => (m.idMedico ?? m.id) == idMedCita);
    const nombreMed = c.medico?.usuario?.nombre || medObj?.usuario?.nombre || `Médico #${idMedCita}`;

    let acciones = "";
    if (c.estado === "RESERVADA") {
      acciones += `<button type="button" class="boton secundario chico" onclick="cancelarCitaPaciente(${idCita})">Cancelar</button>`;
    }
    if (c.estado === "ATENDIDA") {
      acciones += `<button type="button" class="boton chico" onclick='abrirModalResena(${JSON.stringify(c)})'>Dejar reseña</button>`;
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

```

---

### 6. `resenas.js` (Sin `comun.js`, HTML dinámico y usando `localStorage.getItem('usuario')`)

```javascript
let citaActualResena = null;
let comentarioGlobal = "";
let ultimasResenas = [];

function getSesionResenas() {
  return JSON.parse(localStorage.getItem("usuario") || "null");
}

async function obtenerResenas(idMedico) {
  try {
    const respuesta = await fetch(`http://localhost:8081/api/resenas/medico/${idMedico}`);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const resultado = await respuesta.json();
    ultimasResenas = resultado.data || resultado || [];
    return ultimasResenas;
  } catch (error) {
    console.error("Error al cargar las reseñas:", error);
    ultimasResenas = [];
    return [];
  }
}

document.getElementById("form-editar-resena")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = Number(document.getElementById("id-resena").value);
  let comentario = document.getElementById("editar-comentario").value.trim();
  const comentarioOriginal = comentarioGlobal.trim();

  if (!comentario) {
    alert("No puede quedar vacío el comentario");
    return;
  }

  if (comentario === comentarioOriginal) {
    alert("No realizaste ningún cambio en el comentario");
    return;
  }

  if (!comentario.startsWith("(editado) ")) {
    comentario = "(editado) " + comentario;
  }

  try {
    const respuesta = await fetch(`http://localhost:8081/api/resenas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comentario })
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.success) {
      alert(resultado.message || "No se pudo actualizar la reseña");
      return;
    }

    alert(resultado.message || "Reseña actualizada correctamente");
    if (typeof cerrarModalesLocal === "function") cerrarModalesLocal();
  } catch (error) {
    console.error("Error al actualizar:", error);
    alert("No fue posible actualizar la reseña, intente más tarde");
  }
});

function editarResena(resena) {
  document.getElementById("id-resena").value = resena.id_resena ?? resena.idResena ?? resena.id;
  document.getElementById("editar-comentario").value = resena.comentario;
  comentarioGlobal = resena.comentario;
  if (typeof abrirModalLocal === "function") {
    abrirModalLocal("modal-editar-resena");
  }
}

function cargarResenasModal(listaResenas = ultimasResenas) {
  const cont = document.getElementById("lista-resenas");
  if (!cont) return;

  const sesion = getSesionResenas();
  const orden = document.getElementById("orden-resenas")?.value || "mayor";
  const rango = document.getElementById("rango-resenas")?.value || "todas";

  let lista = (listaResenas || []).filter(r =>
    rango === "todas" ||
    (rango === "alta" && r.calificacion >= 9) ||
    (rango === "media" && r.calificacion >= 7 && r.calificacion <= 8) ||
    (rango === "baja" && r.calificacion <= 6)
  );

  if (orden === "mayor") lista.sort((a, b) => b.calificacion - a.calificacion);
  if (orden === "menor") lista.sort((a, b) => a.calificacion - b.calificacion);
  if (orden === "reciente") lista.sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""));

  if (!lista.length) {
    cont.innerHTML = `<p class="texto-suave">Sin reseñas en este rango.</p>`;
    return;
  }

  let html = "";
  lista.forEach(r => {
    const idAutor = r.usuario?.idUsuario ?? r.usuario?.id ?? r.idUsuario;
    const puedeEditar = sesion && idAutor == sesion.id;
    const btnEditar = puedeEditar
      ? `<button type="button" class="boton chico" onclick='editarResena(${JSON.stringify(r)})'>Editar</button>`
      : "";

    html += `
      <div class="fila-resena">
        <span class="nota">${r.calificacion}/10</span>
        <span class="texto-suave">${r.fecha || ""}</span>
        <p>${r.comentario || ""}</p>
        ${btnEditar}
      </div>
    `;
  });

  cont.innerHTML = html;
}

document.getElementById("orden-resenas")?.addEventListener("change", () => cargarResenasModal());
document.getElementById("rango-resenas")?.addEventListener("change", () => cargarResenasModal());

async function abrirModalResena(c) {
  citaActualResena = c;
  const nombreMed = c.medico?.usuario?.nombre || "el médico";
  document.getElementById("resena-info").textContent = `Califica la atención de ${nombreMed}`;
  document.getElementById("form-resena")?.reset();
  document.getElementById("valor-calificacion").textContent = "8";
  if (typeof abrirModalLocal === "function") {
    abrirModalLocal("modal-resena");
  }
}

document.getElementById("calificacion")?.addEventListener("input", e => {
  document.getElementById("valor-calificacion").textContent = e.target.value;
});

```

---

### Cambios en tus HTML (`index.html`, `medico.html`, `paciente.html`, `registro.html`)

* **Quita `<script src="js/comun.js"></script>**` de todos los archivos HTML.
* En `index.html`, quita también `<script src="js/contacto.js"></script>` si no existe `#seccion-contacto` ahí (mantienes `contacto.html` y `contacto.js` intactos).
* Ya no necesitas los `<template>` en `medico.html` ni `paciente.html` porque todo se genera como HTML dinámico (`html += ...`).

¿Al probar `citas.js` y `recetas.js` con tu backend en el puerto `8081` te coincide la estructura JSON que devuelve Spring Boot (por ejemplo, si en `Cita` serializa `medico` y `usuario` completos o solo sus IDs)?



## Observaciones adicionales

Se muestra una gran diferencia entre versiones debido a que localmente se modificaron y mezclaron los cambios realizados por compañeros desde la ultima vez que el repositorio local estuvo en sincronia con el de github