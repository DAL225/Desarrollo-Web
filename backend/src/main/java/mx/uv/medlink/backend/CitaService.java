package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CitaService {

    @Autowired
    private ICita icita;

    public Cita obtenerCitaPorId(int id) {
        return icita.findById(id).orElse(null);
    }

    public List<Cita> obtenerCitasMedico(int idMedico) {
        Iterable<Cita> iterable = icita.findAll();
        List<Cita> citasMedico = new ArrayList<>();
        for (Cita cita : iterable) {
            if (cita.getMedico() != null && cita.getMedico().getIdMedico() == idMedico) {
                citasMedico.add(cita);
            }
        }
        return citasMedico;
    }

    public List<Cita> obtenerCitasUsuario(int idUsuario) {
        Iterable<Cita> iterable = icita.findAll();
        List<Cita> citasUsuario = new ArrayList<>();
        for (Cita cita : iterable) {
            // Validación != null necesaria porque las citas DISPONIBLE no tienen usuario
            if (cita.getUsuario() != null && cita.getUsuario().getIdUsuario() == idUsuario) {
                citasUsuario.add(cita);
            }
        }
        return citasUsuario;
    }

    public List<Cita> obtenerCitasDisponibles() {
        Iterable<Cita> iterable = icita.findAll();
        List<Cita> citasDisponible = new ArrayList<>();
        for (Cita cita : iterable) {
            if (cita.getEstado() == Cita.estado.DISPONIBLE) {
                citasDisponible.add(cita);
            }
        }
        return citasDisponible;
    }

    public Cita agregarCita(LocalDate fecha, LocalTime hora_inicio, LocalTime hora_fin, Medico medico) {
        Cita nuevaCita = new Cita(fecha, hora_inicio, hora_fin, medico, null, Cita.estado.DISPONIBLE);
        return icita.save(nuevaCita);
    }

    public Cita agendarCita(int idCita, Usuario usuario) {
        Optional<Cita> citaOpt = icita.findById(idCita);
        if (citaOpt.isPresent()) {
            Cita cita = citaOpt.get();
            if (cita.getEstado() != Cita.estado.DISPONIBLE) {
                throw new IllegalStateException("La cita ya no está disponible.");
            }
            cita.setUsuario(usuario);
            cita.setEstado(Cita.estado.RESERVADA);
            return icita.save(cita);
        }
        return null;
    }

    public Cita guardarCita(Cita cita) {
        if (cita == null) {
            throw new IllegalArgumentException("La cita no puede ser nula.");
        }
        return icita.save(cita);
    }
}