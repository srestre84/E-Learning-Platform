package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO (Data Transfer Object) para solicitudes de registro de usuarios.
 * 
 * Este DTO se usa para recibir los datos de registro de nuevos usuarios
 * desde el cliente durante el proceso de registro.
 * 
 * Contiene:
 * - Información personal del usuario (nombre, apellido)
 * - Credenciales de autenticación (email, contraseña)
 * - Rol del usuario en el sistema
 * 
 * Características:
 * - Validación de datos en el cliente
 * - Conversión a entidad User mediante método estático
 * - Integración con el sistema de roles
 * 
 * Seguridad:
 * - La contraseña se encripta antes de almacenar
 * - El email debe ser único en el sistema
 * - El rol se valida contra los roles permitidos
 */
@Getter
@Setter
public class UserRegisterDto {
    /**
     * Nombre del usuario que se está registrando.
     * Campo obligatorio para identificación personal.
     */
    private String userName;
    
    /**
     * Apellido del usuario que se está registrando.
     * Campo obligatorio para identificación personal.
     */
    private String lastName;
    
    /**
     * Email del usuario que se está registrando.
     * Debe ser único en el sistema y válido.
     */
    private String email;
    
    /**
     * Contraseña del usuario en texto plano.
     * Se encriptará automáticamente antes de almacenar.
     */
    private String password;
    
    /**
     * Rol del usuario en el sistema.
     * Define los permisos y acceso del usuario.
     */
    private User.Role role;

    /**
     * Método estático para convertir el DTO a una entidad User.
     * 
     * Este método facilita la conversión de datos de entrada
     * a la entidad de dominio para persistencia.
     * 
     * @param dto El DTO con los datos de registro
     * @return Entidad User con los datos del DTO
     */
    public static User toEntity(UserRegisterDto dto) {
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }
}
