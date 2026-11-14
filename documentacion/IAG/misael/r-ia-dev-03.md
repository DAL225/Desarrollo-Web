# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  13/11/2026
**Número de reporte:** 03

---

# 1. Breve descripción de uso

Reestructuracion entidad resena y derivados tras integracion de Service.

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | Gemini
Modelo/temperatura | Modelos de Gemini 3
Prompt original | [prompt_1](#prompt_1) 
Respuesta de IA | [respuesta_1](#respuesta_1)
Código anterior | Commit (12d57ae)
Código posterior | Commit (a9ac8e7)
Diferencias entre versiones | 
19      16      backend/pom.xml
17      0       backend/src/main/java/mx/uv/medlink/backend/IResena.java
2       0       backend/src/main/java/mx/uv/medlink/backend/Medico.java
22      211     backend/src/main/java/mx/uv/medlink/backend/MedicoControlador.java
0       47      backend/src/main/java/mx/uv/medlink/backend/MedicoService.java
102     0       backend/src/main/java/mx/uv/medlink/backend/Resena.java
94      0       backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java
80      0       backend/src/main/java/mx/uv/medlink/backend/ResenaService.java
67      222     backend/src/main/java/mx/uv/medlink/backend/UsuarioControlador.java
0       67      backend/src/main/java/mx/uv/medlink/backend/UsuarioService.java
8       25      documentacion/IAG/cesar/r-ia-dev-01.md
3       3       documentacion/IAG/cesar/r-ia-doc-01.md 
git diff --numstat 48d2b5d 0897eez (copiar la salida)
Prueba de funcionamiento | No aplica
Código de uso | Modificación  
Reflexión del estudiante | Reestructuracion de entidad de Resena y sus derivados. Correcta integracion y buena practica de separacion de responsabilidades en capas sobre un entorno de software.


> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
en un proyecto de jpa, java, spring boot, implementare la clase de services a estas clases: package mx.uv.medlink.backend;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;

@Entity
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Es mejor IDENTITY para auto-incrementables en MySQL/PostgreSQL
    private Integer id_resena;

    // Relación Many-to-One con la entidad Medico, multiples resenas a un medico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    // Relación Many-to-One con la entidad Usuario, multiples resenas por parte de
    // un usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Min(value = 1, message = "La calificacion minima es 1")
    @Max(value = 10, message = "La calificacion maxima es 10")
    @Column(nullable = false)
    private Integer calificacion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    private LocalDate fecha;

    // Constructor parametrizado
    public Resena(Medico medico,
            Usuario usuario,
            Integer calificacion,
            String comentario,
            LocalDate fecha) {

        this.medico = medico;
        this.usuario = usuario;
        this.calificacion = calificacion;
        this.comentario = comentario;
        this.fecha = fecha;
    }

    // Constructor vacio/por defecto
    public Resena() {
    }

    // Getters y Setters
    public Integer getId_resena() {
        return id_resena;
    }

    public void setId_resena(Integer id_resena) {
        this.id_resena = id_resena;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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
}, package mx.uv.medlink.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import mx.uv.medlink.backend.IResena;
import mx.uv.medlink.backend.Resena;

@CrossOrigin(origins = "*")
@RestController // paradigna, consiste en hacer peticiones http, a traves de los verbos
public class ResenaControlador {

    // Propiedad que hara uso del CRUD, Repository
    @Autowired
    private IResena iresena;

    /**
     * Obtener todas las resenas correspondientes a un medico
     * 
     * @param idMedico Identificador unico del medico del cual se solicitan sus
     *                 resenas.
     * @return Map de info para tratamiento en el frontend, estado de la respuesta,
     *         mensaje y datos.
     */
    @GetMapping("/api/resenas/medico/{idMedico}")
    public Map<String, Object> obtenerResenasMedico(@PathVariable("idMedico") Integer idMedico) {
        try {
            // Obtiene de la BD, todas las resenas
            Iterable<Resena> resenas = iresena.findAll();

            // Si no se obtiene nada de la BD
            if (!resenas.iterator().hasNext()) {
                return Map.of(
                        "ok", true,
                        "message", "No hay resenas publicadas",
                        "data", resenas);
            }

            // Filtrado de las resenas por medico
            List<Resena> resenasFiltradas = StreamSupport
                    .stream(resenas.spliterator(), false)
                    .filter(r -> r.getMedico().getIdMedico() == idMedico)
                    .collect(Collectors.toList());

            // Si no hay resenas para ese medico
            if (resenasFiltradas.isEmpty()) {
                return Map.of(
                        "ok", true,
                        "message", "No hay resenas publicadas",
                        "data", resenasFiltradas);
            }

            // Resenas correspondientes al medico
            return Map.of(
                    "ok", true,
                    "message", "Resenas encontradas",
                    "data", resenasFiltradas);

            // En caso de error
        } catch (Exception e) {
            System.out.println("Error en la BD " + e.getMessage());
            return Map.of(
                    "ok", false,
                    "message", "Error en la BD",
                    "data", null);
        }

    }

    // Agregar una nueva resena para un medico

    /**
     * 
     * @param resena
     * @return Map de info para tratamiento en el frontend, estado de la respuesta,
     *         mensaje y renena construida en la BD.
     */
    @PostMapping("/api/resenas")
    public Map<String, Object> guardarResena(@RequestBody Resena resena) {

        try {

            //Evaluar permitir resena
            if(!permitirResena(resena.getMedico().getIdMedico(), resena.getUsuario().getIdUsuario())){
                return Map.of(
                    "ok", false,
                    "message", "Solo se puede emitir una Resena por cita atendida, con el respectivo medico",
                    "data", null);

            }

            // Crear la resena
            Resena resenaObj = new Resena(
                    resena.getMedico(),
                    resena.getUsuario(),
                    resena.getCalificacion(),
                    resena.getComentario(),
                    resena.getFecha());

            // Guardar en la BD
            Resena resenaGuardada = iresena.save(resenaObj);

            // Resena guardada correctamente
            return Map.of(
                    "ok", true,
                    "message", "Resena guardada correctamente",
                    "data", resenaGuardada);

        } catch (Exception e) {

            System.out.println("Error al guardar la resena: " + e.getMessage());
            return Map.of(
                    "ok", false,
                    "message", "Error al guardar la resena",
                    "data", null);
        }
    }

    private Boolean permitirResena(Integer idMedico, Integer idUsuario){
        try {

            //Obtener las citas
            //Comparar ids medico y usuario y que las citas sean atendidas 
            //Obtener todas las resenas y contarlas
            //comparar la cantidad de resenas sea menor a la cantidad de citas ATENDIDAS

            return true;
            
        } catch (Exception e) {
            System.out.println("Error " + e.getMessage());
            return false;
        }

    }

}
 ,,package mx.uv.medlink.backend;

import org.springframework.data.repository.CrudRepository;

public interface IResena extends CrudRepository<Resena, Integer> {
    
}

## respuesta_1
¡Claro! En tu proyecto **MedLink**, lo recomendable es incorporar una capa `Service` para separar la lógica de negocio de las peticiones HTTP.

Actualmente tienes esta estructura:

- `Resena`: entidad JPA que representa una reseña.
- `IResena`: repositorio que permite realizar operaciones CRUD.
- `ResenaControlador`: recibe las peticiones HTTP y ejecuta directamente las operaciones del repositorio.

Al incorporar `Service`, la estructura quedaría así:

**ResenaControlador**

Recibe las peticiones HTTP

**ResenaService**

Contiene la lógica de negocio

**IResena**

Accede a la base de datos

**Base de datos**

Almacena las reseñas

## **1. Crear el repositorio IResena**

Primero, podemos aprovechar Spring Data JPA para filtrar las reseñas directamente desde la base de datos, sin tener que recuperar todas y después filtrarlas con `StreamSupport`.

Tu interfaz quedaría así:

```

package mx.uv.medlink.backend;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface IResena extends CrudRepository<Resena, Integer> {

    // Obtener las reseñas correspondientes a un médico
    List<Resena> findByMedico_IdMedico(Integer idMedico);

}

```

Spring Data JPA interpreta el nombre del método y genera automáticamente la consulta utilizando la propiedad `idMedico` de la entidad `Medico`.

## **2. Crear la clase ResenaService**

Esta clase será responsable de ejecutar las operaciones relacionadas con las reseñas.

```

package mx.uv.medlink.backend;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private IResena iresena;

    /**
     * Obtener todas las reseñas de un médico.
     *
     * @param idMedico identificador del médico.
     * @return lista de reseñas.
     */
    public List<Resena> obtenerResenasMedico(Integer idMedico) {

        return iresena.findByMedico_IdMedico(idMedico);

    }

    /**
     * Guardar una nueva reseña.
     *
     * @param resena objeto con la información de la reseña.
     * @return reseña guardada.
     */
    public Resena guardarResena(Resena resena) {

        return iresena.save(resena);

    }

}

```

Por ahora, esta es la implementación básica. Todavía falta incorporar tu regla de negocio para permitir que un usuario publique una reseña únicamente cuando tenga una cita atendida con ese médico.

## **3. Modificar ResenaControlador**

Ahora el controlador ya no necesita conocer directamente el repositorio `IResena`. En su lugar, utilizará `ResenaService`.

La idea es que el controlador se encargue de recibir los datos, llamar al servicio y devolver la respuesta al frontend.

```

package mx.uv.medlink.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
public class ResenaControlador {

    @Autowired
    private ResenaService resenaService;

    /**
     * Obtener las reseñas correspondientes a un médico.
     */
    @GetMapping("/api/resenas/medico/{idMedico}")
    public Map<String, Object> obtenerResenasMedico(
            @PathVariable("idMedico") Integer idMedico) {

        try {

            List<Resena> resenas = resenaService.obtenerResenasMedico(idMedico);

            if (resenas.isEmpty()) {
                return respuesta(
                        true,
                        "No hay resenas publicadas",
                        resenas);
            }

            return respuesta(
                    true,
                    "Resenas encontradas",
                    resenas);

        } catch (Exception e) {

            System.out.println("Error al obtener resenas: " + e.getMessage());

            return respuesta(
                    false,
                    "Error al consultar las resenas",
                    null);
        }
    }

    /**
     * Guardar una nueva reseña.
     */
    @PostMapping("/api/resenas")
    public Map<String, Object> guardarResena(@RequestBody Resena resena) {

        try {

            Resena resenaGuardada = resenaService.guardarResena(resena);

            return respuesta(
                    true,
                    "Resena guardada correctamente",
                    resenaGuardada);

        } catch (Exception e) {

            System.out.println("Error al guardar la resena: " + e.getMessage());

            return respuesta(
                    false,
                    "Error al guardar la resena",
                    null);
        }
    }

    /**
     * Construir la respuesta para el frontend.
     */
    private Map<String, Object> respuesta(
            Boolean ok,
            String message,
            Object data) {

        Map<String, Object> resultado = new HashMap<>();

        resultado.put("ok", ok);
        resultado.put("message", message);
        resultado.put("data", data);

        return resultado;
    }

}

```

**Una observación:** utilicé `HashMap` para construir las respuestas porque `Map.of()` no admite valores `null`. En tu código original, cuando devolvías `"data", null`, podía producirse otra excepción.

## **4. ¿Qué falta implementar en ResenaService?**

Hay una parte importante de tu controlador original que todavía no hemos trasladado:

```
private Boolean permitirResena(Integer idMedico, Integer idUsuario)
```

Esta función contiene una regla de negocio:

1. Obtener las citas del usuario.
2. Identificar las citas correspondientes al médico.
3. Comprobar cuáles tienen estado `ATENDIDA`.
4. Consultar las reseñas que ya publicó ese usuario para ese médico.
5. Comprobar que no haya excedido la cantidad de reseñas permitidas.

Esta lógica debe estar en `ResenaService`, no en el controlador.

**Necesito que me compartas las siguientes clases para implementar correctamente esa parte:**

- `Cita`: tu entidad que representa las citas médicas.
- `ICita`: tu repositorio de citas.

Así podemos implementar `permitirResena()` utilizando las relaciones JPA y las consultas de Spring Data, evitando recuperar todos los registros de la base de datos innecesariamente.

También podremos dejar el método `guardarResena()` completo, con la validación antes de guardar.

*Por ahora, el método de guardado que te mostré es básico: todavía no aplica la restricción de una reseña por cita atendida.*

## Observaciones adicionales

Durante este commit se mezclo con la version de otro companero, lo cual la salida de la diferencia de commits marca cambios sobre medicos y usuarios.
