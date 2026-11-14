# Reporte de Uso Documental en el Proyecto

**Fecha:** 13/11/2026
**Número de reporte:**  02

---

# 1. Breve descripción de uso

Las consultas se realizaron principalmente para informacion sobre el manejo correcto(buenas practicas) de la logica del negocio, resultando en una nueva capa de services.

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 07/11/2026 | Chat gpt | [prompt_1](#prompt_1)| [respuesta_1](#respuesta_1)|
| | | | |
| | | | |

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Por ejemplo, si en nuestras consultas, un ejemplo, vamos a agregar en un ambiente de, digámoslo de citas médicas y doctores, médicos, usuarios y reseñas. Un ejemplo, un usuario solo podría agregar una reseña si ya tuvo una cita con ese doctor. Entonces tenemos que manejar todo en nuestro reseña controlador, es decir obtener el número de citas, por ejemplo, yo lo presento así: obtener el número de citas que ya tuvo ese usuario con ese médico y si el número es mayor o igual al número de reseñas que están ligadas entre ese usuario y ese médico, entonces podemos darle la opción o permitir que se agregue otra reseña o que se agreguen reseñas hasta que el número sea igual, es decir que nunca sea mayor el otro. En este caso todo debemos manejarlo en los controladores, utilizando JPA, o sea la funcionalidad de JPA es no tener que realizar consultas, sino trabajar con los datos que ya te da. Esa sería mi pregunta.

## respuesta_1
¡Exactamente! Estás entendiendo la idea de Spring Data JPA, pero hay una distinción importante: **no necesitas manejar toda la lógica en el controlador ni tampoco necesitas traer todos los registros de la base de datos para hacer las comprobaciones.**

En tu ejemplo de citas médicas, podemos separar las responsabilidades de esta manera:

1. **Repositorio (Repository):** se encarga de consultar, guardar, actualizar y eliminar información de la base de datos.
2. **Controlador (Controller):** recibe las solicitudes HTTP y devuelve las respuestas.
3. **Servicio (Service):** contiene las reglas de negocio, es decir, las validaciones y operaciones que necesita realizar el sistema.

Por ejemplo, la regla de negocio sería:

> Un usuario solamente puede publicar una reseña por cada cita que haya tenido con un médico.

Esto significa que debemos comprobar cuántas citas ha tenido y cuántas reseñas ha publicado para ese médico.

### **1. ¿Cómo lo haríamos con JPA?**

Supongamos que tenemos estas entidades:

- `Usuario`
- `Medico`
- `Cita`
- `Resena`

Y sus relaciones:

- Un usuario puede tener muchas citas.
- Un médico puede tener muchas citas.
- Un usuario puede escribir muchas reseñas.
- Un médico puede recibir muchas reseñas.

En nuestro repositorio de citas podríamos tener:

```
public interface ICita extends CrudRepository<Cita, Integer> {

    long countByUsuarioIdAndMedicoIdAndEstado(
        Integer idUsuario,
        Integer idMedico,
        String estado
    );

}
```

Este método es interesante porque **no tenemos que escribir una consulta SQL**.

Spring Data JPA interpreta el nombre del método y genera la consulta correspondiente.

Por ejemplo:

```
countByUsuarioIdAndMedicoIdAndEstado(...)
```

Significa:

- `countBy`: contar los registros.
- `UsuarioId`: que pertenezcan a determinado usuario.
- `MedicoId`: que correspondan a determinado médico.
- `Estado`: que tengan determinado estado.

De esta manera podemos contar únicamente las citas completadas de ese usuario con ese médico.

En el repositorio de reseñas tendríamos algo similar:

```
public interface IResena extends CrudRepository<Resena, Integer> {

    long countByUsuarioIdAndMedicoId(
        Integer idUsuario,
        Integer idMedico
    );

}
```

Este método cuenta las reseñas que ha publicado ese usuario para ese médico.

*Nota:* Los nombres `UsuarioId` y `MedicoId` suponen que las entidades tienen atributos llamados `usuario` y `medico`, respectivamente, y que estos tienen un atributo `id`.

### **2. ¿Dónde hacemos la validación?**

Aquí es donde entra la capa de servicios.

Por ejemplo, podríamos tener una clase `ResenaService`:

```
@Service
public class ResenaService {

    @Autowired
    private ICita citaRepository;

    @Autowired
    private IResena resenaRepository;

    public boolean puedeAgregarResena(
        Integer idUsuario,
        Integer idMedico
    ) {

        long totalCitas = citaRepository
            .countByUsuarioIdAndMedicoIdAndEstado(
                idUsuario,
                idMedico,
                "COMPLETADA"
            );

        long totalResenas = resenaRepository
            .countByUsuarioIdAndMedicoId(
                idUsuario,
                idMedico
            );

        return totalCitas > totalResenas;
    }
}
```

¿Qué estamos haciendo?

1. Consultamos cuántas citas completadas tiene el usuario con ese médico.
2. Consultamos cuántas reseñas ha publicado para ese médico.
3. Comparamos ambos resultados.
4. Si tiene más citas que reseñas, puede publicar otra.

Por ejemplo:

| Citas completadas | Reseñas | ¿Puede agregar otra? |
| ----------------- | ------- | -------------------- |
| 0                 | 0       | No                   |
| 1                 | 0       | Sí                   |
| 1                 | 1       | No                   |
| 2                 | 1       | Sí                   |
| 3                 | 2       | Sí                   |
| 3                 | 3       | No                   |

### **3. ¿Y qué hacemos en el controlador?**

El controlador solamente recibe la solicitud y utiliza el servicio para realizar la validación.

Por ejemplo:

```
@RestController
@RequestMapping("/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @GetMapping("/puede-agregar/{idUsuario}/{idMedico}")
    public boolean puedeAgregar(
        @PathVariable Integer idUsuario,
        @PathVariable Integer idMedico
    ) {

        return resenaService.puedeAgregarResena(
            idUsuario,
            idMedico
        );
    }
}
```

Así, desde el frontend podemos consultar ese endpoint para saber si habilitamos la opción de publicar una reseña.

Sin embargo, la validación también debe ejecutarse al momento de guardar la reseña. No basta con ocultar o deshabilitar un botón, porque alguien podría enviar directamente una petición HTTP.

### **4. Entonces, ¿JPA evita que hagamos consultas?**

Aquí hay una pequeña confusión que vale la pena aclarar.

**JPA no elimina las consultas a la base de datos; facilita la manera de realizarlas.**

Por ejemplo, tenemos tres posibilidades:

| Forma de consultar                          | ¿Es necesario escribir SQL?              |
| ------------------------------------------- | ---------------------------------------- |
| `findAll()`                                 | No                                       |
| `countByUsuarioIdAndMedicoId()`             | No                                       |
| `@Query("SELECT...")`                       | No SQL nativo, pero sí una consulta JPQL |
| `@Query(value = "...", nativeQuery = true)` | Sí, SQL nativo                           |

Spring Data JPA genera automáticamente consultas a partir de los nombres de los métodos, cuando estos siguen las convenciones correspondientes.

Por lo tanto, no necesitas traer todos los registros para después recorrerlos con un `for` y hacer las comparaciones en Java. Puedes pedirle directamente a la base de datos que cuente los registros que cumplen determinadas condiciones.

### **5. Una recomendación importante para su sistema de citas médicas**

Hay algo que mejoraría en el diseño de tu propuesta.

En lugar de relacionar una reseña únicamente con el usuario y el médico, sería mejor relacionarla también con la cita que la originó.

Por ejemplo:

**Reseña**

- `idResena`
- `calificacion`
- `comentario`
- `idUsuario`
- `idMedico`
- `idCita`

De esta manera, cada cita completada puede tener como máximo una reseña.

Incluso pueden establecer una restricción `UNIQUE` sobre `idCita` en la tabla de reseñas para evitar que se registre más de una reseña para la misma cita.

Esto es más seguro que comparar únicamente cantidades, porque evita que una misma cita se utilice varias veces para justificar reseñas diferentes.

### **Conclusión**

Tu planteamiento es correcto en cuanto a utilizar JPA para facilitar las operaciones con la base de datos. Lo que te recomendaría para su proyecto es mantener esta estructura:

**Controller**

Recibe solicitudes HTTP y devuelve respuestas.

**Service**

Realiza validaciones y aplica las reglas de negocio.

**Repository**

Define las operaciones y consultas mediante JPA.

**Base de datos**

Almacena y proporciona los datos.

**Mi recomendación:** utilicen los repositorios para las consultas, los servicios para las validaciones y los controladores para manejar las peticiones. Así tendrán un proyecto Spring Boot mucho más organizado y fácil de mantener.


