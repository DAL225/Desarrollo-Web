package mx.uv.medlink.backend;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface IResena extends CrudRepository<Resena, Integer> {

    // Obtener las reseñas correspondientes a un médico
    List<Resena> findByMedico_IdMedico(Integer idMedico);

    // Contar las reseñas de un usuario con un médico
    long countByMedico_IdMedicoAndUsuario_IdUsuario(
            Integer idMedico,
            Integer idUsuario
    );

}
