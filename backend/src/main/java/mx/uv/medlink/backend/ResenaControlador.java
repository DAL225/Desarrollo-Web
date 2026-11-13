package mx.uv.medlink.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
public class ResenaControlador {

    @Autowired
    private ResenaService resenaService;

    /**
     * Obtener las reseñas correspondientes a un médico.
     */
    @GetMapping("/api/resenas/medico/{idMedico}")
    public Map<String, Object> obtenerResenasMedico(
            @PathVariable("idMedico") Integer idMedico) {

        try {

            List<Resena> resenas = resenaService.obtenerResenasMedico(idMedico);

            if (resenas.isEmpty()) {
                return respuesta(
                        true,
                        "No hay resenas publicadas",
                        resenas);
            }

            return respuesta(
                    true,
                    "Resenas encontradas",
                    resenas);

        } catch (Exception e) {

            System.out.println("Error al obtener resenas: " + e.getMessage());

            return respuesta(
                    false,
                    "Error al consultar las resenas",
                    null);
        }
    }

    /**
     * Guardar una nueva reseña.
     */
    @PostMapping("/api/resenas")
    public Map<String, Object> guardarResena(@RequestBody Resena resena) {

        try {

            Resena resenaGuardada = resenaService.guardarResena(resena);

            return respuesta(
                    true,
                    "Resena guardada correctamente",
                    resenaGuardada);

        } catch (Exception e) {

            System.out.println("Error al guardar la resena: " + e.getMessage());

            return respuesta(
                    false,
                    "Error al guardar la resena",
                    null);
        }
    }

    /**
     * Construir la respuesta para el frontend.
     */
    private Map<String, Object> respuesta(
            Boolean ok,
            String message,
            Object data) {

        Map<String, Object> resultado = new HashMap<>();

        resultado.put("ok", ok);
        resultado.put("message", message);
        resultado.put("data", data);

        return resultado;
    }

}
