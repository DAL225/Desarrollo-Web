const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');

// ---------- Login ----------
if (formLogin) {
  formLogin.addEventListener('submit', e => {
    e.preventDefault();
    const correo = document.getElementById('correo').value.trim();
    const clave = document.getElementById('clave').value;
    const u = obtenerUsuarios().find(x => x.correo === correo && x.clave === clave);
    if (!u) {
      mostrarError('error-login', 'Correo o contraseña incorrectos.');
      return;
    }
    guardarSesion({ correo: u.correo, nombre: u.nombre, rol: u.rol });
    irAPanel(u);
  });
}

// ---------- Registro ----------
if (formRegistro) {
  const selRol = document.getElementById('rol');
  selRol.addEventListener('change', () => {
    document.getElementById('campos-medico').classList.toggle('oculto', selRol.value !== 'MEDICO');
  });

  formRegistro.addEventListener('submit', e => {
    e.preventDefault();
    const rol = selRol.value;
    const correo = document.getElementById('correo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const clave = document.getElementById('clave').value;
    const lista = obtenerUsuarios();

    if (!/^\S+@\S+\.\S+$/.test(correo)) return mostrarError('error-registro', 'Ingresa un correo válido.');
    if (lista.some(u => u.correo === correo)) return mostrarError('error-registro', 'Ese correo ya está registrado.');
    if (clave.length < 4) return mostrarError('error-registro', 'La contraseña debe tener al menos 4 caracteres.');

    const nuevo = { correo, clave, nombre, rol };
    if (rol === 'MEDICO') {
      nuevo.cedula = document.getElementById('cedula').value.trim();
      nuevo.especialidad = document.getElementById('especialidad').value.trim();
      nuevo.direccion = document.getElementById('direccion').value.trim();
      if (!nuevo.cedula || !nuevo.especialidad || !nuevo.direccion) {
        return mostrarError('error-registro', 'Completa los datos profesionales.');
      }
    }
    lista.push(nuevo);
    guardar('usuarios', lista);
    mostrarMensaje('Cuenta creada');
    setTimeout(() => location.href = 'index.html', 900);
  });
}