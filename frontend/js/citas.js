function obtenerCitas() {
  return leer('citas', [
    { id: 1, idMedico: 'medico@correo.com', fecha: fechaMas(-7), inicio: '10:00', fin: '10:30', estado: 'ATENDIDA', idPaciente: 'paciente@correo.com' },
    { id: 2, idMedico: 'medico@correo.com', fecha: fechaMas(2), inicio: '09:00', fin: '09:30', estado: 'DISPONIBLE', idPaciente: null },
    { id: 3, idMedico: 'medico@correo.com', fecha: fechaMas(2), inicio: '10:00', fin: '10:30', estado: 'DISPONIBLE', idPaciente: null },
    { id: 4, idMedico: 'medico2@correo.com', fecha: fechaMas(3), inicio: '16:00', fin: '16:30', estado: 'DISPONIBLE', idPaciente: null },
    { id: 5, idMedico: 'medico@correo.com', fecha: fechaMas(-14), inicio: '12:00', fin: '12:30', estado: 'ATENDIDA', idPaciente: 'paciente2@correo.com' }
  ]);
}

// Médico: Publicar nueva cita
const formCita = document.getElementById('form-cita');
if (formCita) {
  formCita.addEventListener('submit', e => {
    e.preventDefault();
    const fecha = document.getElementById('fecha').value;
    const inicio = document.getElementById('inicio').value;
    const fin = document.getElementById('fin').value;

    if (fecha < hoy()) return mostrarError('error-cita', 'La fecha no puede ser anterior a hoy.');
    if (fin <= inicio) return mostrarError('error-cita', 'La hora de fin debe ser posterior a la de inicio.');

    const citas = obtenerCitas();
    const cruce = citas.some(c => c.idMedico === usuario.correo && c.estado !== 'CANCELADA' && c.fecha === fecha && c.inicio < fin && inicio < c.fin);
    if (cruce) return mostrarError('error-cita', 'Ya tienes una cita que se cruza con ese horario.');

    citas.push({ id: Date.now(), idMedico: usuario.correo, fecha, inicio, fin, estado: 'DISPONIBLE', idPaciente: null });
    guardar('citas', citas);
    mostrarError('error-cita', '');
    cerrarModales();
    mostrarMensaje('Cita publicada');
    if (typeof cargarAgenda === 'function') cargarAgenda();
  });
}

// Médico: Cambiar estado
function cambiarEstadoCita(id, nuevo) {
  const citas = obtenerCitas();
  const c = citas.find(x => x.id === id);
  if (!c || c.estado !== 'RESERVADA') return mostrarMensaje('Solo una cita reservada puede cambiar de estado.');
  c.estado = nuevo;
  guardar('citas', citas);
  mostrarMensaje('Cita ' + (nuevo === 'ATENDIDA' ? 'atendida' : 'cancelada'));
  if (typeof cargarAgenda === 'function') cargarAgenda();
}

// Paciente: Reservar cita
function reservarCita(id) {
  const LIMITE_CITAS = 3;
  const citas = obtenerCitas();
  const c = citas.find(x => x.id === id);

  if (!c || c.estado !== 'DISPONIBLE' || c.idPaciente) return mostrarMensaje('La cita ya no está disponible.');
  
  const mias = citas.filter(x => x.idPaciente === usuario.correo && x.estado === 'RESERVADA');
  if (mias.length >= LIMITE_CITAS) return mostrarMensaje('Llegaste al límite de ' + LIMITE_CITAS + ' citas activas.');
  
  if (mias.some(x => x.fecha === c.fecha && x.inicio < c.fin && c.inicio < x.fin)) {
    return mostrarMensaje('Se cruza con otra de tus citas.');
  }

  c.estado = 'RESERVADA';
  c.idPaciente = usuario.correo;
  guardar('citas', citas);
  mostrarMensaje('Cita reservada');
  if (typeof cargarHorarios === 'function') cargarHorarios();
  if (typeof cargarCitas === 'function') cargarCitas();
}

// Paciente: Cancelar cita propia
function cancelarCitaPaciente(id) {
  const citas = obtenerCitas();
  const c = citas.find(x => x.id === id);
  if (!c) return;
  c.estado = 'DISPONIBLE';
  c.idPaciente = null;
  guardar('citas', citas);
  mostrarMensaje('Cita cancelada');
  if (typeof cargarCitas === 'function') cargarCitas();
}