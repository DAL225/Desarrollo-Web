const usuario=protegerPagina('MEDICO');
let citaActual=null;   // cita sobre la que se emite la receta

document.getElementById('nombre-usuario').textContent=usuario.nombre;
document.getElementById('btn-salir').onclick=cerrarSesion;
document.getElementById('fecha').min=hoy();

// ---------- Agenda ----------
function cargarAgenda(){
  const cont=document.getElementById('lista-agenda');
  const recetas=obtenerRecetas();
  const mias=obtenerCitas().filter(c=>c.idMedico===usuario.correo)
    .sort((a,b)=>(b.fecha+b.inicio).localeCompare(a.fecha+a.inicio));
  cont.innerHTML='';
  if(!mias.length)cont.innerHTML='<p class="texto-suave">Aún no has publicado citas.</p>';

  mias.forEach(c=>{
    const t=clonar('plantilla-agenda');
    poner(t,'.ag-fecha',c.fecha);
    poner(t,'.ag-hora',c.inicio+' – '+c.fin);
    poner(t,'.ag-paciente',c.idPaciente?'Paciente: '+nombreUsuario(c.idPaciente):'Sin paciente');
    const est=t.querySelector('.ag-estado');est.textContent=c.estado;est.classList.add(c.estado);

    const bAtender=t.querySelector('.btn-atender'),bCancelar=t.querySelector('.btn-cancelar'),bReceta=t.querySelector('.btn-receta');
    if(c.estado==='RESERVADA'){
      bAtender.onclick=()=>cambiarEstado(c.id,'ATENDIDA');
      bCancelar.onclick=()=>cambiarEstado(c.id,'CANCELADA');
    }else{bAtender.remove();bCancelar.remove();}
    if(c.estado==='ATENDIDA'&&!recetas.some(r=>r.idCita===c.id))bReceta.onclick=()=>abrirReceta(c);
    else bReceta.remove();
    cont.appendChild(t);
  });
  cargarContadores(mias);
}

function cargarContadores(mias){
  const cuenta=e=>mias.filter(c=>c.estado===e).length;
  document.getElementById('cont-disponibles').textContent=cuenta('DISPONIBLE');
  document.getElementById('cont-reservadas').textContent=cuenta('RESERVADA');
  document.getElementById('cont-atendidas').textContent=cuenta('ATENDIDA');
  const r=obtenerResenas().filter(x=>x.idMedico===usuario.correo);
  document.getElementById('cont-promedio').textContent=r.length?(r.reduce((s,x)=>s+x.calificacion,0)/r.length).toFixed(1):'-';
}

function cambiarEstado(id,nuevo){
  const citas=obtenerCitas();
  const c=citas.find(x=>x.id===id);
  if(!c||c.estado!=='RESERVADA')return mostrarMensaje('Solo una cita reservada puede cambiar de estado.'); // RES-09
  c.estado=nuevo;
  guardar('citas',citas);
  mostrarMensaje('Cita '+(nuevo==='ATENDIDA'?'atendida':'cancelada'));
  cargarAgenda();
}

// ---------- Nueva cita ----------
document.getElementById('form-cita').addEventListener('submit',e=>{
  e.preventDefault();
  const fecha=document.getElementById('fecha').value;
  const inicio=document.getElementById('inicio').value;
  const fin=document.getElementById('fin').value;
  if(fecha<hoy())return mostrarError('error-cita','La fecha no puede ser anterior a hoy.');                       // RES-08
  if(fin<=inicio)return mostrarError('error-cita','La hora de fin debe ser posterior a la de inicio.');         // RES-08
  const citas=obtenerCitas();
  const cruce=citas.some(c=>c.idMedico===usuario.correo&&c.estado!=='CANCELADA'&&c.fecha===fecha&&c.inicio<fin&&inicio<c.fin);
  if(cruce)return mostrarError('error-cita','Ya tienes una cita que se cruza con ese horario.');                 // RES-07
  citas.push({id:Date.now(),idMedico:usuario.correo,fecha,inicio,fin,estado:'DISPONIBLE',idPaciente:null});
  guardar('citas',citas);
  mostrarError('error-cita','');
  cerrarModales();mostrarMensaje('Cita publicada');
  cargarAgenda();
});

// ---------- Recetas ----------
function abrirReceta(c){
  citaActual=c;
  document.getElementById('form-receta').reset();
  document.getElementById('receta-info').textContent='Paciente: '+nombreUsuario(c.idPaciente)+' · '+c.fecha;
  abrirModal('modal-receta');
}

document.getElementById('form-receta').addEventListener('submit',e=>{
  e.preventDefault();
  const recetas=obtenerRecetas();
  if(citaActual.estado!=='ATENDIDA')return mostrarMensaje('La cita debe estar atendida.');                         // RES-10
  if(recetas.some(r=>r.idCita===citaActual.id))return mostrarMensaje('Esta cita ya tiene receta.');               // RES-11
  recetas.push({                                                                                                  // RES-12
    idCita:citaActual.id,idMedico:citaActual.idMedico,idPaciente:citaActual.idPaciente,fecha:hoy(),
    diagnostico:document.getElementById('diagnostico').value.trim(),
    tratamiento:document.getElementById('tratamiento').value.trim(),
    indicaciones:document.getElementById('indicaciones').value.trim()
  });
  guardar('recetas',recetas);
  cerrarModales();mostrarMensaje('Receta emitida');
  cargarAgenda();cargarRecetas();
});

function cargarRecetas(){
  const cont=document.getElementById('lista-recetas');
  cont.innerHTML='';
  const lista=obtenerRecetas().filter(r=>r.idMedico===usuario.correo);
  if(!lista.length){cont.innerHTML='<p class="texto-suave">Aún no has emitido recetas.</p>';return;}
  lista.forEach(r=>{
    const t=clonar('plantilla-receta-emitida');
    poner(t,'.rec-paciente',nombreUsuario(r.idPaciente));
    poner(t,'.rec-fecha',r.fecha);
    poner(t,'.rec-diagnostico',r.diagnostico);
    cont.appendChild(t);
  });
}

cargarAgenda();cargarRecetas();
