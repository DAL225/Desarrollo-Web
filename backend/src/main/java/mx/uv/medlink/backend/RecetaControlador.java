package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/recetas")
public class RecetaControlador {

    @Autowired
    private RecetaService recetaService;

    @Autowired
    private CitaService citaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private IMedico iMedico; // O tu MedicoService equivalente

    // 1. POST /api/recetas - Crea y emite una nueva receta médica
    @PostMapping
    public ResponseEntity<?> crearReceta(@RequestBody Map<String, Object> payload) {
        try {
            int idCita = Integer.parseInt(payload.get("idCita").toString());
            int idMedico = Integer.parseInt(payload.get("idMedico").toString());
            int idUsuario = Integer.parseInt(payload.get("idUsuario").toString());
            String descripcion = payload.get("descripcion").toString();
            
            // Si no mandan fecha en el JSON, toma la fecha actual
            LocalDate fecha = payload.containsKey("fecha") 
                ? LocalDate.parse(payload.get("fecha").toString()) 
                : LocalDate.now();

            Cita cita = citaService.obtenerCitaPorId(idCita);
            if (cita == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("La cita especificada no existe.");
            }

            Medico medico = iMedico.findById(idMedico).orElse(null);
            if (medico == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El médico especificado no existe.");
            }

            Usuario usuario = null;
            for (Usuario u : usuarioService.obtenerUsuarios()) {
                if (u.getIdUsuario() == idUsuario) {
                    usuario = u;
                    break;
                }
            }
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El paciente especificado no existe.");
            }

            Receta recetaCreada = recetaService.crearReceta(cita, medico, usuario, fecha, descripcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(recetaCreada);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al emitir la receta: " + e.getMessage());
        }
    }

    // 2. GET /api/recetas/{idReceta} - Obtiene el detalle de una receta
    @GetMapping("/{idReceta}")
    public ResponseEntity<?> obtenerRecetaPorId(@PathVariable String idReceta) {
        try {
            int idInt = Integer.parseInt(idReceta);
            Receta receta = recetaService.obtenerRecetaPorId(idInt);
            if (receta == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Receta no encontrada.");
            }
            return ResponseEntity.ok(receta);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El identificador no es un número entero válido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el servidor.");
        }
    }

    // 3. GET /api/recetas/usuario/{idUsuario} - Consulta todas las recetas de un paciente
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> obtenerRecetasUsuario(@PathVariable String idUsuario) {
        try {
            int idInt = Integer.parseInt(idUsuario);
            List<Receta> recetas = recetaService.obtenerRecetasPorUsuario(idInt);
            return ResponseEntity.ok(recetas);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("El identificador no es un número entero válido.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el servidor.");
        }
    }

    // 3. GET /api/recetas/medico/{idMedico} - Consulta todas las recetas de un medico ha emitido
    @GetMapping("/medico/{idMedico}")
public ResponseEntity<?> obtenerRecetasPorMedico(@PathVariable String idMedico) {
    try {
        int idInt = Integer.parseInt(idMedico);
        List<Receta> recetas = recetaService.obtenerRecetasPorMedico(idInt);
        return ResponseEntity.ok(recetas);
    } catch (NumberFormatException e) {
        return ResponseEntity.badRequest().body("El identificador no es un número entero válido.");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el servidor.");
    }
}
}