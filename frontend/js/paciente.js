const usuario = protegerPagina('PACIENTE');
let medicoActual = null;   // correo del medico abierto en modal-medico
let citaActual = null;     // id de la cita para la resena

document.getElementById('nombre-usuario').textContent = usuario.nombre;
document.getElementById('btn-salir').onclick = cerrarSesion;

// ---------- Directorio ----------
function promedio(correo) {
  const r = obtenerResenas().filter(x => x.idMedico === correo);
  if (!r.length) return 'Nuevo';
  return '★ ' + (r.reduce((s, x) => s + x.calificacion, 0) / r.length).toFixed(1);
}

function cargarEspecialidades() {
  const sel = document.getElementById('filtro-especialidad');
  const lista = [...new Set(obtenerUsuarios().filter(u => u.rol === 'MEDICO').map(u => u.especialidad))];
  lista.forEach(e => { const o = document.createElement('option'); o.textContent = e; sel.appendChild(o); });
}

function cargarMedicos() {
  const cont = document.getElementById('lista-medicos');
  const texto = document.getElementById('buscar').value.toLowerCase();
  const esp = document.getElementById('filtro-especialidad').value;
  cont.innerHTML = '';
  const lista = obtenerUsuarios().filter(u => u.rol === 'MEDICO' && (!esp || u.especialidad === esp) && (u.nombre + u.especialidad).toLowerCase().includes(texto));
  if (!lista.length) { cont.innerHTML = '<p class="texto-suave">Sin resultados.</p>'; return; }
  lista.forEach(m => {
    const t = clonar('plantilla-medico');
    poner(t, '.med-inicial', m.nombre.replace(/^Dra?\.\s/, '').split(' ').map(p => p[0]).join('').slice(0, 2));
    poner(t, '.med-nombre', m.nombre);
    poner(t, '.med-datos', m.especialidad + ' · Céd. ' + m.cedula);
    poner(t, '.med-direccion', '📍 ' + m.direccion);
    poner(t, '.med-promedio', promedio(m.correo));
    t.querySelector('.btn-ver').onclick = () => abrirMedico(m.correo);
    cont.appendChild(t);
  });
}

// ---------- Modal medico: horarios y resenas ----------
function abrirMedico(correo) {
  const m = buscarUsuario(correo);
  medicoActual = correo;
  document.getElementById('medico-nombre').textContent = m.nombre;
  document.getElementById('medico-datos').textContent = m.especialidad + ' · Céd. ' + m.cedula;
  document.getElementById('medico-direccion').textContent = '📍 ' + m.direccion;
  cargarHorarios();
  cargarResenas();
  abrirModal('modal-medico');
}

function cargarHorarios() {
  const cont = document.getElementById('lista-horarios');
  cont.innerHTML = '';
  const libres = obtenerCitas()
    .filter(c => c.idMedico === medicoActual && c.estado === 'DISPONIBLE' && !c.idPaciente && c.fecha >= hoy())
    .sort((a, b) => (a.fecha + a.inicio).localeCompare(b.fecha + b.inicio));
  if (!libres.length) { cont.innerHTML = '<p class="texto-suave">Sin horarios disponibles.</p>'; return; }
  libres.forEach(c => {
    const t = clonar('plantilla-horario');
    poner(t, '.hor-fecha', c.fecha);
    poner(t, '.hor-hora', c.inicio + ' – ' + c.fin);
    t.querySelector('.btn-reservar').onclick = () => reservar(c.id);
    cont.appendChild(t);
  });
}

function reservar(id) {
  const citas = obtenerCitas();
  const c = citas.find(x => x.id === id);
  if (!c || c.estado !== 'DISPONIBLE' || c.idPaciente) return mostrarMensaje('La cita ya no está disponible.');           // RES-04
  const mias = citas.filter(x => x.idPaciente === usuario.correo && x.estado === 'RESERVADA');
  if (mias.length >= LIMITE_CITAS) return mostrarMensaje('Llegaste al límite de ' + LIMITE_CITAS + ' citas activas.');     // RES-05
  if (mias.some(x => x.fecha === c.fecha && x.inicio < c.fin && c.inicio < x.fin)) return mostrarMensaje('Se cruza con otra de tus citas.'); // RES-06
  c.estado = 'RESERVADA'; c.idPaciente = usuario.correo;                                                               // RES-09
  guardar('citas', citas);
  mostrarMensaje('Cita reservada');
  cargarHorarios(); cargarCitas();
}

function cargarResenas() {
  const cont = document.getElementById('lista-resenas');
  const orden = document.getElementById('orden-resenas').value;
  const rango = document.getElementById('rango-resenas').value;
  cont.innerHTML = '';
  let lista = obtenerResenas().filter(r => r.idMedico === medicoActual).filter(r =>
    rango === 'todas' || (rango === 'alta' && r.calificacion >= 9) || (rango === 'media' && r.calificacion >= 7 && r.calificacion <= 8) || (rango === 'baja' && r.calificacion <= 6));
  if (orden === 'mayor') lista.sort((a, b) => b.calificacion - a.calificacion);
  if (orden === 'menor') lista.sort((a, b) => a.calificacion - b.calificacion);
  if (orden === 'reciente') lista.sort((a, b) => b.fecha.localeCompare(a.fecha));
  if (!lista.length) { cont.innerHTML = '<p class="texto-suave">Sin reseñas en este rango.</p>'; return; }
  lista.forEach(r => {
    const t = clonar('plantilla-resena');
    poner(t, '.res-nota', r.calificacion + '/10');
    poner(t, '.res-fecha', r.fecha);
    poner(t, '.res-texto', r.comentario);
    cont.appendChild(t);
  });
}

