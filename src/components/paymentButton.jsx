import RazorpayCheckout from "@razorpay/razorpay-js/checkout";
import API from "../services/axios";

const PaymentButton = ({ shippingAddress, selectedMethod }) => {

    const handlePayment = async () => {

        try {

            const res = await API.post("/payment/createOrder");

            console.log("RAZORPAY ORDER RESPONSE:", res.data);

            if (!res.data.success) {
                alert("Unable to create order");
                return;
            }

            const order = res.data.order;

            console.log(
                "RAZORPAY KEY:",
                import.meta.env.VITE_RAZORPAY_KEY_ID
            );

            const checkout = await RazorpayCheckout({

                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency: order.currency,

                name: "VELAURA",

                description: "VELAURA Accessories",

                order_id: order.id,

                handler: async function (paymentResponse) {

                    console.log(
                        "PAYMENT RESPONSE:",
                        paymentResponse
                    );

                    try {

                        
                        const paymentMethod =
                            selectedMethod === "Card"
                                ? "CARD"
                                : selectedMethod;

                        console.log(
                            "SELECTED METHOD:",
                            selectedMethod
                        );

                        console.log(
                            "METHOD SENT TO BACKEND:",
                            paymentMethod
                        );

                        const verifyRes = await API.post(
                            "/payment/verify",
                            {
                                ...paymentResponse,
                                shippingAddress: shippingAddress,
                                paymentMethod: paymentMethod
                            }
                        );

                        console.log(
                            "VERIFY RESPONSE:",
                            verifyRes.data
                        );

                        if (verifyRes.data.success) {

                            alert("Payment successful");

                        } else {

                            alert("Payment verification failed");

                        }

                    } catch (error) {

                        console.log(
                            "VERIFY ERROR:",
                            error
                        );

                        console.log(
                            "VERIFY ERROR RESPONSE:",
                            error.response?.data
                        );

                        alert(
                            error.response?.data?.message ||
                            "Payment verification failed"
                        );

                    }

                },

                prefill: {
                    name: "Test User",
                    email: "test@example.com",
                    contact: "9999999999",
                },

                theme: {
                    color: "#000000",
                },

            });

            checkout.on(
                "payment.failed",
                function (response) {

                    console.log(
                        "PAYMENT FAILED:",
                        response
                    );

                    alert("Payment failed");

                }
            );

            checkout.open();

        } catch (error) {

            console.log(
                "PAYMENT ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };


    return (
        <button
            onClick={handlePayment}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
            Pay Now
        </button>
    );
};

export default PaymentButton;