# Reporte de IA Desarrollo en el Proyecto

**Fecha:**  13/11/2026
**Número de reporte:** 04

---

# 1. Breve descripción de uso

Pruebas CURL sobre Resena

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
Prueba de funcionamiento | curl -X GET "http://localhost:8080/api/resenas/medico/1" \
-H "Accept: application/json" ,, curl -X POST "http://localhost:8080/api/resenas" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "medico": {
        "idMedico": 1
    },
    "usuario": {
        "idUsuario": 2
    },
    "calificacion": 9,
    "comentario": "Excelente atención médica",
    "fecha": "2026-11-13"
}'
Código de uso | Pruebas  
Reflexión del estudiante | Creacion de comandos de prueba. La importancia de las pruebas unitarias en cada entidad ademas de la nomenclatura.

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
para GET y POST, generame curls sobre pruebas hacia ellos,

## respuesta_1
¡Claro! Te dejo los comandos `curl` para probar los dos endpoints de tu controlador `ResenaControlador`, suponiendo que tu Spring Boot se ejecuta en el puerto `8080`.

## **1. GET – Obtener reseñas de un médico**

**Endpoint:**

```
GET http://localhost:8080/api/resenas/medico/{idMedico}
```

**Comando curl:**

```
curl -X GET "http://localhost:8080/api/resenas/medico/1" \
-H "Accept: application/json"
```

Aquí estamos consultando las reseñas del médico con identificador `1`.

**Respuesta esperada si existen reseñas:**

```
{
    "ok": true,
    "message": "Resenas encontradas",
    "data": [
        {
            "id_resena": 1,
            "medico": {
                "idMedico": 1
            },
            "usuario": {
                "idUsuario": 2
            },
            "calificacion": 9,
            "comentario": "Excelente atención médica",
            "fecha": "2026-11-13"
        }
    ]
}
```

La estructura exacta dependerá de los atributos y las relaciones de tus entidades.

## **2. POST – Guardar una reseña**

**Endpoint:**

```
POST http://localhost:8080/api/resenas
```

**Comando curl:**

```
curl -X POST "http://localhost:8080/api/resenas" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "medico": {
        "idMedico": 1
    },
    "usuario": {
        "idUsuario": 2
    },
    "calificacion": 9,
    "comentario": "Excelente atención médica",
    "fecha": "2026-11-13"
}'
```

**Respuesta esperada si se guarda correctamente:**

```
{
    "ok": true,
    "message": "Resena guardada correctamente",
    "data": {
        "id_resena": 1,
        "medico": {
            "idMedico": 1
        },
        "usuario": {
            "idUsuario": 2
        },
        "calificacion": 9,
        "comentario": "Excelente atención médica",
        "fecha": "2026-11-13"
    }
}
```

## **3. Pruebas adicionales para POST**

Te recomiendo probar diferentes escenarios:

| Prueba | Calificación | Citas atendidas | Reseñas existentes | Resultado                |
| ------ | ------------ | --------------- | ------------------ | ------------------------ |
| 1      | 9            | 5               | 0                  | Permitida                |
| 2      | 10           | 5               | 1                  | Permitida                |
| 3      | 7            | 5               | 5                  | Rechazada                |
| 4      | 11           | 5               | 2                  | Rechazada por validación |
| 5      | 0            | 5               | 2                  | Rechazada por validación |
| 6      | 8            | 0               | 0                  | Rechazada                |

Para probar las calificaciones inválidas, utiliza el mismo POST cambiando el valor de `calificacion`.

**Importante:** para que las pruebas de los escenarios 1, 2, 3 y 6 funcionen como esperamos, debes tener implementada la consulta de citas atendidas en `ICita` y la validación en `ResenaService`. También debes tener en cuenta que `@Min` y `@Max` requieren que actives la validación con `@Valid` en el parámetro `@RequestBody` del controlador.

## **4. Ejecutar las pruebas en Windows**

Si estás utilizando CMD o PowerShell, puedes ejecutar los comandos en una sola línea para evitar problemas con los saltos de línea:

```
curl.exe -X POST "http://localhost:8080/api/resenas" -H "Content-Type: application/json" -H "Accept: application/json" -d "{\"medico\":{\"idMedico\":1},\"usuario\":{\"idUsuario\":2},\"calificacion\":9,\"comentario\":\"Excelente atencion medica\",\"fecha\":\"2026-11-13\"}"
```

Recomendación

Prueba primero el GET y después el POST. Finalmente, vuelve a ejecutar el GET para comprobar que la reseña recién insertada aparece en los resultados.

Si tu aplicación utiliza otro puerto, sustituye `8080` por el correspondiente.


## Observaciones adicionales

Durante este commit se mezclo con la version de otro companero, lo cual la salida de la diferencia de commits marca cambios sobre medicos y usuarios.
