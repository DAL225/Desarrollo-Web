package mx.uv.medlink.backend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Clase Java que representa a un usuario dentro de un sistema web
 * @Entity: Palabra reservada proveniente del import que permite indicar a la API 
 * Hibernate que esta clase y sus instancias corresponden con una Tabla en la Base de datos
 */
@Entity
public class Usuario {

    //@ID: palabra reservada para indicarle a JPA que el atributo idUsuario es una llave primaria 
    @Id 
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int idUsuario;
    
    //@Column con nullable y length establecen que el campo no puede ser nulo y el tamaño correspondientemente
    @Column(nullable = false, length = 100)
    private String nombre;

    //@Column con nullable y length establecen que el campo no puede ser nulo y el tamaño correspondientemente
    @Column(nullable = false, length = 100, unique = true)
    private String correo;

    //@Column con nullable y length establecen que el campo no puede ser nulo y el tamaño correspondientemente al cifrado 
    @Column(nullable = false, length = 60)
    private String contrasena;

    //@Column con nullable y length establecen que el campo no puede ser nulo y el tamaño correspondientemente
    @Column(nullable = false, length = 10)
    private String telefono;
    
    //@Column con nullable y length establecen que el campo no puede ser nulo y el tamaño correspondientemente
    @Column(nullable = false, length = 10)
    private String rol;

    // Getters y Setters

    public int getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(int nIdUsuario) {
        this.idUsuario = nIdUsuario;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nNombre) {
        this.nombre = nNombre;
    }

    public String getCorreo() {
        return this.correo;
    }

    public void setCorreo(String nCorreo) {
        this.correo = nCorreo;
    }

    public String getContrasena() {
        return this.contrasena;
    }

    public void setContrasena(String nContrasena) {
        this.contrasena = nContrasena;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public void setTelefono(String nTelefono) {
        this.telefono = nTelefono;
    }

    public String getRol() {
        return this.rol;
    }

    public void setRol(String nRol) {
        this.rol = nRol;
    }

    public String toString(){
        return "El usuario "+this.idUsuario+" se llama "+nombre+", su correo es "+correo+", su contraseña es "+ contrasena+ "y su rol es "+rol+"";
    }

    public Usuario(String pNombre, String pCorreo, String pContrasena, String pTelefono, String pRol) {
        //Restricciones de valor nulo aplicadas al constructor
        if (pNombre == null) {
            throw new IllegalArgumentException("El usuario debe poseer un nombre.");
        }
        if (pCorreo == null) {
            throw new IllegalArgumentException("El usuario debe poseer un correo.");
        }
        if (pContrasena == null) {
            throw new IllegalArgumentException("El usuario debe poseer una contraseña.");
        }
        if (pTelefono == null) {
            throw new IllegalArgumentException("El usuario debe poseer un telefono.");
        }        
        if (pRol == null) {
            throw new IllegalArgumentException("El usuario debe poseer un rol.");
        }        

        //Se simula el criterio de integridad check en el constructor para el campo del rol
        if ((!pRol.equalsIgnoreCase("paciente") && !pRol.equalsIgnoreCase("medico"))){
            throw new IllegalArgumentException("El rol del usuario no es valido"); 
        }

        //Asignacion correcta de los datos
        this.nombre=pNombre;
        this.correo=pCorreo;
        this.contrasena= pContrasena;
        this.telefono=pTelefono;
        this.rol= pRol;
    }
    // Constructor vacío obligatorio para JPA
    public Usuario() {
    }
}
