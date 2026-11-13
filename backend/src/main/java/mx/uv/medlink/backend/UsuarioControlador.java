package mx.uv.medlink.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class UsuarioControlador { 

    @Autowired
    private UsuarioService usuarioService;
    private IUsuario iusuario;
    
    // Inyección de dependencias para conectar con la BD
    // Metodo para agregar un usuario a la BD ingresando sus parametros en el curl
    // Ejemplo de uso: POST /usuario/Juan Pérez/juan@mail.com/12345/2281234567/paciente
/**
     * Consulta el listado completo de usuarios registrados en el sistema.
     * 
     * @return el listado de usuarios o un mensaje informativo en texto plano.
     */
    @GetMapping("/api/usuarios")
    public Object verUsuarios() {
        try {
            List<Usuario> usuarios = usuarioService.obtenerUsuarios();
            if (usuarios.isEmpty()) {
                return "No hay usuarios registrados en el sistema";
            }
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
        if (id == null) {
            return "El parámetro no puede ser nulo";
        }
        if (id.length() == 0) {
            return "El parámetro no puede estar vacío";
        }

        try {
            int idInt = Integer.parseInt(id);
            Usuario usuarioEncontrado = usuarioService.obtenerUsuarioPorId(idInt);
            if (usuarioEncontrado != null) {
                return usuarioEncontrado;
            } else {
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

    // Metodo para agregar un usuario a la BD ingresando sus parametros en el curl y , si es médico, se crea su perfil profesional automáticamente
   /**
     * Registra un nuevo usuario con rol médico o paciente tras validar la integridad de los datos.
     * 
     * @param nombre nombre completo del usuario.
     * @param correo correo electrónico institucional o personal.
     * @param contrasena clave de acceso al sistema.
     * @param telefono número telefónico de contacto.
     * @param rol rol asignado en la plataforma.
     * @param cedula cédula profesional para perfiles médicos.
     * @param especialidad área de especialización médica.
     * @param direccion ubicación del consultorio o centro médico.
     * @return un mensaje de texto indicando el resultado del registro.
     */
    @PostMapping("/api/usuarios/registro/medico/{nombre}/{correo}/{contrasena}/{telefono}/{rol}/{cedula}/{especialidad}/{direccion}")
    public Object crearUsuario(
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol,
            @PathVariable String cedula,
            @PathVariable String especialidad,
            @PathVariable String direccion) {

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
        if (cedula == null) {
            return "La cédula no puede ser nula";
        }
        if (cedula.length() == 0) {
            return "La cédula no puede estar vacía";
        }
        if (especialidad == null) {
            return "La especialidad no puede ser nula";
        }
        if (especialidad.length() == 0) {
            return "La especialidad no puede estar vacía";
        }
        if (direccion == null) {
            return "La dirección no puede ser nula";
        }
        if (direccion.length() == 0) {
            return "La dirección no puede estar vacía";
        }

        try {
            Usuario nuevoUsuario = usuarioService.crearUsuario(nombre, correo, contrasena, telefono, rol);

            if (nuevoUsuario != null) {
                if (rol.equalsIgnoreCase("medico")) {
                    Medico nuevoMedico = new Medico(nuevoUsuario, cedula, especialidad, direccion);
                    imedico.save(nuevoMedico);
                }
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
            if (id == null) {
                return "El identificador no puede ser nulo";
            }
            if (id.length() == 0) {
                return "El identificador no puede estar vacío";
            }

            int idInt = Integer.parseInt(id);
            boolean eliminado = usuarioService.eliminarUsuario(idInt);

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
     * @param id identificador único del usuario.
     * @param nombre nuevo nombre del usuario.
     * @param correo nuevo correo electrónico.
     * @param contrasena nueva contraseña de acceso.
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

            int idInt = Integer.parseInt(id);
            Usuario usuarioActualizado = usuarioService.modificarUsuario(idInt, nombre, correo, contrasena, telefono, rol);

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