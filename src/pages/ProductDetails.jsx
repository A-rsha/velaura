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
                <p className="text-sm text-gray-500">
                    Loading product...
                </p>
            </div>
        )
    }


    return (
        <div className="bg-[#F5F0E8] text-[#2B2926]">

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

                <div
                    className="
                        max-w-6xl
                        mx-auto
                    "
                >

                    {/* Breadcrumb */}

                    <p
                        className="
                            mb-6
                            text-xs
                            sm:text-sm
                            text-gray-500
                        "
                    >
                        Home / Shop / {product.title}
                    </p>


                    {/* Product Section */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-2
                            gap-8
                            md:gap-12
                            lg:gap-16
                            items-start
                        "
                    >

                        {/* Product Image */}

                        <div
                            className="
                                border
                                border-[#DED5C8]
                                bg-[#F5F0E8]
                                overflow-hidden
                            "
                        >

                            <img
                                src={product.image}
                                alt={product.title}
                                className="
                                    w-full
                                    aspect-[4/5]
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
                                flex-col
                                justify-center
                                py-2
                                md:py-8
                            "
                        >

                            {/* Category */}

                            <p
                                className="
                                    text-[10px]
                                    sm:text-xs
                                    uppercase
                                    tracking-[3px]
                                    text-gray-500
                                "
                            >
                                {product.category}
                            </p>


                            {/* Title */}

                            <h1
                                className="
                                    mt-3
                                    font-serif
                                    text-3xl
                                    sm:text-4xl
                                    md:text-5xl
                                    font-medium
                                    leading-tight
                                    text-[#2B2926]
                                "
                            >
                                {product.title}
                            </h1>


                            {/* Price */}

                            <p
                                className="
                                    mt-5
                                    text-xl
                                    sm:text-2xl
                                    font-medium
                                    text-[#2B2926]
                                "
                            >
                                ₹{product.price}
                            </p>


                            {/* Divider */}

                            <div
                                className="
                                    mt-6
                                    border-t
                                    border-[#DED5C8]
                                "
                            ></div>


                            {/* Description */}

                            <p
                                className="
                                    mt-6
                                    text-sm
                                    sm:text-base
                                    leading-7
                                    text-gray-600
                                    max-w-lg
                                "
                            >
                                {product.description}
                            </p>


                            {/* Product Info */}

                            <div
                                className="
                                    mt-6
                                    border-y
                                    border-[#DED5C8]
                                    py-4
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        uppercase
                                        tracking-[2px]
                                        text-gray-500
                                    "
                                >
                                    Category
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[#2B2926]
                                    "
                                >
                                    {product.category}
                                </p>

                            </div>


                            {/* Add To Cart */}

                            <button
                                onClick={handleAddToCart}
                                className="
                                    mt-7
                                    w-full
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
                                Add to Cart
                            </button>


                            {/* Small Note */}

                            <p
                                className="
                                    mt-3
                                    text-center
                                    text-xs
                                    text-gray-500
                                "
                            >
                                Add this piece to your collection.
                            </p>

                        </div>

                    </div>

                </div>

            </main>


            <Footer />

        </div>
    )
}

export default ProductDetails