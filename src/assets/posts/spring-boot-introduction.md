---
Getting Started with Spring Boot and Java
2025-08-22
---

# Getting Started with Spring Boot and Java

Spring Boot is a powerful framework built on top of the **Spring Framework**.  
It simplifies the process of building Java applications by providing:

- Auto-configuration
- Embedded servers (Tomcat, Jetty, Undertow)
- Production-ready features (metrics, logging, health checks)

## Why Spring Boot?

1. **Rapid development** – reduces boilerplate code.
2. **Standalone applications** – no need for external app servers.
3. **Microservices ready** – easily build REST APIs and distributed systems.

## Example: Hello World with Spring Boot

````java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication {

    @GetMapping("/")
    public String hello() {
        return "Hello, Spring Boot!";
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}


```bash
./mvnw spring-boot:run
````
