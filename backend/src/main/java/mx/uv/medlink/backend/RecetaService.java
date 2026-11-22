package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RecetaService {

    @Autowired
    private IReceta iReceta;

    @Autowired
    private ICita iCita;

    public Receta crearReceta(Cita cita, Medico medico, Usuario usuario, LocalDate fecha, String descripcion) {
        Receta nuevaReceta = new Receta(cita, medico, usuario, fecha, descripcion);

        // Opcional pero recomendado: marcar la cita como ATENDIDA al emitir su receta
        cita.setEstado(Cita.estado.ATENDIDA);
        iCita.save(cita);

        return iReceta.save(nuevaReceta);
    }

    public Receta obtenerRecetaPorId(int idReceta) {
        return iReceta.findById(idReceta).orElse(null);
    }

    public List<Receta> obtenerRecetasPorUsuario(int idUsuario) {
        Iterable<Receta> iterable = iReceta.findAll();
        List<Receta> recetasUsuario = new ArrayList<>();
        for (Receta receta : iterable) {
            if (receta.getUsuario() != null && receta.getUsuario().getIdUsuario() == idUsuario) {
                recetasUsuario.add(receta);
            }
        }
        return recetasUsuario;
    }

    public List<Receta> obtenerRecetasPorMedico(int idMedico) {
        Iterable<Receta> iterable = iReceta.findAll();
        List<Receta> recetasMedico = new ArrayList<>();
        for (Receta receta : iterable) {
            if (receta.getMedico() != null && receta.getMedico().getIdMedico() == idMedico) {
                recetasMedico.add(receta);
            }
        }
        return recetasMedico;
    }
}