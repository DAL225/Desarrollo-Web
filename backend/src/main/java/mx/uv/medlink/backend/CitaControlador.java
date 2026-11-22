package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/citas")
public class CitaControlador {

    @Autowired
    private CitaService citaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private IMedico iMedico; // O tu MedicoService equivalente

    // 1. POST /api/citas - El médico crea una nueva cita disponible
    @PostMapping
    public ResponseEntity<?> crearCita(@RequestBody Map<String, Object> payload) {
        try {
            LocalDate fecha = LocalDate.parse(payload.get("fecha").toString());
            LocalTime horaInicio = LocalTime.parse(payload.get("hora_inicio").toString());
            LocalTime horaFin = LocalTime.parse(payload.get("hora_fin").toString());
            int idMedico = Integer.parseInt(payload.get("idMedico").toString());

            Medico medico = iMedico.findById(idMedico).orElse(null);
            if (medico == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El médico especificado no existe.");
            }

            Cita creada = citaService.agregarCita(fecha, horaInicio, horaFin, medico);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear la cita: " + e.getMessage());
        }
    }

    // 2. GET /api/citas/medico/{idMedico} - Lista citas de un médico específico
    @GetMapping("/medico/{idMedico}")
    public ResponseEntity<?> obtenerCitaMedico(@PathVariable String idMedico) {
        try {
            int idInt = Integer.parseInt(idMedico);
            List<Cita> citas = citaService.obtenerCitasMedico(idInt);
            return ResponseEntity.ok(citas);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El identificador no es un número entero válido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el servidor.");
        }
    }

    // 3. PUT /api/citas/{idCita}/agendar - Asigna el id_usuario a una cita libre
    @PutMapping("/{idCita}/agendar")
    public ResponseEntity<?> agendarCita(@PathVariable String idCita, @RequestBody Map<String, Object> payload) {
        try {
            int idCitaInt = Integer.parseInt(idCita);
            if (!payload.containsKey("idUsuario")) {
                return ResponseEntity.badRequest().body("Se requiere el idUsuario en el cuerpo de la petición.");
            }
            int idUsuarioInt = Integer.parseInt(payload.get("idUsuario").toString());

            Usuario usuarioEncontrado = null;
            for (Usuario u : usuarioService.obtenerUsuarios()) {
                if (u.getIdUsuario() == idUsuarioInt) {
                    usuarioEncontrado = u;
                    break;
                }
            }

            if (usuarioEncontrado == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
            }

            Cita citaAgendada = citaService.agendarCita(idCitaInt, usuarioEncontrado);
            if (citaAgendada == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cita no encontrada.");
            }

            return ResponseEntity.ok(citaAgendada);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Los identificadores deben ser números enteros válidos.");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // 4. GET /api/citas/usuario/{idUsuario} - Historial de citas de un paciente
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerCitaUsuario(@PathVariable String idUsuario) {
        try {
            int idInt = Integer.parseInt(idUsuario);
            // Corregido: antes llamaba a obtenerCitasMedico
            List<Cita> citas = citaService.obtenerCitasUsuario(idInt);
            return ResponseEntity.ok(citas);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El identificador no es un número entero válido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el servidor.");
        }
    }

    /**
     * Actualiza el estado de una cita
     */
    @PutMapping("/{idCita}/estado")
    public ResponseEntity<?> cambiarEstadoCita(@PathVariable String idCita, @RequestBody Map<String, Object> payload) {
        try {
            int idCitaInt = Integer.parseInt(idCita);
            String nuevoEstadoStr = payload.get("estado").toString().toUpperCase();
            Cita.estado nuevoEstado = Cita.estado.valueOf(nuevoEstadoStr);

            Cita cita = citaService.obtenerCitaPorId(idCitaInt);
            if (cita == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cita no encontrada.");
            }

            cita.setEstado(nuevoEstado);
            Cita actualizada = citaService.guardarCita(cita); // icita.save(cita) en CitaService
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado o identificador inválido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el estado.");
        }
    }
}