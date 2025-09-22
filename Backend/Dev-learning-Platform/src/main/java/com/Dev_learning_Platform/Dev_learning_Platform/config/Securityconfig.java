package com.Dev_learning_Platform.Dev_learning_Platform.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;

import lombok.extern.slf4j.Slf4j;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@Slf4j
public class Securityconfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    public Securityconfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * Configuración de CORS para Spring Security
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        log.info("Configurando CORS en SecurityConfig con orígenes: {}", Arrays.toString(allowedOrigins));

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins)); // Usar solo orígenes explícitos
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        log.info("CORS configurado en SecurityConfig");
        return source;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ CRÍTICO: Habilitar CORS
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // ✅ Endpoints públicos (sin autenticación)
                .requestMatchers("/auth/**").permitAll()           // Login públicos
                .requestMatchers("/api/users/register").permitAll() // Registro público  
                .requestMatchers("/api/courses").permitAll() // Catálogo público
                .requestMatchers("/api/courses/{id}").permitAll() // Detalle público de curso
                .requestMatchers("/api/categories").permitAll() // Categorías públicas
                .requestMatchers("/api/course-videos/course/{courseId}").permitAll() // Videos públicos del curso
                .requestMatchers("/api/course-videos/course/{courseId}/lessons").permitAll() // Lecciones públicas del curso

                // ✅ Herramientas de desarrollo
                .requestMatchers("/h2-console/**").permitAll()      // H2 para desarrollo
                .requestMatchers("/actuator/health").permitAll()    // Health check
                .requestMatchers("/api/test/**").permitAll()        // Endpoints de test para desarrollo
                
                // ✅ Testing de Stripe (temporal para desarrollo)
                .requestMatchers("/api/stripe/**").permitAll()      // Stripe endpoints para testing

                // ✅ Todo lo demás requiere autenticación JWT
                .anyRequest().authenticated()                       // Resto requiere JWT
            )
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.deny())
                .contentTypeOptions(contentTypeOptions -> {})
                .referrerPolicy(referrer -> referrer
                    .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
                )
            )
            // ✅ CRÍTICO: Agregar filtro JWT antes del filtro de autenticación estándar
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) 
            throws Exception {
        return config.getAuthenticationManager();
    }
}