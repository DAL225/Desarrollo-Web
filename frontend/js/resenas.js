let citaActualResena = null;


async function obtenerResenas(idMedico) {
  try {
    const respuesta = await fetch(`http://localhost:8081/api/resenas/medico/${idMedico}`);

    if (!respuesta.ok) {
      alert(respuesta.message);
    }

    const resultado = await respuesta.json();

    const resenas = resultado.data || [];

    console.log(resenas);
    return resenas;

  } catch (error) {
    console.error('Error al cargar las reseñas:', error);
    return [];
  }
}

/**
 * Actualizacion de la resena
 */
document.getElementById('form-editar-resena').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = Number(document.getElementById('id-resena').value);
  let comentario = document.getElementById('editar-comentario').value.trim();

  const comentarioOriginal = comentarioGlobal.trim();

  if (!comentario) {
    alert('No puede quedar vacío el comentario');
    return;
  }

  if (comentario === comentarioOriginal) {
    alert('No realizaste ningún cambio en el comentario');
    return;
  }

  if (!comentario.startsWith('(editado) ')) {
    comentario = '(editado) ' + comentario;
  }

  try {
    console.log("resena a actualizar: " + id)
    const respuesta = await fetch(`http://localhost:8081/api/resenas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ comentario })
    });

    const resultado = await respuesta.json();

    // Validar si ocurrió algún error
    if (!respuesta.ok || !resultado.success) {
      alert(resultado.message || 'No se pudo actualizar la reseña');
      return;
    }

    alert(resultado.message || 'Reseña actualizada correctamente');

  } catch (error) {
    console.error('Error al actualizar:', error);
    alert('No fue posible actualizar la reseña, intente más tarde');
  }
});

function calcularPromedioMedico(id) {
  const r = obtenerResenas(id);
  if (!r.length) return 'Nuevo';
  return (r.reduce((s, x) => s + x.calificacion, 0) / r.length).toFixed(1);
}

function cargarResenasModal(listaResenas) {
  const cont = document.getElementById('lista-resenas');
  if (!cont) return;

  const orden = document.getElementById('orden-resenas')?.value || 'mayor';
  const rango = document.getElementById('rango-resenas')?.value || 'todas';
  cont.innerHTML = '';

  let lista = listaResenas.filter(r =>
    rango === 'todas' ||
    (rango === 'alta' && r.calificacion >= 9) ||
    (rango === 'media' && r.calificacion >= 7 && r.calificacion <= 8) ||
    (rango === 'baja' && r.calificacion <= 6)
  );

  if (orden === 'mayor') lista.sort((a, b) => b.calificacion - a.calificacion);
  if (orden === 'menor') lista.sort((a, b) => a.calificacion - b.calificacion);
  if (orden === 'reciente') lista.sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (!lista.length) {
    cont.innerHTML = '<p class="texto-suave">Sin reseñas en este rango.</p>';
    return;
  }

  lista.forEach(r => {
    const t = clonar('plantilla-resena');
    poner(t, '.res-nota', r.calificacion + '/10');
    poner(t, '.res-fecha', r.fecha);
    poner(t, '.res-texto', r.comentario);

    const btnEditar = t.querySelector('.btn-editar-resena');

    if (r.usuario.idUsuario === 102) { // CAMBIAR POR SESSION
      btnEditar.style.display = 'inline-block';

      btnEditar.onclick = () => editarResena(r);
    }

    cont.appendChild(t);
  });
}

document.getElementById('orden-resenas')?.addEventListener('change', cargarResenasModal);
document.getElementById('rango-resenas')?.addEventListener('change', cargarResenasModal);

async function abrirModalResena(c) {
  citaActualResena = c;
  const med = await buscarUsuario(c.idMedico);
  document.getElementById('resena-info').textContent = 'Califica la atención de ' + (med ? med.nombre : c.idMedico);
  document.getElementById('form-resena').reset();
  document.getElementById('valor-calificacion').textContent = '8';
  abrirModal('modal-resena');
}

const rangoCalificacion = document.getElementById('calificacion');
if (rangoCalificacion) {
  rangoCalificacion.addEventListener('input', e => {
    document.getElementById('valor-calificacion').textContent = e.target.value;
  });
}

const formResena = document.getElementById('form-resena');
if (formResena) {
  formResena.addEventListener('submit', e => {
    e.preventDefault();
    const resenas = obtenerResenas();
    resenas.push({
      idCita: citaActualResena.id,
      idMedico: citaActualResena.idMedico,
      idPaciente: usuario.correo,
      calificacion: parseInt(document.getElementById('calificacion').value),
      comentario: document.getElementById('comentario').value.trim(),
      fecha: hoy()
    });
    guardar('resenas', resenas);
    cerrarModales();
    mostrarMensaje('Reseña enviada con éxito');
    if (typeof cargarCitas === 'function') cargarCitas();
  });
}