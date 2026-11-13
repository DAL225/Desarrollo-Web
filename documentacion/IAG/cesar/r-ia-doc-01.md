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
11/11/2026	 | Asistente IA (Gemini)  | [prompt 1](#prompt_1) | [Respuesta 1](#respuesta_1)
11/11/2026	 | Asistente IA (Gemini)  | [prompt 2](#prompt_2) | [Respuesta 2](#respuesta_2)
11/11/2026	 | Asistente IA (Gemini)  | [prompt 3](#prompt_3) | [Respuesta 3](#respuesta_3)
| | | | |
| | | | |

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Con base a este codigo de un  ejemplo anterior, para que sirven las palabras reservadas  con @ acompañadas de los imports?: package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Saludador {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String contenido;

    public String getContenido() {
        return this.contenido;
    }

    public Saludador(String contenido) {
        this.contenido = contenido;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    // Constructor vacío obligatorio para JPA
    public Saludador() {
    }
}

---

## prompt_2

Explica estos dos mecanismos para poder identificarlos, y cual seria la palabra reservada para utilizar cada uno de los mecanismos
---

## prompt_3
Si tengo un atributo que va a estar declarado como llave primaria serial, tengo que incluirlo aun asi en el constructor?
---

 ## respuesta_1
En Java, y especialmente cuando trabajas con Spring Boot y Hibernate/JPA, las palabras que empiezan con @ se llaman anotaciones.

Las anotaciones funcionan como etiquetas o metadatos. Su propósito principal es darle instrucciones al framework —en este caso, a Hibernate— para que sepa cómo manejar tus clases sin que tengas que escribir configuraciones complejas en XML o código SQL manual.

Para que tu código reconozca estas etiquetas, necesitas los import, que actúan como la dirección exacta que le indica a Java en qué librería se encuentran definidas esas reglas (en este proyecto, todas provienen de la especificación jakarta.persistence).

Aquí te detallo cada una de las anotaciones que aparecían en tu ejemplo:

@Entity (importada desde jakarta.persistence.Entity)

Para qué sirve: Convierte tu clase normal de Java (en este caso, Saludador) en una entidad persistente. Le dice a Hibernate que esta clase está mapeada directamente a una tabla en tu base de datos de PostgreSQL. Por defecto, Hibernate buscará o creará una tabla con el nombre de la clase.

@Id (importada desde jakarta.persistence.Id)

Para qué sirve: Marca el atributo que está justo debajo (private Integer id;) como la clave primaria (Primary Key) de la tabla. Le indica a la base de datos que este campo será el identificador único para cada registro.

@GeneratedValue(strategy = GenerationType.AUTO) (importada desde jakarta.persistence.GeneratedValue y GenerationType)

Para qué sirve: Define la estrategia para generar automáticamente el valor de la clave primaria. Al usar GenerationType.AUTO, dejas que JPA y PostgreSQL elijan el mecanismo de auto-incremento más adecuado (como secuencias o campos seriales), evitando que tengas que asignar un ID numérico de forma manual cada vez que guardes un registro nuevo.
---

## respuesta_2
El mecanismo de generación de la llave primaria (controlado principalmente por la anotación @GeneratedValue) se encarga de definir cómo se calcula o asigna el valor único (id) cada vez que insertas un nuevo registro en la base de datos.

En lugar de obligarte a escribir código en Java para calcular cuál es el siguiente número disponible —por ejemplo, asegurarte manualmente de que si ya existe el ID 5, al siguiente le toque el 6—, este mecanismo automatiza ese proceso delegándolo en el framework y en el motor de base de datos (PostgreSQL).

Para lograrlo, este mecanismo utiliza una propiedad llamada strategy (estrategia) a través de GenerationType. Las formas principales de configurarlo son:

GenerationType.IDENTITY: Delega la creación del ID directamente a una columna autoincrementable de la base de datos (en PostgreSQL, esto se alinea con tipos como SERIAL o columnas con GENERATED ALWAYS AS IDENTITY). Cada vez que guardas un objeto, la base de datos asigna el siguiente número secuencial de manera nativa en el momento de la inserción.

GenerationType.SEQUENCE: Utiliza un objeto independiente en la base de datos llamado "secuencia" que emite números en un orden específico. Hibernate le solicita a esa secuencia el próximo valor antes de enviar la instrucción de guardar el registro.

GenerationType.AUTO: Deja que Hibernate analice el motor de base de datos que estás usando (en este caso, PostgreSQL) y seleccione por ti la estrategia que considere más óptima.

En resumen, mientras que @Id solo funciona como una etiqueta para señalar cuál atributo de tu clase es la llave primaria, el mecanismo de @GeneratedValue se encarga de toda la lógica de cómo se autocompleta ese campo de forma segura para evitar duplicados o errores en los registros.
---

## respuesta_3
No, no tienes que incluirlo (ni debes) en el constructor que utilizas para crear nuevos registros.

La razón principal es que, al tratarse de una clave primaria autoincrementable (SERIAL o IDENTITY), tú no conoces el valor del ID cuando el usuario se está registrando o cuando estás creando el objeto por primera vez. Ese número lo calcula y asigna automáticamente la base de datos de PostgreSQL en el preciso instante en que se ejecuta la inserción (INSERT).

Si incluyeras el ID en el constructor de creación, te verías en la obligación de pasarle un número ficticio o inventado (como 0 o -1) cada vez que quieras instanciar un nuevo usuario, lo cual no tiene sentido lógico.

¿Cómo se manejan los constructores en la práctica con una clave autoincrementable?
El constructor vacío (Obligatorio para JPA):
Este constructor sin parámetros (public Usuario() {}) es el que utiliza Hibernate por debajo de la mesa cuando hace una consulta (SELECT) a la base de datos. Como la base de datos ya tiene el registro guardado con su ID, Hibernate instancia el objeto vacío y luego utiliza el método setIdUsuario() para rellenarlo automáticamente.

El constructor de registro (Sin el ID):
Es el constructor que tú diseñas para recibir únicamente los datos que el cliente introduce desde el frontend (nombre, correo, contraseña, teléfono, rol). Al no incluir el idUsuario aquí, garantizas que el objeto nazca limpio y listo para que la base de datos le asigne su identificador correlativo al guardarlo.
---

## Observaciones adicionales

Existe una relacion directa entre la restricciones de integridad que estan presentes en el modelo de bases de datos relacional y las entidades cuyo nombre lo relaciono directamente con clases JPA
