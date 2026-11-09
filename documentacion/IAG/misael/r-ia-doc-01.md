# Reporte de Uso Documental en el Proyecto

**Fecha:** 09/11/2026
**Número de reporte:**  01

---

# 1. Breve descripción de uso

Las consultas se realizaron principalmente para definir la estructura del proyecto en cuanto a los requerimientos y entidades participantes en la BD, tambien la generacion de un prototipo para la interfaz de usuario.

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 07/11/2026 | Gemini, Modelos de Gemini 3 | [prompt_1](#prompt_1)| [respuesta_1](#respuesta_1)|
| 07/11/2026 | Gemini, Modelos de Gemini 3 | [prompt_2](#prompt_2)| [respuesta_2](#respuesta_2)|
| 07/11/2026 | Gemini, Modelos de Gemini 3 | [prompt_3](#prompt_3)| [respuesta_3](#respuesta_3)|
| 08/11/2026 | Claude, Sonnet 5.5 | [prompt_4](#prompt_4)| [respuesta_4](#respuesta_4)|
| | | | |
| | | | |

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
Hola. Tengo que desarrollar un proyecto en Java utilizando Spring Boot y para la base de datos ORM. Estoy definiendo lo que sería como tal el esquema de la base de datos, sin embargo, un ORM directamente guarda los datos desde las clases que están en Java. Entonces, como tal, no vamos a definir el esquema en la base de datos, pero sí es necesario para saber qué información guardar y cómo va a estar relacionado. Actualmente tengo una duda en cuanto al esquema. Ya tengo una base, sin embargo, quisiera consultar si se considera correcto respecto al tema. La idea del proyecto es un sistema de citas médicas en la cual hay dos usuarios, dos tipos de usuarios, un doctor médico y un usuario normal. Un médico crea sus propias citas y las expone al público. Un usuario entra, le aparecen los médicos y puede dar clic para agendar la cita. Le aparecen las citas por cada médico y puede agendar alguna. Entonces, por defecto, la cita tendría una correspondencia hacia un usuario que en dado momento estaría vacía. Cuando el usuario la solicite o acceda a ella, se llenaría con el ID del usuario. También está la parte de recetas en la cual un usuario, perdón, un médico puede crear una receta para un determinado usuario. Partiendo de esto, se crea una receta médica y el usuario puede acceder a ella para la posterior compra o lo que quiera hacer con ella. También tengo la idea de incluir un expediente, pero pues no encuentro la forma de que si es necesario incluirlo o puede descartarse debido a la complejidad que ya existe. Además, incluir la parte de reseñas en la cual un usuario puede dejar una reseña sobre un médico que ya le consultó o ya tuvo una cita con él.

## respuesta_1
Para estructurar los controladores en tu proyecto con Spring Boot (`@RestController`), lo ideal es organizarlos de manera lógica según las entidades que acabamos de definir.

Aquí tienes la propuesta completa de los **endpoints** RESTful necesarios para cubrir todos los flujos del sistema (Autenticación, Gestión de Médicos, Citas, Recetas y Reseñas):

---

### 1. Autenticación y Usuarios (`/api/auth` o `/api/usuarios`)

Encargados del registro y de validar el inicio de sesión para ambos tipos de usuario.

* `POST /api/auth/registro`
* **Descripción:** Registra un nuevo usuario en el sistema. Si se registra como médico, también crea su registro en la tabla `Medico`.


* `POST /api/auth/login`
* **Descripción:** Autentica al usuario (por correo y contraseña) y devuelve sus datos básicos (o un token JWT si planeas usarlo).



---

### 2. Médicos (`/api/medicos`)

Para que los pacientes puedan consultar la lista de profesionales disponibles y ver sus perfiles.

* `GET /api/medicos`
* **Descripción:** Lista todos los médicos registrados en el sistema con sus datos de especialidad y dirección.




* `GET /api/medicos/{id}`
* **Descripción:** Obtiene los detalles de un médico específico, incluyendo sus reseñas y su calificación promedio.



---

### 3. Citas Médicas (`/api/citas`)

Maneja tanto la creación de espacios por parte del médico como la reserva por parte del paciente.

* `POST /api/citas`
* **Descripción:** **(Rol: Medico)** El médico crea una nueva cita disponible en su agenda (con fecha, hora de inicio y hora de fin; el `id_usuario` se queda nulo).




* `GET /api/citas/medico/{idMedico}`
* **Descripción:** Lista las citas creadas por un médico específico (útil para que el médico vea su agenda y el paciente vea las disponibles).


* `PUT /api/citas/{idCita}/agendar`
* **Descripción:** **(Rol: Usuario/Paciente)** Asigna el `id_usuario` del paciente logueado a una cita que estaba libre, reservándola.




* `GET /api/citas/usuario/{idUsuario}`
* **Descripción:** **(Rol: Usuario/Paciente)** Muestra el historial de citas agendadas por un paciente específico.



---

### 4. Recetas Médicas (`/api/recetas`)

Para que el médico prescriba y el paciente consulte sus indicaciones médicas.

* `POST /api/recetas`
* **Descripción:** **(Rol: Medico)** Crea y emite una nueva receta médica asociada a un paciente y a una consulta.




* `GET /api/recetas/usuario/{idUsuario}`
* **Descripción:** **(Rol: Usuario/Paciente)** Permite al paciente consultar todas las recetas médicas que le han emitido.




* `GET /api/recetas/{idReceta}`
* **Descripción:** Obtiene el detalle completo de una receta en específico.



---

### 5. Reseñas (`/api/resenas`)

Para que los pacientes califiquen la atención de los médicos.

* `POST /api/resenas`
* **Descripción:** **(Rol: Usuario/Paciente)** Permite a un paciente dejar una calificación (1 a 10) y un comentario sobre un médico con el que ya se atendió.




* `GET /api/resenas/medico/{idMedico}`
* **Descripción:** Lista todas las reseñas y calificaciones asociadas a un médico en particular.

## prompt_2
ahora necesito los endpoints del sistema

## respuesta_2
Para estructurar los controladores en tu proyecto con Spring Boot (`@RestController`), lo ideal es organizarlos de manera lógica según las entidades que acabamos de definir.

Aquí tienes la propuesta completa de los **endpoints** RESTful necesarios para cubrir todos los flujos del sistema (Autenticación, Gestión de Médicos, Citas, Recetas y Reseñas):

---

### 1. Autenticación y Usuarios (`/api/auth` o `/api/usuarios`)

Encargados del registro y de validar el inicio de sesión para ambos tipos de usuario.

* `POST /api/auth/registro`
* **Descripción:** Registra un nuevo usuario en el sistema. Si se registra como médico, también crea su registro en la tabla `Medico`.


* `POST /api/auth/login`
* **Descripción:** Autentica al usuario (por correo y contraseña) y devuelve sus datos básicos (o un token JWT si planeas usarlo).



---

### 2. Médicos (`/api/medicos`)

Para que los pacientes puedan consultar la lista de profesionales disponibles y ver sus perfiles.

* `GET /api/medicos`
* **Descripción:** Lista todos los médicos registrados en el sistema con sus datos de especialidad y dirección.




* `GET /api/medicos/{id}`
* **Descripción:** Obtiene los detalles de un médico específico, incluyendo sus reseñas y su calificación promedio.



---

### 3. Citas Médicas (`/api/citas`)

Maneja tanto la creación de espacios por parte del médico como la reserva por parte del paciente.

* `POST /api/citas`
* **Descripción:** **(Rol: Medico)** El médico crea una nueva cita disponible en su agenda (con fecha, hora de inicio y hora de fin; el `id_usuario` se queda nulo).




* `GET /api/citas/medico/{idMedico}`
* **Descripción:** Lista las citas creadas por un médico específico (útil para que el médico vea su agenda y el paciente vea las disponibles).


* `PUT /api/citas/{idCita}/agendar`
* **Descripción:** **(Rol: Usuario/Paciente)** Asigna el `id_usuario` del paciente logueado a una cita que estaba libre, reservándola.




* `GET /api/citas/usuario/{idUsuario}`
* **Descripción:** **(Rol: Usuario/Paciente)** Muestra el historial de citas agendadas por un paciente específico.



---

### 4. Recetas Médicas (`/api/recetas`)

Para que el médico prescriba y el paciente consulte sus indicaciones médicas.

* `POST /api/recetas`
* **Descripción:** **(Rol: Medico)** Crea y emite una nueva receta médica asociada a un paciente y a una consulta.




* `GET /api/recetas/usuario/{idUsuario}`
* **Descripción:** **(Rol: Usuario/Paciente)** Permite al paciente consultar todas las recetas médicas que le han emitido.




* `GET /api/recetas/{idReceta}`
* **Descripción:** Obtiene el detalle completo de una receta en específico.



---

### 5. Reseñas (`/api/resenas`)

Para que los pacientes califiquen la atención de los médicos.

* `POST /api/resenas`
* **Descripción:** **(Rol: Usuario/Paciente)** Permite a un paciente dejar una calificación (1 a 10) y un comentario sobre un médico con el que ya se atendió.




* `GET /api/resenas/medico/{idMedico}`
* **Descripción:** Lista todas las reseñas y calificaciones asociadas a un médico en particular.


## prompt_3
en base a lo que hemos comentado y la logica del negocio dame la lista de restricciones porfas

## respuesta_3
Aquí tienes la lista completa y estructurada de las **reglas de negocio y restricciones del sistema**, organizadas por módulo.

Estas restricciones garantizan la integridad de los datos en la base de datos y deben validarse en la capa de servicio (`@Service`) de Spring Boot antes de realizar cualquier operación de persistencia.

---

### 1. Usuarios y Autenticación

* **Unicidad de correo:** El correo electrónico debe ser único en la tabla `Usuario`. No pueden registrarse dos cuentas con el mismo correo.
* **Formato de correo y contraseña:** El correo debe cumplir con una estructura válida (`@`) y la contraseña debe almacenarse encriptada (usando BCrypt).
* **Integridad del perfil médico:** Un usuario con rol `MEDICO` debe contar obligatoriamente con su registro correspondiente en la tabla `Medico` (con `cedula_profesional`, `especialidad` y `direccion` no nulos). Un usuario con rol `PACIENTE` no puede tener registro en la tabla `Medico`.

---

### 2. Citas Médicas (`Cita`)

* **Disponibilidad para reserva:** Un paciente solo puede agendar una cita si esta se encuentra explícitamente en estado `DISPONIBLE` y con `id_usuario` nulo.
* **Límite de citas activas por paciente:** Un paciente no puede tener más de **$N$ citas activas** (en estado `RESERVADA`) simultáneamente o con fechas futuras (por ejemplo, máximo 2 o 3 citas vigentes a la vez).
* **No solapamiento de horario (Paciente):** Un paciente no puede agendar una cita si ya tiene otra cita en estado `RESERVADA` en la misma fecha y cuyo rango de tiempo (`hora_inicio` a `hora_fin`) se traslape con la nueva.
* **No solapamiento de horario (Médico):** Un médico no puede crear dos citas en su agenda que se empalmen en fecha y hora.
* **Coherencia temporal:** La `hora_fin` de una cita debe ser estrictamente posterior a la `hora_inicio`, y la fecha de creación/reserva no puede ser anterior a la fecha actual.
* **Transición de estados:**
* Una cita solo pasa de `DISPONIBLE` a `RESERVADA` al asignársele un paciente.
* Solo una cita en estado `RESERVADA` puede pasar a `ATENDIDA` o `CANCELADA`.



---

### 3. Recetas Médicas (`Receta`)

* **Requisito de cita atendida:** Una receta solo puede ser emitida por un médico si está vinculada a una cita que se encuentre en estado `ATENDIDA`.
* **Unicidad de receta por cita:** Una cita en estado `ATENDIDA` solo puede tener **una única receta** asociada (`@OneToOne`).
* **Coherencia de la consulta:** Los campos `id_medico` e `id_usuario` de la receta deben coincidir exactamente con el médico y paciente asociados a esa cita en particular.

---

### 4. Reseñas (`Reseña`) — *Opción 1 Seleccionada*

* **Requisito de cita previa:** Un usuario solo puede escribir una reseña si existe una cita vinculada a él y al médico en estado `ATENDIDA`.
* **Una reseña por cita:** Cada cita en estado `ATENDIDA` permite registrar **únicamente una reseña**. No se pueden crear múltiples reseñas a partir de una misma consulta.
* **Verificación de autoría:** El `id_usuario` que crea la reseña debe ser el mismo paciente que asistió a dicha cita.
* **Rango de calificación:** El valor de la calificación debe estar acotado numéricamente dentro del rango de **1 a 10** (o 1 a 5, según definas en la interfaz).


## prompt_4
Hola, tengo que realizar un proyecto para Desarrollo Web, la idea es un sistema para medicos y pacientes. Necesito una propuesta para la interfaz, simple y con color tenue y acorde al contexto. Hay un login y registro de cuenta. El medico crea espacios de citas y el paciente/usuario puede agendar, posterior a la cita el medico crea una receta y el usuario puede dejar una resena sobre el medico. Los requisitos y restricciones definidos son los siguientes:  Autenticación y Usuarios		
RF-01	Registro de Usuarios	Como visitante de la plataforma, quiero registrarme ingresando mis datos, especificando si soy paciente o médico, para obtener una cuenta de acceso al sistema.
RF-02	Inicio de sesión en el sistema	Como usuario registrado, quiero iniciar sesión ingresando mis credenciales (correo y contraseña), para autenticarme y acceder al panel de control correspondiente a mi rol (PACIENTE o MEDICO).
		
Directorio de Médicos		
RF-03	Consulta del directorio médico	Como paciente, quiero visualizar la lista de médicos registrados con su información profesional (especialidad, cédula profesional y dirección), para elegir al especialista adecuado para mi consulta.
		
Citas Médicas		
RF-04	Publicación de citas	Como médico, quiero crear citas (fecha, hora de inicio y hora de fin) marcados con estado DISPONIBLE, para exponer mi agenda de citas al público y que los pacientes puedan reservarlos.
RF-05	Agendar una cita médica	Como paciente, quiero seleccionar una cita disponible de un médico y reservarla, para apartar mi consulta, validando que no exceda mi límite de citas activas ni se cruce con otros horarios.
RF-06	Control de estados de la cita	Como sistema / usuario autorizado, quiero que las citas transicionen dinámicamente entre los estados DISPONIBLE, RESERVADA, ATENDIDA y CANCELADA, para reflejar el flujo real de la atención médica.
		
Recetas Médicas		
RF-07	Creación de receta médica	Como médico, quiero emitir una receta digital asociada de forma única a una cita que se encuentre en estado ATENDIDA, para registrar el diagnóstico y tratamiento prescrito al paciente.
RF-08	Visualización de recetas históricas.	Como paciente, quiero consultar el detalle de las recetas médicas que me han emitido en mis consultas pasadas, para poder revisarlas o surtirlas cuando lo necesite.
RF-09	Exportación de receta médica a documento PDF.	Como paciente, quiero descargar la receta médica correspondiente a una cita en formato PDF con diseño formal, para poder imprimirla, guardarla localmente o presentarla fácilmente en la farmacia.
		
Reseñas y Calificaciones		
RF-10	Calificación de la atención médica	Como paciente, quiero emitir una reseña que incluya una calificación numérica (del 1 al 10) y un comentario sobre un médico, vinculada estrictamente a una cita que ya fue ATENDIDA, para evaluar la calidad del servicio recibido.
RF-11	Filtros de opiniones sobre el médico.	Como paciente que explora el directorio, quiero filtrar y ordenar las reseñas de un médico específico (por ejemplo, ordenarlas de la calificación más alta a la más baja, o filtrar por un rango de estrellas/puntuación), para tomar una decisión más informada al momento de elegir con qué especialista atenderme.   ;;  RES-01	Unicidad de correo: El correo electrónico debe ser único en la tabla Usuario. No pueden registrarse dos cuentas con el mismo correo.
RES-02	Formato de correo y contraseña: El correo debe cumplir con una estructura válida (@) y la contraseña debe almacenarse encriptada (usando BCrypt).
RES-03	Integridad del perfil médico: Un usuario con rol MEDICO debe contar obligatoriamente con su registro correspondiente en la tabla Medico (con cedula_profesional, especialidad y direccion no nulos). Un usuario con rol PACIENTE no puede tener registro en la tabla Medico.
RES-04	Disponibilidad para reserva: Un paciente solo puede agendar una cita si esta se encuentra explícitamente en estado DISPONIBLE y con id_usuario nulo.
RES-05	Límite de citas activas por paciente: Un paciente no puede tener más de $N$ citas activas (en estado RESERVADA) simultáneamente o con fechas futuras (por ejemplo, máximo 2 o 3 citas vigentes a la vez).
RES-06	No solapamiento de horario (Paciente): Un paciente no puede agendar una cita si ya tiene otra cita en estado RESERVADA en la misma fecha y cuyo rango de tiempo (hora_inicio a hora_fin) se traslape con la nueva.
RES-07	No solapamiento de horario (Médico): Un médico no puede crear dos citas en su agenda que coincidan en fecha y hora.
RES-08	Coherencia temporal: La hora_fin de una cita debe ser estrictamente posterior a la hora_inicio, y la fecha de creación/reserva no puede ser anterior a la fecha actual.
RES-09	"Transición de estados:
Una cita solo pasa de DISPONIBLE a RESERVADA al asignársele un paciente.
Solo una cita en estado RESERVADA puede pasar a ATENDIDA o CANCELADA."
RES-10	Requisito de cita atendida: Una receta solo puede ser emitida por un médico si está vinculada a una cita que se encuentre en estado ATENDIDA.
RES-11	Unicidad de receta por cita: Una cita en estado ATENDIDA solo puede tener una única receta asociada (@OneToOne).
RES-12	Coherencia de la consulta: Los campos id_medico e id_usuario de la receta deben coincidir exactamente con el médico y paciente asociados a esa cita en particular.
RES-13	Requisito de cita previa: Un usuario solo puede escribir una reseña si existe una cita vinculada a él y al médico en estado ATENDIDA.
RES-14	Una reseña por cita: Cada cita en estado ATENDIDA permite registrar únicamente una reseña. No se pueden crear múltiples reseñas a partir de una misma consulta.
RES-15	Verificación de autoría: El id_usuario que crea la reseña debe ser el mismo paciente que asistió a dicha cita.
RES-16	Rango de calificación: El valor de la calificación debe estar acotado numéricamente dentro del rango de 1 a 10 (o 1 a 5, según definas en la interfaz).

## respuesta_4
Preparé un prototipo interactivo con paleta suave (verde salvia y azul grisáceo), que cubre login, registro, directorio, reservas, recetas y reseñas.

Armé un prototipo navegable de la interfaz: **MediCita**, en HTML puro, con modo claro y oscuro. Úsalo como referencia visual para tu proyecto.

**Estilo.** Fondo gris verdoso muy claro, tarjetas blancas y un solo color de acento verde azulado. Los estados de la cita tienen colores tenues: DISPONIBLE (verde), RESERVADA (azul), ATENDIDA (teal) y CANCELADA (rojo suave).

**Pantallas incluidas** (con los botones de "Vista previa" arriba puedes saltar entre ellas):
- **Login y registro (RF-01, RF-02):** el registro tiene un selector paciente/médico. Si eliges médico aparecen cédula, especialidad y dirección (RES-03). También valida el formato del correo (RES-02).
- **Paciente:**
  - Directorio con búsqueda y filtro por especialidad (RF-03).
  - Detalle del médico con horarios disponibles y reseñas, que se pueden ordenar y filtrar por rango de calificación (RF-04, RF-11).
  - "Mis citas" con contador de citas activas (RES-05), cancelar y estados.
  - Recetas con vista formal tipo PDF y botón de descarga (RF-08, RF-09).
  - Reseña con calificación de 1 a 10, solo disponible en citas ATENDIDA (RF-10, RES-13, RES-14).
- **Médico:**
  - Agenda con formulario para publicar citas, que valida que la hora fin sea posterior a la de inicio y que la fecha no sea pasada (RES-08).
  - Botones "Marcar atendida" y "Cancelar" solo en citas RESERVADA (RES-09).
  - "Emitir receta" solo en citas ATENDIDA (RES-10).
  - Listado de recetas emitidas.

**Notas para tu implementación:**
- Los datos son de ejemplo. Las reglas que dependen de la base de datos (unicidad de correo, solapamientos RES-06 y RES-07, límite N, una receta o reseña por cita, coherencia de autoría) deben validarse en el backend. En la interfaz conviene mostrar el error que devuelva el servidor, por ejemplo con un aviso emergente.
- El botón de PDF solo muestra un aviso. En tu proyecto puedes generarlo con iText o OpenPDF en Java, o con jsPDF en el cliente.
- Si prefieres calificación de 1 a 5 (RES-16), basta cambiar el rango del control deslizante.

El prototipo está aquí: https://claude.ai/artifact/LKTaxGiwrf1cnNz8mFUzXt

Si quieres, puedo adaptarlo a tu stack (React, Thymeleaf, Angular) o ajustar la paleta.
---

## Observaciones adicionales

Agregar cualquier comentario explicativo relevante.

No existen observaciones.