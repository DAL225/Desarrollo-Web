// ---------- Sesión (localStorage y sessionStorage) ----------

/**
 * Almacena en localStorage los datos esenciales del usuario que inicia sesión.
 * Se serializa el objeto a formato JSON para persistir id, nombre, correo, telefono y rol.
 * @param {Object} u Objeto con los datos del usuario autenticado.
 */
function guardarSesion(u) {
  // Se construye un objeto limpio únicamente con los atributos requeridos para la sesión
  const datosSesion = {
    id: u.idUsuario || u.id || null,
    nombre: u.nombre || '',
    correo: u.correo || '',
    telefono: u.telefono || '',
    rol: u.rol ? u.rol.toUpperCase() : ''
  };

  // Se guarda la cadena JSON en localStorage bajo la clave 'usuario'
  localStorage.setItem('usuario', JSON.stringify(datosSesion));
  // Se respalda en sessionStorage para compatibilidad con vistas activas
  sessionStorage.setItem('usuario', JSON.stringify(datosSesion));
}

/**
 * Recupera los datos de la sesión activa desde localStorage.
 * Convierte la cadena JSON almacenada nuevamente en un objeto de JavaScript.
 * @returns {Object|null} Objeto usuario o null si no existe sesión activa.
 */
function obtenerSesion() {
  // Se obtiene el registro almacenado en localStorage
  const sesionLocal = localStorage.getItem('usuario');
  // Si existe información, se parsea y retorna; de lo contrario, se devuelve null
  return sesionLocal ? JSON.parse(sesionLocal) : null;
}

/**
 * Elimina los datos de la sesión activa en el navegador y redirige al inicio.
 */
function cerrarSesion() {
  // Se remueve la clave 'usuario' tanto de localStorage como de sessionStorage
  localStorage.removeItem('usuario');
  sessionStorage.removeItem('usuario');
  // Se redirige a la pantalla de inicio de sesión
  location.href = 'index.html';
}

/**
 * Redirige al panel correspondiente según el rol del usuario autenticado.
 * @param {Object} u Objeto usuario con la propiedad rol.
 */
function irAPanel(u) {
  const rolNormalizado = u.rol ? u.rol.toUpperCase() : '';
  location.href = rolNormalizado === 'MEDICO' ? 'medico.html' : 'paciente.html';
}

/**
 * Verifica si existe una sesión activa y si el rol coincide con el requerido por la vista.
 * @param {string} rol Rol esperado ('PACIENTE' o 'MEDICO').
 * @returns {Object|null} Objeto usuario válido o null tras redirigir.
 */
function protegerPagina(rol) {
  const u = obtenerSesion();
  if (!u || u.rol.toUpperCase() !== rol.toUpperCase()) {
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
async function obtenerUsuarios() {
  try {
    const respuesta = await fetch("http://localhost:8081/api/usuarios");
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

async function nombreUsuario(correo) {
  var listaUsuario = [];
  listaUsuario = await obtenerUsuarios();
  listaUsuario.forEach(element => {
    if (element.correo === correo){
      console.log(element ? element.nombre : corre);
      return element ? element.nombre : correo;
    }
  });
}

async function buscarUsuario(correo) {
  let listaUsuario = [];
  listaUsuario = await obtenerUsuarios();
  listaUsuario.forEach(element => {
    if (element.correo == correo){
      console.log(element);
      return element;
    }
  });
}

async function obtenerMedicos() {
  try {
    const respuesta = await fetch("http://localhost:8081/api/medicos");
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