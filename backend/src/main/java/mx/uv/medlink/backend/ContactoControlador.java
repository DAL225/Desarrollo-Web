package mx.uv.medlink.backend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*")
@Controller
public class ContactoControlador {

    @GetMapping("/api/contacto")
    public String mostrarContacto(Model modelo) {
        modelo.addAttribute("nombreAdmin", "Ing. Carlos Calcedo Cal");
        modelo.addAttribute("correo", "soporte.citas@clinica.mx");
        modelo.addAttribute("telefono", "+52 228 000 4567");
        modelo.addAttribute("horario", "Lunes a Viernes de 8:00 AM a 6:00 PM");
        
        return "contacto"; // Busca src/main/resources/templates/contacto.html
    }
}