async function obtenerCitasMedico(idMedico) {
  try {
    const respuesta = await fetch("http://localhost:8081/api/citas/medico/"+idMedico);
    if (!respuesta.ok){
      throw new Error('Error HTTP: ${respuesta.status}');
    }
    const datos = await respuesta.json();
    console.log(datos);
    return datos;
  } catch (error){
    console.error('Hubo un problema con el metodo fetch:', error);
  }
}

async function agendarCita(idCita, idUsuario) {
  try {
    const respuesta = await fetch("http://localhost:8081/api/citas/"+idCita+"/"+idUsuario+"/agendar", {method: "PUT"});
    if (!respuesta.ok){
      throw new Error('Error HTTP: ${respuesta.status}');
    }
    const datos = await respuesta.json();
    console.log(datos);
    return datos;
  } catch (error){
    console.error('Hubo un problema con el metodo fetch:', error);
  }
}


async function obtenerCitasUsuario(idUsuario) {
  try {
    const respuesta = await fetch("http://localhost:8081/api/citas/usuario/"+idUsuario);
    if (!respuesta.ok){
      throw new Error('Error HTTP: ${respuesta.status}');
    }
    const datos = await respuesta.json();
    console.log(datos);
    return datos;
  } catch (error){
    console.error('Hubo un problema con el metodo fetch:', error);
  }
}

async function obtenerCitasDisponibles() {
  try {
    const respuesta = await fetch("http://localhost:8081/api/citas/disponible");
    if (!respuesta.ok){
      throw new Error('Error HTTP: ${respuesta.status}');
    }
    const datos = await respuesta.json();
    console.log(datos);
    return datos;
  } catch (error){
    console.error('Hubo un problema con el metodo fetch:', error);
  }
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
async function reservarCita(id) {
  const LIMITE_CITAS = 3;
  citas = [];
  citas = await obtenerCitasDisponibles();
  console.log(citas);
  let c;
  citas.forEach(x => {
    if (x.idCita == id){
      console.log(x.idCita);
      console.log(id);
      c = x;      
    }
  });

  if (!c || c.estado !== 'DISPONIBLE' || c.idUsuario) return mostrarMensaje('La cita ya no está disponible.');
  
  let mias = [];
  citas.forEach(x => {
    if (x.idUsuario === usuario.idUsuario && x.estado === 'RESERVADA'){
      mias.push(x);
    }
  })
  console.log(mias);
  if (mias.length >= LIMITE_CITAS) return mostrarMensaje('Llegaste al límite de ' + LIMITE_CITAS + ' citas activas.');
  
  if (mias.some(x => x.fecha === c.fecha && x.inicio < c.fin && c.inicio < x.fin)) {
    return mostrarMensaje('Se cruza con otra de tus citas.');
  }

  agendarCita(c.idCita,usuario.id);
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