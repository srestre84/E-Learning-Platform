package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.oracle.bmc.ConfigFileReader;
import com.oracle.bmc.auth.AuthenticationDetailsProvider;
import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.auth.InstancePrincipalsAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorageClient;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@ConditionalOnProperty(name = "oci.enabled", havingValue = "true")
public class OciConfig {

    @Value("${oci.config.profile:DEFAULT}")
    private String configProfile;

    @Value("${oci.config.file:~/.oci/config}")
    private String configFile;

    @Value("${oci.auth.type:config_file}")
    private String authType;

    @Value("${oci.auth.instance-principal.enabled:false}")
    private boolean instancePrincipalEnabled;

    @Value("${oci.objectstorage.region}")
    private String region;

    @Bean
    public AuthenticationDetailsProvider authenticationDetailsProvider() {
        try {
            if (instancePrincipalEnabled || "instance_principal".equals(authType)) {
                log.info("Configurando autenticación OCI con Instance Principal");
                return (AuthenticationDetailsProvider) InstancePrincipalsAuthenticationDetailsProvider.builder().build();
            } else {
                log.info("Configurando autenticación OCI con archivo de configuración: {}", configFile);
                return new ConfigFileAuthenticationDetailsProvider(
                    ConfigFileReader.parse(configFile, configProfile)
                );
            }
        } catch (Exception e) {
            log.error("Error configurando autenticación OCI: {}", e.getMessage());
            throw new RuntimeException("Error inicializando proveedor de autenticación OCI", e);
        }
    }

    @Bean
    public ObjectStorageClient objectStorageClient(AuthenticationDetailsProvider authProvider) {
        try {
            return ObjectStorageClient.builder()
                    .region(region)
                    .build(authProvider);
        } catch (Exception e) {
            log.error("Error inicializando cliente OCI Object Storage: {}", e.getMessage());
            throw new RuntimeException("Error inicializando cliente OCI Object Storage", e);
        }
    }
}
