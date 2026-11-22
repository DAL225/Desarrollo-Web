// Obtiene el HTML de contacto desde el backend e inserta la tarjeta o el body dentro de #seccion-contacto
async function cargarContacto() {
  const contenedor = document.getElementById("seccion-contacto");
  if (!contenedor) return; // Sale si la vista actual no tiene la sección de contacto

  try {
    const respuesta = await fetch("http://localhost:8081/api/contacto");
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const html = await respuesta.text();

    // Parsea el texto HTML para poder consultar selectores del DOM de forma segura
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Prioriza .tarjeta-contacto; si no existe, toma todo el <body>
    const contenido = doc.querySelector(".tarjeta-contacto") || doc.body;

    // Inserta el fragmento dentro del contenedor destino
    contenedor.innerHTML = contenido.innerHTML;
  } catch (error) {
    console.error("Error al obtener contacto:", error);
    // Muestra un mensaje de respaldo en la UI si falla la petición o el parseo
    contenedor.innerHTML = "<p class=\"error\">No se pudo cargar la información del administrador.</p>";
  }
}

// Ejecuta la carga automáticamente cuando el DOM está listo para manipularse
document.addEventListener("DOMContentLoaded", cargarContacto);