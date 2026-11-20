package mx.uv.medlink.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class UsuarioControlador { 

    @Autowired
    private UsuarioService usuarioService;
    private IUsuario iusuario;

// Se establecen patrones para validaciones
String patronNombre = "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$";
String patronTelefono = "^[0-9]{10}$";
String patronCorreo = "^[A-Za-z0-9._%+-]{1,20}@gmail\\.com$";
String patronPassword = "^\\S{1,20}$";

    /**
     * Consulta el listado completo de usuarios registrados en el sistema.
     * Ejemplo de uso: POST /usuario/Juan Pérez/juan@mail.com/12345/2281234567/paciente
     * @return el listado de usuarios o un mensaje informativo en texto plano.
     */
    @GetMapping("/api/usuarios")
    public Object verUsuarios() {
        try {
            //Obtiene una lista de usuarios en el sistema
            List<Usuario> usuarios = usuarioService.obtenerUsuarios();
            //Verifica que la lista no este vacia, si esta vacia envia un mensaje al usuario
            if (usuarios.isEmpty()) {
                return "No hay usuarios registrados en el sistema";
            }
            //Envia la lista de usuarios
            return usuarios;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error detallado: "+e.getMessage();
        }
    }

/**
     * Consulta un usuario específico mediante su identificador numérico.
     * 
     * @param id identificador único del usuario en formato de texto para validación.
     * @return el objeto usuario encontrado o un mensaje de texto con el error correspondiente.
     */
    @GetMapping("/usuario/{id}")
    public Object verUsuario(@PathVariable String id) {
        try {
            //Se verifica que id enviado por el usuario no tenga valor nulo.
            if (id == null) {
                return "El parámetro no puede ser nulo";
            }

            //Se verifica que el id enviado no sea una linea de caracteres vacia.
            if (id.length() == 0) {
                return "El parámetro no puede estar vacío";
            }

            //Se convierte el id de texto a entero.
            int idInt = Integer.parseInt(id);
            //Obtenemos el objeto del usuario encontrado y verificamos que no este vacio
            Usuario usuarioEncontrado = usuarioService.obtenerUsuarioPorId(idInt);
            if (usuarioEncontrado != null) {
                //Si se recupero el objeto se envia al usuario
                return usuarioEncontrado;
            } else {
                //Se notifica al usaurio que no fue encontrado
                return "El usuario no fue encontrado";
            }
        } catch (NumberFormatException e) {
            return "El identificador proporcionado no es un número entero válido";
        } catch (Exception e) {
            return "Error interno en el servidor";
        }
    }

    @Autowired
    private IMedico imedico;

    
    /**
     * Metodo para agregar un usuario a la BD ingresando sus parametros en el curl 
     * y , si es médico, se crea su perfil profesional automáticamente
     */
    @PostMapping("/api/usuarios/registro")
    public ResponseEntity<Map<String, Object>> agregarUsuario(@RequestBody Map<String, Object> body) {
        Map<String, Object> res = new HashMap<>();
        // Si no se recibieron datos en la solicitud se envia una respuesta inmediata
        if (body == null) {
            res.put("ok", false);
            res.put("mensaje", "El cuerpo de la solicitud no puede ser nulo");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        // Se recupera el contenido enviado por el usuario y se parsea a texto
        String nombre = body.get("nombre") != null ? String.valueOf(body.get("nombre")).trim() : "";
        String correo = body.get("correo") != null ? String.valueOf(body.get("correo")).trim() : "";
        String contrasena = body.get("contrasena") != null ? String.valueOf(body.get("contrasena")) : "";
        String telefono = body.get("telefono") != null ? String.valueOf(body.get("telefono")).trim() : "";
        String rol = body.get("rol") != null ? String.valueOf(body.get("rol")).trim() : "paciente";

        // Se realizan las validaciones en caso de no cumplirse se envia una respuesta explicando el problema
        if (nombre.isEmpty() || !nombre.matches(patronNombre)) {
            res.put("ok", false);
            res.put("mensaje", "Nombre inválido: solo letras y espacios");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (correo.isEmpty() || !correo.matches("(?i)" + patronCorreo)) {
            res.put("ok", false);
            res.put("mensaje", "Correo inválido: máx. 20 caracteres y dominio @gmail.com");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (contrasena.isEmpty() || !contrasena.matches(patronPassword)) {
            res.put("ok", false);
            res.put("mensaje", "Contraseña inválida: máx. 20 caracteres sin espacios");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (telefono.isEmpty() || !telefono.matches(patronTelefono)) {
            res.put("ok", false);
            res.put("mensaje", "Teléfono inválido: deben ser exactamente 10 dígitos numéricos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        // Se agrega el usuario a la BD y se envia el mensaje de confirmacion
        try {
            Usuario nuevoUsuario = usuarioService.crearUsuario(nombre, correo, contrasena, telefono, rol);
            res.put("ok", true);
            res.put("mensaje", "Usuario agregado correctamente");
            res.put("usuario", nuevoUsuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IllegalArgumentException e) {
            res.put("ok", false);
            res.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } catch (Exception e) {
            res.put("ok", false);
            res.put("mensaje", "Error interno al procesar el registro");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }
    
    /**
     * Elimina un usuario del sistema basándose en su identificador único.
     * 
     * @param id identificador único del usuario en formato de texto.
     * @return un mensaje de texto confirmando la eliminación o reportando el fallo.
     */
    @DeleteMapping("/api/usuarios/registro/{id}")
    public Object eliminarUsuario(@PathVariable String id) {
        try {
            //Se verifica que el id enviado tenga valor y texto no vacio
            if (id == null) {
                return "El identificador no puede ser nulo";
            }
            if (id.length() == 0) {
                return "El identificador no puede estar vacío";
            }

            //Se parsea el id a entero
            int idInt = Integer.parseInt(id);
            //Se elimina el usuario de la BD
            boolean eliminado = usuarioService.eliminarUsuario(idInt);
            //Si se regresa true o false se envia el mensaje de confirmacion correspondiente
            if (eliminado) {
                return "Usuario eliminado exitosamente";
            } else {
                return "No se encontró el usuario a eliminar";
            }
        } catch (NumberFormatException e) {
            return "El identificador debe ser un número entero válido";
        } catch (Exception e) {
            return "Error interno en el servidor";
        }
    }

    /**
     * Actualiza la información de un usuario existente tras validar su existencia y la integridad de los campos.
     * 
     * @param id id del usuario.
     * @param nombre nuevo nombre del usuario.
     * @param correo nuevo correo electrónico.
     * @param contrasena nueva contraseña del usuario.
     * @param telefono nuevo número telefónico.
     * @param rol nuevo rol asignado.
     * @return un mensaje de texto con el resultado de la actualización.
     */
    @PutMapping("/api/usuarios/registro/{id}/{nombre}/{correo}/{contrasena}/{telefono}/{rol}")
    public Object actualizarUsuario(
            @PathVariable String id,
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol) {

        try {
            //Se valida que cada uno de los datos recuperados no tenga el valor nulo y texto vacio en caso de error se regresa el mensaje correspondiente
            if (id == null) {
                return "El identificador no puede ser nulo";
            }
            if (id.length() == 0) {
                return "El identificador no puede estar vacío";
            }
            if (nombre == null) {
                return "El nombre no puede ser nulo";
            }
            if (nombre.length() == 0) {
                return "El nombre no puede estar vacío";
            }
            if (correo == null) {
                return "El correo no puede ser nulo";
            }
            if (correo.length() == 0) {
                return "El correo no puede estar vacío";
            }
            if (contrasena == null) {
                return "La contraseña no puede ser nula";
            }
            if (contrasena.length() == 0) {
                return "La contraseña no puede estar vacía";
            }
            if (telefono == null) {
                return "El teléfono no puede ser nulo";
            }
            if (telefono.length() == 0) {
                return "El teléfono no puede estar vacío";
            }
            if (rol == null) {
                return "El rol no puede ser nulo";
            }
            if (rol.length() == 0) {
                return "El rol no puede estar vacío";
            }
        
        //Se parsea el id a entero
            int idInt = Integer.parseInt(id);
        //Se modifica al usuario en la BD
            Usuario usuarioActualizado = usuarioService.modificarUsuario(idInt, nombre, correo, contrasena, telefono, rol);
        //Si se regresa el objeto modificado de la BD entonces se regresa un mensaje de confirmacion
            if (usuarioActualizado != null) {
                return "Usuario actualizado correctamente";
            } else {
                return "El usuario no existe en la base de datos";
            }
        } catch (NumberFormatException e) {
            return "El identificador debe ser un número entero válido";
        } catch (Exception e) {
            return "Error interno en el servidor";
        }
    }


    @PostMapping("/api/usuarios/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        // Se instancia la entidad para la respuesta
        Map<String, Object> res = new HashMap<>();
        // Se recupera el contenido del Body en JSON
        Object rawCorreo = (body != null) ? body.get("correo") : null;
        Object rawPassword = (body != null) ? body.get("psw") : null;
        // Se parsea el contenido en texto
        String correo = (rawCorreo != null) ? String.valueOf(rawCorreo).trim() : null;
        String password = (rawPassword != null) ? String.valueOf(rawPassword) : null;
        // Se declara una bandera booleana para validacion
        boolean datosValidos = true;
        // Se crea una variable para anotar los mensajes de error
        String mensajeError = "";

        // Se valida que cada uno de los datos tenga contenido no nulo y no vacio
        if (correo == null || correo.length() <= 0) {
            datosValidos = false;
            mensajeError = "Error: ingresa un correo";
        }
        if (password == null || password.length() <= 0) {
            datosValidos = false;
            if (mensajeError.isEmpty()) mensajeError = "Error: ingresa una contraseña";
        }
        // Se valida que el contenido corresponda con el patron establecido
        if (correo != null && !(correo.matches("(?i)" + patronCorreo))) {
            datosValidos = false;
            if (mensajeError.isEmpty()) mensajeError = "Máx. 20 caracteres y dominio @gmail.com";
        }
        if (password != null && !(password.matches(patronPassword))) {
            datosValidos = false;
            if (mensajeError.isEmpty()) mensajeError = "Usa mayúsculas, minúsculas y símbolos";
        }
        // Si se paso la verificacion entonces se envia la respuesta confirmando que la sesion tuvo exito
        if (datosValidos) {
            try {
                Usuario usuarioEncontrado = usuarioService.validarCredenciales(correo, password);
                if (usuarioEncontrado != null) {
                    Map<String, Object> datosUsuario = new HashMap<>();
                    // Envio de datos para guardarlos en el session storage
                    datosUsuario.put("idUsuario", usuarioEncontrado.getIdUsuario());
                    datosUsuario.put("nombre", usuarioEncontrado.getNombre());
                    datosUsuario.put("correo", usuarioEncontrado.getCorreo());
                    datosUsuario.put("telefono", usuarioEncontrado.getTelefono());
                    datosUsuario.put("rol", usuarioEncontrado.getRol());

                    res.put("ok", true);
                    res.put("mensaje", "Usuario encontrado, ingresando al sistema");
                    res.put("usuario", datosUsuario);
                    return ResponseEntity.status(HttpStatus.OK).body(res);
                } else {
                    res.put("ok", false);
                    res.put("mensaje", "No se ha encontrado al usuario");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
                }
            } catch (Exception e) {
                res.put("ok", false);
                res.put("mensaje", "Error interno en el servidor");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
            }
        } else {
            res.put("ok", false);
            res.put("mensaje", mensajeError);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
    }
}


