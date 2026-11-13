package mx.uv.medlink.backend;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class MedicoService {
    @Autowired
    private IMedico imedico; // Inyección de dependencias para la tabla medico
    private Usuario usuario; // Inyección de dependencias para la tabla medico

    // Metodo para consultar todos los médicos registrados
    public Iterable<Medico> obtenerMedicos() {
        return imedico.findAll();
    }

    // Metodo para consultar un médico específico por su ID
    public Medico obtenerMedicoPorId(int id) {
        return imedico.findById(id).orElse(null);
    }

    // Metodo para agregar un usuario a la BD ingresando sus parametros en el curl y , si es médico, se crea su perfil profesional automáticamente
    public Medico agregarMedico(Usuario usuarioGuardado, String cedula, String especialidad, String direccion){        
            // Se crea el objeto medico
            Medico nuevoMedico = new Medico(usuarioGuardado, cedula, especialidad, direccion);
            // Se guarda el medico en la BD            
            return imedico.save(nuevoMedico);
        }

    // Metodo para eliminar un médico por su ID
    public Boolean eliminarMedico(int id) {
        if (imedico.existsById(id)) {
            imedico.deleteById(id);
            return true;
        }
        return false;
    }

    public Medico modificarMedico(int idMedico, Usuario usuario, String cedula, String especialidad, String direccion){
        // Verificamos si el usuario existe antes de actualizar
        if (imedico.existsById(idMedico)) {
            Medico medicoActualizado = new Medico(usuario, cedula, especialidad, direccion);
            return imedico.save(medicoActualizado);
        }
        return null; // O puedes retornar una excepción si no se encuentra
    }
}
