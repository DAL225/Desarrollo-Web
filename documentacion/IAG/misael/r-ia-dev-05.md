# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  16/11/2026
**Número de reporte:** 05

---

# 1. Breve descripción de uso

Reestructuracion de Resena para la implementacion del DTO y correcto funcionamiento de GET y POST.

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
Prueba de funcionamiento | (CURLS ACTUALIZADOS Y FUNCIONALES)
```
curl -X GET "http://localhost:8081/api/resenas/medico/52"
curl -X POST "http://localhost:8081/api/resenas" -H "Content-Type: application/json" -H "Accept: application/json" -d '{
    "idMedico": 52,
    "idUsuario": 102,
    "calificacion": 9,
    "comentario": "Excelente atención médica",
    "fecha": "2026-11-13"
}'
```
Código de uso | Pruebas / Modificacion / Depuracion  
Reflexión del estudiante | Creacion de comandos de prueba y actualizacion para DTO de peticiones. La importancia de las pruebas unitarias en cada entidad ademas de la nomenclatura, utilizando un correcto manejo de la informacion de las peticiones.

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
(Le comparti mis 4 archivos de Resena)

## respuesta_1
¡Perfecto! Ya con las cuatro clases se identifica claramente el problema y podemos corregirlo sin modificar la estructura de tus relaciones en JPA.

En tu implementación actual, el problema está en esta combinación:

```
public Map<String, Object> guardarResena(@RequestBody Resena resena)
```

Estás recibiendo directamente una entidad `Resena`. Por lo tanto, Jackson intenta construir también los objetos `Medico` y `Usuario` anidados en el JSON.

El problema es que tu entidad `Medico` tiene un constructor que exige obligatoriamente un `Usuario`. Por eso falla antes de llegar a `guardarResena()` del servicio.

**Mi recomendación es utilizar un DTO para recibir los datos y recuperar las entidades desde sus repositorios.**

Además, hay algo importante en tu lógica: quieres permitir una reseña por cada cita atendida, incluso si el usuario decide publicar varias reseñas posteriormente. Tu método `permitirResena()` ya contempla correctamente ese comportamiento, así que lo conservaremos.

## **1. Crear ResenaDTO.java**

Crea una nueva clase en el mismo paquete `mx.uv.medlink.backend`.

```

package mx.uv.medlink.backend;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ResenaDTO {

    @NotNull(message = "El médico es obligatorio")
    private Integer idMedico;

    @NotNull(message = "El usuario es obligatorio")
    private Integer idUsuario;

    @NotNull(message = "La calificación es obligatoria")
    @Min(value = 1, message = "La calificación mínima es 1")
    @Max(value = 10, message = "La calificación máxima es 10")
    private Integer calificacion;

    private String comentario;

    private LocalDate fecha;

    public ResenaDTO() {
    }

    public Integer getIdMedico() {
        return idMedico;
    }

    public void setIdMedico(Integer idMedico) {
        this.idMedico = idMedico;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}

```

Con esto, el DTO solamente recibe los identificadores y los datos de la reseña. Ya no necesita construir entidades `Medico` ni `Usuario`.

## **2. Modificar ResenaService.java**

Aquí realizaremos tres operaciones:

1. Recuperar el médico mediante su identificador.
2. Recuperar el usuario mediante su identificador.
3. Construir y guardar la reseña con las entidades recuperadas.

Agrega las dependencias de los repositorios `IMedico` e `IUsuario`.

