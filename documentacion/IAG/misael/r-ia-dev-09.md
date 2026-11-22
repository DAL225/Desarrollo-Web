# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  22/11/2026
**Número de reporte:** 09

---

# 1. Breve descripción de uso

Correcciones a backend y nuevo endpoint

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | Gemini
Modelo/temperatura | Modelo gratuito(por defecto)
Prompt original | [prompt_1](#prompt_1) 
Respuesta de IA | [respuesta_1](#respuesta_1)
Código anterior | Commit (d65e4b8)
Código posterior | Commit (928cdae)
Diferencias entre versiones | 
0       5       backend/pom.xml
9       13      backend/src/main/java/mx/uv/medlink/backend/Cita.java
3       132     backend/src/main/java/mx/uv/medlink/backend/CitaControlador.java
2       75      backend/src/main/java/mx/uv/medlink/backend/CitaService.java
0       21      backend/src/main/java/mx/uv/medlink/backend/ContactoControlador.java
0       3       backend/src/main/java/mx/uv/medlink/backend/IUsuario.java
47      181     backend/src/main/java/mx/uv/medlink/backend/MedicoControlador.java
4       10      backend/src/main/java/mx/uv/medlink/backend/MedicoService.java
1       4       backend/src/main/java/mx/uv/medlink/backend/Receta.java
2       111     backend/src/main/java/mx/uv/medlink/backend/RecetaControlador.java
2       48      backend/src/main/java/mx/uv/medlink/backend/RecetaService.java
1       14      backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java
1       1       backend/src/main/java/mx/uv/medlink/backend/ResenaDTO.java
90      158     backend/src/main/java/mx/uv/medlink/backend/UsuarioControlador.java
8       38      backend/src/main/java/mx/uv/medlink/backend/UsuarioService.java
0       24      backend/src/main/java/mx/uv/medlink/backend/WebConfig.java
0       11      backend/src/main/resources/templates/contacto.html
0       187     documentacion/IAG/cesar/r-ia-dev-02.md
0       131     documentacion/IAG/cesar/r-ia-doc-02.md
0       79      documentacion/IAG/diego/r-ia-dev-01.md
0       90      documentacion/r-act-04.md
0       23      frontend/contacto.html
0       27      frontend/css/contacto.css
5       30      frontend/css/medico.css
14      96      frontend/css/paciente.css
6       6       frontend/index.html
68      243     frontend/js/citas.js
117     0       frontend/js/comun.js
0       29      frontend/js/contacto.js
46      127     frontend/js/login.js
51      162     frontend/js/medico.js
106     273     frontend/js/paciente.js
80      302     frontend/js/recetas.js
0       275     frontend/js/registro.js
56      171     frontend/js/resenas.js
25      31      frontend/medico.html
79      62      frontend/paciente.html
2       5       frontend/registro.html

git diff --numstat 48d2b5d 0897eez (copiar la salida)
Prueba de funcionamiento |
Frontend funcional
Código de uso | Modificacion / Depuracion  
Reflexión del estudiante | Actualizacion en backend. Tras mostrar errores en frontend por marcado de citas y recetas en logica de negocio, se consulto con IA, la causa identificando la necesidad de un endpoint no contemplado.

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Tengo detalle en cuanto a las citas, las reseñas y las recetas. Cuando marco como médico una cita como atendida, el mensaje me muestra que ya se marcó, pero en el frontend me sigue apareciendo la opción de marcar como atendida. Refresco la página y me sigue de igual manera y no se guardan los cambios en la base de datos ni me marca ningún error tanto ni en el servidor como en el frontend. O sea, lo funciona como si sí se actualizara, pero en realidad no. Cuando doy la opción de dejar una reseña, tampoco se guarda la reseña.

## respuesta_1
Lo que describes ocurre porque en el código actual **ambas acciones solo actualizan el estado en memoria o muestran el mensaje de éxito sin hacer una petición real (`fetch`) al backend para persistir en PostgreSQL**. Al refrescar la página, el frontend vuelve a consultar la base de datos y trae los datos sin cambios.

---

### 1. Por qué al marcar una cita como `ATENDIDA` no se guarda en la BD

En `citas.js`, `cambiarEstadoCita(id, nuevo)` solo mostraba el mensaje y llamaba a `cargarAgenda()`, sin llamar a ningún endpoint del backend. Además, en la tabla de endpoints definida (`image_9b3062.png`) no hay un endpoint específico para cambiar libremente el estado a `ATENDIDA` o `CANCELADA` (en `RecetaService` anterior, la cita pasaba a `ATENDIDA` al emitir la receta).

**Opciones para resolverlo:**

* **Opción A (Apegada a los endpoints ya definidos):** Que la cita pase a `ATENDIDA` cuando el médico emite su receta (`POST /api/recetas`), o agregar un endpoint en `CitaControlador` (por ejemplo `PUT /api/citas/{idCita}/estado`) si necesitas cambiar el estado antes de emitir la receta.
* **Opción B (Si agregas `PUT /api/citas/{idCita}/estado` en `CitaControlador`):**

En `CitaControlador.java`:

```java
@PutMapping("/{idCita}/estado")
public ResponseEntity<?> cambiarEstadoCita(@PathVariable String idCita, @RequestBody Map<String, Object> payload) {
    try {
        int idCitaInt = Integer.parseInt(idCita);
        String nuevoEstadoStr = payload.get("estado").toString().toUpperCase();
        Cita.estado nuevoEstado = Cita.estado.valueOf(nuevoEstadoStr);

        Cita cita = citaService.obtenerCitaPorId(idCitaInt);
        if (cita == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cita no encontrada.");
        }

        cita.setEstado(nuevoEstado);
        Cita actualizada = citaService.guardarCita(cita); // icita.save(cita) en CitaService
        return ResponseEntity.ok(actualizada);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Estado o identificador inválido.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el estado.");
    }
}

```

Y en `citas.js`, conectar `cambiarEstadoCita` con `fetch`:

```javascript
async function cambiarEstadoCita(idCita, nuevoEstado) {
  try {
    const respuesta = await fetch(`${API_CITAS}/${idCita}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!respuesta.ok) {
      const msg = await respuesta.text();
      throw new Error(msg || `Error HTTP: ${respuesta.status}`);
    }

    mensajeCita("Cita " + (nuevoEstado === "ATENDIDA" ? "atendida" : "cancelada"));
    if (typeof cargarAgenda === "function") {
      await cargarAgenda();
    }
  } catch (error) {
    console.error("Error al cambiar estado de la cita:", error);
    mensajeCita("No se pudo actualizar el estado de la cita en el servidor.");
  }
}

