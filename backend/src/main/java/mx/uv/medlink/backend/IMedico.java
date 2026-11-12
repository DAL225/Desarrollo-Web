package mx.uv.medlink.backend;
import org.springframework.data.repository.CrudRepository;

public interface IMedico extends CrudRepository <Medico, Integer> {  
}
