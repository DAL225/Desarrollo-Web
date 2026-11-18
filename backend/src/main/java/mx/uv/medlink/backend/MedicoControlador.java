package mx.uv.medlink.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

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
     * @return el listado de médicos o un mensaje de error si no fue posible recuperarlos.
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
     * @param id id del médico en formato de texto para validación.
     * @return el objeto médico encontrado o un mensaje de texto con el error correspondiente.
     */
    @GetMapping("/medico/{id}")
    public Object obtenerMedicoPorId(@PathVariable String id) {
        //Se verficia que el id enviado por el usuario no tenga valor null y que tenga texto
        if (id == null) {
            return "El parámetro no puede ser nulo";
        }
        if (id.length() == 0) {
            return "El parámetro no puede estar vacío";
        }
        
        try {
        //Se parsea el valor a entero
            int idInt = Integer.parseInt(id);
        //Se busca al medico por su id y si existe se recupera su objeto
            Medico medicoEncontrado = medicoService.obtenerMedicoPorId(idInt);
        //Si se pudo recuperar el objeto medico se envia al usuario si no entonces un mensaje de confirmacion
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
     * Registra un nuevo médico relacionado a una tupla de usuario existente tras validar la integridad de los datos.
     * 
     * @param idUsuario identificador del usuario asociado al médico.
     * @param cedula cédula profesional del médico.
     * @param especialidad especialidad del medico.
     * @param direccion ubicación del médico.
     * @return un mensaje de confirmacion del proceso.
     */
    @PostMapping("/api/medicos/registro/{idUsuario}/{cedula}/{especialidad}/{direccion}")
    public Object agregarMedico(
            @PathVariable String idUsuario,
            @PathVariable String cedula,
            @PathVariable String especialidad,
            @PathVariable String direccion) {
    // Se valida que cada uno de los satos enviados por el usuario tengan valor no nulo y texto existente
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
        //Se parsea el id del usuario a entero
            int idUsuarioInt = Integer.parseInt(idUsuario);
        //Buscamos al usuario existente en la BD y lo recuperamos
            Usuario usuarioAsociado = usuarioService.obtenerUsuarioPorId(idUsuarioInt);
        //En caso de que el usuario no se pudiera recuperar
            if (usuarioAsociado == null) {
                return "El usuario asociado no existe en la base de datos";
            }
        //Se agrega el nuevo medico a la BD y se recupera el objeto
            Medico nuevoMedico = medicoService.agregarMedico(usuarioAsociado, cedula, especialidad, direccion);
        //Si se recupero el objeto medico entonces se envia un mensaje de confirmacion
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
     * Elimina un médico del sistema mediante su id.
     * @param id id del médico en formato de texto.
     * @return un mensaje de texto confirmando la eliminación o reportando el fallo.
     */
    @DeleteMapping("/api/medicos/registro/{id}")
    public Object eliminarMedico(@PathVariable String id) {
        //Se verifica que el id enviado por el usuario no tenga valor nulo o texto vacio
        try {
            if (id == null) {
                return "El identificador no puede ser nulo";
            }
            if (id.length() == 0) {
                return "El identificador no puede estar vacío";
            }
        //Se parsea el id del usuario a entero
            int idInt = Integer.parseInt(id);
        //Se elimina al usuario y se regresa true o false dependiendo si se pudo eliminar o no al usuario
            boolean eliminado = medicoService.eliminarMedico(idInt);
        //Si el borrado fue exitoso se enviara un mensaje confirmando los cambios
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
     * @param id id del médico.
     * @param idUsuario id del usuario asociado.
     * @param cedula nueva cédula.
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
        //Se verifica que los datos enviados por el usuario no tengan valor nulo o texto vacio
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
        //Se parsea el id a entero
            int idInt = Integer.parseInt(id);
        //Se 
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