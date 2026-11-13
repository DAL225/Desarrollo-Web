# Reporte de IA Desarrollo en el Proyecto

**Fecha:**11/11/2026  
**Número de reporte:** 1

---

# 1. Breve descripción de uso

Describir la intención general del desarrollo.

---

# 2. Evidencias de uso

| Evidencia | Formato | 
|------------|------------------------|
Herramienta | GEMINI
Modelo/temperatura | Gemini / 0.2
Prompt original | [prompt 1](#prompt_1)
Respuesta de IA | [respuesta 1](#respuesta_1)
Código anterior | 5663284
Código posterior | 7165789
Diferencias entre versiones | 117     0       .mvn/wrapper MavenWrapperDownloader.java -       -       .mvn/wrapper/maven-wrapper.jar 2       0       .mvn/wrapper/maven-wrapper.properties 2       0       backend/.gitignore 5       0       backend/src/main/java/mx/uv/medlink/backend/IMedico.java 5       0       backend/src/main/java/mx/uv/medlink/backend IUsuario.java 119     0       backend/src/main/java/mx/uv/medlink/backend/Medico.java 38      0       backend/src/main/java/mx/uv/medlink/backend/MedicoControlador 129     0       backend/src/main/java/mx/uv/medlink/backend/Usuario.java 115     0       backend/src/main/java/mx/uv/medlink/backend/UsuarioControlador.java 117     0       documentacion/IAG/cesar/r-ia-dev-01.md 130     0       documentacion/IAG/cesar/r-ia-doc-01.md 310     0       mvnw :" Prueba de funcionamiento | CURL o captura imagen del resultado Código de uso | Diseño Reflexión del estudiante | 
Prueba de funcionamiento | CURL o captura imagen del resultado
Código de uso | Diseño
Reflexión del estudiante | 


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
Prueba de funcionamiento | CURL o captura imagen del resultado 
Código de uso | Diseño 
Reflexión del estudiante | 



> El prompt y la respuesta pueden ser copiados como una subsección y enlazados
## prompt_1
Tengo el siguiente caso una tabla que representa a los usuarios dentro de mi aplicacion sus datos se construyen de la siguiente manera, el id_usuario es una llave primaria autoincrementable, tengo un nombre, un correo se almacena en texto pero debe ser uico, una contraseña guardada en texto cuyo valor esta encriptado con BCrypt y un campo rol que guarda uno de dos valores en texto (Paciente o medico). Con esto dame una lista de las restricciones que me pueden ser utiles y ejemplos de como se implementa la estructura en atributos genericos.
---

## prompt_2
Estoy definiendo estas interfaces para utilizarlas, esto con base a un proyecto que ya tengo me puedes indicar cual es la funcion concreta de hacer esto? y si debo agregar algunas lineas?: package mx.uv.medlink.backend;
import org.springframework.data.repository.CrudRepository;

public interface IMedico extends CrudRepository <Medico, Integer> {  
}
---

## respuesta_1
Para diseñar esta entidad de usuarios en tu proyecto con Spring Boot, Hibernate y PostgreSQL, existen varias restricciones y validaciones a nivel de base de datos y de mapeo que te ayudarán a mantener la integridad de los datos.

Aquí tienes la lista de las restricciones útiles para tu caso y cómo se implementan conceptualmente:

1. Restricción de Clave Primaria Autoincrementable (PRIMARY KEY y IDENTITY)
Para qué sirve: Garantiza que cada usuario tenga un identificador único numérico que la base de datos incrementa de forma automática, evitando duplicados en los registros.

Cómo se aplica: Con las anotaciones @Id y @GeneratedValue(strategy = GenerationType.IDENTITY).

2. Restricción de No Nulidad (NOT NULL)
Para qué sirve: Obliga a que los campos obligatorios (como el nombre, el correo, la contraseña encriptada y el rol) nunca se guarden como valores vacíos o nulos en la base de datos.

Cómo se aplica: Mediante la propiedad nullable = false dentro de la anotación @Column.

3. Restricción de Unicidad (UNIQUE)
Para qué sirve: Evita que dos usuarios diferentes puedan registrarse utilizando exactamente la misma dirección de correo electrónico.

Cómo se aplica: Configurando unique = true dentro de la anotación @Column del correo.

4. Restricción de Dominio o Valores Permitidos (CHECK)
Para qué sirve: Asegura que el campo de rol únicamente acepte los valores específicos permitidos por tu lógica de negocio (en este caso, exactamente "Paciente" o "medico"), rechazando cualquier otro texto incorrecto directamente desde la base de datos.

Cómo se aplica: Se puede respaldar en la base de datos con una restricción de tipo CHECK (a veces soportada mediante anotaciones específicas de Hibernate como @Check) o controlando los valores a través de un Enum de Java.
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
## Observaciones adicionales

Agregar cualquier comentario explicativo relevante.
