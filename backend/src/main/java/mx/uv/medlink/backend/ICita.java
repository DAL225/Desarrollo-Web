package mx.uv.medlink.backend;
import org.springframework.data.repository.CrudRepository;

public interface ICita extends CrudRepository <Cita, Integer> {

    long countByMedico_IdMedicoAndUsuario_IdUsuarioAndEstado (
        Integer idMedico,
        Integer idUsuario,
        Cita.estado estado
    );
}
