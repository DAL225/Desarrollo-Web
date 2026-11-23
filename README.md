# Desarrollo-Web

## Descripción

Proyecto web que utiliza **Spring Boot** para el backend y una interfaz web para el frontend. Se conecta a una base de datos PostgreSQL alojada en Aiven.

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de contar con las siguientes herramientas:

- [Git](https://git-scm.com/) para clonar el repositorio.
- [Visual Studio Code](https://code.visualstudio.com/) como entorno de desarrollo.
- [WSL](https://learn.microsoft.com/es-es/windows/wsl/install) para trabajar desde Linux en Windows.
- Java JDK, compatible con la versión configurada en el proyecto.
- [Apache Maven](https://maven.apache.org/) para compilar y ejecutar el backend.
- Extensión **Live Preview** de Visual Studio Code para visualizar el frontend.

## 1. Clonar el repositorio

Abre una terminal de WSL y ubícate en el directorio donde deseas almacenar el proyecto.

Ejecuta el siguiente comando para clonar el repositorio:

```bash
git clone https://github.com/DAL225/Desarrollo-Web.git
```

Una vez completada la descarga, ingresa al directorio del proyecto:

```bash
cd Desarrollo-Web/
```

## 2. Abrir el proyecto en Visual Studio Code

Desde la terminal, ejecuta el siguiente comando para abrir el proyecto:

```bash
code .
```

## 3. Configurar la conexión a la base de datos

Dentro de Visual Studio Code, localiza la siguiente ruta:

```text
backend/
└── src/
    └── main/
        └── resources/
```

En la carpeta `resources`, crea un archivo llamado `application.properties`.

Este archivo contendrá la configuración del servidor, la conexión a PostgreSQL y los parámetros de JPA/Hibernate.

Agrega el siguiente contenido:

```properties
# Configuración del servidor local de aplicación
spring.application.name=backend
server.port=8081

# Configuración de PostgreSQL en Aiven (con SSL requerido)
spring.datasource.url=jdbc:postgresql://server-doc-medic-bd.e.aivencloud.com:28876/defaultdb?sslmode=require
spring.datasource.username=avnadmin
spring.datasource.password=abcdefgh

# Configuración de JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
# spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

**Importante:** El password debe consultarse con los desarrolladores del proyecto, 'abcdefgh' es una prueba.

## 4. Compilar el backend

Regresa a la terminal de WSL y asegúrate de encontrarte en el directorio principal del proyecto.

Ingresa a la carpeta `backend`:

```bash
cd backend/
```

Una vez dentro, ejecuta el siguiente comando para compilar el proyecto y verificar que sus dependencias y componentes estén correctamente configurados:

```bash
mvn compile
```

Espera a que el proceso termine correctamente antes de continuar.

## 5. Ejecutar el servidor backend

Después de completar la compilación, ejecuta el siguiente comando para iniciar el servidor de Spring Boot:

```bash
mvn spring-boot:run
```

El backend estará disponible en el siguiente puerto:

```text
http://localhost:8081
```

Mantén abierta la terminal mientras el servidor se encuentre en ejecución.

## 6. Ejecutar el frontend

Una vez que el backend se encuentre funcionando, abre en Visual Studio Code la carpeta `frontend` y localiza el archivo `index.html`.

Para visualizar la interfaz, utiliza la extensión **Live Preview** de Visual Studio Code:

1. Abre el archivo `frontend/index.html`.
2. Inicia Live Preview desde Visual Studio Code.
3. La extensión levantará un servidor local en el puerto `3000`.
4. Copia la dirección generada y ábrela en tu navegador.

La dirección esperada es:

```text
http://127.0.0.1:3000/frontend/index.html
```

### Alternativa para visualizar el frontend

Si se presentan problemas al utilizar Live Preview, puedes acceder directamente a la siguiente dirección:

[http://localhost:8081/](http://localhost:8081/)

Esta alternativa permite visualizar el frontend desde el mismo servidor de Spring Boot, sin necesidad de utilizar Live Preview.

## 7. Usuarios de prueba

El sistema cuenta con perfiles de usuario/paciente y médico para probar las funcionalidades disponibles.

Además, la base de datos contiene los siguientes usuarios con información previamente registrada:

| Correo electrónico | Contraseña | Rol |
|---|---|---|
| rmora@gmail.com | 1234 | Médico |
| pmontez@gmail.com | 1234 | Médico |
| gcruz@gmail.com | 1234 | Médico |
| pramirez@gmail.com | 1234 | Usuario/Paciente |
| fhernandez@gmail.com | 1234 | Usuario/Paciente |

## 8. Resumen de direcciones y puertos

| Servicio | Dirección | Puerto |
|---|---|---|
| Backend (Spring Boot) | `http://localhost:8081` | 8081 |
| Frontend (Live Preview) | `http://127.0.0.1:3000/frontend/index.html` | 3000 |
| Base de datos (PostgreSQL - Aiven) | `server-doc-medic-bd.e.aivencloud.com` | 28876 |

---

**Nota:** Para ejecutar correctamente el proyecto, es necesario que el backend esté iniciado y que la conexión con la base de datos PostgreSQL se encuentre configurada correctamente.
