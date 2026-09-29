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

                setCart(cartData)

                const total = cartData.items.reduce(
                    (total, item) =>
                        total + item.price * item.quantity,
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

        <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">

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

                            <div className="mb-8">

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
                                            w-full
                                            flex
                                            items-center
                                            gap-4
                                            border
                                            p-4
                                            sm:p-5
                                            text-left
                                            transition
                                            duration-300
                                            ${selectedMethod === method.name
                                                ? "border-[#2B2926] bg-[#F5F0E8]"
                                                : "border-[#DED5C8] bg-white hover:border-[#8F877D]"
                                            }
                                        `}
                                    >

                                        {/* Icon */}

                                        <div
                                            className="
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
                                                className="
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
                            <div className="mt-8  h-20
                                                w-full
                                                shrink-0
                                            
                                                justify-center
                                                border

                                                border-[#DED5C8]
                                                bg-white">
                                <input value={ShippingAddress}
                                    className=" text-black text-right"
                                    type="text"
                                    placeholder="Enter delivery address" onChange={(e) => setShippingAddress(e.target.value)}
                                />
                            </div>


                            {/* Payment Button */}


                            <div className="mt-8">

                                <PaymentButton
                                    shippingAddress={ShippingAddress}
                                    selectedMethod={selectedMethod} />

                            </div>


                            {/* Security Note */}

                            <div
                                className="
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

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium">
                                        ₹{totalAmount}
                                    </span>

                                </div>


                                {/* Shipping */}

                                <div className="flex justify-between">

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