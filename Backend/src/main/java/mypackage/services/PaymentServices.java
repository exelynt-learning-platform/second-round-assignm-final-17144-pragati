package mypackage.services;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import mypackage.entity.Order;
import mypackage.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentServices {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    public Map<String, String> CreatePaymentSession(Order order) {
        try {
            Stripe.apiKey = stripeSecretKey;

            long amountInCents = (long) (order.getTotal_amount() * 100);

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("inr")
                    .setDescription("ShopEase E-commerce Purchase")
                    .putMetadata("order_id", String.valueOf(order.getOrder_id()))
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            return response;

        } catch (Exception e) {
            System.out.println("Stripe error: " + e.getMessage());
            throw new BadRequestException("Payment session creation failed: " + e.getMessage());
        }
    }
}
