package mx.uv.medlink.backend;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;

@Entity
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Es mejor IDENTITY para auto-incrementables en MySQL/PostgreSQL
    private Integer id_resena;

    // Relación Many-to-One con la entidad Medico, multiples resenas a un medico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medico", nullable = false)
    private Medico medico;

    // Relación Many-to-One con la entidad Usuario, multiples resenas por parte de
    // un usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Min(value = 1, message = "La calificacion minima es 1")
    @Max(value = 10, message = "La calificacion maxima es 10")
    @Column(nullable = false)
    private Integer calificacion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    private LocalDate fecha;

    // Constructor parametrizado
    public Resena(Medico medico,
            Usuario usuario,
            Integer calificacion,
            String comentario,
            LocalDate fecha) {

        this.medico = medico;
        this.usuario = usuario;
        this.calificacion = calificacion;
        this.comentario = comentario;
        this.fecha = fecha;
    }

    // Constructor vacio/por defecto
    public Resena() {
    }

    // Getters y Setters
    public Integer getId_resena() {
        return id_resena;
    }

    public void setId_resena(Integer id_resena) {
        this.id_resena = id_resena;
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

    public Integer getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}