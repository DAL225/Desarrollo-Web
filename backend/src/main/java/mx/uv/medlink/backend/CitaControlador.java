package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController 
public class CitaControlador {

    @Autowired 
    private CitaService citaService;

    @Autowired 
    private UsuarioService usuarioService;

    @GetMapping("/api/citas")
    public Object obtenerCitas(){
        try {
            List<Cita> citas = citaService.obtenerCitasMedico(4);
            return citas;
        } catch (Exception e){
            return "Error al procesar la solicitud de Citas";
        }
    }

    @GetMapping("/api/citas/medico/{idMedico}")
    public Object obtenerCitaMedico(@PathVariable String idMedico){
        if (idMedico == null){
            return "El parámetro no puede ser nulo";
        }
        if (idMedico.length() == 0){
            return "El parámetro no puede estar vacío";
        }
        try {
            int idInt = Integer.parseInt(idMedico);
            List<Cita> citasEncontrada = citaService.obtenerCitasMedico(idInt);
            if (citasEncontrada != null){
                return citasEncontrada;
            } else {
                return "Las citas no fueron encontradas";
            }
        } catch (NumberFormatException e){
            return "El identificador proporcionado no es un número entero válido";
        } catch (Exception e){
            return "Error interno en el servidor";
        }
    }

    @GetMapping("/api/citas/usuario/{idUsuario}")
    public Object obtenerCitaUsuario(@PathVariable String idUsuario){
        if (idUsuario == null){
            return "El parámetro no puede ser nulo";
        }
        if (idUsuario.length() == 0){
            return "El parámetro no puede estar vacío";
        }
        try {
            int idInt = Integer.parseInt(idUsuario);
            List<Cita> citasEncontrada = citaService.obtenerCitasMedico(idInt);
            if (citasEncontrada != null){
                return citasEncontrada;
            } else {
                return "Las citas no fueron encontradas";
            }
        } catch (NumberFormatException e){
            return "El identificador proporcionado no es un número entero válido";
        } catch (Exception e){
            return "Error interno en el servidor";
        }
    }

    @GetMapping("/api/citas/disponible")
    public Object obtenerCitaDisponible(){
        List<Cita> citasEncontrada = citaService.obtenerCitasDisponibles();
        if (citasEncontrada != null){
            return citasEncontrada;
        } else {
            return "Las citas no fueron encontradas";
        }
    }

    @PutMapping("/api/citas/{idCita}/{idUsuario}/agendar")
    public Object agendarCita(@PathVariable("idCita") String idCita,@PathVariable("idUsuario") String idUsuario){
        if (idCita == null || idUsuario == null){
            return "El parámetro no puede ser nulo";
        }
        if (idCita.length() == 0 || idUsuario.length() == 0){
            return "El parámetro no puede estar vacío";
        }
        try {
            Usuario usuarioEncontrado = null;
            Cita citaEncontrada = null;
            int idInt = Integer.parseInt(idCita);
            List<Cita> citasEncontrada = citaService.obtenerCitasDisponibles();
            int idUInt = Integer.parseInt(idUsuario);
            List<Usuario> usuariosEncontrados = usuarioService.obtenerUsuarios();
            for (Cita cita : citasEncontrada) {
                if (cita.getIdCita() == idInt){
                    citaEncontrada = cita;
                }
            }
            for (Usuario usuario : usuariosEncontrados) {
                if (usuario.getIdUsuario() == idUInt){
                    usuarioEncontrado = usuario;
                }
            }
            if (citaEncontrada != null){
                LocalDate fecha = citaEncontrada.getFecha();
                LocalTime hora_inicio = citaEncontrada.getHora_inicio();
                LocalTime hora_fin = citaEncontrada.getHora_fin();
                Medico medico = citaEncontrada.getMedico();
                return citaService.modificarCita(idInt, fecha, hora_inicio, hora_fin, medico, usuarioEncontrado, Cita.estado.RESERVADA);
            } else {
                return "La cita no fueron encontrada";
            }
        } catch (NumberFormatException e){
            return "El identificador proporcionado no es un número entero válido";
        } catch (Exception e){
            return e.getMessage();
        }
    }
}
