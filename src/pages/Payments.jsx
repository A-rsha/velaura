import React, { useEffect, useState } from "react"
import PaymentButton from "../components/paymentButton"

import {
    FiArrowLeft,
    FiCheck,
    FiCreditCard,
    FiSmartphone,
    FiShield,
} from "react-icons/fi"

import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import API from "../services/axios"

function Payments() {

    const [cart, setCart] = useState(null)
    const [totalAmount, setTotalAmount] = useState(0)

    const navigate = useNavigate()
    const [ShippingAddress, setShippingAddress] = useState("")

    const [selectedMethod, setSelectedMethod] = useState("UPI")
    const [addressError, setAddressError] = useState("")

    const paymentMethods = [
        {
            name: "UPI",
            icon: <FiSmartphone />,
            desc: "Google Pay, PhonePe",
        },
        {
            name: "Card",
            icon: <FiCreditCard />,
            desc: "Visa & MasterCard",
        },
        {
            name: "NetBanking",
            icon: <FiShield />,
            desc: "All Indian Banks",
        },
    ]

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const res = await API.get('/cart/getCart')

                console.log("CART RESPONSE:", res.data)

                const cartData = res.data.cart

                console.log("PAYMENT CART ITEMS:", cartData.items)

                setCart(cartData)

                const total = cartData.items.reduce(
                    (total, item) => {

                        const price = item.productId?.isOffer
                            ? item.productId?.offerPrice
                            : item.price

                        return total + price * item.quantity
                    },
                    0
                )

                setTotalAmount(total)

            } catch (error) {

                console.log("CART ERROR:", error)

            }

        }

        fetchCart()

    }, [])

    return (

        <div className="payment-page min-h-screen bg-[#F5F0E8] text-[#2B2926]">

            <style>{`

                /* Page entrance */

                .payment-page {
                    animation: paymentPageEnter 0.7s ease-out both;
                }

                @keyframes paymentPageEnter {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* Back button */

                .payment-back {
                    animation: paymentSlideLeft 0.7s ease-out both;
                    transition: all 0.3s ease;
                }

                .payment-back:hover {
                    transform: translateX(-6px);
                    color: #000;
                }

                @keyframes paymentSlideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                /* Main container */

                .payment-container {
                    animation: paymentContainerEnter 0.9s ease-out both;
                    animation-delay: 0.1s;
                    transition: box-shadow 0.4s ease;
                }

                .payment-container:hover {
                    box-shadow: 0 18px 45px rgba(43, 41, 38, 0.08);
                }

                @keyframes paymentContainerEnter {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Heading animations */

                .payment-heading {
                    animation: paymentFadeUp 0.7s ease-out both;
                    animation-delay: 0.2s;
                }

                .payment-heading h1 {
                    transition: letter-spacing 0.4s ease;
                }

                .payment-heading h1:hover {
                    letter-spacing: 0.5px;
                }

                @keyframes paymentFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Payment method cards */

                .payment-method {
                    position: relative;
                    overflow: hidden;
                    animation: paymentFadeUp 0.6s ease-out both;
                    transition:
                        transform 0.35s ease,
                        box-shadow 0.35s ease,
                        border-color 0.35s ease,
                        background 0.35s ease;
                }

                .payment-method:nth-child(1) {
                    animation-delay: 0.3s;
                }

                .payment-method:nth-child(2) {
                    animation-delay: 0.4s;
                }

                .payment-method:nth-child(3) {
                    animation-delay: 0.5s;
                }

                .payment-method::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.55),
                        transparent
                    );
                    transition: left 0.7s ease;
                    pointer-events: none;
                }

                .payment-method:hover::before {
                    left: 140%;
                }

                .payment-method:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 22px rgba(43, 41, 38, 0.09);
                }

                .payment-method-icon {
                    transition:
                        transform 0.4s ease,
                        background 0.4s ease,
                        border-color 0.4s ease;
                }

                .payment-method:hover .payment-method-icon {
                    transform: rotate(-8deg) scale(1.1);
                    border-color: #2B2926;
                }

                .payment-check {
                    animation: paymentCheckPop 0.35s ease-out both;
                }

                @keyframes paymentCheckPop {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    70% {
                        transform: scale(1.2);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* Address textarea */

                .payment-address {
                    transition:
                        border-color 0.3s ease,
                        box-shadow 0.3s ease,
                        transform 0.3s ease;
                }

                .payment-address:hover {
                    border-color: #8F877D;
                }

                .payment-address:focus {
                    border-color: #2B2926;
                    box-shadow: 0 0 0 4px rgba(43, 41, 38, 0.08);
                    transform: translateY(-2px);
                }

                /* Address error */

                .payment-error {
                    animation: paymentError 0.3s ease-out both;
                }

                @keyframes paymentError {
                    from {
                        opacity: 0;
                        transform: translateY(-5px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Security note */

                .payment-security {
                    animation: paymentFadeUp 0.8s ease-out both;
                    animation-delay: 0.7s;
                }

                .payment-security svg {
                    transition: transform 0.4s ease;
                }

                .payment-security:hover svg {
                    transform: rotate(15deg) scale(1.2);
                }

                /* Order summary */

                .payment-summary {
                    animation: paymentSummaryEnter 0.9s ease-out both;
                    animation-delay: 0.3s;
                }

                @keyframes paymentSummaryEnter {
                    from {
                        opacity: 0;
                        transform: translateX(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .payment-summary-row {
                    transition: transform 0.3s ease;
                }

                .payment-summary-row:hover {
                    transform: translateX(5px);
                }

                .payment-total {
                    transition: transform 0.3s ease;
                }

                .payment-total:hover {
                    transform: scale(1.04);
                }

                .payment-summary-note {
                    animation: paymentFadeUp 0.7s ease-out both;
                    animation-delay: 0.7s;
                    transition:
                        transform 0.35s ease,
                        box-shadow 0.35s ease;
                }

                .payment-summary-note:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(43, 41, 38, 0.07);
                }

                /* Reduced motion */

                @media (prefers-reduced-motion: reduce) {
                    .payment-page *,
                    .payment-page *::before,
                    .payment-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }

            `}</style>

            <main
                className="
                    px-5
                    sm:px-8
                    md:px-10
                    lg:px-16
                    pt-8
                    sm:pt-12
                    pb-16
                "
            >

                <div className="max-w-6xl mx-auto">

                    {/* Back */}

                    <button
                        className="
                            payment-back
                            mb-7
                            flex
                            items-center
                            gap-2
                            text-sm
                            text-gray-600
                            transition
                            duration-300
                            hover:text-black
                        "
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft size={17} />
                        Back
                    </button>


                    {/* Main Payment Container */}

                    <div
                        className="
                            payment-container
                            grid
                            grid-cols-1
                            lg:grid-cols-[1fr_360px]
                            border
                            border-[#DCCFBE]
                            bg-white
                        "
                    >

                        {/* Payment Section */}

                        <div
                            className="
                                p-6
                                sm:p-8
                                md:p-10
                            "
                        >

                            {/* Heading */}

                            <div className="payment-heading mb-8">

                                <p
                                    className="
                                        mb-2
                                        text-[10px]
                                        sm:text-xs
                                        uppercase
                                        tracking-[3px]
                                        text-gray-500
                                    "
                                >
                                    SECURE CHECKOUT
                                </p>

                                <h1
                                    className="
                                        font-serif
                                        text-3xl
                                        sm:text-4xl
                                        font-medium
                                    "
                                >
                                    Complete Your Payment
                                </h1>

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        leading-relaxed
                                        text-gray-500
                                    "
                                >
                                    Select your preferred payment method
                                    to complete your order.
                                </p>

                            </div>


                            {/* Payment Methods */}

                            <div className="space-y-3">

                                {paymentMethods.map((method) => (

                                    <button
                                        key={method.name}
                                        onClick={() =>
                                            setSelectedMethod(method.name)
                                        }
                                        className={`
                                            payment-method
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            border
                                            p-4
                                            sm:p-5
                                            text-left
                                            ${selectedMethod === method.name
                                                ? "border-[#2B2926] bg-[#F5F0E8]"
                                                : "border-[#DED5C8] bg-white hover:border-[#8F877D]"
                                            }
                                        `}
                                    >

                                        {/* Icon */}

                                        <div
                                            className="
                                                payment-method-icon
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                border
                                                border-[#DED5C8]
                                                bg-white
                                            "
                                        >
                                            {React.cloneElement(
                                                method.icon,
                                                { size: 19 }
                                            )}
                                        </div>


                                        {/* Details */}

                                        <div className="flex-1">

                                            <p
                                                className="
                                                    text-sm
                                                    sm:text-base
                                                    font-medium
                                                "
                                            >
                                                {method.name}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    sm:text-sm
                                                    text-gray-500
                                                "
                                            >
                                                {method.desc}
                                            </p>

                                        </div>


                                        {/* Selected */}

                                        {selectedMethod === method.name && (

                                            <div
                                                key={selectedMethod}
                                                className="
                                                    payment-check
                                                    flex
                                                    h-5
                                                    w-5
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#2B2926]
                                                "
                                            >
                                                <FiCheck
                                                    size={12}
                                                    className="text-white"
                                                />
                                            </div>

                                        )}

                                    </button>

                                ))}

                            </div>


                            {/* Shipping Address */}

                            <div className="mt-8 w-full">

                                <textarea
                                    value={ShippingAddress}
                                    className={`
                                        payment-address
                                        w-full
                                        rounded-lg
                                        border
                                        p-3
                                        text-left
                                        text-black
                                        outline-none
                                        ${addressError
                                            ? "border-red-500"
                                            : "border-[#DED5C8]"
                                        }
                                    `}
                                    placeholder="Enter delivery address"
                                    onChange={(e) => {

                                        setShippingAddress(e.target.value)

                                        if (e.target.value.trim()) {
                                            setAddressError("")
                                        }

                                    }}
                                />

                                {addressError && (

                                    <p className="payment-error mt-1 text-sm text-red-500">
                                        {addressError}
                                    </p>

                                )}

                            </div>


                            {/* Payment Button */}

                            <div className="mt-8">

                                <PaymentButton
                                    shippingAddress={ShippingAddress}
                                    selectedMethod={selectedMethod}
                                    setAddressError={setAddressError}
                                />

                            </div>


                            {/* Security Note */}

                            <div
                                className="
                                    payment-security
                                    mt-6
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    text-xs
                                    text-gray-500
                                "
                            >
                                <FiShield size={14} />
                                Secure and encrypted payment
                            </div>

                        </div>


                        {/* Order Summary */}

                        <aside
                            className="
                                payment-summary
                                border-t
                                lg:border-t-0
                                lg:border-l
                                border-[#DCCFBE]
                                bg-[#F5F0E8]
                                p-6
                                sm:p-8
                                md:p-10
                            "
                        >

                            <p
                                className="
                                    text-[10px]
                                    sm:text-xs
                                    uppercase
                                    tracking-[3px]
                                    text-gray-500
                                    mb-2
                                "
                            >
                                YOUR ORDER
                            </p>

                            <h2
                                className="
                                    font-serif
                                    text-2xl
                                    font-medium
                                    mb-7
                                "
                            >
                                Order Summary
                            </h2>


                            <div className="space-y-4 text-sm">

                                {/* Subtotal */}

                                <div className="payment-summary-row flex justify-between">

                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium">
                                        ₹{totalAmount}
                                    </span>

                                </div>


                                {/* Shipping */}

                                <div className="payment-summary-row flex justify-between">

                                    <span className="text-gray-500">
                                        Shipping
                                    </span>

                                    <span>
                                        Free
                                    </span>

                                </div>


                                {/* Divider */}

                                <div
                                    className="
                                        border-t
                                        border-[#DCCFBE]
                                        pt-5
                                        mt-5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            justify-between
                                            items-center
                                        "
                                    >

                                        <span className="font-medium">
                                            Total
                                        </span>

                                        <span
                                            className="
                                                payment-total
                                                text-xl
                                                font-medium
                                            "
                                        >
                                            ₹{totalAmount}
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* Summary Note */}

                            <div
                                className="
                                    payment-summary-note
                                    mt-8
                                    border
                                    border-[#DCCFBE]
                                    bg-white
                                    p-4
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        leading-relaxed
                                        text-gray-500
                                    "
                                >
                                    Your order will be processed securely
                                    after payment confirmation.
                                </p>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>


            <Footer />

        </div>

    )
}

export default Payments