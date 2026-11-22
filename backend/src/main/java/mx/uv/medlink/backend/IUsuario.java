package mx.uv.medlink.backend;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface IUsuario extends CrudRepository <Usuario, Integer> {  
    Optional<Usuario> findByCorreoIgnoreCase(String correo);
    boolean existsByCorreoIgnoreCase(String correo);
}