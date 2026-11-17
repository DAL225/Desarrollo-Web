# Reporte de Uso Documental en el Proyecto

**Fecha:** 16/11/2026 \
**Número de reporte:**  03

---

# 1. Breve descripción de uso

Se consulto un error al realizar GET y POST, sobre resena, se obtuvo el requerir el uso de DTOs, para la deserializacion de datos provenientes del frontend/peticion

---

# 2. Evidencias de uso

| Fecha | Herramienta | Enlace a prompt | Enlace a respuesta |
|------------|------------------------|-----------------|-------|
| 16/11/2026 | Chat gpt | [prompt_1](#prompt_1)| [respuesta_1](#respuesta_1)|
| | | | |
| | | | |

> El prompt y la respuesta pueden ser copiados como una subsección y enlazados

## prompt_1
amiss@AngelMisael:~/temp/Desarrollo-Web$ curl -X POST "http://localhost:8081/api/resenas" -H "Content-Type: application/
json" -H "Accept: application/json" -d '{
    "medico": {
        "idMedico": 52
    },
    "usuario": {
        "idUsuario": 102
    },
    "calificacion": 9,
    "comentario": "Excelente atención médica",
    "fecha": "2026-11-13"
}'
{"timestamp":"2026-11-16T19:51:15.349Z","status":400,"error":"Bad Request","trace":"org.springframework.http.converter.HttpMessageNotReadableException: JSON parse error: Cannot construct instance of `mx.uv.medlink.backend.Medico`, problem: El médico debe estar asociado obligatoriamente a un usuario.\n\tat org.springframework.http.converter.AbstractJacksonHttpMessageConverter.readJavaType(AbstractJacksonHttpMessageConverter.java:363)\n\tat org.springframework.http.converter.AbstractJacksonHttpMessageConverter.read(AbstractJacksonHttpMessageConverter.java:319)\n\tat org.springframework.web.servlet.mvc.method.annotation.AbstractMessageConverterMethodArgumentResolver.readWithMessageConverters(AbstractMessageConverterMethodArgumentResolver.java:203)\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.readWithMessageConverters(RequestResponseBodyMethodProcessor.java:181)\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.resolveArgument(RequestResponseBodyMethodProcessor.java:156)\n\tat org.springframework.web.method.support.HandlerMethodArgumentResolverComposite.resolveArgument(HandlerMethodArgumentResolverComposite.java:122)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.getMethodArgumentValues(InvocableHandlerMethod.java:224)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:174)\n\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:117)\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:934)\n\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:853)\n\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:86)\n\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:963)\n\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:866)\n\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1000)\n\tat org.springframework.web.servlet.FrameworkServlet.doPost(FrameworkServlet.java:903)\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:649)\n\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:874)\n\tat jakarta.servlet.http.HttpServlet.service(HttpServlet.java:710)\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:132)\n\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:59)\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\n\tat org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:100)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\n\tat org.springframework.web.filter.FormContentFilter.doFilterInternal(FormContentFilter.java:93)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\n\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:199)\n\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:116)\n\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:111)\n\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:164)\n\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:77)\n\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:540)\n\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:115)\n\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:86)\n\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:71)\n\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:347)\n\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:411)\n\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:71)\n\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:1308)\n\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:2202)\n\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:74)\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:947)\n\tat org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:481)\n\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:74)\n\tat java.base/java.lang.Thread.run(Thread.java:840)\nCaused by: tools.jackson.databind.exc.ValueInstantiationException: Cannot construct instance of `mx.uv.medlink.backend.Medico`, problem: El médico debe estar asociado obligatoriamente a un usuario.\n at [Source: REDACTED (`StreamReadFeature.INCLUDE_SOURCE_IN_LOCATION` disabled); byte offset: #45] (through reference chain: mx.uv.medlink.backend.Resena[\"medico\"])\n\tat tools.jackson.databind.exc.ValueInstantiationException.from(ValueInstantiationException.java:44)\n\tat tools.jackson.databind.DeserializationContext.instantiationException(DeserializationContext.java:2117)\n\tat tools.jackson.databind.deser.std.StdValueInstantiator.wrapAsDatabindException(StdValueInstantiator.java:581)\n\tat tools.jackson.databind.deser.std.StdValueInstantiator.rewrapCtorProblem(StdValueInstantiator.java:602)\n\tat tools.jackson.databind.deser.std.StdValueInstantiator.createFromObjectWith(StdValueInstantiator.java:289)\n\tat tools.jackson.databind.deser.ValueInstantiator.createFromObjectWith(ValueInstantiator.java:271)\n\tat tools.jackson.databind.deser.bean.PropertyBasedCreator.build(PropertyBasedCreator.java:294)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer._deserializeUsingPropertyBased(BeanDeserializer.java:822)\n\tat tools.jackson.databind.deser.bean.BeanDeserializerBase.deserializeFromObjectUsingNonDefault(BeanDeserializerBase.java:1509)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer.deserializeFromObject(BeanDeserializer.java:610)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer.deserialize(BeanDeserializer.java:200)\n\tat tools.jackson.databind.deser.SettableBeanProperty.deserialize(SettableBeanProperty.java:569)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer._deserializeWithErrorWrapping(BeanDeserializer.java:884)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer._deserializeUsingPropertyBased(BeanDeserializer.java:735)\n\tat tools.jackson.databind.deser.bean.BeanDeserializerBase.deserializeFromObjectUsingNonDefault(BeanDeserializerBase.java:1509)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer.deserializeFromObject(BeanDeserializer.java:610)\n\tat tools.jackson.databind.deser.bean.BeanDeserializer.deserialize(BeanDeserializer.java:200)\n\tat tools.jackson.databind.deser.DeserializationContextExt.readRootValue(DeserializationContextExt.java:266)\n\tat tools.jackson.databind.ObjectReader._bindAndClose(ObjectReader.java:1888)\n\tat tools.jackson.databind.ObjectReader.readValue(ObjectReader.java:1270)\n\tat org.springframework.http.converter.AbstractJacksonHttpMessageConverter.readJavaType(AbstractJacksonHttpMessageConverter.java:352)\n\t... 46 more\nCaused by: java.lang.IllegalArgumentException: El médico debe estar asociado obligatoriamente a un usuario.\n\tat mx.uv.medlink.backend.Medico.<init>(Medico.java:52)\n\tat java.base/java.lang.invoke.MethodHandle.invokeWithArguments(MethodHandle.java:732)\n\tat tools.jackson.databind.introspect.AnnotatedConstructor.call(AnnotatedConstructor.java:113)\n\tat tools.jackson.databind.deser.std.StdValueInstantiator.createFromObjectWith(StdValueInstantiator.java:287)\n\t... 62 more\n","message":"JSON parse error: Cannot construct instance of `mx.uv.medlink.backend.Medico`, problem: El médico debe estar asociado obligatoriamente a un usuario.","path":"/api/ramiss@AngelMisaeamiss@AngelMisael:~amiss@AngelMisael:~/temp/Desarrollo-Web$


## respuesta_1
El error no está relacionado directamente con el endpoint `POST /api/resenas`, sino con la forma en que Jackson está intentando construir el objeto `Medico` a partir del JSON.

La parte importante del error es:

```
Cannot construct instance of `mx.uv.medlink.backend.Medico`,
problem: El médico debe estar asociado obligatoriamente a un usuario.
```

Y señala específicamente esta línea:

```
Medico.<init>(Medico.java:52)
```

## **1. ¿Por qué ocurre?**

Actualmente estás enviando:

```
"medico": {
    "idMedico": 52
}
```

Pero, por lo que indica el error, tu clase `Medico` tiene una validación en su constructor que obliga a que cada médico esté asociado a un usuario.

Probablemente tienes algo parecido a esto:

```
public Medico(Usuario usuario, ...) {
    if (usuario == null) {
        throw new IllegalArgumentException(
            "El médico debe estar asociado obligatoriamente a un usuario."
        );
    }

    this.usuario = usuario;
}
```

Cuando Jackson recibe el JSON, intenta construir un objeto `Medico` únicamente con el identificador `idMedico`, pero no encuentra el usuario asociado y lanza la excepción.

## **2. ¿Cómo solucionarlo?**

Hay dos alternativas, aunque te recomiendo la primera.

**Opción 1. Utilizar DTO para registrar reseñas (recomendada).**

En lugar de recibir directamente entidades `Medico` y `Usuario`, recibe sus identificadores.

Por ejemplo:

```
public class ResenaDTO {

    private Integer idMedico;
    private Integer idUsuario;
    private Integer calificacion;
    private String comentario;
    private LocalDate fecha;

    // Getters y setters
}
```

Y en tu controlador o servicio recuperas las entidades desde sus respectivos repositorios:

```
Medico medico = medicoRepository.findById(dto.getIdMedico())
    .orElseThrow(() -> new RuntimeException("Médico no encontrado"));

Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
```

Posteriormente construyes la reseña utilizando las entidades recuperadas.

Así evitas que Jackson tenga que construir entidades incompletas.

**Opción 2. Modificar la forma en que recibes las entidades.**

Podrías agregar un constructor sin argumentos o modificar la deserialización, pero no te recomiendo eliminar la validación de `Medico` solamente para resolver este problema.

La asociación obligatoria entre médico y usuario parece ser una regla de tu modelo de datos que conviene conservar.

## **3. ¿Cómo quedaría el CURL?**

Si implementas la primera alternativa, el JSON sería mucho más sencillo:

```
curl -X POST "http://localhost:8081/api/resenas" \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
    "idMedico": 52,
    "idUsuario": 102,
    "calificacion": 9,
    "comentario": "Excelente atención médica",
    "fecha": "2026-11-13"
}'
```

## **4. Necesito revisar algo de tu implementación**

Para darte una solución que encaje con tu proyecto MedLink, compárteme estas tres clases:

1. `Medico.java`: principalmente sus constructores y la relación con `Usuario`.
2. `Resena.java`: para revisar cómo están relacionadas las entidades.
3. `ResenaController.java`**&#x20;y/o&#x20;**`ResenaService.java`: para adaptar el registro.

Mi recomendación es mantener las entidades como están y resolver la recepción de datos mediante DTO. Así evitamos modificar relaciones que ya funcionan y mantenemos una separación adecuada entre la API y el modelo de persistencia.
