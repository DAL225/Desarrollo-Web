// ---------- Sesion (sessionStorage) ----------
function guardarSesion(u){sessionStorage.setItem('usuario',JSON.stringify(u));}
function obtenerSesion(){return JSON.parse(sessionStorage.getItem('usuario'));}
function cerrarSesion(){sessionStorage.removeItem('usuario');location.href='index.html';}
function irAPanel(u){location.href=u.rol==='MEDICO'?'medico.html':'paciente.html';}
function protegerPagina(rol){
  const u=obtenerSesion();
  if(!u||u.rol!==rol){location.href='index.html';return null;}
  return u;
}

// ---------- Almacen de datos de demo (localStorage) ----------
function leer(clave,defecto){const v=localStorage.getItem(clave);return v?JSON.parse(v):defecto;}
function guardar(clave,valor){localStorage.setItem(clave,JSON.stringify(valor));}

// ---------- Utilidades de interfaz ----------
function abrirModal(id){document.getElementById(id).classList.add('activo');}
function cerrarModales(){document.querySelectorAll('.modal').forEach(m=>m.classList.remove('activo'));}
function mostrarSeccion(id){
  document.querySelectorAll('.seccion').forEach(s=>s.classList.toggle('activo',s.id===id));
  document.querySelectorAll('[data-seccion]').forEach(b=>b.classList.toggle('activo',b.dataset.seccion===id));
}
function mostrarMensaje(texto){
  const m=document.getElementById('mensaje');
  m.textContent=texto;m.classList.add('activo');
  setTimeout(()=>m.classList.remove('activo'),2400);
}
function mostrarError(id,texto){
  const e=document.getElementById(id);
  e.textContent=texto;e.classList.toggle('oculto',!texto);
}
function clonar(idPlantilla){return document.getElementById(idPlantilla).content.firstElementChild.cloneNode(true);}
function poner(el,selector,texto){el.querySelector(selector).textContent=texto;}
function hoy(){return new Date().toISOString().slice(0,10);}

// Eventos globales: abrir/cerrar modales y cambiar de seccion
document.addEventListener('click',e=>{
  const abrir=e.target.closest('[data-abrir]');
  if(abrir)abrirModal(abrir.dataset.abrir);
  if(e.target.closest('[data-cerrar]')||e.target.classList.contains('modal'))cerrarModales();
  const sec=e.target.closest('[data-seccion]');
  if(sec)mostrarSeccion(sec.dataset.seccion);
});
