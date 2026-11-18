let citaActualReceta = null;
usuario = obtenerSesion();

function obtenerRecetas() {
  return leer('recetas', [
    { 
      idCita: 1, 
      idMedico: 'medico@correo.com', 
      idPaciente: 'paciente@correo.com', 
      fecha: fechaMas(-7), 
      diagnostico: 'Hipertensión arterial leve.', 
      tratamiento: 'Losartán 50 mg, una tableta cada 24 h por 30 días.', 
      indicaciones: 'Reducir consumo de sal. Control en 4 semanas.' 
    }
  ]);
}

// Médico: Abrir modal para emitir receta
function abrirEmisionReceta(c) {
  citaActualReceta = c;
  document.getElementById('form-receta').reset();
  document.getElementById('receta-info').textContent = 'Paciente: ' + nombreUsuario(c.idPaciente) + ' · ' + c.fecha;
  abrirModal('modal-receta');
}

// Médico: Guardar receta
const formReceta = document.getElementById('form-receta');
if (formReceta && usuario && usuario.rol === 'MEDICO') {
  formReceta.addEventListener('submit', e => {
    e.preventDefault();
    const recetas = obtenerRecetas();
    if (citaActualReceta.estado !== 'ATENDIDA') return mostrarMensaje('La cita debe estar atendida.');
    if (recetas.some(r => r.idCita === citaActualReceta.id)) return mostrarMensaje('Esta cita ya tiene receta.');

    recetas.push({
      idCita: citaActualReceta.id,
      idMedico: citaActualReceta.idMedico,
      idPaciente: citaActualReceta.idPaciente,
      fecha: hoy(),
      diagnostico: document.getElementById('diagnostico').value.trim(),
      tratamiento: document.getElementById('tratamiento').value.trim(),
      indicaciones: document.getElementById('indicaciones').value.trim()
    });

    guardar('recetas', recetas);
    cerrarModales();
    mostrarMensaje('Receta emitida');
    if (typeof cargarAgenda === 'function') cargarAgenda();
    if (typeof cargarRecetas === 'function') cargarRecetas();
  });
}

// Cargar listado de recetas (Médico o Paciente)
function cargarRecetas() {
  const cont = document.getElementById('lista-recetas');
  if (!cont) return;
  cont.innerHTML = '';

  const lista = usuario.rol === 'MEDICO' 
    ? obtenerRecetas().filter(r => r.idMedico === usuario.correo)
    : obtenerRecetas().filter(r => r.idPaciente === usuario.correo);

  if (!lista.length) {
    cont.innerHTML = '<p class="texto-suave">No hay recetas registradas.</p>';
    return;
  }

  lista.forEach(r => {
    const t = clonar(usuario.rol === 'MEDICO' ? 'plantilla-receta-emitida' : 'plantilla-receta');
    const med = buscarUsuario(r.idMedico);
    
    if (usuario.rol === 'MEDICO') {
      poner(t, '.rec-paciente', nombreUsuario(r.idPaciente));
      poner(t, '.rec-fecha', r.fecha);
      poner(t, '.rec-diagnostico', r.diagnostico);
    } else {
      poner(t, '.rec-medico', med ? med.nombre : r.idMedico);
      poner(t, '.rec-fecha', 'Fecha: ' + r.fecha);
      poner(t, '.rec-diagnostico', r.diagnostico);
      t.querySelector('.btn-ver-receta').onclick = () => verDetalleReceta(r, med);
    }
    cont.appendChild(t);
  });
}

// Paciente: Ver detalle / Modal receta
function verDetalleReceta(r, med) {
  document.getElementById('receta-medico').textContent = med ? med.nombre : r.idMedico;
  document.getElementById('receta-especialidad').textContent = med ? med.especialidad + ' · Céd. ' + med.cedula : '';
  document.getElementById('receta-paciente').textContent = usuario.nombre;
  document.getElementById('receta-fecha').textContent = r.fecha;
  document.getElementById('receta-diagnostico').textContent = r.diagnostico;
  document.getElementById('receta-tratamiento').textContent = r.tratamiento;
  document.getElementById('receta-indicaciones').textContent = r.indicaciones || 'Ninguna';
  
  document.getElementById('btn-pdf').onclick = () => mostrarMensaje('Descarga de PDF simulada con éxito');
  abrirModal('modal-receta');
}