package og.ca.pizzadeliveryservice.jwt.service;

import og.ca.pizzadeliveryservice.TestBase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static og.ca.pizzadeliveryservice.helper.CommonsHelper.SECRET_KEY;
import static og.ca.pizzadeliveryservice.helper.CommonsHelper.USERNAME;
import static org.assertj.core.api.BDDAssertions.then;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest extends TestBase {

    @Test
    void should_generate_valid_token() {
        //given
        givenJwtConfig();

        //when
        var token = jwtService.generateToken(USERNAME);

        //then
        then(token).isNotNull();
        then(jwtService.extractUsername(token)).isEqualTo(USERNAME);
    }

    @Test
    void should_extract_username_from_token() {
        //given
        givenJwtConfig();

        //when
        var token = jwtService.generateToken(USERNAME);
        var extractedUsername = jwtService.extractUsername(token);

        //then
        then(extractedUsername).isEqualTo(USERNAME);
    }

    @Test
    void should_validate_token_successfully() {
        //given
        givenJwtConfig();

        //when
        var token = jwtService.generateToken(USERNAME);

        //then
        then(jwtService.validateToken(token)).isTrue();
    }

    @Test
    void should_invalidate_tempered_token() {
        //given
        givenJwtConfig();

        //when
        var validToken = jwtService.generateToken(USERNAME);
        var tamperedToken = validToken.substring(0, validToken.length() - 2) + "ab";

        //then
        then(jwtService.validateToken(tamperedToken)).isFalse();
    }

    private void givenJwtConfig() {
        var expiration = 3600000L;
        when(jwtConfig.getSecretKey()).thenReturn(SECRET_KEY);
        when(jwtConfig.getExpiration()).thenReturn(expiration);
    }

}

