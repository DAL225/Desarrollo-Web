const API_CITAS = "http://localhost:8081/api/citas";

// Devuelve la fecha de hoy en formato "YYYY-MM-DD"
function hoyLocal() {
  return new Date().toISOString().slice(0, 10);
}

// Muestra un mensaje temporal usando una función local si existe, el elemento #mensaje o alert()
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

// Muestra u oculta un texto de error en el elemento con el "id" indicado
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

// Cierra todos los modales activos quitando la clase "activo" (o usa cerrarModalesLocal si existe)
function cerrarModalesCita() {
  if (typeof cerrarModalesLocal === "function") {
    cerrarModalesLocal();
  } else {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("activo"));
  }
}

// Obtiene del backend todas las citas de un médico por su ID (regresa [] si falla)
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

// Obtiene del backend las citas asociadas a un usuario/paciente (regresa [] si falla)
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

// Obtiene del backend las citas que están libres/disponibles (regresa [] si falla)
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

// Envía una nueva cita al backend (POST) y devuelve el registro creado o lanza error
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

// Asigna una cita disponible a un usuario en el backend (PUT); devuelve la cita o null si falla
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

// Médico: Valida fecha, rango de horas y cruces con citas previas antes de publicar una nueva cita
const formCita = document.getElementById("form-cita");
if (formCita) {
  formCita.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = JSON.parse(sessionStorage.getItem("usuario") || "null");
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

    // Revisa si el horario se encimaría con otra cita activa del mismo médico en esa fecha
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
      // Asegura formato HH:MM:SS si viene como HH:MM
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

// Actualiza el estado de una cita (ej. ATENDIDA o CANCELADA) y refresca la agenda si existe
async function cambiarEstadoCita(idCita, nuevoEstado) {
  try {
    const respuesta = await fetch(`${API_CITAS}/${idCita}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!respuesta.ok) {
      const msg = await respuesta.text();
      throw new Error(msg || `Error HTTP: ${respuesta.status}`);
    }

    mensajeCita("Cita " + (nuevoEstado === "ATENDIDA" ? "atendida" : "cancelada"));
    if (typeof cargarAgenda === "function") {
      await cargarAgenda();
    }
  } catch (error) {
    console.error("Error al cambiar estado de la cita:", error);
    mensajeCita("No se pudo actualizar el estado de la cita en el servidor.");
  }
}

// Paciente: Verifica disponibilidad, límite de 3 citas activas y cruces de horario para reservar
async function reservarCita(idCita) {
  const LIMITE_CITAS = 3;
  const sesion = JSON.parse(sessionStorage.getItem("usuario") || "null");
  if (!sesion) return;

  const idMed = typeof medicoIdActual !== "undefined" ? medicoIdActual : null;
  if (!idMed) {
    return mensajeCita("No se pudo identificar al médico de la cita.");
  }

  // Confirma que la cita siga disponible
  const citasMedico = await obtenerCitasMedico(idMed);
  const c = citasMedico.find(x => (x.idCita ?? x.id) == idCita);

  if (!c || c.estado !== "DISPONIBLE") {
    alert("La cita ya no está disponible.");
    return mensajeCita("La cita ya no está disponible.");
  }

  // Valida que el paciente no supere el máximo de citas reservadas
  const mias = await obtenerCitasUsuario(sesion.id);
  const activas = mias.filter(x => x.estado === "RESERVADA");

  if (activas.length >= LIMITE_CITAS) {
    alert(`Llegaste al límite de ${LIMITE_CITAS} citas activas.`);
    return mensajeCita(`Llegaste al límite de ${LIMITE_CITAS} citas activas.`);
  }

  // Evita reservar dos citas que se traslapen en fecha y hora
  const cIni = c.hora_inicio || c.inicio;
  const cFin = c.hora_fin || c.fin;
  const hayCruce = activas.some(x => {
    const xIni = x.hora_inicio || x.inicio;
    const xFin = x.hora_fin || x.fin;
    return x.fecha === c.fecha && xIni < cFin && cIni < xFin;
  });

  if (hayCruce) {
    alert("Se cruza con otra de tus citas.");
    return mensajeCita("Se cruza con otra de tus citas.");
  }

  // Realiza la reserva en el backend y actualiza las vistas disponibles
  const reservada = await agendarCita(c.idCita ?? c.id, sesion.id);
  if (!reservada) {
    alert("No se pudo reservar la cita.");
    return mensajeCita("No se pudo reservar la cita.");
  }

  alert("Cita reservada");
  mensajeCita("Cita reservada");
  cerrarModalesCita();
  if (typeof cargarHorarios === "function") {
    await cargarHorarios(idMed);
  }
  if (typeof cargarCitas === "function") {
    await cargarCitas();
  }
}