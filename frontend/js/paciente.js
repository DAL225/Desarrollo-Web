const usuario = protegerPagina('PACIENTE');
let medicoActual = null; // Correo del médico abierto en el modal

document.getElementById('nombre-usuario').textContent = usuario.nombre;
document.getElementById('btn-salir').onclick = cerrarSesion;

// ---------- Directorio ----------
function cargarEspecialidades() {
  const sel = document.getElementById('filtro-especialidad');
  if (!sel) return;
  const lista = ["Dermatología", "Cardiología", "Ginecología", "Neurología", "Pediatría", "Psiquiatría", "Traumatología", "Medicina general"];
  lista.forEach(e => {
    const o = document.createElement('option');
    o.value = e;
    o.textContent = e;
    sel.appendChild(o);
  });
}

function cargarMedicos() {
  const cont = document.getElementById('lista-medicos');
  if (!cont) return;
  const texto = document.getElementById('buscar').value.toLowerCase();
  const esp = document.getElementById('filtro-especialidad').value;
  cont.innerHTML = '';

  const lista = obtenerUsuarios().filter(u =>
    u.rol === 'MEDICO' &&
    (!esp || u.especialidad === esp) &&
    (u.nombre + u.especialidad).toLowerCase().includes(texto)
  );

  if (!lista.length) {
    cont.innerHTML = '<p class="texto-suave">Sin resultados.</p>';
    return;
  }

  lista.forEach(m => {
    const t = clonar('plantilla-medico');
    poner(t, '.med-inicial', m.nombre.replace(/^Dra?\.\s/, '').split(' ').map(p => p[0]).join('').slice(0, 2));
    poner(t, '.med-nombre', m.nombre);
    poner(t, '.med-datos', m.especialidad + ' · Céd. ' + m.cedula);
    poner(t, '.med-direccion', '📍 ' + m.direccion);
    //Se les agrega los eventos a cada elemento html
    t.querySelector('.btn-ver-resena').onclick = () => verResenas(52); ///CAMBIAR POR ID
    t.querySelector('.btn-ver-horario').onclick = () => abrirMedico(m.correo);
    cont.appendChild(t);
  });
}

document.getElementById('buscar')?.addEventListener('input', cargarMedicos);
document.getElementById('filtro-especialidad')?.addEventListener('change', cargarMedicos);

// ---------- Modal Médico: Horarios y Reseñas ----------
function abrirMedico(correo) {
  const m = buscarUsuario(correo);
  medicoActual = correo;
  document.getElementById('medico-nombre').textContent = m.nombre;
  document.getElementById('medico-datos').textContent = m.especialidad + ' · Céd. ' + m.cedula;
  document.getElementById('medico-direccion').textContent = '📍 ' + m.direccion;
  cargarHorarios();
  abrirModal('modal-medico');
}

function cargarHorarios() {
  const cont = document.getElementById('lista-horarios');
  if (!cont) return;
  cont.innerHTML = '';
  const libres = obtenerCitas()
    .filter(c => c.idMedico === medicoActual && c.estado === 'DISPONIBLE' && !c.idPaciente && c.fecha >= hoy())
    .sort((a, b) => (a.fecha + a.inicio).localeCompare(b.fecha + b.inicio));

  if (!libres.length) {
    cont.innerHTML = '<p class="texto-suave">Sin horarios disponibles.</p>';
    return;
  }

  libres.forEach(c => {
    const t = clonar('plantilla-horario');
    poner(t, '.hor-fecha', c.fecha);
    poner(t, '.hor-hora', c.inicio + ' – ' + c.fin);
    t.querySelector('.btn-reservar').onclick = () => reservarCita(c.id);
    cont.appendChild(t);
  });
}

// ---------- Mis Citas ----------
function cargarCitas() {
  const cont = document.getElementById('lista-citas');
  if (!cont) return;
  const todas = obtenerCitas();
  const mias = todas.filter(c => c.idPaciente === usuario.correo).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const activas = mias.filter(c => c.estado === 'RESERVADA').length;

  document.getElementById('info-limite').textContent = `Tienes ${activas} de 3 citas activas permitidas.`;
  cont.innerHTML = '';

  if (!mias.length) {
    cont.innerHTML = '<p class="texto-suave">No tienes citas registradas.</p>';
    return;
  }

  mias.forEach(c => {
    const t = clonar('plantilla-cita');
    const med = buscarUsuario(c.idMedico);
    poner(t, '.cita-medico', med ? med.nombre : c.idMedico);
    poner(t, '.cita-fecha', c.fecha + ' (' + c.inicio + ' – ' + c.fin + ')');

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




// Inicialización del panel de paciente
cargarEspecialidades();
cargarMedicos();
cargarCitas();
cargarRecetas();