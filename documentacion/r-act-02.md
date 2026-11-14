# Reporte de Avance del Proyecto

**Equipo:** 1 \
**Fecha:**  13/11/2026 \
**Número de reporte:** 02 \
**Repositorio GitHub: https://github.com/DAL225/Desarrollo-Web.git**  

---

# 1. Actividades realizadas

Proyecto en Spring Boot
Conexion a Postgre SQL en la nube
Creacion de entidades y relacionados
Implementacion de POST y GET
Pruebas mediante CURL

---

# 2. Evidencias de trabajo

| Actividad | Integrante responsable | Enlace a commit |
|------------|------------------------|-----------------|
|Creacion de clases relacionadas a Resena| Misael | https://github.com/DAL225/Desarrollo-Web/commit/a9ac8e7b2752972e9f45a5e4fd4c13ac8c29166c|
|Creacion de clases de Cita y Receta| Diego | https://github.com/DAL225/Desarrollo-Web/commit/23f09cdad7c33a9434974275b8a51aeeebdc355b|
|Creacion de clases relacionadas a Usuario y Medico | Cesar | https://github.com/DAL225/Desarrollo-Web/commit/12d57aee019a7279a1266d9c16d2f5434b3a11f4|
| | | |
| | | |

---

# 3. Problemas encontrados

Al definir las clases y controladores, habia problemas de logica en cuanto a las restricciones del sistema, por lo cual consultando con fuentes de IA, se implemento una capa/clase de services, para cada una de las clases declaradas, esto permitiedo separar la parte logica de la parte de peticiones y respuestas.

---

# 4. Avance funcional

Clases java implementadas, controladores, services e interfaces, manejo de endpoints para GET y POST.

---

# 5. Uso de IA generativa

Documentar el uso de herramientas de inteligencia artificial durante el desarrollo del proyecto.

- **Herramienta utilizada:** Gemini Modelos de Gemini 3
- **Actividad para la que se utilizó:** Correciones en clases respecto a nomenclatura y logica de JPA, manejo de logica en capa services.
- **Código o contenido generado:** Codigo y estructuras bien definidas, respetando reglas.
- **Modificaciones realizadas por el equipo:** No hubo modificaciones, ya que es la primera seccion en donde se incluye codigo.
- **Forma en que se verificó el resultado:** Verificando mediante el despliegue del servidor su funcion correcta, ademas del respectivo analisis en la base de datos, se mantuviera la integridad.

<br>

- **Herramienta utilizada:** Gemini Modelos de Gemini 3
- **Actividad para la que se utilizó:** Generacion de pruebas(curl), para endpoints e integridad en la base de datos
- **Código o contenido generado:** Instrucciones curl
- **Modificaciones realizadas por el equipo:** No hubo modificaciones, ya que es la primera seccion en donde se incluye codigo.
- **Forma en que se verificó el resultado:** Analizando las respuestas de curl, y verificando la integridad en la base de datos

> Si no se utilizó IA, indicarlo expresamente.

---

# 6. Participación individual

Describir brevemente la contribución de cada integrante.

- **Diego:** Diseño e implementación de las entidades Cita y receta en el backend
- **Misael:** Creacion del proyecto Maven, Diseño e implementación de las entidades Reseña en el backend
- **Cesar:** Diseño e implementación de las entidades Usuario y medico en el backend  

---

# 7. Próximas actividades

Indicar las tareas que se realizarán antes del siguiente reporte.

- Actividad 1: Posibles correcciones tras la integracion del trabajo colaborativo
- Actividad 2: Integracion de PUT y DELETE
- Actividad 3: Incorporacion de filtros
- Actividad 4: Validacion de respuestas HTTP
- Actividad 5: Pruebas de persistencia

---

## Observaciones adicionales

Sin observaciones
