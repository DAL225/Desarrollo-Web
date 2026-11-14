package mx.uv.medlink.backend;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Cita {
    
    @Id
    private int idCita;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora_inicio;

    @Column(nullable = false)
    private LocalTime hora_fin;

    @ManyToOne
    @JoinColumn(nullable = false, name = "id_medico")
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public enum estado {
        DISPONIBLE,
        RESERVADA,
        ATENDIDA,
        CANCELADA
    }

    @Enumerated(EnumType.STRING)
    private estado estado;

    public Cita(){
    }

    public Cita(LocalDate fecha, LocalTime hora_inicio, LocalTime hora_fin, Medico medico, Usuario usuario, estado estado){
        if (fecha == null || fecha.isBefore(LocalDate.now())){
            throw new IllegalArgumentException("La fecha debe de ser una fecha valida.");
        }
        if (hora_inicio == null){
            throw new IllegalArgumentException("Debe establecerse una hora valida.");
        }
        if (hora_fin == null){
            throw new IllegalArgumentException("Debe establecerse una hora valida.");
        }
        if (medico == null){
            throw new IllegalArgumentException("La Cita debe estar asociada obligatoriamente a un médico.");
        }
        if (estado == null){
            throw new IllegalArgumentException("El estado debe ser uno de los estados valido.");
        }
        this.fecha = fecha;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.medico = medico;
        this.estado = estado;
    }

    public int getIdCita() {
        return idCita;
    }

    public void setIdCita(int idCita) {
        this.idCita = idCita;
    }


    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora_inicio() {
        return hora_inicio;
    }

    public void setHora_inicio(LocalTime hora_inicio) {
        this.hora_inicio = hora_inicio;
    }

    public LocalTime getHora_fin() {
        return hora_fin;
    }

    public void setHora_fin(LocalTime hora_fin) {
        this.hora_fin = hora_fin;
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

    public estado getEstado() {
        return estado;
    }

    public void setEstado(estado estado) {
        this.estado = estado;
    }
}
