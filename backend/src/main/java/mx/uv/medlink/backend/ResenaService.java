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

        @Autowired
        private IMedico imedico;

        @Autowired
        private IUsuario iusuario;

        /**
         * Obtener todas las reseñas de un médico.
         */
        public List<Resena> obtenerResenasMedico(Integer idMedico) {

                return iresena.findByMedico_IdMedico(idMedico);
        }

        /**
         * Validar si un usuario puede publicar una reseña.
         */
        public Boolean permitirResena(Integer idMedico, Integer idUsuario) {

                // Obtener la cantidad de citas atendidas
                long citasAtendidas = icita
                                .countByMedico_IdMedicoAndUsuario_IdUsuarioAndEstado(
                                                idMedico,
                                                idUsuario,
                                                Cita.estado.ATENDIDA);

                // Obtener la cantidad de reseñas publicadas
                long resenasPublicadas = iresena
                                .countByMedico_IdMedicoAndUsuario_IdUsuario(
                                                idMedico,
                                                idUsuario);

                return resenasPublicadas < citasAtendidas;
        }

        /**
         * Guardar una nueva reseña.
         */
        public Resena guardarResena(ResenaDTO dto) {

                // Recuperar el médico
                Medico medico = imedico.findById(dto.getIdMedico())
                                .orElseThrow(() -> new IllegalArgumentException("Médico no encontrado"));

                // Recuperar el usuario
                Usuario usuario = iusuario.findById(dto.getIdUsuario())
                                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

                // Validar que el usuario tenga citas atendidas disponibles
                if (!permitirResena(
                                medico.getIdMedico(),
                                usuario.getIdUsuario())) {

                        throw new IllegalArgumentException(
                                        "Solo se puede emitir una reseña por cita atendida con el médico.");
                }

                // Construir la reseña con las entidades recuperadas
                Resena resena = new Resena(
                                medico,
                                usuario,
                                dto.getCalificacion(),
                                dto.getComentario(),
                                dto.getFecha());

                // Guardar la reseña
                return iresena.save(resena);
        }

        
        /**
         * Actualizar el comentario de una reseña.
         *
         * @param idResena identificador de la reseña.
         * @param dto      información con el nuevo comentario.
         * @return reseña actualizada.
         */
        public Resena actualizarResena(Integer idResena, ActualizarResenaDTO dto) {

                // Buscar la reseña
                Resena resena = iresena.findById(idResena)
                                .orElseThrow(() -> new IllegalArgumentException("Reseña no encontrada"));

                // Actualizar únicamente el comentario
                resena.setComentario(dto.getComentario());

                // Guardar los cambios
                return iresena.save(resena);
        }
}
