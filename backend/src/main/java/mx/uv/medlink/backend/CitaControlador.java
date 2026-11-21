package mx.uv.medlink.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController 
public class CitaControlador {

    @Autowired 
    private CitaService citaService;

    @GetMapping("/api/citas")
    public Object obtenerCitas(){
        try {
            Iterable<Cita> citas = citaService.obtenerCitas();
            return citas;
        } catch (Exception e){
            return "Error al procesar la solicitud de Citas";
        }
    }

    @GetMapping("/api/citas/{id}")
    public Object obtenerCitaPorId(@PathVariable String id){
        if (id == null){
            return "El parámetro no puede ser nulo";
        }
        if (id.length() == 0){
            return "El parámetro no puede estar vacío";
        }
        try {
            int idInt = Integer.parseInt(id);
            Cita citaEncontrada = citaService.obtenercitaPorId(idInt);
            if (citaEncontrada != null){
                return citaEncontrada;
            } else {
                return "La cita no fue encontrada";
            }
        } catch (NumberFormatException e){
            return "El identificador proporcionado no es un número entero válido";
        } catch (Exception e){
            return "Error interno en el servidor";
        }
    }
}
