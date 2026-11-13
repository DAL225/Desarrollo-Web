package mx.uv.medlink.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;

/**
 * Clase Java que representa a un usuario dentro de un sistema web
 * @Entity: Palabra reservada proveniente del import que permite indicar a la API 
 * JPA que esta clase y sus instancias corresponden con una Tabla en la Base de datos
 */
@Entity
public class Medico {

    //@Id para indicar que el atributo corresponde con la llave primaria de la entidad
    @Id
    private int idMedico;

    /**
     * @OneToOne, @MapsIdRelación, @JoinColumn, es una secuencia que permite definir una llave foranea, 
     * La llave primaria del médico es también la foránea que apunta al idUsuario en la tabla usuario
     * 
     * **/
    @OneToOne
    @MapsId
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    //@Column con nullable, unique y length establecen que el campo cedulaProfesional no puede ser nulo, su valor es unico y el tamaño correspondientemente
    @Column(nullable = false, unique = true, length = 50)
    private String cedulaProfesional;

    //@Column con nullable y length establecen que el campo especialidad no puede ser nulo y el tamaño correspondientemente
    @Column(nullable = false, length = 100)
    private String especialidad;

    //@Column con nullable y length establecen que el campo direccion no puede ser nulo y el tamaño correspondientemente
    @Column(nullable = false, length = 100)
    private String direccion;

    // Constructor vacío obligatorio para JPA / Hibernate
    public Medico() {
    }

    // Constructor con validación simulada (restricciones)
    public Medico(Usuario usuario, String cedulaProfesional, String especialidad, String direccion) {
        //Restricciones de valor nulo aplicadas al constructor
        if (usuario == null) {
            throw new IllegalArgumentException("El médico debe estar asociado obligatoriamente a un usuario.");
        }
        //En los siguientes casos se verifica que la longitud del valor String no sea 0.
        if (cedulaProfesional == null || cedulaProfesional.trim().isEmpty()) {
            throw new IllegalArgumentException("La cédula profesional no puede estar vacía.");
        }
        if (especialidad == null || especialidad.trim().isEmpty() || especialidad.length() > 100) {
            throw new IllegalArgumentException("La especialidad es obligatoria y no puede superar los 100 caracteres.");
        }
        if (direccion == null || direccion.trim().isEmpty() || direccion.length() > 100) {
            throw new IllegalArgumentException("La dirección es obligatoria y no puede superar los 100 caracteres.");
        }
        this.usuario = usuario;
        this.cedulaProfesional = cedulaProfesional;
        this.especialidad = especialidad;
        this.direccion = direccion;
    }

    // Getters y Setters

    public int getIdMedico() {
        return this.idMedico;
    }

    public void setIdMedico(int pIdMedico) {
        this.idMedico = pIdMedico;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getCedulaProfesional() {
        return cedulaProfesional;
    }

    public void setCedulaProfesional(String cedulaProfesional) {
        this.cedulaProfesional = cedulaProfesional;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    @Override
    public String toString() {
        return "Medico [idMedico=" + idMedico + ", cedulaProfesional=" + cedulaProfesional + 
               ", especialidad=" + especialidad + ", direccion=" + direccion + "]";
    }
}