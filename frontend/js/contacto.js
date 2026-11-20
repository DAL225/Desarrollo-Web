async function cargarContacto() {
  const contenedor = document.getElementById("seccion-contacto");
  if (!contenedor) return;

  try {
    const respuesta = await fetch("http://localhost:8081/api/contacto");
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const html = await respuesta.text();

    // Si el backend devuelve un documento HTML completo, extraemos su body o tarjeta;
    // si devuelve solo el fragmento, también funciona.
    const doc = new DOMParser().parseFromString(html, "text/html");
    const contenido = doc.querySelector(".tarjeta-contacto") || doc.body;

    contenedor.innerHTML = contenido.innerHTML;
  } catch (error) {
    console.error("Error al obtener contacto:", error);
    contenedor.innerHTML = "<p class=\"error\">No se pudo cargar la información del administrador.</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarContacto);