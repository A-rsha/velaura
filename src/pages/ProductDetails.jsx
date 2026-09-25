import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import API from '../services/axios'

function ProductDetails({ cartCount, setCartCount, setCartItems }) {

    const { id } = useParams()
    const [product, setProduct] = useState(null)

    useEffect(() => {

        const fetchProduct = async () => {
            try {

                const res = await API.get(`/product/getProduct/${id}`)

                console.log("PRODUCT DETAILS:", res.data)

                setProduct(res.data.data)

            } catch (error) {

                console.log(
                    "Error fetching product:",
                    error.response?.data || error
                )

            }
        }

        fetchProduct()

    }, [id])


    const handleAddToCart = async () => {

        try {

            const res = await API.post('/cart/add', {
                productId: product._id
            })

            console.log("CART RESPONSE:", res.data)

            alert("Product added to cart")

            if (setCartCount) {
                setCartCount(prev => prev + 1)
            }

        } catch (error) {

            console.log(
                "Add to cart error:",
                error.response?.data || error
            )

            alert(
                error.response?.data?.message ||
                "Add To Cart Failed"
            )
        }
    }


    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading product...</p>
            </div>
        )
    }


    return (
        <div>

            <Navbar cartCount={cartCount} />

            <div className="max-w-5xl mx-auto mt-10 border bg-white shadow-lg rounded-2xl p-6 md:p-10">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Product Image */}

                    <div>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-[450px] object-cover rounded-2xl"
                        />
                    </div>


                    {/* Product Details */}

                    <div className="flex flex-col gap-5">

                        <h1 className="text-3xl font-bold">
                            {product.title}
                        </h1>

                        <p className="text-gray-600 leading-relaxed">
                            {product.description}
                        </p>

                        <p className="text-2xl font-bold">
                            ₹{product.price}
                        </p>

                        <p className="text-sm text-gray-500">
                            Category: {product.category}
                        </p>


                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-48 bg-orange-100 hover:bg-orange-200 py-3 rounded-lg font-medium"
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>

            <Footer />

        </div>
    )
}

export default ProductDetails