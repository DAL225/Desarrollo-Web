package mx.uv.medlink.backend;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class UsuarioService {
    @Autowired 
    private IUsuario iusuario;

    /**
     * Crea un usuario en la BD.
     * @param nombre nombre del usuario.
     * @param correo correo del usuario.
     * @param contrasena contrasena del usuario.
     * @param telefono telefono del usuario.
     * @param rol rol del usuario.
     * @return Objeto Usuario.
     */
    public Usuario crearUsuario(String nombre, String correo, String contrasena, String telefono, String rol) {
        // Se crea una instancia del usuario
        Usuario nuevoUsuario = new Usuario(nombre, correo, contrasena, telefono, rol);
        // Se guarda como una fila para la tabla usuario en la base de datos PostgreSQL
        return iusuario.save(nuevoUsuario);
    }

    /**
     * Elimina un usuario en la BD.
     * @param idUsuario identificador del usuario.
     * @return true si el usuario pudo ser eliminado, en caso contrario false.
     */   
    public boolean eliminarUsuario(int idUsuario){
        if (iusuario.existsById(idUsuario)) {
            iusuario.deleteById(idUsuario);
            return true;
        }
        return false;
    }   

    /**
     * Modificar un usuario en la BD.
     * @param id id del usuario.
     * @param nombre nombre del usuario.
     * @param correo correo del usuario.
     * @param contrasena correo del usuario.
     * @param telefono telefono del usuario.
     * @param rol rol del usuario.
     * @return Objeto Usuario modificado, o null en caso de que no se encuentre el mismo.
     */
    public Usuario modificarUsuario(int id, String nombre, String correo, String contrasena, String telefono, String rol){
        // Verificamos si el usuario existe antes de actualizar
        if (iusuario.existsById(id)) {
            Usuario usuarioActualizado = new Usuario(nombre, correo, contrasena, telefono, rol);
            usuarioActualizado.setIdUsuario(id); // Aseguramos que mantenga el mismo ID
            return iusuario.save(usuarioActualizado);
        }
        return null; // O puedes retornar una excepción si no se encuentra
    }


    /**
     * Metodo que obtiene todos los usuarios de la BD
     * @return Lista de usuarios en la BD.
     */
    public List<Usuario> obtenerUsuarios(){
        //Surge por el error de retornar directamente el arreglo
        Iterable<Usuario> iterable = iusuario.findAll();
        // Conversión segura mediante StreamSupport
        return StreamSupport.stream(iterable.spliterator(), false).collect(Collectors.toList());
    }


    /**
     * Metodo que devuelve un usuario en la BD mediante su id.
     * @param id id del usuario.
     * @return Objeto Usuario.
     */
    public Usuario obtenerUsuarioPorId(int id) {
        return iusuario.findById(id).orElse(null);
    }
}
