package mx.uv.medlink.backend;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private IResena iresena;

    @Autowired
    private ICita icita;

    /**
     * Obtener todas las reseñas de un médico.
     *
     * @param idMedico identificador del médico.
     * @return lista de reseñas.
     */
    public List<Resena> obtenerResenasMedico(Integer idMedico) {

        return iresena.findByMedico_IdMedico(idMedico);

    }

    /**
     * Validar si un usuario puede publicar una reseña.
     *
     * @param idMedico identificador del médico.
     * @param idUsuario identificador del usuario.
     * @return true si tiene citas atendidas disponibles para reseñar.
     */
    public Boolean permitirResena(Integer idMedico, Integer idUsuario) {

        // Obtener la cantidad de citas atendidas
        long citasAtendidas = icita
                .countByMedico_IdMedicoAndUsuario_IdUsuarioAndEstado(
                        idMedico,
                        idUsuario,
                        Cita.estado.ATENDIDA
                );

        // Obtener la cantidad de reseñas publicadas
        long resenasPublicadas = iresena
                .countByMedico_IdMedicoAndUsuario_IdUsuario(
                        idMedico,
                        idUsuario
                );

        // Permitir una reseña por cada cita atendida
        return resenasPublicadas < citasAtendidas;
    }

    /**
     * Guardar una nueva reseña.
     *
     * @param resena objeto con la información de la reseña.
     * @return reseña guardada.
     */
    public Resena guardarResena(Resena resena) {

        // Validar que el usuario pueda publicar una reseña
        if (!permitirResena(
                resena.getMedico().getIdMedico(),
                resena.getUsuario().getIdUsuario())) {

            throw new IllegalArgumentException(
                    "Solo se puede emitir una reseña por cita atendida con el médico."
            );
        }

        // Guardar la reseña
        return iresena.save(resena);

    }

}
