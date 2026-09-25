import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import API from '../services/axios'
import { useNavigate } from 'react-router-dom'


function CartPage({ cartCount, setCartCount }) {
  const navigate =useNavigate()

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
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Loading cart...
                </p>
            </div>
        )
    }


    const cartItems = cart.items || []



    const totalPrice = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    )


    return (
        <div className="min-h-screen bg-gray-50">

            <Navbar cartCount={cartCount} />


            <div className="max-w-6xl mx-auto px-4 py-10">

                <h1 className="text-3xl font-bold mb-8">
                    Shopping Cart
                </h1>


                {cartItems.length === 0 ? (

                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm">

                        <p className="text-gray-500 text-lg">
                            Your cart is empty
                        </p>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                        

                        <div className="lg:col-span-2 space-y-4">

                            {cartItems.map((item) => (

                                <div
                                    key={item.productId?._id}
                                    className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-5"
                                >

                                    

                                    <img
                                        src={item.productId?.image}
                                        alt={item.productId?.title}
                                        className="w-28 h-28 object-cover rounded-xl"
                                    />


                                    

                                    <div className="flex-1 text-center sm:text-left">

                                        <h2 className="text-lg font-semibold">
                                            {item.productId?.title}
                                        </h2>


                                        <p className="text-gray-600 mt-1">
                                            ₹{item.price}
                                        </p>


                                      

                                        <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">

                                            <button
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.productId?._id,
                                                        item.quantity
                                                    )
                                                }
                                                className="w-8 h-8 border rounded-lg hover:bg-gray-100"
                                            >
                                                −
                                            </button>


                                            <span className="font-medium">
                                                {item.quantity}
                                            </span>


                                            <button
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.productId?._id,
                                                        item.quantity
                                                    )
                                                }
                                                className="w-8 h-8 border rounded-lg hover:bg-gray-100"
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    <button
                                        onClick={() =>
                                            deleteProduct(
                                                item.productId?._id
                                            )
                                        }
                                        className="text-red-500 hover:text-red-700 text-xl"
                                    >
                                        🗑️
                                    </button>

                                </div>

                            ))}

                        </div>


                       
                        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">

                            <h2 className="text-xl font-semibold mb-6">
                                Order Summary
                            </h2>


                            <div className="flex justify-between text-gray-600 mb-4">

                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    ₹{totalPrice}
                                </span>

                            </div>


                            <div className="border-t pt-4 flex justify-between text-lg font-bold">

                                <span>
                                    Total
                                </span>

                                <span>
                                    ₹{totalPrice}
                                </span>

                            </div>


                            <button
                                className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800"
                            onClick={()=>navigate('/payment')} >
                                Proceed to Checkout
                            </button>

                        </div>

                    </div>

                )}

            </div>


            <Footer />

        </div>
    )
}

export default CartPage