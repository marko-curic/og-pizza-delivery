package og.ca.pizzadeliveryservice;

import og.ca.pizzadeliveryservice.jwt.JwtConfig;
import og.ca.pizzadeliveryservice.jwt.service.JwtService;
import og.ca.pizzadeliveryservice.kafka.service.KafkaConsumer;
import og.ca.pizzadeliveryservice.kafka.service.KafkaProducer;
import og.ca.pizzadeliveryservice.order.persistance.OrdersRepository;
import og.ca.pizzadeliveryservice.order.service.OrderingService;
import og.ca.pizzadeliveryservice.pizza.persistance.PizzaRepository;
import og.ca.pizzadeliveryservice.pizza.service.PizzaService;
import og.ca.pizzadeliveryservice.user.persistance.UserRepository;
import og.ca.pizzadeliveryservice.user.service.UserService;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public abstract class TestBase {

    @Mock
    protected JwtConfig jwtConfig;

    @InjectMocks
    protected JwtService jwtService;

    @Mock
    protected SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    protected KafkaConsumer kafkaConsumer;

    @Mock
    protected KafkaTemplate<String, String> kafkaTemplate;

    @InjectMocks
    protected KafkaProducer kafkaProducer;

    @Mock
    protected OrdersRepository ordersRepository;

    @Mock
    protected PizzaRepository pizzaRepository;

    @InjectMocks
    protected OrderingService orderingService;

    @InjectMocks
    protected PizzaService pizzaService;

    @Mock
    protected UserRepository userRepository;

    @Mock
    protected PasswordEncoder passwordEncoder;

    @InjectMocks
    protected UserService userService;
}