package mx.uv.medlink.backend;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CitaService {
    @Autowired 
    private ICita icita;

    public Cita obtenerCitaPorId(int id) {
        return icita.findById(id).get();
    }

    public List<Cita> obtenerCitasMedico(int idMedico){
        Iterable<Cita> iterable = icita.findAll();
        List<Cita> citasMedico = new ArrayList<>();
        for (Cita cita : iterable) {
            if (cita.getMedico().getIdMedico() == idMedico){
                citasMedico.add(cita);
            }
        }
        return citasMedico;
    }

    public List<Cita> obtenerCitasUsuario(int idUsuario){
        Iterable<Cita> iterable = icita.findAll();
        List<Cita> citasUsuario = new ArrayList<>();
        for (Cita cita : iterable) {
            if (cita.getUsuario().getIdUsuario() == idUsuario){
                citasUsuario.add(cita);
            }
        }
        return citasUsuario;    
    }

    public List<Cita> obtenerCitasDisponibles(){
        Iterable<Cita> iterable = icita.findAll();
        List<Cita> citasDisponible = new ArrayList<>();
        for (Cita cita : iterable) {
            if (cita.getEstado() == Cita.estado.DISPONIBLE){
                citasDisponible.add(cita);
            }
        }
        return citasDisponible;    
    }

    public Cita agregarCita (LocalDate fecha, LocalTime hora_inicio, LocalTime hora_fin, Medico medico){
        Cita nuevaCita = new Cita(fecha, hora_inicio, hora_fin, medico, null, Cita.estado.DISPONIBLE);
        return icita.save(nuevaCita);        
    }
    

    public Cita modificarCita(int id, LocalDate fecha, LocalTime hora_inicio, LocalTime hora_fin, Medico medico, Usuario usuario, Cita.estado estado){
        if (icita.existsById(id)){
            Cita citaActualizada = new Cita(fecha, hora_inicio, hora_fin, medico, usuario, estado);
            return icita.save(citaActualizada);
        }
        return null;
    }
}
