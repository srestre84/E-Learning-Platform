package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.UserRegisterDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody UserRegisterDto user) {
        // Buscar si ya existe el usuario
        User existingUser = userService.findByEmail(user.getEmail());
        if (existingUser != null) {
            // Si ya existe, retorna 200 OK con el usuario existente
            return ResponseEntity.ok(existingUser);
        }

        User newUser = userService.saveUser(UserRegisterDto.toEntity(user));
        return ResponseEntity.ok(newUser);
    }
}