```

package mx.uv.medlink.backend;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private IResena iresena;

    @Autowired
    private ICita icita;

    @Autowired
    private IMedico imedico;

    @Autowired
    private IUsuario iusuario;

    /**
     * Obtener todas las reseñas de un médico.
     */
    public List<Resena> obtenerResenasMedico(Integer idMedico) {

        return iresena.findByMedico_IdMedico(idMedico);
    }

    /**
     * Validar si un usuario puede publicar una reseña.
     */
    public Boolean permitirResena(Integer idMedico, Integer idUsuario) {

        long citasAtendidas = icita
                .countByMedico_IdMedicoAndUsuario_IdUsuarioAndEstado(
                        idMedico,
                        idUsuario,
                        Cita.estado.ATENDIDA
                );

        long resenasPublicadas = iresena
                .countByMedico_IdMedicoAndUsuario_IdUsuario(
                        idMedico,
                        idUsuario
                );

        return resenasPublicadas < citasAtendidas;
    }

    /**
     * Guardar una nueva reseña.
     */
    public Resena guardarResena(ResenaDTO dto) {

        // Recuperar el médico
        Medico medico = imedico.findById(dto.getIdMedico())
                .orElseThrow(() ->
                        new IllegalArgumentException("Médico no encontrado")
                );

        // Recuperar el usuario
        Usuario usuario = iusuario.findById(dto.getIdUsuario())
                .orElseThrow(() ->
                        new IllegalArgumentException("Usuario no encontrado")
                );

        // Validar que el usuario tenga citas atendidas disponibles
        if (!permitirResena(
                medico.getIdMedico(),
                usuario.getIdUsuario())) {

            throw new IllegalArgumentException(
                    "Solo se puede emitir una reseña por cita atendida con el médico."
            );
        }

        // Construir la reseña con las entidades recuperadas
        Resena resena = new Resena(
                medico,
                usuario,
                dto.getCalificacion(),
                dto.getComentario(),
                dto.getFecha()
        );

        // Guardar la reseña
        return iresena.save(resena);
    }
}

```

**Importante:** estoy suponiendo que tus interfaces de repositorio se llaman `IMedico` e `IUsuario` y que extienden `CrudRepository` o `JpaRepository`. Si tienen otros nombres, solamente ajustamos esos dos atributos.

## **3. Modificar ResenaControlador.java**

Cambia el parámetro del método POST para recibir `ResenaDTO` en lugar de `Resena`.

También agregaremos `@Valid` para aplicar las validaciones del DTO.

```

import jakarta.validation.Valid;

// ...

@PostMapping("/api/resenas")
public Map<String, Object> guardarResena(
        @Valid @RequestBody ResenaDTO dto) {

    try {

        Resena resenaGuardada = resenaService.guardarResena(dto);

        return respuesta(
                true,
                "Resena guardada correctamente",
                resenaGuardada);

    } catch (Exception e) {

        System.out.println(
                "Error al guardar la resena: " + e.getMessage()
        );

        return respuesta(
                false,
                e.getMessage(),
                null);
    }
}

```

El resto de tu controlador puede permanecer igual.

## **4. CURL actualizado para probar el POST**

Ahora el JSON ya no debe enviar objetos anidados `medico` y `usuario`, sino sus identificadores directamente.

```
curl -X POST "http://localhost:8081/api/resenas" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "idMedico": 52,
    "idUsuario": 102,
    "calificacion": 9,
    "comentario": "Excelente atención médica",
    "fecha": "2026-11-13"
}'
```

## **5. ¿Qué clases necesitamos modificar?**

| Clase                    | Modificación                                     |
| ------------------------ | ------------------------------------------------ |
| `Resena.java`            | Ninguna                                          |
| `ResenaControlador.java` | Recibir `ResenaDTO`                              |
| `ResenaService.java`     | Recuperar médico y usuario mediante repositorios |
| `IResena.java`           | Ninguna                                          |
| `ResenaDTO.java`         | Nueva clase                                      |

**Una consideración adicional:** asegúrate de tener la dependencia de validación de Spring (`spring-boot-starter-validation`) para que `@Valid`, `@NotNull`, `@Min` y `@Max` funcionen correctamente.

Con este cambio conservas tu modelo relacional, la asociación obligatoria entre médico y usuario y la regla de una reseña por cada cita atendida.

**Antes de probarlo**, me gustaría confirmar algo: ¿tus interfaces `IMedico` e `IUsuario` extienden `CrudRepository` o `JpaRepository`? Así verificamos que los métodos `findById()` sean compatibles con tu implementación.


## Observaciones adicionales

Se encontro que debia haber una reestructuracion en los archivos, respecto a la implementacion de una nueva capa DTO, para el manejo de la informacion que se recibe por parte de las peticiones(curl/frontend).
Solo se implemento en resena.
