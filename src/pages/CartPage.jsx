import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import API from '../services/axios'
import { useNavigate } from 'react-router-dom'
import { FiTrash2, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi'


function CartPage({ cartCount, setCartCount }) {

    const navigate = useNavigate()

    const [cart, setCart] = useState(null)


    const fetchCart = async () => {

        try {

            const res = await API.get('/cart/getCart')

            console.log("CART RESPONSE:", res.data)

            setCart(res.data.cart)

        } catch (error) {

            console.log(
                "CART ERROR:",
                error.response?.data || error
            )

        }

    }


    useEffect(() => {
        fetchCart()
    }, [])


    // Increase quantity

    const increaseQuantity = async (productId, currentQuantity) => {

        try {

            const res = await API.put('/cart/updateCart', {
                productId: productId,
                quantity: currentQuantity + 1
            })

            console.log("UPDATE CART:", res.data)

            fetchCart()

        } catch (error) {

            console.log(
                "INCREASE ERROR:",
                error.response?.data || error
            )

        }

    }


    // Decrease quantity

    const decreaseQuantity = async (productId, currentQuantity) => {

        if (currentQuantity <= 1) {
            return
        }

        try {

            const res = await API.put('/cart/updateCart', {
                productId: productId,
                quantity: currentQuantity - 1
            })

            console.log("UPDATE CART:", res.data)

            fetchCart()

        } catch (error) {

            console.log(
                "DECREASE ERROR:",
                error.response?.data || error
            )

        }

    }


    // Delete product

    const deleteProduct = async (productId) => {

        try {

            const res = await API.delete(
                '/cart/removeFromCart',
                {
                    data: {
                        productId: productId
                    }
                }
            )

            console.log("DELETE CART:", res.data)

            fetchCart()

            if (setCartCount) {
                setCartCount(prev => Math.max(0, prev - 1))
            }

        } catch (error) {

            console.log(
                "DELETE ERROR:",
                error.response?.data || error
            )

        }

    }


    if (!cart) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#F5F0E8]
            ">

                <div className="flex flex-col items-center gap-4">

                    <div className="cart-loader"></div>

                    <p className="text-sm text-gray-500">
                        Loading cart...
                    </p>

                </div>

                <style>{`

                    .cart-loader {
                        width: 34px;
                        height: 34px;
                        border: 2px solid #DED5C8;
                        border-top-color: #2B2926;
                        border-radius: 50%;
                        animation: cartSpin 0.8s linear infinite;
                    }

                    @keyframes cartSpin {
                        to {
                            transform: rotate(360deg);
                        }
                    }

                `}</style>

            </div>

        )

    }


    const cartItems = cart.items || []


    const totalPrice = cartItems.reduce(
        (total, item) => {

            const price = item.productId?.isOffer
                ? item.productId?.offerPrice
                : item.price

            return total + price * item.quantity

        },
        0
    )


    return (

        <div className="cart-page min-h-screen bg-[#F5F0E8] text-[#2B2926]">

            <Navbar cartCount={cartCount} />


            <main
                className="
                    min-h-screen
                    px-5
                    sm:px-8
                    md:px-10
                    lg:px-16
                    pt-24
                    sm:pt-28
                    pb-16
                "
            >

                <div className="max-w-6xl mx-auto">


                    {/* Page Heading */}

                    <div className="cart-heading mb-10 sm:mb-12">

                        <p
                            className="
                                cart-subtitle
                                mb-2
                                text-[10px]
                                sm:text-xs
                                uppercase
                                tracking-[3px]
                                text-gray-500
                            "
                        >
                            YOUR SELECTION
                        </p>

                        <h1
                            className="
                                cart-title
                                font-serif
                                text-3xl
                                sm:text-4xl
                                md:text-5xl
                                font-medium
                            "
                        >
                            Shopping Cart
                        </h1>

                        <p
                            className="
                                cart-description
                                mt-3
                                text-sm
                                sm:text-base
                                text-gray-500
                            "
                        >
                            Review your selected pieces before checkout.
                        </p>

                    </div>


                    {cartItems.length === 0 ? (

                        /* Empty Cart */

                        <div
                            className="
                                cart-empty
                                border
                                border-[#DED5C8]
                                bg-[#F5F0E8]
                                px-6
                                py-20
                                text-center
                            "
                        >

                            <div className="empty-cart-icon">

                                <svg
                                    width="42"
                                    height="42"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mx-auto text-gray-500"
                                >
                                    <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
                                    <circle cx="10" cy="21" r="1" />
                                    <circle cx="19" cy="21" r="1" />
                                </svg>

                            </div>


                            <p
                                className="
                                    mt-5
                                    font-serif
                                    text-2xl
                                    sm:text-3xl
                                "
                            >
                                Your cart is empty
                            </p>

                            <p
                                className="
                                    mt-3
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Discover something beautiful for your collection.
                            </p>

                            <button
                                onClick={() => navigate('/shop')}
                                className="
                                    cart-explore-btn
                                    mt-6
                                    border
                                    border-[#2B2926]
                                    px-7
                                    py-3
                                    text-sm
                                    font-medium
                                    transition
                                    duration-300
                                    hover:bg-[#2B2926]
                                    hover:text-white
                                "
                            >
                                Explore Collection
                            </button>

                        </div>

                    ) : (

                        <div
                            className="
                                grid
                                grid-cols-1
                                lg:grid-cols-[1fr_340px]
                                gap-10
                                lg:gap-12
                            "
                        >


                            {/* Cart Items */}

                            <div className="space-y-5">

                                {cartItems.map((item, index) => (

                                    <div
                                        key={item.productId?._id}
                                        className="cart-item-card flex flex-col sm:flex-row gap-5 border border-[#DED5C8] bg-white p-4 sm:p-5"
                                        style={{
                                            '--cart-index': index
                                        }}
                                    >


                                        {/* Product Image */}

                                        <div
                                            className="
                                                cart-image-wrapper
                                                shrink-0
                                                w-full
                                                sm:w-32
                                                md:w-36
                                                aspect-square
                                                overflow-hidden
                                                bg-[#F5F0E8]
                                            "
                                        >

                                            <img
                                                src={item.productId?.image}
                                                alt={item.productId?.title}
                                                className="
                                                    cart-product-image
                                                    h-full
                                                    w-full
                                                    object-cover
                                                    transition
                                                    duration-500
                                                    hover:scale-105
                                                "
                                            />

                                        </div>


                                        {/* Product Details */}

                                        <div
                                            className="
                                                flex
                                                flex-1
                                                flex-col
                                                justify-between
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        cart-category
                                                        text-[10px]
                                                        uppercase
                                                        tracking-[2px]
                                                        text-gray-400
                                                    "
                                                >
                                                    {item.productId?.category}
                                                </p>

                                                <h2
                                                    className="
                                                        cart-product-title
                                                        mt-1
                                                        text-base
                                                        sm:text-lg
                                                        font-medium
                                                        text-[#2B2926]
                                                    "
                                                >
                                                    {item.productId?.title}
                                                </h2>


                                                {item.productId?.isOffer ? (

                                                    <div className="mt-2">

                                                        <p className="text-sm text-gray-600 line-through">
                                                            ₹{item.price}
                                                        </p>

                                                        <p className="text-sm font-semibold text-[#2B2926]">
                                                            ₹{item.productId?.offerPrice}
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {item.productId?.offerPercentage}% OFF
                                                        </p>

                                                    </div>

                                                ) : (

                                                    <p className="mt-2 text-sm text-gray-500">
                                                        ₹{item.price}
                                                    </p>

                                                )}

                                            </div>


                                            {/* Quantity + Delete */}

                                            <div
                                                className="
                                                    mt-5
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >

                                                {/* Quantity */}

                                                <div
                                                    className="
                                                        cart-quantity
                                                        flex
                                                        items-center
                                                        border
                                                        border-[#DED5C8]
                                                    "
                                                >

                                                    <button
                                                        onClick={() =>
                                                            decreaseQuantity(
                                                                item.productId?._id,
                                                                item.quantity
                                                            )
                                                        }
                                                        aria-label="Decrease quantity"
                                                        className="
                                                            quantity-btn
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            text-gray-600
                                                            transition
                                                            hover:bg-[#F5F0E8]
                                                        "
                                                    >
                                                        <FiMinus size={13} />
                                                    </button>


                                                    <span
                                                        className="
                                                            cart-quantity-value
                                                            flex
                                                            h-9
                                                            min-w-9
                                                            items-center
                                                            justify-center
                                                            border-x
                                                            border-[#DED5C8]
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        {item.quantity}
                                                    </span>


                                                    <button
                                                        onClick={() =>
                                                            increaseQuantity(
                                                                item.productId?._id,
                                                                item.quantity
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                        className="
                                                            quantity-btn
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            text-gray-600
                                                            transition
                                                            hover:bg-[#F5F0E8]
                                                        "
                                                    >
                                                        <FiPlus size={13} />
                                                    </button>

                                                </div>


                                                {/* Remove */}

                                                <button
                                                    onClick={() =>
                                                        deleteProduct(
                                                            item.productId?._id
                                                        )
                                                    }
                                                    className="
                                                        cart-remove-btn
                                                        flex
                                                        items-center
                                                        gap-1.5
                                                        text-xs
                                                        text-gray-500
                                                        transition
                                                        hover:text-red-600
                                                    "
                                                >

                                                    <FiTrash2
                                                        className="remove-icon"
                                                        size={15}
                                                    />

                                                    Remove

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>


                            {/* Order Summary */}

                            <div
                                className="
                                    cart-summary
                                    h-fit
                                    border
                                    border-[#DED5C8]
                                    bg-[#F5F0E8]
                                    p-6
                                    sm:p-7
                                    lg:sticky
                                    lg:top-28
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        uppercase
                                        tracking-[3px]
                                        text-gray-500
                                    "
                                >
                                    ORDER DETAILS
                                </p>

                                <h2
                                    className="
                                        mt-2
                                        font-serif
                                        text-2xl
                                        font-medium
                                    "
                                >
                                    Order Summary
                                </h2>


                                <div
                                    className="
                                        mt-7
                                        space-y-4
                                        text-sm
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            justify-between
                                        "
                                    >

                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span>
                                            ₹{totalPrice}
                                        </span>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            justify-between
                                        "
                                    >

                                        <span className="text-gray-500">
                                            Shipping
                                        </span>

                                        <span>
                                            Free
                                        </span>

                                    </div>


                                    <div
                                        className="
                                            border-t
                                            border-[#DCCFBE]
                                            pt-5
                                            mt-5
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
                                                cart-total-price
                                                text-xl
                                                font-medium
                                            "
                                        >
                                            ₹{totalPrice}
                                        </span>

                                    </div>

                                </div>


                                {/* Checkout Button */}

                                <button
                                    onClick={() => navigate('/payment')}
                                    className="
                                        cart-checkout-btn
                                        mt-7
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        bg-[#2B2926]
                                        py-3.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        duration-300
                                        hover:bg-black
                                    "
                                >

                                    Proceed to Checkout

                                    <FiArrowRight
                                        className="checkout-arrow"
                                        size={16}
                                    />

                                </button>


                                <p
                                    className="
                                        mt-4
                                        text-center
                                        text-xs
                                        leading-relaxed
                                        text-gray-500
                                    "
                                >
                                    Secure checkout with multiple
                                    payment options.
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </main>


            <Footer />


            {/* Premium Cart Animations */}

            <style>{`

                /* Page Entrance */

                .cart-page {
                    animation: cartPageEnter 0.7s ease both;
                }

                @keyframes cartPageEnter {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }


                /* Heading */

                .cart-heading {
                    animation: cartHeadingEnter 0.8s ease both;
                }

                .cart-subtitle {
                    animation: cartTextEnter 0.7s ease both;
                }

                .cart-title {
                    animation: cartTextEnter 0.8s ease both;
                    animation-delay: 0.1s;
                    animation-fill-mode: both;
                }

                .cart-description {
                    animation: cartTextEnter 0.8s ease both;
                    animation-delay: 0.2s;
                    animation-fill-mode: both;
                }

                @keyframes cartHeadingEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes cartTextEnter {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }


                /* Cart Item Cards */

                .cart-item-card {
                    opacity: 0;
                    animation: cartItemEnter 0.65s ease forwards;
                    animation-delay: calc(var(--cart-index) * 120ms);
                    transition:
                        transform 0.4s ease,
                        box-shadow 0.4s ease,
                        border-color 0.4s ease;
                }

                @keyframes cartItemEnter {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .cart-item-card:hover {
                    transform: translateY(-5px);
                    border-color: #C8BBA9;
                    box-shadow: 0 12px 28px rgba(43, 41, 38, 0.08);
                }


                /* Product Image */

                .cart-image-wrapper {
                    overflow: hidden;
                }

                .cart-product-image {
                    transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.3, 1);
                }

                .cart-item-card:hover .cart-product-image {
                    transform: scale(1.08);
                }


                /* Product Text */

                .cart-category {
                    transition: color 0.3s ease;
                }

                .cart-item-card:hover .cart-category {
                    color: #927858;
                }

                .cart-product-title {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .cart-item-card:hover .cart-product-title {
                    color: #927858;
                    transform: translateX(2px);
                }


                /* Quantity Buttons */

                .quantity-btn {
                    transition:
                        background 0.3s ease,
                        color 0.3s ease,
                        transform 0.2s ease;
                }

                .quantity-btn:hover {
                    background: #EAE2D7;
                    color: #2B2926;
                }

                .quantity-btn:active {
                    transform: scale(0.85);
                }

                .quantity-btn svg {
                    transition: transform 0.25s ease;
                }

                .quantity-btn:hover svg {
                    transform: scale(1.2);
                }

                .cart-quantity-value {
                    transition: background 0.3s ease;
                }

                .cart-quantity:hover .cart-quantity-value {
                    background: #FCFAF7;
                }


                /* Remove Button */

                .cart-remove-btn {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .cart-remove-btn:hover {
                    color: #DC2626;
                    transform: translateX(3px);
                }

                .remove-icon {
                    transition:
                        transform 0.3s ease;
                }

                .cart-remove-btn:hover .remove-icon {
                    transform: rotate(-10deg) scale(1.15);
                }


                /* Order Summary */

                .cart-summary {
                    opacity: 0;
                    animation: summaryEnter 0.8s ease forwards;
                    animation-delay: 0.3s;
                    transition:
                        box-shadow 0.4s ease,
                        border-color 0.4s ease;
                }

                @keyframes summaryEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .cart-summary:hover {
                    border-color: #C8BBA9;
                    box-shadow: 0 12px 30px rgba(43, 41, 38, 0.07);
                }


                /* Total Price */

                .cart-total-price {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .cart-summary:hover .cart-total-price {
                    color: #927858;
                    transform: scale(1.04);
                }


                /* Checkout Button */

                .cart-checkout-btn {
                    position: relative;
                    overflow: hidden;
                    transition:
                        background 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .cart-checkout-btn::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.2),
                        transparent
                    );
                    transform: skewX(-20deg);
                    transition: left 0.65s ease;
                }

                .cart-checkout-btn:hover::before {
                    left: 150%;
                }

                .cart-checkout-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(43, 41, 38, 0.2);
                }

                .cart-checkout-btn:active {
                    transform: scale(0.98);
                }

                .checkout-arrow {
                    transition: transform 0.3s ease;
                }

                .cart-checkout-btn:hover .checkout-arrow {
                    transform: translateX(5px);
                }


                /* Empty Cart */

                .cart-empty {
                    animation: emptyCartEnter 0.8s ease both;
                }

                @keyframes emptyCartEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px) scale(0.98);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .empty-cart-icon {
                    animation: emptyCartFloat 2.5s ease-in-out infinite;
                }

                @keyframes emptyCartFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-7px);
                    }
                }


                /* Explore Button */

                .cart-explore-btn {
                    transition:
                        background 0.3s ease,
                        color 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .cart-explore-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 7px 18px rgba(43, 41, 38, 0.15);
                }

                .cart-explore-btn:active {
                    transform: scale(0.96);
                }


                /* Reduced Motion */

                @media (prefers-reduced-motion: reduce) {

                    .cart-page,
                    .cart-heading,
                    .cart-subtitle,
                    .cart-title,
                    .cart-description,
                    .cart-item-card,
                    .cart-summary,
                    .cart-empty,
                    .empty-cart-icon,
                    .cart-loader {
                        animation: none !important;
                        opacity: 1 !important;
                        transform: none !important;
                    }

                    .cart-item-card,
                    .cart-product-image,
                    .quantity-btn,
                    .cart-checkout-btn,
                    .cart-remove-btn {
                        transition: none !important;
                    }

                }

            `}</style>

        </div>

    )

}

export default CartPage