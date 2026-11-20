package mx.uv.medlink.backend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
public class MedicoControlador {

    @Autowired
    private MedicoService medicoService;

    @Autowired
    private UsuarioService usuarioService;


// Patrones globales para validaciones
    String patronNombre = "^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]+$";
    String patronCorreo = "^[A-Za-z0-9._%+-]{1,20}@gmail\\.com$";
    String patronPassword = "^\\S{1,20}$";
    String patronTelefono = "^[0-9]{10}$";

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
     * Metodo para agregar un usuario a la BD ingresando sus parametros en el curl 
     * y , si es médico, se crea su perfil profesional automáticamente
     * 
     * @param nombre nombre del usuario.
     * @param correo correo del usuario.
     * @param contrasena contraseña del usuario.
     * @param telefono número del usuario.
     * @param rol rol del usuario (paciente o medico).
     * @param cedula cédula profesional para perfiles médicos.
     * @param especialidad área de especialización médica.
     * @param direccion ubicación del consultorio o centro médico.
     * @return Mensaje de texto afirmativo o negativo
     */
    @PostMapping("/api/usuarios/registro/medico/{nombre}/{correo}/{contrasena}/{telefono}/{rol}/{cedula}/{especialidad}/{direccion}")
    public Object crearUsuarioMedico(
            @PathVariable String nombre,
            @PathVariable String correo,
            @PathVariable String contrasena,
            @PathVariable String telefono,
            @PathVariable String rol,
            @PathVariable String cedula,
            @PathVariable String especialidad,
            @PathVariable String direccion) {

        //Para cada dato enviado se verifica que no tenga el valor null y que exista texto alguno.
        if (nombre == null) {
            return "El nombre no puede ser nulo";
        }
        if (nombre.length() == 0) {
            return "El nombre no puede estar vacío";
        }
        if (correo == null) {
            return "El correo no puede ser nulo";
        }
        if (correo.length() == 0) {
            return "El correo no puede estar vacío";
        }
        if (contrasena == null) {
            return "La contraseña no puede ser nula";
        }
        if (contrasena.length() == 0) {
            return "La contraseña no puede estar vacía";
        }
        if (telefono == null) {
            return "El teléfono no puede ser nulo";
        }
        if (telefono.length() == 0) {
            return "El teléfono no puede estar vacío";
        }
        if (rol == null) {
            return "El rol no puede ser nulo";
        }
        if (rol.length() == 0) {
            return "El rol no puede estar vacío";
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
            //  Se crea al nuevo usuario
            Usuario nuevoUsuario = usuarioService.crearUsuario(nombre, correo, contrasena, telefono, rol);
            //  Si se regresa el nuevo dato que se ingreso entonces, verificamos si el rol insertado es un medico.
            if (nuevoUsuario != null) {
                //Si el rol es el de medico, entonces se crea el nuevo objeto y se llama a la interfaz
                if (rol.equalsIgnoreCase("medico")) {
                    Medico nuevoMedico = medicoService.agregarMedico(nuevoUsuario, cedula, especialidad, direccion);
                    if (nuevoMedico != null){
                        return "Nuevo medico agregado correctamente";
                    }else{
                        return "Error al agregar al medico";
                    }
                }else{
                    return "No se puede registrar otro rol";
                }
            } else {
                return "No se pudo registrar al usuario";
            }
        } catch (Exception e) {
            return "Error interno al procesar el registro";
        }
    }

    /**
     * Registra un nuevo médico relacionado a una tupla de usuario existente tras validar la integridad de los datos.
     */
    @PostMapping("/api/medicos/registro")
    public ResponseEntity <Map<String, Object>> agregarMedico(@RequestBody Map<String, Object> body) {
        // Se instancia la entidad para las respuestas
        Map<String, Object> res = new HashMap<>();

        // Si los datos enviados por el usuario estan vacios se envia el mensaje de error
        if (body == null) {
            res.put("ok", false);
            res.put("mensaje", "El cuerpo de la solicitud no puede ser nulo");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        // Se recuperan los datos en formato JSON y en la misma linea se parsean a texto
        String nombre = body.get("nombre") != null ? String.valueOf(body.get("nombre")).trim() : "";
        String correo = body.get("correo") != null ? String.valueOf(body.get("correo")).trim() : "";
        String contrasena = body.get("contrasena") != null ? String.valueOf(body.get("contrasena")) : "";
        String telefono = body.get("telefono") != null ? String.valueOf(body.get("telefono")).trim() : "";
        String cedula = body.get("cedula") != null ? String.valueOf(body.get("cedula")).trim() : "";
        String especialidad = body.get("especialidad") != null ? String.valueOf(body.get("especialidad")).trim() : "";
        String direccion = body.get("direccion") != null ? String.valueOf(body.get("direccion")).trim() : "";

        // Se realizan las verificaciones con los patrones para obtener datos correctos, en caso de que alguna falle se envia un mensaje de error explicando la situacion
        if (nombre.isEmpty() || !nombre.matches(patronNombre)) {
            res.put("ok", false);
            res.put("mensaje", "Nombre inválido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (correo.isEmpty() || !correo.matches("(?i)" + patronCorreo)) {
            res.put("ok", false);
            res.put("mensaje", "Correo inválido");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (contrasena.isEmpty() || !contrasena.matches(patronPassword)) {
            res.put("ok", false);
            res.put("mensaje", "Contraseña inválida");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (telefono.isEmpty() || !telefono.matches(patronTelefono)) {
            res.put("ok", false);
            res.put("mensaje", "Teléfono inválido: deben ser 10 dígitos numéricos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }
        if (cedula.isEmpty() || especialidad.isEmpty() || direccion.isEmpty()) {
            res.put("ok", false);
            res.put("mensaje", "Cédula, especialidad y dirección son obligatorias para médicos");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        }

        //Si se pasaron todas las verificaciones entonces se procede a agregar al usuario a la BD
        try {
            Usuario nuevoMedico = usuarioService.crearUsuario(nombre, correo, contrasena, telefono, "medico");
            //Se agrega al nuevo medico en la BD
            medicoService.agregarMedico(nuevoMedico, cedula, especialidad, direccion);
            // Luego se recupera el objeto usuario creado y se le agrega la informacion para enviarla en la respuesta y agregarla al session storage
            Map<String, Object> perfilMedico = new HashMap<>();
            perfilMedico.put("idUsuario", nuevoMedico.getIdUsuario());
            perfilMedico.put("nombre", nuevoMedico.getNombre());
            perfilMedico.put("correo", nuevoMedico.getCorreo());
            perfilMedico.put("telefono", nuevoMedico.getTelefono());
            perfilMedico.put("rol", nuevoMedico.getRol());
            perfilMedico.put("cedula", cedula);
            perfilMedico.put("especialidad", especialidad);
            perfilMedico.put("direccion", direccion);

            res.put("ok", true);
            res.put("mensaje", "Médico registrado correctamente");
            res.put("medico", perfilMedico);
            return ResponseEntity.status(HttpStatus.CREATED).body(res);
        } catch (IllegalArgumentException e) {
            res.put("ok", false);
            res.put("mensaje", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
        } catch (Exception e) {
            res.put("ok", false);
            res.put("mensaje", "Error interno al procesar el registro del médico");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
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
    @PutMapping("/api/medicos/registro/{id}/{cedula}/{especialidad}/{direccion}")
    public Object actualizarMedico(
            @PathVariable String id,
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
            Usuario usuarioAsociado = usuarioService.obtenerUsuarioPorId(idInt);
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