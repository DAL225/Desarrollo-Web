// Patrones globales definidos en la cima del archivo
const patronNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras (con acentos/ñ) y espacios
const patronTelefono = /^[0-9]{10}$/; // Exactamente 10 dígitos numéricos
const patronCorreo = /^[A-Za-z0-9._%+-]{1,20}@gmail\.com$/i; // @gmail.com con parte local de 1 a 20 caracteres
const patronContrasena = /^\S{1,20}$/; // De 1 a 20 caracteres sin espacios en blanco

// Referencias DOM de los inputs del formulario de registro
const inpNombre = document.getElementById("inpNombre") || document.getElementById("nombre");
const inpCorreo = document.getElementById("inpCorreo") || document.getElementById("correo");
const inpPsw = document.getElementById("inpPsw") || document.getElementById("clave");
const selectRol = document.getElementById("rol");
const inpTelefono = document.getElementById("inpTelefono") || document.getElementById("telefono");
const inpCedula = document.getElementById("cedula");
const selectEspecialidad = document.getElementById("especialidad");
const inpDireccion = document.getElementById("direccion");

// Configura listeners al cargar el DOM para alternar campos de médico y enviar el formulario
document.addEventListener("DOMContentLoaded", function () {
    const formRegistro = document.getElementById("form-registro");

    // Muestra u oculta el bloque de campos extra según si el rol seleccionado es MEDICO
    if (selectRol) {
        selectRol.addEventListener("change", function () {
            const camposMedico = document.getElementById("campos-medico");
            if (camposMedico) {
                camposMedico.classList.toggle("oculto", selectRol.value !== "MEDICO");
            }
        });
    }

    // Intercepta el submit del formulario y dirige al flujo de médico o de paciente/usuario
    if (formRegistro) {
        formRegistro.addEventListener("submit", function (e) {
            e.preventDefault();
            if (selectRol && selectRol.value === "MEDICO") {
                registrarMedico();
            } else {
                registrarUsuario();
            }
        });
    }
});

/**
 * Valida los campos básicos de usuario (nombre, correo, contraseña y teléfono),
 * marcando bordes en rojo o azul y actualizando placeholders si hay error.
 * @returns {boolean} True si todos los campos pasan la validación, false en caso contrario.
 */
function validarDatosUsuario() {
    let datosValidos = true;
    const arregloInputs = [inpNombre, inpCorreo, inpPsw, inpTelefono];

    for (let i = 0; i < arregloInputs.length; i++) {
        const inp = arregloInputs[i];
        if (!inp) continue;
        const valor = inp.value;

        // Primero revisa si el campo está vacío o solo tiene espacios
        if (valor == null || valor.trim().length <= 0) {
            inp.style.border = "2px solid red";

            if (inp.tagName !== "SELECT") {
                inp.value = "";
            }

            if (inp === inpNombre) {
                inp.placeholder = "Error: ingresa tu nombre completo";
            } else if (inp === inpCorreo) {
                inp.placeholder = "Error: ingresa un correo electrónico";
            } else if (inp === inpPsw) {
                inp.placeholder = "Error: ingresa una contraseña";
            } else if (inp === inpTelefono) {
                inp.placeholder = "Error: ingresa un teléfono de 10 dígitos";
            }

            datosValidos = false;
        } else {
            // Si no está vacío, valida el formato contra su expresión regular correspondiente
            if (inp === inpNombre) {
                if (!patronNombre.test(valor.trim())) {
                    inp.style.border = "2px solid red";
                    inp.value = "";
                    inp.placeholder = "Solo letras mayúsculas, minúsculas y espacios";
                    datosValidos = false;
                } else {
                    inp.style.border = "2px solid blue";
                }
            } else if (inp === inpCorreo) {
                if (!patronCorreo.test(valor.trim())) {
                    inp.style.border = "2px solid red";
                    inp.value = "";
                    inp.placeholder = "Máx. 20 caracteres y dominio @gmail.com";
                    datosValidos = false;
                } else {
                    inp.style.border = "2px solid blue";
                }
            } else if (inp === inpPsw) {
                if (!patronContrasena.test(valor)) {
                    inp.style.border = "2px solid red";
                    inp.value = "";
                    inp.placeholder = "Máx. 20 caracteres sin espacios";
                    datosValidos = false;
                } else {
                    inp.style.border = "2px solid blue";
                }
            } else if (inp === inpTelefono) {
                if (!patronTelefono.test(valor.trim())) {
                    inp.style.border = "2px solid red";
                    inp.value = "";
                    inp.placeholder = "Solo 10 números enteros (0-9)";
                    datosValidos = false;
                } else {
                    inp.style.border = "2px solid blue";
                }
            }
        }
    }

    return datosValidos;
}

