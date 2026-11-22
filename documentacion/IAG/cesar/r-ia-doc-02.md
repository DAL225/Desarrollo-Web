# Reporte de Uso Documental en el Proyecto

**Fecha:** 11/11/2026  
**Número de reporte:**  

---

# 1. Breve descripción de uso

Explicacion de construccion de clases en el Backend

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
18/11/2026	 | Asistente IA (Gemini)  | [prompt 1](#prompt_1) | [Respuesta 1](#respuesta_1)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 2](#prompt_2) | [Respuesta 2](#respuesta_2)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 3](#prompt_3) | [Respuesta 3](#respuesta_3)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 1](#prompt_1) | [Respuesta 1](#respuesta_1)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 2](#prompt_2) | [Respuesta 2](#respuesta_2)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 3](#prompt_3) | [Respuesta 3](#respuesta_3)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 1](#prompt_1) | [Respuesta 1](#respuesta_1)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 2](#prompt_2) | [Respuesta 2](#respuesta_2)
18/11/2026	 | Asistente IA (Gemini)  | [prompt 3](#prompt_3) | [Respuesta 3](#respuesta_3)
| | | | |
| | | | |

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
¿Es posible regresar la linea deleteById?
    /**
     * Elimina un usuario en la BD.
     * @param idUsuario identificador del usuario.
     * @return true si el usuario pudo ser eliminado, en caso contrario false.
     */   
    public boolean eliminarUsuario(int idUsuario){
        if (iusuario.existsById(idUsuario)) {
            iusuario.deleteById(idUsuario);
            return true;
        }
        return false;
    }   

---

## prompt_2

¿Guardar un objeto utilizando la interfaz conectada a JPA y Hibernate de la misma clase con el id de otro ya existente lo actualiza?
---

## prompt_3
En mi proyecto dentro del backend tengo la interfaz de JPA, el framework de Hibernate y tengo clases java que sirven para lo siguiente, clase Objeto: en estas establezco una clase con sus atributos y constructor, donde tambien coloco restricciones que se mapearan a las columnas de una tabla en PostgresSQL, 
tengo la Interfaz I.java: aqui configuro las APIS que se conectaran con PostgreSQL, tengo la clase Services: en esta utilizo la clase de interfaz para realizar operaciones en la Base de datos y por ultimo tengo la clase Controlador: en esta proceso la logica de las solicitudes y las respuestas,
tambien adjunto una imagen de mis clases, todas estas estan declaradas para una entidad, Usuario, medico, reseña etc. Mis preguntas con este planteamiento son las siguientes:
¿En el codigo de una clase IUsuario.java, IMedico.java o IResena.java es recomendable implementar la firma de todas las acciones con la Base de datos?
---

## prompt_4
¿Se sugieren las clases DTO, cuáles son sus usos, por qué existen y qué carga distribuyen?

## prompt_5
¿Que extencion en el pom necesito para resolver errores al implementar funciones para hasheo de contraseñas?

---

 ## respuesta_1
Sí, es totalmente correcto y necesario.
En tu fragmento de código,
iusuario.deleteById(idUsuario);
ejecuta lainstrucción SQL de eliminación en la base de datos una vez validado que el registro existe mediante
existsById
.
Si se removiera esa línea, la función verificaría si el usuario existe, retornaría
true
, pero
nunca lo borraría
de labase de datos. Por lo tanto, conservarla es indispensable para que el método cumpla su propósito de eliminarlógicamente y físicamente el registro.
---

## respuesta_2
Sí.
En Spring Data JPA, el método save() de un repositorio maneja un comportamiento "inteligente" basado en elIdentificador (@Id): Si la entidad que le pasas no tiene un ID (o es nulo/cero), JPA asume que es un registro nuevo y ejecuta un comando INSERT. Si la entidad tiene un ID asignado (como haces con usuarioActualizado setIdUsuario(id); ), JPA busca en labase de datos si ese ID ya existe: Si existe, ejecuta un comando UPDATE sobre los campos modificados. Si no existe, intenta hacer un INSERT con ese ID explícito (lo cual podría fallar o crear un registro nuevodependiendo de la estrategia de autoincremento).
---

## respuesta_3
No es necesario ni recomendable sobrecargarla con operaciones básicas que ya vienen heredadas.
Al extender de JpaRepository<Entidad, ID>, tus interfaces ya heredan automáticamente métodos robustos comosave(),findById(),findAll(),deleteById(),count(), entre otros.

¿Cuándo sí debes declarar firmas en la interfaz?
Únicamente cuando necesitas consultas personalizadascomplejas que Spring Data no adivina por sí solo (por ejemplo, buscar por combinación de campos específicos mediante Query Methods como findByCorreoAndRol(String correo, String rol), o consultas personalizadascon anotaciones @Query ).
---

## respuesta_4
Sí, el uso de clases DTO (Data Transfer Object) es una de las prácticas más recomendadas y profesionales enarquitecturas robustas de Spring Boot (como se ve que tienes clases como ActualizarReseniaDTO.java y ReseniaDTO.java
en tu proyecto).

¿Por qué existen y cuáles son sus usos?
Existen para aislar la estructura interna de tus bases de datos (tusmodelos mapeados con Hibernate) de los datos que viajan hacia o desde el cliente web/móvil. Sirven para:
1. Evitar exponer información sensible:Ocultar campos críticos de la entidad como contraseñas encriptadas,fechas de auditoría interna, etc.
2. Recibir datos específicos de formularios: Transportar exactamente los parámetros requeridos para unaacción puntual (por ejemplo, un DTO especial para actualizar contraseñas o datos parciales).
3. Modelar proyecciones: Combinar datos de múltiples tablas en una sola respuesta plana sin alterar elesquema relacional de PostgreSQL. ¿Qué carga distribuyen? Carga de validación y acoplamiento: Permiten trasladar las anotaciones de validación de entrada( @NotNull, @Size , @Email ) fuera de tus entidades de base de datos. 

Desacoplamiento de capas:Evitan que un cambio en la estructura de las columnas de PostgreSQL rompadirectamente contratos de las APIs frontend, delegando en los servicios o mappers la tarea de transformar unDTO a una Entidad (y viceversa) de forma limpia y controlada.
---

## respuesta_5

Respuesta
Para resolver esos errores de compilación en UsuarioService.java (org.springframework.security.crypto.bcrypt y BCryptPasswordEncoder), debes agregar la dependencia spring-security-crypto dentro de la sección <dependencies> de tu archivo backend/pom.xml.

Si tu proyecto usa Spring Boot (con <parent> de spring-boot-starter-parent), no necesitas indicar <version> ya que Maven la toma automáticamente de la versión de Spring Boot:

XML
<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-crypto</artifactId>
</dependency>

Ventajas de usar spring-security-crypto en vez de spring-boot-starter-security
Solo agrega las utilidades criptográficas (BCryptPasswordEncoder) sin activar filtros de seguridad HTTP ni bloquear tus rutas /api/** o archivos estáticos automáticamente.

Si tu pom.xml no hereda de un BOM de Spring Boot o Spring Framework y te pide versión, agrega la etiqueta <version> compatible con tu versión de Spring Framework.

Después de guardar el pom.xml, actualiza el proyecto de Maven en tu editor (o ejecuta mvn clean compile dentro de la carpeta backend) para que se descargue la librería y desaparezcan los errores.

## Observaciones adicionales

Cabe señalar que la interpretacion del ORM de Hibernate esta muy simplificada lo cual es util en algunos aspectos.