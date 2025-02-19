package og.ca.pizzadeliveryservice.jwt;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "application.security.jwt")
public class JwtConfig {
    private String secretKey;
    private long expiration;
}

