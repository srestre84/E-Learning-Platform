package com.Dev_learning_Platform.Dev_learning_Platform;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.UserRegisterDto;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerUser_shouldReturnOk() throws Exception {
        UserRegisterDto dto = new UserRegisterDto();
        dto.setUserName("juan");
        dto.setLastName("perez");
        dto.setEmail("juan.perez@example.com");
        dto.setRole(com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.STUDENT);
        dto.setPassword("password123");

        mockMvc.perform(post("/api/users/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

}
