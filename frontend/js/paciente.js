const usuario = protegerPagina('PACIENTE');
let medicoActual = null; // Correo del médico abierto en el modal

// Elementos const DOM solicitados (con respaldo a los IDs de paciente.html)
const inpBarraBusqueda = document.getElementById('inpBarraBusqueda') || document.getElementById('buscar');
const selectEspecialidad = document.getElementById('selectEspecialidad') || document.getElementById('filtro-especialidad');
const divListaMedicos = document.getElementById('divListaMedicos') || document.getElementById('lista-medicos');

// Variable global para almacenar el listado de médicos
let listaMedicos = [];

/**
 * Obtiene la lista de médicos disponibles desde la fuente de datos (usuarios con rol MEDICO).
 * @returns {Array<Object>} Arreglo de objetos médico.
 */
async function obtenerListaMedicos() {
  const medicos = await obtenerMedicos();
  return medicos;
}

// Listener DOMContentLoaded que ejecuta la carga inicial y renderizado del directorio
document.addEventListener('DOMContentLoaded', () => {
  if (usuario) {
    document.getElementById('nombre-usuario').textContent = usuario.nombre;
  }
  const btnSalir = document.getElementById('btn-salir');
  if (btnSalir) btnSalir.onclick = cerrarSesion;

  cargarEspecialidades();
  renderizarDirectorio();
  cargarCitas();
  if (typeof cargarRecetas === 'function') {
    cargarRecetas();
  }
});

// ---------- Directorio ----------
function cargarEspecialidades() {
  if (!selectEspecialidad) return;
  const lista = [
    "Dermatología", "Cardiología", "Ginecología", "Neurología",
    "Pediatría", "Psiquiatría", "Traumatología", "Medicina general"
  ];
  lista.forEach(e => {
    const o = document.createElement('option');
    o.value = e;
    o.textContent = e;
    selectEspecialidad.appendChild(o);
  });
}

/**
 * Renderiza las tarjetas de los médicos en divListaMedicos aplicando los filtros activos.
 */
async function renderizarDirectorio() {
  if (!divListaMedicos) return;

  const texto = inpBarraBusqueda ? inpBarraBusqueda.value.toLowerCase() : '';
  const esp = selectEspecialidad ? selectEspecialidad.value : '';

  // Se actualiza la variable global listaMedicos
  listaMedicos = await obtenerListaMedicos();
  console.log(listaMedicos);
  console.log(listaMedicos[1].usuario.correo);

  // Se limpia la sección de divListaMedicos
  divListaMedicos.innerHTML = '';

  if (!listaMedicos.length) {
    divListaMedicos.innerHTML = '<p class="texto-suave">Sin resultados.</p>';
    return;
  }

  // Se itera sobre cada objeto doctor recuperado para construir su tarjeta/botón
  listaMedicos.forEach(doctor => {
    const promedio = typeof calcularPromedioMedico === 'function'
      ? calcularPromedioMedico(doctor.usuario.correo)
      : '★ N/A';

    divListaMedicos.innerHTML += `
      <article class="tarjeta">
        <div class="divPanelContenido">
          <div class="datos">
            <h3>${doctor.usuario.nombre}</h3>
            <p class="texto-suave">${doctor.especialidad} · Céd. ${doctor.cedulaProfesional}</p>
          </div>
          <div class="direccion">
            <p class="texto-suave">📍 ${doctor.direccion}</p>
          </div>
          <div class="detalles fila-pie">
            <span class="nota">${promedio}</span>
            <button type="button" class="boton chico btn-ver" onclick="abrirMedico('${doctor.usuario.correo}')">
              Ver horarios
            </button>
          </div>
        </div>
      </article>
    `;
  });
}

// Eventos de filtrado dinámico en barra de búsqueda y select de especialidad
inpBarraBusqueda?.addEventListener('input', renderizarDirectorio);
selectEspecialidad?.addEventListener('change', renderizarDirectorio);

