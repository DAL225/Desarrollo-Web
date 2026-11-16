package mx.uv.medlink.backend;

import jakarta.validation.constraints.NotBlank;

public class ActualizarResenaDTO {

    @NotBlank(message = "El comentario no puede estar vacío")
    private String comentario;

    public ActualizarResenaDTO() {
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}