package mx.uv.medlink.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import mx.uv.medlink.backend.IResena;
import mx.uv.medlink.backend.Resena;

@CrossOrigin(origins = "*")
@RestController // paradigna, consiste en hacer peticiones http, a traves de los verbos
public class ResenaControlador {

    // Propiedad que hara uso del CRUD, Repository
    @Autowired
    private IResena iresena;

    /**
     * Obtener todas las resenas correspondientes a un medico
     * 
     * @param idMedico Identificador unico del medico del cual se solicitan sus
     *                 resenas.
     * @return Map de info para tratamiento en el frontend, estado de la respuesta,
     *         mensaje y datos.
     */
    @GetMapping("/api/resenas/medico/{idMedico}")
    public Map<String, Object> obtenerResenasMedico(@PathVariable("idMedico") Integer idMedico) {
        try {
            // Obtiene de la BD, todas las resenas
            Iterable<Resena> resenas = iresena.findAll();

            // Si no se obtiene nada de la BD
            if (!resenas.iterator().hasNext()) {
                return Map.of(
                        "ok", true,
                        "message", "No hay resenas publicadas",
                        "data", resenas);
            }

            // Filtrado de las resenas por medico
            List<Resena> resenasFiltradas = StreamSupport
                    .stream(resenas.spliterator(), false)
                    .filter(r -> r.getMedico().getId().equals(idMedico))
                    .collect(Collectors.toList());

            // Si no hay resenas para ese medico
            if (resenasFiltradas.isEmpty()) {
                return Map.of(
                        "ok", true,
                        "message", "No hay resenas publicadas",
                        "data", resenasFiltradas);
            }

            // Resenas correspondientes al medico
            return Map.of(
                    "ok", true,
                    "message", "Resenas encontradas",
                    "data", resenasFiltradas);

            // En caso de error
        } catch (Exception e) {
            System.out.println("Error en la BD " + e.getMessage());
            return Map.of(
                    "ok", false,
                    "message", "Error en la BD",
                    "data", null);
        }

    }

    // Agregar una nueva resena para un medico

    /**
     * 
     * @param resena
     * @return Map de info para tratamiento en el frontend, estado de la respuesta,
     *         mensaje y renena construida en la BD.
     */
    @PostMapping("/api/resenas")
    public Map<String, Object> guardarResena(@RequestBody Resena resena) {

        try {

            //Evaluar permitir resena
            if(!permitirResena(resena.getMedico().getId_medico(), resena.getUsuario().getId_usuario())){
                return Map.of(
                    "ok", false,
                    "message", "Solo se puede emitir una Resena por cita atendida, con el respectivo medico",
                    "data", null);

            }

            // Crear la resena
            Resena resenaObj = new Resena(
                    resena.getMedico(),
                    resena.getUsuario(),
                    resena.getCalificacion(),
                    resena.getComentario(),
                    resena.getFecha());

            // Guardar en la BD
            Resena resenaGuardada = iiresena.save(resenaObj);

            // Resena guardada correctamente
            return Map.of(
                    "ok", true,
                    "message", "Resena guardada correctamente",
                    "data", resenaGuardada);

        } catch (Exception e) {

            System.out.println("Error al guardar la resena: " + e.getMessage());
            return Map.of(
                    "ok", false,
                    "message", "Error al guardar la resena",
                    "data", null);
        }
    }

    private Boolean permitirResena(Integer idMedico, Integer idUsuario){
        try {

            //Obtener las citas
            //Comparar ids medico y usuario y que las citas sean atendidas 
            //Obtener todas las resenas y contarlas
            //comparar la cantidad de resenas sea menor a la cantidad de citas ATENDIDAS


            
        } catch (Exception e) {
            System.out.println("Error " + e.getMessage());
            return false;
        }

    }

}
