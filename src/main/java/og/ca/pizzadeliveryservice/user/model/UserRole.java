package og.ca.pizzadeliveryservice.user.model;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
public enum UserRole implements GrantedAuthority {
    CUSTOMER("CUSTOMER"),
    ADMIN("ADMIN");

    private String value;

    UserRole(String value) {
        this.value = value;
    }

    @Override
    public String getAuthority() {
        return name();
    }
}
