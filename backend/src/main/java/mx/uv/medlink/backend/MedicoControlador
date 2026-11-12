package mx.uv.medlink.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*" )
@RestController
public class MedicoControlador {

    @Autowired
    private IMedico imedico; // Inyección de dependencias para la tabla medico

    // Metodo para consultar todos los médicos registrados
    @GetMapping("/api/usuarios/medicos")
    public Iterable<Medico> obtenerMedicos() {
        return imedico.findAll();
    }

    // Metodo para consultar un médico específico por su ID
    @GetMapping("/api/usuarios/medico/{id}")
    public Medico obtenerMedicoPorId(@PathVariable int id) {
        return imedico.findById(id).orElse(null);
    }

    // Metodo para eliminar un médico por su ID
    @DeleteMapping("/api/usuarios/medico/{id}")
    public String eliminarMedico(@PathVariable int id) {
        if (imedico.existsById(id)) {
            imedico.deleteById(id);
            return "Médico con ID " + id + " eliminado exitosamente.";
        }
        return "No se encontró el médico con ID " + id;
    }
}