package com.bdcnexus;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
    info = @Info(
        title = "BDC-Nexus Analytics API",
        version = "1.0.0",
        description = "Enterprise-grade sales analytics and predictive forecasting API. " +
                      "Aligned with SAP Business Data Cloud (BDC) data ingestion and analytics patterns.",
        contact = @Contact(name = "BDC-Nexus Team"),
        license = @License(name = "MIT")
    )
)
public class BdcNexusApplication {

    public static void main(String[] args) {
        SpringApplication.run(BdcNexusApplication.class, args);
    }
}
