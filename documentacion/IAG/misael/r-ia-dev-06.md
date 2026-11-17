# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  16/11/2026
**Número de reporte:** 06

---

# 1. Breve descripción de uso

Correcta implementacion de PUT para resena

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | Chat GPT
Modelo/temperatura | Modelo gratuito(por defecto)
Prompt original | [prompt_1](#prompt_1) 
Respuesta de IA | [respuesta_1](#respuesta_1)
Código anterior | Commit (947b9b8)
Código posterior | Commit (6a39eac)
Diferencias entre versiones | 
```
20      0       backend/src/main/java/mx/uv/medlink/backend/ActualizarResenaDTO.java
16      0       backend/src/main/java/mx/uv/medlink/backend/Resena.java
37      4       backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java
67      0       backend/src/main/java/mx/uv/medlink/backend/ResenaDTO.java
91      65      backend/src/main/java/mx/uv/medlink/backend/ResenaService.java
```
git diff --numstat 48d2b5d 0897eez (copiar la salida)
Prueba de funcionamiento |
```
curl -X PUT "http://localhost:8081/api/resenas/1" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "comentario": "Excelente atención, el médico fue muy amable y profesional."
}'
```
Código de uso | Pruebas / Modificacion / Depuracion  
Reflexión del estudiante | Creacion de comandos de prueba y actualizacion para DTO de peticiones. La importancia de las pruebas unitarias en cada entidad ademas de la nomenclatura, utilizando un correcto manejo de la informacion de las peticiones.

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
como implementar un put? en todo caso solo podria actualizar el comentario?

## respuesta_1
¡Exactamente! Para MedLink, considero que lo más conveniente es permitir que una reseña únicamente pueda actualizar su **comentario**, manteniendo fija la calificación, el médico, el usuario y la fecha original.

Esto tiene sentido porque una reseña está asociada a una cita atendida y representa una experiencia del usuario. Permitir modificar la calificación o cambiar el médico podría alterar el significado de esa experiencia.

Te explico cómo implementarlo siguiendo la estructura que ya tienes.

## **1. Crear un DTO para actualizar la reseña**

Como solamente modificaremos el comentario, podemos crear un DTO pequeño.

`ActualizarResenaDTO.java`

```
package mx.uv.medlink.backend;

import jakarta.validation.constraints.NotBlank;

public class ActualizarResenaDTO {

    @NotBlank(message = "El comentario no puede estar vacío")
    private String comentario;

    public ActualizarResenaDTO() {
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
```

Utilizamos `@NotBlank` para evitar comentarios nulos, vacíos o que contengan únicamente espacios.

## **2. Implementar el método en ResenaService**

Aquí necesitamos recuperar la reseña existente mediante su identificador.

Después actualizamos exclusivamente el comentario.

Agrega este método a tu `ResenaService`:

```
/**
 * Actualizar el comentario de una reseña.
 *
 * @param idResena identificador de la reseña.
 * @param dto información con el nuevo comentario.
 * @return reseña actualizada.
 */
public Resena actualizarResena(Integer idResena, ActualizarResenaDTO dto) {

    // Buscar la reseña
    Resena resena = iresena.findById(idResena)
            .orElseThrow(() ->
                    new IllegalArgumentException("Reseña no encontrada")
            );

    // Actualizar únicamente el comentario
    resena.setComentario(dto.getComentario());

    // Guardar los cambios
    return iresena.save(resena);
}
```

**¿Por qué no construimos una nueva entidad Resena?**

Porque ya existe una reseña almacenada. Recuperamos esa misma entidad, modificamos uno de sus atributos y guardamos los cambios.

JPA identifica que es una entidad existente y actualiza su registro.

## **3. Implementar el PUT en ResenaControlador**

Agregamos el siguiente endpoint:

```
/**
 * Actualizar el comentario de una reseña.
 */
@PutMapping("/api/resenas/{idResena}")
public Map<String, Object> actualizarResena(
        @PathVariable("idResena") Integer idResena,
        @Valid @RequestBody ActualizarResenaDTO dto) {

    try {

        Resena resenaActualizada =
                resenaService.actualizarResena(idResena, dto);

        return respuesta(
                true,
                "Reseña actualizada correctamente",
                resenaActualizada
        );

    } catch (Exception e) {

        System.out.println(
                "Error al actualizar la reseña: " + e.getMessage()
        );

        return respuesta(
                false,
                e.getMessage(),
                null
        );
    }
}
```

## **4. CURL para probar el PUT**

Supongamos que queremos modificar el comentario de la reseña con identificador `1`.

```
curl -X PUT "http://localhost:8081/api/resenas/1" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "comentario": "Excelente atención, el médico fue muy amable y profesional."
}'
```

El JSON únicamente contiene el comentario.

No necesitamos enviar:

- `idMedico`.
- `idUsuario`.
- `calificacion`.
- `fecha`.

Estos datos permanecen intactos.

## **5. ¿Cómo funcionaría desde el frontend?**

Podrías implementar una función similar:

```
async function actualizarResena(idResena, comentario) {

    try {

        const respuesta = await fetch(
            `http://localhost:8081/api/resenas/${idResena}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    comentario: comentario
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(resultado.message);
        }

        console.log("Reseña actualizada:", resultado.data);

        return resultado;

    } catch (error) {

        console.error("Error al actualizar reseña:", error.message);
        throw error;
    }
}
```

## **6. Consideración importante: ¿quién puede modificar una reseña?**

Aquí hay algo que te recomiendo implementar antes de dar por terminado el PUT.

Actualmente, el servicio solamente comprueba que la reseña exista. Pero cualquier usuario que conozca el identificador podría intentar modificarla.

Lo correcto es comprobar que la reseña pertenezca al usuario que inició sesión.

Por ejemplo, podrías ampliar el servicio para recibir también `idUsuario`:

```
public Resena actualizarResena(
        Integer idResena,
        Integer idUsuario,
        ActualizarResenaDTO dto) {

    Resena resena = iresena.findById(idResena)
            .orElseThrow(() ->
                    new IllegalArgumentException("Reseña no encontrada")
            );

    if (!resena.getUsuario().getIdUsuario().equals(idUsuario)) {
        throw new IllegalArgumentException(
                "No tienes permiso para modificar esta reseña."
        );
    }

    resena.setComentario(dto.getComentario());

    return iresena.save(resena);
}
```

En producción, lo recomendable es obtener `idUsuario` del usuario autenticado mediante Spring Security, no confiar en un identificador enviado libremente por el frontend.

## **7. Así quedaría la responsabilidad de tus operaciones**

| Método HTTP | Endpoint                         | Función                         |
| ----------- | -------------------------------- | ------------------------------- |
| GET         | `/api/resenas/medico/{idMedico}` | Consultar reseñas de un médico. |
| POST        | `/api/resenas`                   | Registrar una reseña.           |
| PUT         | `/api/resenas/{idResena}`        | Actualizar el comentario.       |

**Mi recomendación para MedLink:** mantener la calificación, el médico, el usuario y la fecha como datos inmutables después de publicar la reseña. El comentario sí puede corregirse porque representa el texto que el usuario escribió, sin alterar la relación de la reseña con su experiencia médica.


## Observaciones adicionales

Se implemento un DTO para PUT, se comprobo el funcionamiento correcto.
