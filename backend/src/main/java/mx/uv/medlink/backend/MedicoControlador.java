package mx.uv.medlink.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
public class MedicoControlador {

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Consulta el listado completo de médicos registrados en el sistema.
     * 
     * @return el listado de médicos o un mensaje informativo en texto plano.
     */
    @GetMapping("/api/medicos")
    public Object obtenerMedicos() {
        try {
            Iterable<Medico> medicos = medicoService.obtenerMedicos();
            return medicos;
        } catch (Exception e) {
            return "Error al procesar la solicitud de médicos";
        }
    }

    /**
     * Consulta un médico específico mediante su identificador numérico.
     * 
     * @param id identificador único del médico en formato de texto para validación.
     * @return el objeto médico encontrado o un mensaje de texto con el error correspondiente.
     */
    @GetMapping("/medico/{id}")
    public Object obtenerMedicoPorId(@PathVariable String id) {
        if (id == null) {
            return "El parámetro no puede ser nulo";
        }
        if (id.length() == 0) {
            return "El parámetro no puede estar vacío";
        }

        try {
            int idInt = Integer.parseInt(id);
            Medico medicoEncontrado = medicoService.obtenerMedicoPorId(idInt);

            if (medicoEncontrado != null) {
                return medicoEncontrado;
            } else {
                return "El médico no fue encontrado";
            }
        } catch (NumberFormatException e) {
            return "El identificador proporcionado no es un número entero válido";
        } catch (Exception e) {
            return "Error interno en el servidor";
        }
    }

    /**
     * Registra un nuevo perfil de médico vinculado a un usuario existente tras validar la integridad de los datos.
     * 
     * @param idUsuario identificador del usuario asociado al médico.
     * @param cedula cédula profesional del médico.
     * @param especialidad área de especialización médica.
     * @param direccion ubicación del consultorio o centro médico.
     * @return un mensaje de texto indicando el resultado del registro.
     */
    @PostMapping("/api/medicos/registro/{idUsuario}/{cedula}/{especialidad}/{direccion}")
    public Object agregarMedico(
            @PathVariable String idUsuario,
            @PathVariable String cedula,
            @PathVariable String especialidad,
            @PathVariable String direccion) {

        if (idUsuario == null) {
            return "El identificador de usuario no puede ser nulo";
        }
        if (idUsuario.length() == 0) {
            return "El identificador de usuario no puede estar vacío";
        }
        if (cedula == null) {
            return "La cédula no puede ser nula";
        }
        if (cedula.length() == 0) {
            return "La cédula no puede estar vacía";
        }
        if (especialidad == null) {
            return "La especialidad no puede ser nula";
        }
        if (especialidad.length() == 0) {
            return "La especialidad no puede estar vacía";
        }
        if (direccion == null) {
            return "La dirección no puede ser nula";
        }
        if (direccion.length() == 0) {
            return "La dirección no puede estar vacía";
        }

        try {
            int idUsuarioInt = Integer.parseInt(idUsuario);
            Usuario usuarioAsociado = usuarioService.obtenerUsuarioPorId(idUsuarioInt);

            if (usuarioAsociado == null) {
                return "El usuario asociado no existe en la base de datos";
            }

            Medico nuevoMedico = medicoService.agregarMedico(usuarioAsociado, cedula, especialidad, direccion);

            if (nuevoMedico != null) {
                return "Médico agregado correctamente";
            } else {
                return "No se pudo registrar el perfil de médico";
            }
        } catch (NumberFormatException e) {
            return "El identificador de usuario debe ser un número entero válido";
        } catch (Exception e) {
            return "Error interno al procesar el registro del médico";
        }
    }

    /**
     * Elimina un médico del sistema basándose en su identificador único.
     * 
     * @param id identificador único del médico en formato de texto.
     * @return un mensaje de texto confirmando la eliminación o reportando el fallo.
     */
    @DeleteMapping("/api/medicos/registro/{id}")
    public Object eliminarMedico(@PathVariable String id) {
        try {
            if (id == null) {
                return "El identificador no puede ser nulo";
            }
            if (id.length() == 0) {
                return "El identificador no puede estar vacío";
            }

            int idInt = Integer.parseInt(id);
            boolean eliminado = medicoService.eliminarMedico(idInt);

            if (eliminado) {
                return "Médico eliminado exitosamente";
            } else {
                return "No se encontró el médico a eliminar";
            }
        } catch (NumberFormatException e) {
            return "El identificador debe ser un número entero válido";
        } catch (Exception e) {
            return "Error interno en el servidor";
        }
    }

    /**
     * Actualiza la información de un médico existente tras validar su existencia y la integridad de los campos.
     * 
     * @param id identificador único del médico.
     * @param idUsuario identificador del usuario asociado.
     * @param cedula nueva cédula profesional.
     * @param especialidad nueva especialidad.
     * @param direccion nueva dirección.
     * @return un mensaje de texto con el resultado de la actualización.
     */
    @PutMapping("/api/medicos/registro/{id}/{idUsuario}/{cedula}/{especialidad}/{direccion}")
    public Object actualizarMedico(
            @PathVariable String id,
            @PathVariable String idUsuario,
            @PathVariable String cedula,
            @PathVariable String especialidad,
            @PathVariable String direccion) {

        try {
            if (id == null) {
                return "El identificador no puede ser nulo";
            }
            if (id.length() == 0) {
                return "El identificador no puede estar vacío";
            }
            if (idUsuario == null) {
                return "El identificador de usuario no puede ser nulo";
            }
            if (idUsuario.length() == 0) {
                return "El identificador de usuario no puede estar vacío";
            }
            if (cedula == null) {
                return "La cédula no puede ser nula";
            }
            if (cedula.length() == 0) {
                return "La cédula no puede estar vacía";
            }
            if (especialidad == null) {
                return "La especialidad no puede ser nula";
            }
            if (especialidad.length() == 0) {
                return "La especialidad no puede estar vacía";
            }
            if (direccion == null) {
                return "La dirección no puede ser nula";
            }
            if (direccion.length() == 0) {
                return "La dirección no puede estar vacía";
            }

            int idInt = Integer.parseInt(id);
            int idUsuarioInt = Integer.parseInt(idUsuario);

            Usuario usuarioAsociado = usuarioService.obtenerUsuarioPorId(idUsuarioInt);
            if (usuarioAsociado == null) {
                return "El usuario asociado no existe en la base de datos";
            }

            Medico medicoActualizado = medicoService.modificarMedico(idInt, usuarioAsociado, cedula, especialidad, direccion);

            if (medicoActualizado != null) {
                return "Médico actualizado correctamente";
            } else {
                return "El médico no existe en la base de datos";
            }
        } catch (NumberFormatException e) {
            return "Los identificadores deben ser números enteros válidos";
        } catch (Exception e) {
            return "Error interno en el servidor";
        }
    }
}