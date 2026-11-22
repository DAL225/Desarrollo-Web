// Variables globales para manejar la cita a reseñar, el comentario original y el caché de reseñas
let citaActualResena = null;
let comentarioGlobal = "";
let ultimasResenas = [];

// Obtiene los datos del usuario en sesión desde sessionStorage (o null si no existe)
function getSesionResenas() {
  return JSON.parse(sessionStorage.getItem("usuario") || "null");
}

// Consulta las reseñas de un médico por su ID y actualiza ultimasResenas (regresa [] si falla)
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

// Envía la edición de un comentario existente (PUT) validando que no esté vacío ni sin cambios
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

  // Marca el comentario como editado si aún no lleva el prefijo
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

// Precarga los datos de una reseña en el modal de edición y guarda su texto original
function editarResena(resena) {
  document.getElementById("id-resena").value = resena.id_resena ?? resena.idResena ?? resena.id;
  document.getElementById("editar-comentario").value = resena.comentario;
  comentarioGlobal = resena.comentario;
  if (typeof abrirModalLocal === "function") {
    abrirModalLocal("modal-editar-resena");
  }
}

// Filtra por rango de calificación, ordena y renderiza las reseñas dentro del modal
function cargarResenasModal(listaResenas = ultimasResenas) {
  const cont = document.getElementById("lista-resenas");
  if (!cont) return;

  const sesion = getSesionResenas();
  const orden = document.getElementById("orden-resenas")?.value || "mayor";
  const rango = document.getElementById("rango-resenas")?.value || "todas";

  // Filtra según el rango seleccionado (alta: 9-10, media: 7-8, baja: <=6)
  let lista = (listaResenas || []).filter(r =>
    rango === "todas" ||
    (rango === "alta" && r.calificacion >= 9) ||
    (rango === "media" && r.calificacion >= 7 && r.calificacion <= 8) ||
    (rango === "baja" && r.calificacion <= 6)
  );

  // Ordena por calificación (mayor/menor) o por fecha descendente (reciente)
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
    // Solo habilita el botón Editar si la reseña pertenece al usuario en sesión
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

// Re-renderiza la lista del modal cuando cambian los selectores de orden o rango
document.getElementById("orden-resenas")?.addEventListener("change", () => cargarResenasModal());
document.getElementById("rango-resenas")?.addEventListener("change", () => cargarResenasModal());

// Guarda la cita seleccionada, reinicia el formulario y abre el modal para crear una reseña
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

// Actualiza en tiempo real el número mostrado al mover el control de calificación
document.getElementById("calificacion")?.addEventListener("input", e => {
  document.getElementById("valor-calificacion").textContent = e.target.value;
});

// Envía una nueva reseña al backend (POST) y refresca las citas del paciente si tiene éxito
const formResena = document.getElementById("form-resena");
if (formResena) {
  formResena.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = getSesionResenas();
    if (!sesion || !citaActualResena) return;

    const calificacion = parseInt(document.getElementById("calificacion").value, 10);
    const comentario = document.getElementById("comentario").value.trim();
    const idMedico = citaActualResena.medico?.idMedico ?? citaActualResena.idMedico;
    const idCita = citaActualResena.idCita ?? citaActualResena.id;

    if (!comentario) {
      alert("Escribe un comentario antes de enviar la reseña.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8081/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calificacion,
          comentario,
          idMedico,
          idUsuario: sesion.id,
          idCita,
          fecha: new Date().toISOString().slice(0, 10)
        })
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto || `Error HTTP: ${respuesta.status}`);
      }

      cerrarModalesLocal();
      alert("Reseña enviada con éxito");
      if (typeof cargarCitas === "function") {
        await cargarCitas();
      }
    } catch (error) {
      console.error("Error al guardar reseña:", error);
      alert("No se pudo guardar la reseña en el servidor.");
    }
  });
}