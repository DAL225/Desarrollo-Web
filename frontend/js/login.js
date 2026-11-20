// CLASE LOGIN 

//Listener DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  //obtiene acceso al panel del login
  const formLogin = document.getElementById("form-login");
  //Si se obtuvo el elemento entonces se le añade el listener al boton de inicio de sesion
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      iniciarSesion();
    });
  }
});

// Patrones para validacion
const patronNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const patronCorreo = /^[A-Za-z0-9._%+-]{1,20}@gmail\.com$/i;
const patronContrasena = /^\S{1,20}$/;

// Elementos DOM
const inpCorreo = document.getElementById("inpCorreo");
const inpPassword = document.getElementById("inpPassword");
const btnIniciarSesion = document.getElementById("btnIniciarSesion");
//Asignacion del listener en el boton de inicio de sesion
if (btnIniciarSesion) {
  btnIniciarSesion.addEventListener("click", function (e) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    iniciarSesion();
  });
}

/**
 * Funcion que valida los datos de inicio de sesion y realiza la solicitud al servidor
 */
function iniciarSesion() {
  const validacionExitosa = validarCredenciales();
  if (validacionExitosa) {
    login();
  }
}

/**
 * Funcion que valida las credenciales ingresadas
 * @returns Boolean True / False dependiendo si los datos son correctos o no correspondientemente
 */
function validarCredenciales() {
  //Se declara una bandera con el valor true, esta debe llegar al final del metodo sin sufrir modificaciones entonces los datos seran validos
  let exito = true;
  //Se obtienen los valores de los inputs, se guarda el contenido en texto o null si no se encuentra
  const correo = inpCorreo ? inpCorreo.value.trim() : null;
  const psw = inpPassword ? inpPassword.value : null;
  //Si se pudo recuperar el contenido entonces dejamos los inputs con sus estilos normales
  if (correo !== null && correo.length > 0) {
    inpCorreo.style.borderColor = "";
    //Si no se recupero un valor entonces se avisa el error en el input
  }else {
    inpCorreo.style.borderColor = "2px solid red";
    inpCorreo.value = "";
    inpCorreo.placeholder = "Error ingresa un correo";
    exito = false;
  }
  if (psw !== null && psw.length > 0) {
    inpPassword.style.borderColor = "";
      //Si no se recupero un valor entonces se avisa el error en el input
  }else {
    inpPassword.style.borderColor = "2px solid red";
    inpPassword.value = "";
    inpPassword.placeholder = "Error ingresa una contraseña";
    exito = false;
  }
  //Ahora validamos que correspondan con el formato esperado
  if (patronCorreo.test(correo)) {
      inpCorreo.style.borderColor = "2px solid blue";
  }else{
      inpCorreo.style.borderColor = "2px solid red";
      inpCorreo.value = "";
      inpCorreo.placeholder = "Máx. 20 caracteres y dominio @gmail.com";
      exito = false;
  }
  if (patronContrasena.test(psw)) {
    inpPassword.style.borderColor = "2px solid blue";
  }else{
    inpPassword.style.borderColor = "2px solid red";
    inpPassword.value = "";    
    inpPassword.placeholder = "Usa mayúsculas, minúsculas y símbolos";
    exito = false;
  }
  return exito;
}

/**
 * 
 */
async function login() {
  try {
    const correo = inpCorreo ? inpCorreo.value.trim() : "";
    const psw = inpPassword ? inpPassword.value : "";
    const response = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        correo: correo,
        psw: psw
      })
    });

    const respuesta = await response.json();
    if (respuesta.ok) {
    // Se almacenan id, nombre, correo, telefono y rol en localStorage
      guardarSesion(respuesta.usuario);
      alert(respuesta.mensaje)
      // Redirección al panel según el rol (paciente.html o medico.html)
      irAPanel(respuesta.usuario);
    } else {
      alert("No se ha encontrado al usuario");
    } 
  }catch (error) {
    console.error("Error en login:", error);
    mostrarFeedbackLogin("Ocurrió un error al intentar iniciar sesión.");
  }
}