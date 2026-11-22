let citaActualResena = null;

function obtenerResenas() {
  return leer('resenas', [
    { idCita: 5, idMedico: 'medico@correo.com', idPaciente: 'paciente2@correo.com', calificacion: 9, comentario: 'Puntual y muy profesional.', fecha: fechaMas(-13) }
  ]);
}

function calcularPromedioMedico(correo) {
  const r = obtenerResenas().filter(x => x.idMedico === correo);
  if (!r.length) return 'Nuevo';
  return '★ ' + (r.reduce((s, x) => s + x.calificacion, 0) / r.length).toFixed(1);
}

function cargarResenasModal() {
  const cont = document.getElementById('lista-resenas');
  if (!cont) return;

  const orden = document.getElementById('orden-resenas')?.value || 'mayor';
  const rango = document.getElementById('rango-resenas')?.value || 'todas';
  cont.innerHTML = '';

  let lista = obtenerResenas().filter(r => r.idMedico === medicoActual).filter(r =>
    rango === 'todas' || 
    (rango === 'alta' && r.calificacion >= 9) || 
    (rango === 'media' && r.calificacion >= 7 && r.calificacion <= 8) || 
    (rango === 'baja' && r.calificacion <= 6)
  );

  if (orden === 'mayor') lista.sort((a, b) => b.calificacion - a.calificacion);
  if (orden === 'menor') lista.sort((a, b) => a.calificacion - b.calificacion);
  if (orden === 'reciente') lista.sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (!lista.length) {
    cont.innerHTML = '<p class="texto-suave">Sin reseñas en este rango.</p>';
    return;
  }

  lista.forEach(r => {
    const t = clonar('plantilla-resena');
    poner(t, '.res-nota', r.calificacion + '/10');
    poner(t, '.res-fecha', r.fecha);
    poner(t, '.res-texto', r.comentario);
    cont.appendChild(t);
  });
}

document.getElementById('orden-resenas')?.addEventListener('change', cargarResenasModal);
document.getElementById('rango-resenas')?.addEventListener('change', cargarResenasModal);

async function abrirModalResena(c) {
  citaActualResena = c;
  const med = await buscarUsuario(c.idMedico);
  document.getElementById('resena-info').textContent = 'Califica la atención de ' + (med ? med.nombre : c.idMedico);
  document.getElementById('form-resena').reset();
  document.getElementById('valor-calificacion').textContent = '8';
  abrirModal('modal-resena');
}

const rangoCalificacion = document.getElementById('calificacion');
if (rangoCalificacion) {
  rangoCalificacion.addEventListener('input', e => {
    document.getElementById('valor-calificacion').textContent = e.target.value;
  });
}

const formResena = document.getElementById('form-resena');
if (formResena) {
  formResena.addEventListener('submit', e => {
    e.preventDefault();
    const resenas = obtenerResenas();
    resenas.push({
      idCita: citaActualResena.id,
      idMedico: citaActualResena.idMedico,
      idPaciente: usuario.correo,
      calificacion: parseInt(document.getElementById('calificacion').value),
      comentario: document.getElementById('comentario').value.trim(),
      fecha: hoy()
    });
    guardar('resenas', resenas);
    cerrarModales();
    mostrarMensaje('Reseña enviada con éxito');
    if (typeof cargarCitas === 'function') cargarCitas();
  });
}