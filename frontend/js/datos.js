// Datos de demo. En el proyecto real esto vendra del backend (Spring Boot + BD).
const LIMITE_CITAS = 3;

const USUARIOS_DEMO = [
  { correo: 'paciente@correo.com', clave: '1234', nombre: 'Ana Torres', rol: 'PACIENTE' },
  { correo: 'paciente2@correo.com', clave: '1234', nombre: 'Luis Pérez', rol: 'PACIENTE' },
  { correo: 'medico@correo.com', clave: '1234', nombre: 'Dra. Elena Vargas', rol: 'MEDICO', cedula: '8451203', especialidad: 'Cardiología', direccion: 'Av. Reforma 120, Consultorio 4' },
  { correo: 'medico2@correo.com', clave: '1234', nombre: 'Dr. Marcos Rivera', rol: 'MEDICO', cedula: '7392045', especialidad: 'Pediatría', direccion: 'Calle Hidalgo 58, Centro' }
];

function fechaMas(dias) { const d = new Date(); d.setDate(d.getDate() + dias); return d.toISOString().slice(0, 10); }

function obtenerUsuarios() { return leer('usuarios', USUARIOS_DEMO); }
function obtenerCitas() {
  return leer('citas', [
    { id: 1, idMedico: 'medico@correo.com', fecha: fechaMas(-7), inicio: '10:00', fin: '10:30', estado: 'ATENDIDA', idPaciente: 'paciente@correo.com' },
    { id: 2, idMedico: 'medico@correo.com', fecha: fechaMas(2), inicio: '09:00', fin: '09:30', estado: 'DISPONIBLE', idPaciente: null },
    { id: 3, idMedico: 'medico@correo.com', fecha: fechaMas(2), inicio: '10:00', fin: '10:30', estado: 'DISPONIBLE', idPaciente: null },
    { id: 4, idMedico: 'medico2@correo.com', fecha: fechaMas(3), inicio: '16:00', fin: '16:30', estado: 'DISPONIBLE', idPaciente: null },
    { id: 5, idMedico: 'medico@correo.com', fecha: fechaMas(-14), inicio: '12:00', fin: '12:30', estado: 'ATENDIDA', idPaciente: 'paciente2@correo.com' }
  ]);
}
function obtenerRecetas() {
  return leer('recetas', [{ idCita: 1, idMedico: 'medico@correo.com', idPaciente: 'paciente@correo.com', fecha: fechaMas(-7), diagnostico: 'Hipertensión arterial leve.', tratamiento: 'Losartán 50 mg, una tableta cada 24 h por 30 días.', indicaciones: 'Reducir consumo de sal. Control en 4 semanas.' }]);
}
function obtenerResenas() {
  return leer('resenas', [{ idCita: 5, idMedico: 'medico@correo.com', idPaciente: 'paciente2@correo.com', calificacion: 9, comentario: 'Puntual y muy profesional.', fecha: fechaMas(-13) }]);
}
function nombreUsuario(correo) { const u = obtenerUsuarios().find(x => x.correo === correo); return u ? u.nombre : correo; }
function buscarUsuario(correo) { return obtenerUsuarios().find(x => x.correo === correo); }