// ---------- Mis citas ----------
function cargarCitas() {
  const cont = document.getElementById('lista-citas');
  const todas = obtenerCitas();
  const mias = todas.filter(c => c.idPaciente === usuario.correo).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const activas = mias.filter(c => c.estado === 'RESERVADA').length;
  document.getElementById('info-limite').textContent = 'Citas activas: ' + activas + ' de ' + LIMITE_CITAS;
  cont.innerHTML = '';
  if (!mias.length) { cont.innerHTML = '<p class="texto-suave">Aún no tienes citas.</p>'; return; }
  const recetas = obtenerRecetas(), resenas = obtenerResenas();
  mias.forEach(c => {
    const t = clonar('plantilla-cita');
    poner(t, '.cita-medico', nombreUsuario(c.idMedico));
    poner(t, '.cita-fecha', c.fecha + ' · ' + c.inicio + ' – ' + c.fin);
    const est = t.querySelector('.cita-estado'); est.textContent = c.estado; est.classList.add(c.estado);
    const tieneReceta = recetas.some(r => r.idCita === c.id);
    const tieneResena = resenas.some(r => r.idCita === c.id);
    const bCancelar = t.querySelector('.btn-cancelar'), bReceta = t.querySelector('.btn-receta'), bResena = t.querySelector('.btn-resena');
    if (c.estado === 'RESERVADA') bCancelar.onclick = () => cancelarCita(c.id); else bCancelar.remove();
    if (c.estado === 'ATENDIDA' && tieneReceta) bReceta.onclick = () => verReceta(c.id); else bReceta.remove();
    if (c.estado === 'ATENDIDA' && !tieneResena) bResena.onclick = () => abrirResena(c); else bResena.remove();
    cont.appendChild(t);
  });
}

function cancelarCita(id) {
  const citas = obtenerCitas();
  const c = citas.find(x => x.id === id);
  if (c && c.estado === 'RESERVADA') { c.estado = 'CANCELADA'; guardar('citas', citas); mostrarMensaje('Cita cancelada'); cargarCitas(); }
}

// ---------- Recetas ----------
function cargarRecetas() {
  const cont = document.getElementById('lista-recetas');
  cont.innerHTML = '';
  const lista = obtenerRecetas().filter(r => r.idPaciente === usuario.correo);
  if (!lista.length) { cont.innerHTML = '<p class="texto-suave">Aún no tienes recetas.</p>'; return; }
  lista.forEach(r => {
    const t = clonar('plantilla-receta');
    poner(t, '.rec-medico', nombreUsuario(r.idMedico));
    poner(t, '.rec-fecha', r.fecha);
    poner(t, '.rec-diagnostico', r.diagnostico);
    t.querySelector('.btn-ver-receta').onclick = () => verReceta(r.idCita);
    cont.appendChild(t);
  });
}

function verReceta(idCita) {
  const r = obtenerRecetas().find(x => x.idCita === idCita);
  const m = buscarUsuario(r.idMedico);
  document.getElementById('receta-medico').textContent = m.nombre;
  document.getElementById('receta-especialidad').textContent = m.especialidad + ' · Céd. ' + m.cedula;
  document.getElementById('receta-paciente').textContent = usuario.nombre;
  document.getElementById('receta-fecha').textContent = r.fecha;
  document.getElementById('receta-diagnostico').textContent = r.diagnostico;
  document.getElementById('receta-tratamiento').textContent = r.tratamiento;
  document.getElementById('receta-indicaciones').textContent = r.indicaciones;
  abrirModal('modal-receta');
}
// Imprimir / guardar como PDF desde el navegador. En el proyecto real: PDF generado en el backend.
document.getElementById('btn-pdf').onclick = () => window.print();

// ---------- Resena ----------
function abrirResena(c) {
  citaActual = c;
  document.getElementById('resena-info').textContent = nombreUsuario(c.idMedico) + ' · ' + c.fecha;
  document.getElementById('form-resena').reset();
  document.getElementById('valor-calificacion').textContent = '8';
  abrirModal('modal-resena');
}
document.getElementById('calificacion').oninput = e => { document.getElementById('valor-calificacion').textContent = e.target.value; };
document.getElementById('form-resena').addEventListener('submit', e => {
  e.preventDefault();
  const resenas = obtenerResenas();
  if (citaActual.estado !== 'ATENDIDA' || citaActual.idPaciente !== usuario.correo) return mostrarMensaje('No puedes reseñar esta cita.'); // RES-13, RES-15
  if (resenas.some(r => r.idCita === citaActual.id)) return mostrarMensaje('Esta cita ya tiene reseña.');                               // RES-14
  const nota = Number(document.getElementById('calificacion').value);
  if (nota < 1 || nota > 10) return mostrarMensaje('Calificación fuera de rango.');                                                       // RES-16
  resenas.push({ idCita: citaActual.id, idMedico: citaActual.idMedico, idPaciente: usuario.correo, calificacion: nota, comentario: document.getElementById('comentario').value.trim(), fecha: hoy() });
  guardar('resenas', resenas);
  cerrarModales(); mostrarMensaje('Reseña enviada');
  cargarCitas(); cargarMedicos();
});

// ---------- Eventos de filtros e inicio ----------
document.getElementById('buscar').oninput = cargarMedicos;
document.getElementById('filtro-especialidad').onchange = cargarMedicos;
document.getElementById('orden-resenas').onchange = cargarResenas;
document.getElementById('rango-resenas').onchange = cargarResenas;

cargarEspecialidades(); cargarMedicos(); cargarCitas(); cargarRecetas();
