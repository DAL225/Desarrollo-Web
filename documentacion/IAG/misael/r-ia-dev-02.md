# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  13/11/2026
**Número de reporte:** 02

---

# 1. Breve descripción de uso

Revision de error de compilacion

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
Reflexión del estudiante | Explicacion del error de compilacion. Lectura de errores de compilacion.


> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Error de compilación: [INFO] -----------------------< mx.uv.medlink:backend >------------------------
[INFO] Building  0.0.1-SNAPSHOT
[INFO]   from pom.xml
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] >>> spring-boot:4.1.2:run (default-cli) > test-compile @ backend >>>
[INFO]
[INFO] --- resources:3.5.0:resources (default-resources) @ backend ---
[INFO] Copying 1 resource from src/main/resources to target/classes
[INFO] Copying 0 resource from src/main/resources to target/classes
[INFO]
[INFO] --- compiler:3.15.0:compile (default-compile) @ backend ---
[INFO] Recompiling the module because of changed source code.
[INFO] Compiling 10 source files with javac [debug parameters release 17] to target/classes
[INFO] -------------------------------------------------------------
[ERROR] COMPILATION ERROR :
[INFO] -------------------------------------------------------------
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[4,38] package jakarta.validation.constraints does not exist
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[5,38] package jakarta.validation.constraints does not exist
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[26,6] cannot find symbol
  symbol:   class Min
  location: class mx.uv.medlink.backend.Resena
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[27,6] cannot find symbol
  symbol:   class Max
  location: class mx.uv.medlink.backend.Resena
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[53,47] cannot find symbol
  symbol:   method getId()
  location: class mx.uv.medlink.backend.Medico
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[95,50] cannot find symbol
  symbol:   method getId_medico()
  location: class mx.uv.medlink.backend.Medico
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[95,86] cannot find symbol
  symbol:   method getId_usuario()
  location: class mx.uv.medlink.backend.Usuario
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[112,37] cannot find symbol
  symbol:   variable iiresena
  location: class mx.uv.medlink.backend.ResenaControlador
[INFO] 8 errors
[INFO] -------------------------------------------------------------
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  10.564 s
[INFO] Finished at: 2026-11-12T02:57:36-06:00
[INFO] ------------------------------------------------------------------------
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.15.0:compile (default-compile) on project backend: Compilation failure: Compilation failure:
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[4,38] package jakarta.validation.constraints does not exist
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[5,38] package jakarta.validation.constraints does not exist
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[26,6] cannot find symbol
[ERROR]   symbol:   class Min
[ERROR]   location: class mx.uv.medlink.backend.Resena
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/Resena.java:[27,6] cannot find symbol
[ERROR]   symbol:   class Max
[ERROR]   location: class mx.uv.medlink.backend.Resena
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[53,47] cannot find symbol
[ERROR]   symbol:   method getId()
[ERROR]   location: class mx.uv.medlink.backend.Medico
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[95,50] cannot find symbol
[ERROR]   symbol:   method getId_medico()
[ERROR]   location: class mx.uv.medlink.backend.Medico
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[95,86] cannot find symbol
[ERROR]   symbol:   method getId_usuario()
[ERROR]   location: class mx.uv.medlink.backend.Usuario
[ERROR] /home/amiss/temp/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/ResenaControlador.java:[112,37] cannot find symbol
[ERROR]   symbol:   variable iiresena
[ERROR]   location: class mx.uv.medlink.backend.ResenaControlador
[ERROR] -> [Help 1]
[ERROR]
[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
[ERROR] Re-run Maven using the -X switch to enable full debug logging.
[ERROR]
[ERROR] For more information about the errors and possible solutions, please read the following articles:
[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException
amiss@AngelMisael:~/temp/Desarrollo-Web/backend$


## respuesta_1

El error de compilación se debe a dos problemas principales en tu proyecto de Spring Boot: falta una dependencia en el `pom.xml` y hay errores de nombres de métodos o variables en tus clases `Resena`, `Medico`, `Usuario` y `ResenaControlador`.

Aquí tienes el desglose de los errores y cómo solucionarlos paso a paso:

---

### 1. Falta la dependencia de validación (`jakarta.validation.constraints`)

Los errores en `Resena.java` ocurren porque estás intentando usar anotaciones como `@Min` y `@Max`, pero el paquete de validación no está incluido en las dependencias de tu `pom.xml`.

**Solución:**
Agrega la siguiente dependencia dentro de la sección `<dependencies>` de tu archivo `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

```

---

### 2. Métodos no encontrados en `Medico`, `Usuario` y error de variable en `ResenaControlador`

Los demás errores indican que estás llamando a métodos o variables que no existen en tus modelos (`Medico`, `Usuario`, `Resena` o `ResenaControlador`):

* **`cannot find symbol method getId()` / `getId_medico()` en `Medico**`: Revisa tu clase `Medico.java`. Asegúrate de que los métodos para obtener el identificador se llamen correctamente (por ejemplo, si el atributo se llama `id`, el método debe ser `getId()`; si se llama `idMedico`, debe ser `getIdMedico()`).
* **`cannot find symbol method getId_usuario()` en `Usuario**`: Lo mismo aplica para `Usuario.java`. Revisa si el método es `getId()` o `getIdUsuario()`.
* **`cannot find symbol variable iiresena` en `ResenaControlador**`: Tienes un error tipográfico en la línea 112 de `ResenaControlador.java`. Probablemente escribiste `iiresena` en lugar de `resena` o el nombre correcto de tu variable.

---

### Pasos siguientes para aplicar los cambios:

1. Modifica tu archivo `pom.xml` agregando `spring-boot-starter-validation`.
2. Corrige los nombres de los métodos/variables en tus clases de modelo y controlador.
3. Vuelve a compilar y ejecutar el proyecto con Maven limpiando la caché de compilación:

```bash
mvn clean spring-boot:run

```


## Observaciones adicionales

Durante este commit se mezclo con la version de otro companero, lo cual la salida de la diferencia de commits marca cambios sobre medicos y usuarios.
