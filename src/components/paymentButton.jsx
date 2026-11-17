import { useState } from "react"
import RazorpayCheckout from "@razorpay/razorpay-js/checkout"
import API from "../services/axios"
import { toast } from "react-toastify"
import { FiCheckCircle, FiXCircle, FiLock, FiArrowRight } from "react-icons/fi"

const PaymentButton = ({
    shippingAddress,
    selectedMethod,
    setAddressError
}) => {

    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = async () => {

        if (!shippingAddress?.trim()) {
            setAddressError("Address is required")
            return
        }

        if (isProcessing) return

        setAddressError("")
        setIsProcessing(true)

        try {

            const res = await API.post("/payment/createOrder")

            console.log("RAZORPAY ORDER RESPONSE:", res.data)

            if (!res.data.success) {
                toast.error("Unable to create order", {
                    icon: <FiXCircle size={21} />
                })
                setIsProcessing(false)
                return
            }

            const order = res.data.order

            console.log(
                "RAZORPAY KEY:",
                import.meta.env.VITE_RAZORPAY_KEY_ID
            )

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
                    )

                    try {

                        const paymentMethod =
                            selectedMethod === "Card"
                                ? "CARD"
                                : selectedMethod

                        console.log(
                            "SELECTED METHOD:",
                            selectedMethod
                        )

                        console.log(
                            "METHOD SENT TO BACKEND:",
                            paymentMethod
                        )

                        const verifyRes = await API.post(
                            "/payment/verify",
                            {
                                ...paymentResponse,
                                shippingAddress: shippingAddress,
                                paymentMethod: paymentMethod
                            }
                        )

                        console.log(
                            "VERIFY RESPONSE:",
                            verifyRes.data
                        )

                        if (verifyRes.data.success) {

                            toast.success("Payment successful", {
                                icon: <FiCheckCircle size={21} />
                            })

                        } else {

                            toast.error("Payment verification failed", {
                                icon: <FiXCircle size={21} />
                            })

                        }

                    } catch (error) {

                        console.log(
                            "VERIFY ERROR:",
                            error
                        )

                        console.log(
                            "VERIFY ERROR RESPONSE:",
                            error.response?.data
                        )

                        toast.error(
                            error.response?.data?.message ||
                            "Payment verification failed",
                            {
                                icon: <FiXCircle size={21} />
                            }
                        )

                    } finally {
                        setIsProcessing(false)
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

            })

            checkout.on(
                "payment.failed",
                function (response) {

                    console.log(
                        "PAYMENT FAILED:",
                        response
                    )

                    toast.error("Payment failed", {
                        icon: <FiXCircle size={21} />
                    })

                    setIsProcessing(false)

                }
            )

            checkout.open()

            setIsProcessing(false)

        } catch (error) {

            console.log(
                "PAYMENT ERROR:",
                error
            )

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            )

            toast.error(
                error.response?.data?.message ||
                "Something went wrong",
                {
                    icon: <FiXCircle size={21} />
                }
            )

            setIsProcessing(false)
        }
    }


    return (

        <div className="payment-button-wrapper w-full">

            <style>{`

                .velaura-pay-button {
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                    transition:
                        transform 0.35s ease,
                        box-shadow 0.35s ease,
                        background 0.35s ease;
                }

                .velaura-pay-button::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 65%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.25),
                        transparent
                    );
                    transform: skewX(-20deg);
                    transition: left 0.7s ease;
                    z-index: -1;
                }

                .velaura-pay-button:hover::before {
                    left: 150%;
                }

                .velaura-pay-button:hover:not(:disabled) {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 25px rgba(0,0,0,0.22);
                    background: #292929;
                }

                .velaura-pay-button:active:not(:disabled) {
                    transform: translateY(-1px) scale(0.98);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                }

                .velaura-pay-icon {
                    transition: transform 0.35s ease;
                }

                .velaura-pay-button:hover .velaura-pay-icon {
                    transform: translateX(5px);
                }

                .velaura-pay-lock {
                    transition: transform 0.35s ease;
                }

                .velaura-pay-button:hover .velaura-pay-lock {
                    transform: scale(1.15);
                }

                .velaura-pay-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: velauraPaySpin 0.7s linear infinite;
                }

                @keyframes velauraPaySpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .velaura-pay-button:disabled {
                    cursor: not-allowed;
                    opacity: 0.7;
                }

                @media (prefers-reduced-motion: reduce) {
                    .payment-button-wrapper *,
                    .payment-button-wrapper *::before {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                }

            `}</style>


            <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="
                    velaura-pay-button
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-black
                    py-3
                    font-semibold
                    text-white
                "
            >

                {isProcessing ? (

                    <>
                        <span className="velaura-pay-spinner"></span>
                        Processing...
                    </>

                ) : (

                    <>
                        <FiLock
                            size={17}
                            className="velaura-pay-lock"
                        />

                        Pay Now

                        <FiArrowRight
                            size={18}
                            className="velaura-pay-icon"
                        />
                    </>

                )}

            </button>

            <p className="
                mt-3
                flex
                items-center
                justify-center
                gap-1.5
                text-[11px]
                text-gray-500
            ">
                <FiLock size={12} />
                Secure payment powered by Razorpay
            </p>

        </div>

    )
}

export default PaymentButton