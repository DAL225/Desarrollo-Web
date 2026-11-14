# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  13/11/2026
**Número de reporte:** 01

---

# 1. Breve descripción de uso

Reesreucturacion clase Resena.java.

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
Código de uso | Modificación / Depuración 
Reflexión del estudiante | Reestructuracion de la clase Resena. Aprendizaje correcta nomenclatura para JPA.


> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Esta bien?
package mx.uv.medlink.backend;

import java.time.LocalDate;

@Entity
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id_resena;

    @ManyToOne 
    private Integer id_medico;

    private Integer id_usuario;

    private Integer calificacion;

    private String comentario;

    private LocalDate fecha;

    public Resena () {}

    

    
}

## respuesta_1
Tu entidad `Resena` tiene algunos detalles importantes que corregir para que funcione correctamente con JPA y el mapeo de relaciones que conversamos.

Actualmente, tienes campos como `id_medico` e `id_usuario` tipados como `Integer`, pero al usar JPA **no debes mapear las llaves foráneas como simples números primitivos o wrappers**, sino como los **objetos de las entidades relacionadas** (`Medico` y `Usuario`), usando las anotaciones `@ManyToOne`.

Aquí tienes la versión corregida y optimizada de tu entidad `Resena`:

```java
package mx.uv.medlink.backend;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "resenas")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Es mejor IDENTITY para auto-incrementables en MySQL/PostgreSQL
    private Integer id_resena;

    // Relación Many-to-One con la entidad Medico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    // Relación Many-to-One con la entidad Usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private Integer calificacion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    private LocalDate fecha;

    public Resena() {}

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
}

```

### ¿Qué cambios clave se realizaron?

1. **Sustitución de IDs por Objetos:**
* Se cambió `private Integer id_medico;` por `private Medico medico;` con su respectivo `@ManyToOne` y `@JoinColumn(name = "id_medico")`. JPA se encargará automáticamente de extraer el ID de la entidad `Medico` al guardar en la base de datos.
* Se hizo el mismo cambio para el usuario.


2. **Estrategia de Generación (`GenerationType.IDENTITY`):**
* Se cambió `GenerationType.AUTO` por `GenerationType.IDENTITY`. `AUTO` le deja la decisión a Hibernate según el motor de base de datos, lo cual a veces genera tablas de secuencias innecesarias; `IDENTITY` es la opción estándar y más segura para IDs auto-incrementables.


3. **Anotación `@JoinColumn` y `nullable = false`:**
* Asegura que en la base de datos las columnas de la llave foránea no acepten valores nulos, ya que una reseña obligatoriamente debe estar asociada a un médico y a un usuario.


4. **`FetchType.LAZY`:**
* Se añadió para optimizar el rendimiento, indicando que los datos del médico o del usuario solo se consultarán de la base de datos cuando realmente los mandes llamar.


---

## Observaciones adicionales

Durante este commit se mezclo con la version de otro companero, lo cual la salida de la diferencia de commits marca cambios sobre medicos y usuarios.
