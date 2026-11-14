package mx.uv.medlink.backend;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Receta {

    @Id
    private int idReceta;
    
    @OneToOne
    @JoinColumn(nullable = false, name = "id_cita")
    private Cita cita;

    @ManyToOne
    @JoinColumn(nullable = false, name = "id_medico")
    private Medico medico;

    @ManyToOne
    @JoinColumn(nullable = false, name = "id_paciente")
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private String descripcion;

    public Receta(){
    }

    public Receta(Cita cita, Medico medico, Usuario usuario, LocalDate fecha, String descripcion){
        if (cita == null){
            throw new IllegalArgumentException("La Receta debe estar asociada obligatoriamente a una cita.");
        }
        if (medico == null){
            throw new IllegalArgumentException("La Receta debe estar asociada obligatoriamente a un médico.");
        }
        if (usuario == null){
            throw new IllegalArgumentException("La Receta debe estar asociada obligatoriamente a un paciente.");
        }
        if (fecha == null){
            throw new IllegalArgumentException("La fecha debe de ser una fecha valida.");
        }
        if (descripcion == null || descripcion.trim().isEmpty()){
            throw new IllegalArgumentException("La descripción no puede estar vacía.");
        }
        this.cita = cita;
        this.medico = medico;
        this.usuario = usuario;
        this.fecha = fecha;
        this.descripcion = descripcion;
    }

    public int getIdReceta() {
        return idReceta;
    }

    public void setIdReceta(int idReceta) {
        this.idReceta = idReceta;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
