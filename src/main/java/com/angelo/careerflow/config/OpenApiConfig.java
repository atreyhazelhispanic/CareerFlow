package com.angelo.careerflow.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI careerFlowOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CareerFlow API")
                        .version("v1")
                        .description("Backend API for tracking job applications, interviews, contacts, and notes."));
    }
}