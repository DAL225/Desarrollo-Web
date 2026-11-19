package mx.uv.medlink.backend;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class UsuarioControlador { 

    @Autowired
    private UsuarioService usuarioService;
    private IUsuario iusuario;
    
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
     * 
     * @param nombre nombre del usuario.
     * @param correo correo del usuario.
     * @param contrasena contraseña del usuario.
     * @param telefono número del usuario.
     * @param rol rol del usuario (paciente o medico).
     * @param cedula cédula profesional para perfiles médicos.
     * @param especialidad área de especialización médica.
     * @param direccion ubicación del consultorio o centro médico.
     * @return Mensaje de texto afirmativo o negativo
     */
    @PostMapping("/api/usuarios/registro/medico/{nombre}/{correo}/{contrasena}/{telefono}/{rol}")
    public Object crearUsuario(
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol) {

        //Para cada dato enviado se verifica que no tenga el valor null y que exista texto alguno.
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
        
        try {
            //  Se crea al nuevo usuario
            Usuario nuevoUsuario = usuarioService.crearUsuario(nombre, correo, contrasena, telefono, rol);
            //  Si se regresa el nuevo dato que se ingreso entonces, verificamos si el rol insertado es un medico.
            if (nuevoUsuario != null) {
                return "usuario agregado correctamente";
            } else {
                return "No se pudo registrar el usuario";
            }
        } catch (Exception e) {
            return "Error interno al procesar el registro";
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
}