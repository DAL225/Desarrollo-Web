// Espera a que cargue el DOM para interceptar el envío del formulario de login
document.addEventListener("DOMContentLoaded", function () {
  const formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita que el formulario recargue la página
      iniciarSesion();
    });
  }
});

// Expresiones regulares: correo @gmail.com (parte local de 1 a 20 caracteres) y contraseña sin espacios (1 a 20)
const patronCorreo = /^[A-Za-z0-9._%+-]{1,20}@gmail\.com$/i;
const patronContrasena = /^\S{1,20}$/;

// Referencias a los inputs de correo, contraseña y botón de login
const inpCorreo = document.getElementById("inpCorreo");
const inpPassword = document.getElementById("inpPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");

// También permite disparar iniciarSesion() al hacer clic directo en el botón
if (btnIniciarSesion) {
  btnIniciarSesion.addEventListener("click", function (e) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    iniciarSesion();
  });
}

// Muestra un mensaje de error en #error-login (o con alert si no existe ese elemento)
function mostrarFeedbackLogin(mensaje) {
  const errorEl = document.getElementById("error-login");
  if (errorEl) {
    errorEl.textContent = mensaje;
    errorEl.classList.remove("oculto");
  } else {
    alert(mensaje);
  }
}

// Coordina el flujo de inicio de sesión: primero valida y luego envía al backend
function iniciarSesion() {
  if (validarCredenciales()) {
    login();
  }
}

// Valida formato y longitud de correo y contraseña, marcando bordes y placeholders en rojo o azul
function validarCredenciales() {
  let exito = true;
  const correo = inpCorreo ? inpCorreo.value.trim() : "";
  const psw = inpPassword ? inpPassword.value : "";

  // Valida correo
  if (correo.length > 0 && patronCorreo.test(correo)) {
    if (inpCorreo) {
      inpCorreo.style.borderWidth = "2px";
      inpCorreo.style.borderColor = "blue";
    }
  } else {
    if (inpCorreo) {
      inpCorreo.style.borderWidth = "2px";
      inpCorreo.style.borderColor = "red";
      inpCorreo.value = "";
      inpCorreo.placeholder = correo.length === 0
        ? "Error ingresa un correo"
        : "Máx. 20 caracteres y dominio @gmail.com";
    }
    exito = false;
  }

  // Valida contraseña
  if (psw.length > 0 && patronContrasena.test(psw)) {
    if (inpPassword) {
      inpPassword.style.borderWidth = "2px";
      inpPassword.style.borderColor = "blue";
    }
  } else {
    if (inpPassword) {
      inpPassword.style.borderWidth = "2px";
      inpPassword.style.borderColor = "red";
      inpPassword.value = "";
      inpPassword.placeholder = psw.length === 0
        ? "Error ingresa una contraseña"
        : "Usa mayúsculas, minúsculas y símbolos";
    }
    exito = false;
  }

  return exito;
}

// Envía correo y contraseña al backend, guarda la sesión en sessionStorage y redirige según el rol
async function login() {
  try {
    const correo = inpCorreo ? inpCorreo.value.trim() : "";
    const psw = inpPassword ? inpPassword.value : "";

    const response = await fetch("http://localhost:8081/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, psw })
    });

    const respuesta = await response.json();

    if (respuesta.ok && respuesta.usuario) {
      const u = respuesta.usuario;
      // Normaliza los campos del usuario para tenerlos consistentes en sesión
      const datosSesion = {
        id: u.idUsuario || u.id || null,
        idUsuario: u.idUsuario || u.id || null,
        nombre: u.nombre || "",
        correo: u.correo || "",
        telefono: u.telefono || "",
        rol: u.rol ? u.rol.toUpperCase() : ""
      };

      sessionStorage.setItem("usuario", JSON.stringify(datosSesion));
      alert(respuesta.mensaje || "Sesión iniciada");

      // Redirige al panel correspondiente según el rol
      location.href = datosSesion.rol === "MEDICO" ? "medico.html" : "paciente.html";
    } else {
      mostrarFeedbackLogin(respuesta.mensaje || "No se ha encontrado al usuario");
    }
  } catch (error) {
    console.error("Error en login:", error);
    mostrarFeedbackLogin("Ocurrió un error al intentar iniciar sesión.");
  }
}