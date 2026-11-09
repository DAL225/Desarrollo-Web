------Definicion de un esquema para base de datos local-------
------En el proyecto se usa una base de datos en la nube-------


-- 1. Crear la base de datos para el sistema médico
CREATE DATABASE db_citas_medicas;

-- 2. Conectarse a la base de datos en psql 
-- \c db_citas_medicas

-- 3. Crear el usuario administrador de la BD médica
CREATE USER admin_medico WITH PASSWORD '12345';

-- 4. Otorgar todos los privilegios
GRANT ALL PRIVILEGES ON DATABASE db_citas_medicas TO admin_medico;

-- 5. Otorgar permisos sobre el esquema public y definirlo como propietario
GRANT ALL ON SCHEMA public TO admin_medico;
ALTER DATABASE db_citas_medicas OWNER TO admin_medico;

-- 6. Asegurar permisos futuros para las tablas que cree Spring Boot / JPA
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO admin_medico;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO admin_medico;