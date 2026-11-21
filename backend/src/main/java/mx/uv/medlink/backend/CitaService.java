package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CitaService {
    @Autowired 
    private ICita icita;

    public Iterable<Cita> obtenerCitas(){
        return icita.findAll();
    }

    public Cita obtenercitaPorId(int id){
        return icita.findById(id).orElse(null);
    }

    public Cita agregarCita (LocalDate fecha, LocalTime hora_inicio, LocalTime hora_fin, Medico medico){
        Cita nuevaCita = new Cita(fecha, hora_inicio, hora_fin, medico, null, Cita.estado.DISPONIBLE);
        return icita.save(nuevaCita);
    }

    public boolean eliminarCita (int id){
        if (icita.existsById(id)){
            icita.deleteById(id);
            return true;
        }
        return false;
    }

    public Cita modificarCita(int id, LocalDate fecha, LocalTime hora_inicio, LocalTime hora_fin, Medico medico, Usuario usuario, Cita.estado estado){
        if (icita.existsById(id)){
            Cita citaActualizada = new Cita(fecha, hora_inicio, hora_fin, medico, usuario, estado);
            return icita.save(citaActualizada);
        }
        return null;
    }
}
