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
                <p className="text-sm text-gray-500">
                    Loading cart...
                </p>
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

        <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">

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

                    <div className="mb-10 sm:mb-12">

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
                            YOUR SELECTION
                        </p>

                        <h1
                            className="
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
                                border
                                border-[#DED5C8]
                                bg-[#F5F0E8]
                                px-6
                                py-20
                                text-center
                            "
                        >

                            <p
                                className="
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

                                {cartItems.map((item) => (

                                    <div
                                        key={item.productId?._id}
                                        className="
                                            flex
                                            flex-col
                                            sm:flex-row
                                            gap-5
                                            border
                                            border-[#DED5C8]
                                            bg-white
                                            p-4
                                            sm:p-5
                                        "
                                    >


                                        {/* Product Image */}

                                        <div
                                            className="
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
                                                    <div className='mt-2'>
                                                        <p className='text-sm text-gray-600 line-through'>
                                                            ₹{item.price}
                                                        </p>
                                                        <p className='text-sm font-semibold text-[#2B2926]'>
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

                                                <div
                                                    className="
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
                                                        className="
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
                                                        className="
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


                                                <button
                                                    onClick={() =>
                                                        deleteProduct(
                                                            item.productId?._id
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-1.5
                                                        text-xs
                                                        text-gray-500
                                                        transition
                                                        hover:text-red-600
                                                    "
                                                >
                                                    <FiTrash2 size={15} />
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
                                    <FiArrowRight size={16} />
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

        </div>
    )
}

export default CartPage