```

---

### 2. Por qué al dejar una reseña no se guarda

En `resenas.js` (`cita y receta_2.txt`), el evento `submit` de `#form-resena` nunca hace un `fetch(..., { method: "POST", ... })` hacia el backend; solo simula el guardado y muestra `"Reseña enviada con éxito"`.

Para que se guarde en la base de datos, conéctalo a tu endpoint `POST` de reseñas (verifica si en tu backend la ruta es `/api/resenas` y qué campos espera tu entidad/DTO de `Resena`, como `calificacion`, `comentario`, `idMedico`, `idUsuario` o `idCita`):

```javascript
const formResena = document.getElementById("form-resena");
if (formResena) {
  formResena.addEventListener("submit", async (e) => {
    e.preventDefault();
    const sesion = getSesionResenas();
    if (!sesion || !citaActualResena) return;

    const calificacion = parseInt(document.getElementById("calificacion").value, 10);
    const comentario = document.getElementById("comentario").value.trim();
    const idMedico = citaActualResena.medico?.idMedico ?? citaActualResena.idMedico;
    const idCita = citaActualResena.idCita ?? citaActualResena.id;

    if (!comentario) {
      alert("Escribe un comentario antes de enviar la reseña.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:8081/api/resenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calificacion,
          comentario,
          idMedico,
          idUsuario: sesion.id,
          idCita,
          fecha: new Date().toISOString().slice(0, 10)
        })
      });

      if (!respuesta.ok) {
        const errorTexto = await respuesta.text();
        throw new Error(errorTexto || `Error HTTP: ${respuesta.status}`);
      }

      cerrarModalesLocal();
      alert("Reseña enviada con éxito");
      if (typeof cargarCitas === "function") {
        await cargarCitas();
      }
    } catch (error) {
      console.error("Error al guardar reseña:", error);
      alert("No se pudo guardar la reseña en el servidor.");
    }
  });
}

```

---

### 3. Revisa también el flujo de `recetas.js`

En `medico.js` anterior, al renderizar cada cita `ATENDIDA`, se insertaba `JSON.stringify(c)` dentro de un atributo `onclick='abrirEmisionReceta(...)'` en HTML: si algún campo de texto de `c` tiene comillas simples o saltos de línea, puede romper el HTML generado. Es más seguro guardar las citas de la agenda en un arreglo en memoria (ej. `let agendaCache = []`) y pasar solo el `idCita` al `onclick` (`abrirEmisionRecetaPorId(${idCita})`), buscando la cita en `agendaCache`.

¿Cuál es exactamente el endpoint `POST` y los campos que espera tu backend para **reseñas**, y qué detalle específico te está fallando en **recetas**?



## Observaciones adicionales

Se muestra una gran diferencia entre versiones debido a que localmente se modificaron y mezclaron los cambios realizados por compañeros desde la ultima vez que el repositorio local estuvo en sincronia con el de github