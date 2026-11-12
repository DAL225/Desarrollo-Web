package mx.uv.medlink.backend;

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
    private IUsuario iusuario; // Inyección de dependencias para conectar con la BD

    // Metodo para agregar un usuario a la BD ingresando sus parametros en el curl
    // Ejemplo de uso: POST /usuario/Juan Pérez/juan@mail.com/12345/2281234567/paciente
    @PostMapping("/api/usuarios/registro/{nombre}/{correo}/{contrasena}/{telefono}/{rol}")
    public Usuario crearUsuario(
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol) {
        
        // Se crea una instancia del usuario
        Usuario nuevoUsuario = new Usuario(nombre, correo, contrasena, telefono, rol);
        
        // Se guarda como una fila para la tabla usuario en la base de datos PostgreSQL
        return iusuario.save(nuevoUsuario);
    }

    @Autowired
    private IMedico imedico;

    // Metodo para agregar un usuario a la BD ingresando sus parametros en el curl y , si es médico, se crea su perfil profesional automáticamente
    @PostMapping("/api/usuarios/registro/medico/{nombre}/{correo}/{contrasena}/{telefono}/{rol}/{cedula}/{especialidad}/{direccion}")
    public String registrarUsuarioConRol(
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol,
            @PathVariable String cedula,
            @PathVariable String especialidad,
            @PathVariable String direccion) {
        
        // Se crea el objeto Usuario
        Usuario nuevoUsuario = new Usuario(nombre, correo, contrasena, telefono, rol);
        
        // Se guarda el usuario en la BD
        Usuario usuarioGuardado = iusuario.save(nuevoUsuario);
        
        // Se detecta si el usuario es medico, en caso de que si lo sea entonces se genera la tupla de medico
        if (rol.equalsIgnoreCase("medico")) {
            // Se crea el objeto medico
            Medico nuevoMedico = new Medico(usuarioGuardado, cedula, especialidad, direccion);
            
            // Se guarda el medico en la BD
            imedico.save(nuevoMedico);
            
            return "Usuario y perfil de Médico registrados exitosamente con ID: " + usuarioGuardado.getIdUsuario();
        }
        
        return "Usuario registrado como paciente exitosamente con ID: " + usuarioGuardado.getIdUsuario();
    }

    // Metodo para consultar todos los usuarios registrados
    // Ejemplo de uso: GET /usuarios
    @GetMapping("/api/usuarios")
    public Iterable<Usuario> obtenerUsuarios() {
        return iusuario.findAll();
    }

    // Metodo para consultar un usuario específico por su ID
    // Ejemplo de uso: GET /usuario/1
    @GetMapping("/usuario/{id}")
    public Usuario obtenerUsuarioPorId(@PathVariable int id) {
        return iusuario.findById(id).orElse(null);
    }

    // Metodo para actualizar un usuario existente mediante su ID y nuevos datos por URL
    // Ejemplo de uso: PUT /usuario/1/Carlos López/carlos@mail.com/nuevaClave/2289876543/paciente
    @PutMapping("/api/usuarios/registro/{id}/{nombre}/{correo}/{contrasena}/{telefono}/{rol}")
    public Usuario actualizarUsuario(
            @PathVariable int id,
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol) {
        
        // Verificamos si el usuario existe antes de actualizar
        if (iusuario.existsById(id)) {
            Usuario usuarioActualizado = new Usuario(nombre, correo, contrasena, telefono, rol);
            usuarioActualizado.setIdUsuario(id); // Aseguramos que mantenga el mismo ID
            return iusuario.save(usuarioActualizado);
        }
        return null; // O puedes retornar una excepción si no se encuentra
    }

    // Metodo para eliminar un usuario por id
    // Ejemplo de uso: DELETE /usuario/1
    @DeleteMapping("/api/usuarios/registro/{id}")
    public String eliminarUsuario(@PathVariable int id) {
        if (iusuario.existsById(id)) {
            iusuario.deleteById(id);
            return "Usuario con ID " + id + " eliminado exitosamente.";
        }
        return "No se encontró el usuario con ID " + id;
    }
}