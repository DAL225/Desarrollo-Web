const usuario = protegerPagina('MEDICO');

document.getElementById('nombre-usuario').textContent = usuario.nombre;
document.getElementById('btn-salir').onclick = cerrarSesion;
document.getElementById('fecha').min = hoy();

// ---------- Agenda del Médico ----------
function cargarAgenda() {
  const cont = document.getElementById('lista-agenda');
  const recetas = obtenerRecetas();
  const mias = obtenerCitas().filter(c => c.idMedico === usuario.correo)
    .sort((a, b) => (b.fecha + b.inicio).localeCompare(a.fecha + a.inicio));
  
  cont.innerHTML = '';
  if (!mias.length) {
    cont.innerHTML = '<p class="texto-suave">Aún no has publicado citas.</p>';
  }

  mias.forEach(c => {
    const t = clonar('plantilla-agenda');
    poner(t, '.ag-fecha', c.fecha);
    poner(t, '.ag-hora', c.inicio + ' – ' + c.fin);
    poner(t, '.ag-paciente', c.idPaciente ? 'Paciente: ' + nombreUsuario(c.idPaciente) : 'Sin paciente');
    
    const est = t.querySelector('.ag-estado');
    est.textContent = c.estado;
    est.classList.add(c.estado);

    const bAtender = t.querySelector('.btn-atender');
    const bCancelar = t.querySelector('.btn-cancelar');
    const bReceta = t.querySelector('.btn-receta');

    if (c.estado === 'RESERVADA') {
      bAtender.onclick = () => cambiarEstadoCita(c.id, 'ATENDIDA');
      bCancelar.onclick = () => cambiarEstadoCita(c.id, 'CANCELADA');
    } else {
      bAtender.remove();
      bCancelar.remove();
    }

    if (c.estado === 'ATENDIDA' && !recetas.some(r => r.idCita === c.id)) {
      bReceta.onclick = () => abrirEmisionReceta(c);
    } else {
      bReceta.remove();
    }
    cont.appendChild(t);
  });
  cargarContadores(mias);
}

function cargarContadores(mias) {
  const cuenta = e => mias.filter(c => c.estado === e).length;
  document.getElementById('cont-disponibles').textContent = cuenta('DISPONIBLE');
  document.getElementById('cont-reservadas').textContent = cuenta('RESERVADA');
  document.getElementById('cont-atendidas').textContent = cuenta('ATENDIDA');
  
  const r = obtenerResenas().filter(x => x.idMedico === usuario.correo);
  document.getElementById('cont-promedio').textContent = r.length ? (r.reduce((s, x) => s + x.calificacion, 0) / r.length).toFixed(1) : '-';
}

// Inicialización del panel de médico
cargarAgenda();
cargarRecetas();