// ---------- Modal Médico: Horarios y Reseñas ----------
async function abrirMedico(correo) {
  let m;
  listaMedicos.forEach(element => {
    if (element.usuario.correo == correo){
      m = element;
    }
  });
  if (!m) return;
  medicoActual = correo;
  document.getElementById('medico-nombre').textContent = m.usuario.nombre;
  document.getElementById('medico-datos').textContent = m.especialidad + ' · Céd. ' + m.cedulaProfesional;
  document.getElementById('medico-direccion').textContent = '📍 ' + m.direccion;
  await cargarHorarios(m.idMedico);
  if (typeof cargarResenasModal === 'function') {
    cargarResenasModal();
  }
  abrirModal('modal-medico');
}

async function cargarHorarios(id) {
  const cont = document.getElementById('lista-horarios');
  if (!cont) return;
  cont.innerHTML = '';
  libres = [];
  libres = await obtenerCitasMedico(id);
  if (!libres.length) {
    cont.innerHTML = '<p class="texto-suave">Sin horarios disponibles.</p>';
    return;
  }

  libres.forEach(c => {
    const t = clonar('plantilla-horario');
    poner(t, '.hor-fecha', c.fecha);
    poner(t, '.hor-hora', c.hora_inicio + ' – ' + c.hora_fin);
    t.querySelector('.btn-reservar').onclick = () => reservarCita(c.idCita);
    cont.appendChild(t);
  });
}

// ---------- Mis Citas ----------
async function cargarCitas() {
  const cont = document.getElementById('lista-citas');
  if (!cont || !usuario) return;
  mias = [];
  mias = await obtenerCitasUsuario(usuario.id);
  const activas = mias.filter(c => c.estado === 'RESERVADA').length;
  console.log(mias);

  document.getElementById('info-limite').textContent = `Tienes ${activas} citas activas de 3 permitidas.`;
  cont.innerHTML = '';

  if (!mias.length) {
    cont.innerHTML = '<p class="texto-suave">No tienes citas registradas.</p>';
    return;
  }

  mias.forEach(c => {
    const t = clonar('plantilla-cita');
    listaMedicos.forEach(m => {
      if(m.idMedico === c.idMedico){
        const med = m;
      }
    })
    poner(t, '.cita-medico', med ? med.nombre : c.idMedico);
    poner(t, '.cita-fecha', c.fecha + ' (' + c.hora_inicio + ' – ' + c.hora_fin + ')');

    const est = t.querySelector('.cita-estado');
    est.textContent = c.estado;
    est.classList.add(c.estado);

    const bCancelar = t.querySelector('.btn-cancelar');
    const bReceta = t.querySelector('.btn-receta');
    const bResena = t.querySelector('.btn-resena');
    const recetas = obtenerRecetas();
    const recetaAsociada = recetas.find(r => r.idCita === c.id);
    const resenaAsociada = null

    if (c.estado === 'RESERVADA') {
      bCancelar.onclick = () => cancelarCitaPaciente(c.id);
    } else {
      bCancelar.remove();
    }

    if (c.estado === 'ATENDIDA' && recetaAsociada) {
      bReceta.onclick = () => verDetalleReceta(recetaAsociada, med);
    } else {
      bReceta.remove();
    }

    if (c.estado === 'ATENDIDA' && !resenaAsociada) {
      bResena.onclick = () => abrirModalResena(c);
    } else {
      bResena.remove();
    }

    cont.appendChild(t);
  });
}


async function verResenas(idMedico) {

  const resenasMedico = await obtenerResenas(Number(idMedico));

  abrirModal("modal-lista-resenas");

  const promedio = resenasMedico.length
    ? resenasMedico.reduce((suma, r) => suma + Number(r.calificacion), 0) / resenasMedico.length
    : 0;

  document.getElementById('promedio-resenas').textContent = promedio.toFixed(1);

  cargarResenasModal(resenasMedico);
  console.log("en verresena");
  console.log(idMedico);

}

let comentarioGlobal = "";

function editarResena(resena) {
    document.getElementById('id-resena').value = resena.id_resena;
    document.getElementById('editar-comentario').value = resena.comentario;

    comentarioGlobal = resena.comentario;

    abrirModal('modal-editar-resena');
}