/**
 * Valida primero los datos generales de usuario y luego los campos específicos de médico
 * (cédula profesional, especialidad y dirección).
 * @returns {boolean} True si todo es válido, false si falla algún campo.
 */
function validarDatosMedico() {
    let datosValidos = validarDatosUsuario();
    const arregloInputsMedico = [inpCedula, selectEspecialidad, inpDireccion];

    for (let i = 0; i < arregloInputsMedico.length; i++) {
        const inp = arregloInputsMedico[i];
        if (!inp) continue;
        const valor = inp.value;

        // Revisa campos obligatorios de médico vacíos
        if (valor == null || valor.trim().length <= 0) {
            inp.style.border = "2px solid red";

            if (inp.tagName !== "SELECT") {
                inp.value = "";
            }

            if (inp === inpCedula) {
                inp.placeholder = "Error: ingresa tu cédula profesional";
            } else if (inp === selectEspecialidad) {
                inp.title = "Error: selecciona una especialidad";
            } else if (inp === inpDireccion) {
                inp.placeholder = "Error: ingresa la dirección del consultorio";
            }

            datosValidos = false;
        } else {
            // Valida formato de cédula, especialidad y longitud mínima de dirección
            if (inp === inpCedula) {
                if (!/^[0-9]{4,15}$/.test(valor.trim())) {
                    inp.style.border = "2px solid red";
                    inp.value = "";
                    inp.placeholder = "Solo números en la cédula profesional";
                    datosValidos = false;
                } else {
                    inp.style.border = "2px solid blue";
                }
            } else if (inp === selectEspecialidad) {
                inp.style.border = "2px solid blue";
            } else if (inp === inpDireccion) {
                if (valor.trim().length < 5) {
                    inp.style.border = "2px solid red";
                    inp.value = "";
                    inp.placeholder = "Ingresa una dirección válida";
                    datosValidos = false;
                } else {
                    inp.style.border = "2px solid blue";
                }
            }
        }
    }

    return datosValidos;
}

// ==================== METODOS DE SOLICITUD ====================

/**
 * Envía el payload de registro de paciente/usuario al endpoint de usuarios y redirige al login si tiene éxito.
 */
async function solicitudRegistroUsuario() {
    const payload = {
        nombre: inpNombre ? inpNombre.value.trim() : "",
        correo: inpCorreo ? inpCorreo.value.trim() : "",
        contrasena: inpPsw ? inpPsw.value : "",
        telefono: inpTelefono ? inpTelefono.value.trim() : "",
        rol: "paciente"
    };

    try {
        const response = await fetch("http://localhost:8081/api/usuarios/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const resultado = await response.json();

        if (response.ok && resultado.ok) {
            alert(resultado.mensaje || "Usuario registrado exitosamente.");
            window.location.href = "index.html";
        } else {
            alert(resultado.mensaje || "El usuario no pudo registrarse");
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("El usuario no pudo registrarse");
    }
}

/**
 * Envía el payload de registro de médico (incluyendo cédula, especialidad y dirección) al backend.
 */
async function solicitudRegistroMedico() {
    const payload = {
        nombre: inpNombre ? inpNombre.value.trim() : "",
        correo: inpCorreo ? inpCorreo.value.trim() : "",
        contrasena: inpPsw ? inpPsw.value : "",
        telefono: inpTelefono ? inpTelefono.value.trim() : "",
        rol: "medico",
        cedula: inpCedula ? inpCedula.value.trim() : "",
        especialidad: selectEspecialidad ? selectEspecialidad.value : "",
        direccion: inpDireccion ? inpDireccion.value.trim() : ""
    };

    try {
        const response = await fetch("http://localhost:8081/api/medicos/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const resultado = await response.json();

        if (response.ok && resultado.ok) {
            alert(resultado.mensaje || "Médico registrado exitosamente.");
            window.location.href = "index.html";
        } else {
            alert(resultado.mensaje || "El médico no pudo registrarse");
        }
    } catch (error) {
        console.error("Error al registrar médico:", error);
        alert("El médico no pudo registrarse");
    }
}

/**
 * Valida los datos de usuario y, si son correctos, dispara la petición de registro.
 */
function registrarUsuario() {
    const esValido = validarDatosUsuario();
    if (esValido) {
        solicitudRegistroUsuario();
    }
}

/**
 * Valida los datos de médico y, si son correctos, dispara la petición de registro.
 */
function registrarMedico() {
    const esValido = validarDatosMedico();
    if (esValido) {
        solicitudRegistroMedico();
    }
}