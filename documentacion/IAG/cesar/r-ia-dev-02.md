# Reporte de IA Desarrollo en el Proyecto

**Fecha:**11/11/2026  
**Número de reporte:** 1

---

# 1. Breve descripción de uso

Aclarar dudas de diseño e implementacion de codigo

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | GEMINI
Modelo/temperatura | Gemini / 0.2
Prompt original | [prompt 1](#prompt_1)
Respuesta de IA | [respuesta 1](#respuesta_1)
Código anterior | eeb2171
Código posterior | a72e125
| Diferencias entre versiones | `5 0 backend/pom.xml`<br>`3 0 backend/src/main/java/mx/uv/medlink/backend/IUsuario.java`<br>`85 55 backend/src/main/java/mx/uv/medlink/backend/MedicoControlador.java`<br>`131 56 backend/src/main/java/mx/uv/medlink/backend/UsuarioControlador.java`<br>`38 8 backend/src/main/java/mx/uv/medlink/backend/UsuarioService.java`<br>`24 0 backend/src/main/java/mx/uv/medlink/backend/WebConfig.java`<br>`4 4 frontend/index.html`<br>`80 0 frontend/js/citas.js`<br>`155 39 frontend/js/comun.js`<br>`0 30 frontend/js/datos.js`<br>`119 41 frontend/js/login.js`<br>`56 104 frontend/js/medico.js`<br>`148 143 frontend/js/paciente.js`<br>`98 0 frontend/js/recetas.js`<br>`273 0 frontend/js/registro.js`<br>`85 0 frontend/js/resenas.js`<br>`4 2 frontend/medico.html`<br>`3 1 frontend/paciente.html`<br>`5 2 frontend/registro.html` |
| CURL o captura imagen del resultado Código de uso | Diseño Reflexión del estudiante | 
Prueba de funcionamiento | No existieron pruebas dado que son dudas de diseño
Código de uso | Diseño
Reflexión del estudiante | Las restriciones de una tabla en PostgreSQL se definen en la clase de java


# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | GEMINI
Modelo/temperatura | Gemini / 0.2
Prompt original | [prompt 2](#prompt_2)
Respuesta de IA | [respuesta 2](#respuesta_2)
Código anterior | 5663284
Código posterior | 12240de
Diferencias entre versiones | 117     0       .mvn/wrapper MavenWrapperDownloader.java -       -       .mvn/wrapper/maven-wrapper.jar 2       0       .mvn/wrapper/maven-wrapper.properties 2       0       backend/.gitignore 5       0       backend/src/main/java/mx/uv/medlink/backend/IMedico.java 5       0       backend/src/main/java/mx/uv/medlink/backend IUsuario.java 119     0       backend/src/main/java/mx/uv/medlink/backend/Medico.java 38      0       backend/src/main/java/mx/uv/medlink/backend/MedicoControlador 129     0       backend/src/main/java/mx/uv/medlink/backend/Usuario.java 115     0       backend/src/main/java/mx/uv/medlink/backend/UsuarioControlador.java 117     0       documentacion/IAG/cesar/r-ia-dev-01.md 130     0       documentacion/IAG/cesar/r-ia-doc-01.md 310     0       mvnw :" 
Prueba de funcionamiento | No existieron pruebas dado que son dudas de diseño
Código de uso | Implementacion
Reflexión del estudiante | Las interfaces son muy simples pero es necesario utilizar en ocasiones declaraciones de metodos.


> El prompt y la respuesta pueden ser copiados como una subsección y enlazados
## prompt_1
Dame un ejemplo de un metodo de la clase controlador que regrese una respuesta mediante json
---

## prompt_2
Estoy definiendo estas interfaces para utilizarlas, esto con base a un proyecto que ya tengo me puedes indicar cual es la funcion concreta de hacer esto? y si debo agregar algunas lineas?: package mx.uv.medlink.backend;
import org.springframework.data.repository.CrudRepository;

public interface IMedico extends CrudRepository <Medico, Integer> {  
}
---

## prompt_3

Ahora tengo este error: [{ "resource": "/c:/Users/LENOVO CORE i7/Documents/Tareas 5to semestre/Desarrollo web/Proyecto final/repoclonado/Desarrollo-Web/backend/src/main/java/mx/uv/medlink/backend/UsuarioService.java", "owner": "generated_diagnostic_collection_name#1", "code": "errors(1): 4:8-4:11", "severity": 8, "message": "package org.springframework.security.crypto.bcrypt does not exist", "startLineNumber": 4, "startColumn": 8, "endLineNumber": 4, "endColumn": 11, "modelVersionld": 591, "origin": "extHost1"}]

---

## prompt_4
Entendido tengo mas preguntas, porque este metodo me marca un error? 
/** - Elimina un usuario en la BD. - @param idUsuario identificador del usuario. - @return true si el usuario pudo ser eliminado, en caso contrario false. 
*/ public Usuario eliminarUsuario(int idUsuario){ 
    if (iusuario.existsById(idUsuario)) 
        { return iusuario.deleteById(idUsuario); 
    } 
    return null; }
---

## respuesta_1
Para estructurar respuestas JSON limpias y estandarizadas en Spring Boot (emulando objetos tipo mapa o DTO derespuesta genérica), puedes usar un
ResponseEntity>
:
@GetMapping("/api/usuarios/respuesta/{id}")public ResponseEntity> obtenerUsuarioEstructurado(@PathVariable int id) 
    { Map<String, Object> respuesta = new HashMap<>(); 
        Usuario usuario = usuarioService.obtenerUsuarioPorId(id); 
            if (usuario != null) { respuesta.put("codigo", 200); 
                respuesta.put("ok", true); 
                respuesta.put("data", usuario); 
                return ResponseEntity.status(HttpStatus.OK).body(respuesta); } 
            else { respuesta.put("codigo", 404); 
                respuesta.put("ok", false); 
                respuesta.put("data", "Usuario no encontrado"); 
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta); }}
---

## respuesta_2

Esta interfaz es el núcleo de la Capa de Persistencia en tu arquitectura de 3 capas.

¿Cuál es la función concreta de hacer esto?
Su función principal es otorgarle a tu aplicación la capacidad de interactuar automáticamente con la tabla de médicos en PostgreSQL sin que tengas que escribir ni una sola línea de código SQL (SELECT, INSERT, UPDATE, DELETE) ni implementar métodos manuales.

Gracias a que extiendes de CrudRepository<Medico, Integer>, Spring Data JPA analiza tu código por debajo y genera automáticamente una implementación en tiempo de ejecución que te regala métodos listos para usar como:

.save(medico) (para guardar o actualizar)

.findById(id) (para buscar por ID)

.findAll() (para listar todos los médicos)

.deleteById(id) (para eliminar)

.count() (para contar registros)

Sobre los parámetros que le pasas (<Medico, Integer>):

Medico: Le indica a Spring qué entidad de tu base de datos va a administrar este repositorio.

Integer: Especifica el tipo de dato que tiene la clave primaria (idMedico) de esa entidad.

¿Debes agregar algunas líneas?
Para las operaciones básicas (crear, leer, actualizar, borrar por ID), tal como la tienes escrita funciona y está perfecta. No necesitas agregarle nada más para empezar a operar.

Sin embargo, en el desarrollo real de una aplicación, es extremadamente común agregar métodos personalizados (conocidos como Query Methods) para buscar registros por campos específicos que no sean el ID.

Por ejemplo, como en tu entidad Medico tienes el atributo cedulaProfesional que es único, te sería muy útil poder buscar a un médico por su número de cédula. Para ello, puedes añadir una línea dentro de la interfaz:

Java
package mx.uv.medlink.backend;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface IMedico extends CrudRepository<Medico, Integer> { 
    
    // Spring Data JPA lee el nombre del método y genera el SQL automáticamente:
    // SELECT * FROM medico WHERE cedula_profesional = ?
    Optional<Medico> findByCedulaProfesional(String cedulaProfesional);
    
}
Nota: Spring es lo suficientemente inteligente como para traducir findByCedulaProfesional al nombre exacto de la columna en la base de datos y devolverte un objeto Optional por si el médico no existe.

## respuesta_3
Ese error indica que Maven aún no ha cargado o descargado la dependencia spring-security-crypto en tu entorno de desarrollo (VS Code / Java Language Server).   Sigue estos pasos en orden para resolverlo:   Verifica que la dependencia esté en backend/pom.xml dentro de <dependencies>:   XML<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-crypto</artifactId>
</dependency>
(Si tu pom.xml no tiene un <parent> de Spring Boot y Maven marca error por falta de versión, agrega también <version>6.4.2</version> o la versión correspondiente a tu Spring Framework.)   Fuerza la descarga y recompilación desde terminal: Abre una terminal en la carpeta backend y ejecuta:   Bash./mvnw clean compile -U
(O mvn clean compile -U si usas Maven instalado globalmente; la bandera -U fuerza a Maven a revisar/descargar dependencias faltantes.)   Reinicia / limpia el caché del servidor Java en VS Code:   Presiona Ctrl + Shift + P (o Cmd + Shift + P).   Busca y ejecuta Java: Clean Java Language Server Workspace y confirma reiniciar.   También puedes ejecutar Maven: Update Project si tienes la extensión de Maven para VS Code.   Si después de mvn clean compile -U el comando falla en terminal, pega aquí el error que te muestre Maven o las líneas de <parent> y <dependencies> de tu pom.xml para revisarlo directamente.
---

## respuesta_4
El motivo principal por el que ese código te marca un error de compilación es un conflicto de tipos de datos entre lo que retorna el método de Spring Data JPA y lo que tu método personalizado intenta regresar.   Aquí te explico exactamente qué pasa y cómo solucionarlo:   1. El conflicto con deleteById
Por defecto, el método nativo deleteById(id) de JpaRepository está diseñado con la siguiente firma en Spring Data:   Javavoid deleteById(ID id);

Como puedes observar, su tipo de retorno es void (no regresa absolutamente nada, solo ejecuta la instrucción SQL de borrado). Por lo tanto, en tu línea:   Javareturn iusuario.deleteById(idUsuario);

Estás intentando usar la palabra return con un método que no devuelve ningún valor (produce un error del tipo "incompatible types: unexpected return value").   2. ¿Cómo se corrige dependiendo de lo que quieras lograr?
Tienes dos opciones principales según la lógica de negocio que busques en tu servicio:   Opción A: Mantener el tipo de retorno boolean (La más recomendada para un borrado)   Java/**
 * Elimina un usuario en la BD.
 * @param idUsuario identificador del usuario.
 * @return true si el usuario pudo ser eliminado, en caso contrario false.
 */
public boolean eliminarUsuario(int idUsuario) {
  if (iusuario.existsById(idUsuario)) {
    iusuario.deleteById(idUsuario); // Solo se ejecuta, no se retorna
    return true; // Retornamos true porque se borró con éxito
  }
  return false; // Retornamos false si no se encontró el ID
}
   Opción B: Si necesitas regresar el objeto usuario que fue eliminado   Java/**
 * Elimina un usuario en la BD y regresa el objeto eliminado.
 * @param idUsuario identificador del usuario.
 * @return El objeto Usuario eliminado, o null si no existía.
 */
public Usuario eliminarUsuario(int idUsuario) {
  // Buscamos y obtenemos el usuario antes de borrarlo (manejando el Optional con orElse)
  Usuario usuarioAEliminar = iusuario.findById(idUsuario).orElse(null);
  if (usuarioAEliminar != null) {
    iusuario.deleteById(idUsuario); // Lo borramos de la BD
    // Regresamos el objeto que guardamos en la variable
    return usuarioAEliminar;
  }
  return null; // Si no existía, regresamos null
}
---

## Observaciones adicionales

Agregar cualquier comentario explicativo relevante.
