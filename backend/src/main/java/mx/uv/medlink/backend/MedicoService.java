package mx.uv.medlink.backend;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;


@Service
public class MedicoService {
    @Autowired
    private IMedico imedico; // Inyección de dependencias para la tabla medico
    private Usuario usuario; // Inyección de dependencias para la tabla medico


    /**
     * Metodo que devuelve una lista con todos los medicos en la BD.
     * @return List de medicos.
     */
    public Iterable<Medico> obtenerMedicos() {
        return imedico.findAll();
    }

    /**
     * Metodo para consultar un médico específico por su ID.
     * @param id id del usuario a consultar.
     * @return un mensaje de texto con el resultado de la actualización.
     */
    // Metodo para consultar un médico específico por su ID
    public Medico obtenerMedicoPorId(int id) {
        return imedico.findById(id).orElse(null);
    }
    
    /**
     * Metodo para agregar un medico en la BD.
     * @param usuarioGuardado objeto usuario que esta relacionado con el medico.
     * @param cedula cedula del medico.
     * @param especialidad especialidad del medico.
     * @param direccion direccion del medico.
     * @return Objeto Medico.
     **/
    // 
    public Medico agregarMedico(Usuario usuarioGuardado, String cedula, String especialidad, String direccion){        
            // Se crea el objeto medico
            Medico nuevoMedico = new Medico(usuarioGuardado, cedula, especialidad, direccion);
            // Se guarda el medico en la BD            
            return imedico.save(nuevoMedico);
        }

    /**
     * Metodo para eliminar un médico por su ID.
     * @param id id del medico a eliminar.
     * @return True or false dependiendo de si se encontro al medico.
     **/
    public Boolean eliminarMedico(int id) {
        if (imedico.existsById(id)) {
            imedico.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Metodo para modificar a un medico ya existente.
     * @param idMedico id del medico a actualizar.
     * @param usuario Objeto usuario al que esta relacionado el medico.
     * @param cedula cedula nueva.
     * @param especialidad nueva especialidad del medico.
     * @param direccion nueva direccion del medico.
     * @return Objeto medico recien actualizado.
     **/
    public Medico modificarMedico(int idMedico, Usuario usuario, String cedula, String especialidad, String direccion){
        // Verificamos si el usuario existe antes de actualizar
        if (imedico.existsById(idMedico)) {
            Medico medicoActualizado = new Medico(usuario, cedula, especialidad, direccion);
            return imedico.save(medicoActualizado);
        }
        return null; // O puedes retornar una excepción si no se encuentra
    }
}
