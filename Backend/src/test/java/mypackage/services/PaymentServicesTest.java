package mypackage.services;

import mypackage.entity.Order;
import mypackage.exception.BadRequestException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertThrows;

class PaymentServicesTest {

    @InjectMocks
    private PaymentServices paymentServices;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Inject fake key to avoid null pointer with Stripe.apiKey
        ReflectionTestUtils.setField(paymentServices, "stripeSecretKey", "sk_test_fake123");
    }

    @Test
    void testCreatePaymentSession_InvalidStripeKey() {
        Order testOrder = new Order();
        testOrder.setOrder_id(1);
        testOrder.setTotal_amount(150.0);

        // This will naturally fail because "sk_test_fake123" is rejected by Stripe servers
        assertThrows(BadRequestException.class, () -> paymentServices.CreatePaymentSession(testOrder));
    }
}
