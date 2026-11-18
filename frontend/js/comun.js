// ---------- Sesión (sessionStorage) ----------
function guardarSesion(u) {
  sessionStorage.setItem('usuario', JSON.stringify(u));
}

function obtenerSesion() {
  return JSON.parse(sessionStorage.getItem('usuario'));
}

function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  location.href = 'index.html';
}

function irAPanel(u) {
  location.href = u.rol === 'MEDICO' ? 'medico.html' : 'paciente.html';
}

function protegerPagina(rol) {
  const u = obtenerSesion();
  if (!u || u.rol !== rol) {
    location.href = 'index.html';
    return null;
  }
  return u;
}

// ---------- Almacén de datos (localStorage) ----------
function leer(clave, defecto) {
  const v = localStorage.getItem(clave);
  return v ? JSON.parse(v) : defecto;
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// ---------- Utilidades de interfaz y DOM ----------
function abrirModal(id) {
  document.getElementById(id).classList.add('activo');
}

function cerrarModales() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('activo'));
}

function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(s => s.classList.toggle('activo', s.id === id));
  document.querySelectorAll('[data-seccion]').forEach(b => b.classList.toggle('activo', b.dataset.seccion === id));
}

function mostrarMensaje(texto) {
  const m = document.getElementById('mensaje');
  if (!m) return;
  m.textContent = texto;
  m.classList.add('activo');
  setTimeout(() => m.classList.remove('activo'), 2400);
}

function mostrarError(id, texto) {
  const e = document.getElementById(id);
  if (!e) return;
  e.textContent = texto;
  e.classList.toggle('oculto', !texto);
}

function clonar(idPlantilla) {
  return document.getElementById(idPlantilla).content.firstElementChild.cloneNode(true);
}

function poner(el, selector, texto) {
  const elemento = el.querySelector(selector);
  if (elemento) elemento.textContent = texto;
}

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

function fechaMas(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

// ---------- Eventos globales ----------
document.addEventListener('click', e => {
  const abrir = e.target.closest('[data-abrir]');
  if (abrir) abrirModal(abrir.dataset.abrir);
  
  if (e.target.closest('[data-cerrar]') || e.target.classList.contains('modal')) {
    cerrarModales();
  }
  
  const sec = e.target.closest('[data-seccion]');
  if (sec) mostrarSeccion(sec.dataset.seccion);
});

// Datos iniciales de usuarios demo (Se pasará a la API más adelante)
function obtenerUsuarios() {
  const USUARIOS_DEMO = [
    { correo: 'paciente@correo.com', clave: '1234', nombre: 'Ana Torres', rol: 'PACIENTE' },
    { correo: 'paciente2@correo.com', clave: '1234', nombre: 'Luis Pérez', rol: 'PACIENTE' },
    { correo: 'medico@correo.com', clave: '1234', nombre: 'Dra. Elena Vargas', rol: 'MEDICO', cedula: '8451203', especialidad: 'Cardiología', direccion: 'Av. Reforma 120, Consultorio 4' },
    { correo: 'medico2@correo.com', clave: '1234', nombre: 'Dr. Marcos Rivera', rol: 'MEDICO', cedula: '7392045', especialidad: 'Pediatría', direccion: 'Calle Hidalgo 58, Centro' }
  ];
  return  USUARIOS_DEMO;
}

function nombreUsuario(correo) {
  const u = obtenerUsuarios().find(x => x.correo === correo);
  return u ? u.nombre : correo;
}

function buscarUsuario(correo) {
  return obtenerUsuarios().find(x => x.correo === correo);
}