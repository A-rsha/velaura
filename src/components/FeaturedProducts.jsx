import React, { useEffect, useState } from 'react'
import { FiHeart, FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

import API from '../services/axios'
import {
    addWishlist,
    getWishlist,
    removeWishlist
} from '../services/api'


function FeaturedProducts() {

    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [wishlist, setWishlist] = useState([])


    // Fetch products
    useEffect(() => {

        const fetchProducts = async () => {

            try {

                const res = await API.get('/product/getProducts')

                console.log("FEATURED PRODUCTS:", res.data)

                const productData = res.data.data || []

                // Show only first 4 products
                setProducts(productData.slice(0, 4))

            } catch (error) {

                console.log(
                    "FEATURED PRODUCTS ERROR:",
                    error.response?.data || error
                )

            }

        }

        fetchProducts()

    }, [])


    // Fetch wishlist
    useEffect(() => {

        const fetchWishlist = async () => {

            try {

                const res = await getWishlist()

                const wishlistProducts = res.data?.wishlist || []

                const wishlistIds = wishlistProducts.map(
                    (product) => product._id
                )

                setWishlist(wishlistIds)

            } catch (error) {

                console.log(
                    "WISHLIST ERROR:",
                    error.response?.data || error
                )

            }

        }

        fetchWishlist()

    }, [])


    // Wishlist
    const handleWishlist = async (productId) => {

        try {

            if (wishlist.includes(productId)) {

                await removeWishlist(productId)

                setWishlist((prev) =>
                    prev.filter((id) => id !== productId)
                )

            } else {

                await addWishlist(productId)

                setWishlist((prev) => [
                    ...prev,
                    productId
                ])

            }

        } catch (error) {

            console.log(
                "WISHLIST ERROR:",
                error.response?.data || error
            )

        }

    }


    return (

        <section
            className="
                px-5
                sm:px-8
                md:px-10
                lg:px-16
                py-12
                sm:py-14
                md:py-16
            "
        >

            <div className="max-w-6xl mx-auto">


                {/* Section Heading */}

                <div
                    className="
                        flex
                        items-end
                        justify-between
                        mb-7
                        sm:mb-8
                    "
                >

                    <div>

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
                            FEATURED PRODUCTS
                        </p>

                        <h2
                            className="
                                font-serif
                                text-2xl
                                sm:text-3xl
                                md:text-4xl
                                font-medium
                                text-[#2B2926]
                            "
                        >
                            Our Best Sellers
                        </h2>

                    </div>


                    {/* View All */}

                    <button
                        onClick={() => navigate('/shop')}
                        className="
                            hidden
                            sm:flex
                            items-center
                            gap-1
                            text-xs
                            sm:text-sm
                            text-[#2B2926]
                            border-b
                            border-[#2B2926]
                            pb-1
                            transition
                            duration-300
                            hover:opacity-60
                        "
                    >
                        View All Products
                        <FiArrowUpRight size={14} />
                    </button>

                </div>


                {/* Product Grid */}

                <div
                    className="
                        grid
                        grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        gap-x-4
                        sm:gap-x-5
                        lg:gap-x-6
                        gap-y-8
                    "
                >

                    {products.map((product) => (

                        <div
                            key={product._id}
                            className="group"
                        >

                            {/* Image */}

                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    aspect-[4/5]
                                    bg-[#F5F0E8]
                                    border
                                    border-[#DED5C8]
                                "
                            >

                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition
                                        duration-500
                                        group-hover:scale-105
                                    "
                                />


                                {/* Wishlist */}

                                <button
                                    onClick={() =>
                                        handleWishlist(product._id)
                                    }
                                    className="
                                        absolute
                                        right-3
                                        top-3
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white/90
                                        transition
                                        duration-300
                                        hover:scale-105
                                    "
                                >

                                    <FiHeart
                                        size={16}
                                        strokeWidth={1.5}
                                        className={
                                            wishlist.includes(product._id)
                                                ? "fill-red-500 text-red-500"
                                                : "text-[#2B2926]"
                                        }
                                    />

                                </button>

                            </div>


                            {/* Product Info */}

                            <div
                                className="
                                    border-x
                                    border-b
                                    border-[#DED5C8]
                                    px-3
                                    py-3
                                    sm:px-4
                                    sm:py-4
                                "
                            >

                                <h3
                                    className="
                                        line-clamp-1
                                        text-xs
                                        sm:text-sm
                                        font-medium
                                        text-[#2B2926]
                                    "
                                >
                                    {product.title}
                                </h3>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        sm:text-base
                                        font-medium
                                        text-[#2B2926]
                                    "
                                >
                                    ₹{product.price}
                                </p>


                                {/* Rating */}

                                <div
                                    className="
                                        mt-1.5
                                        flex
                                        items-center
                                        gap-1
                                    "
                                >

                                    <span
                                        className="
                                            text-xs
                                            tracking-[1px]
                                            text-[#B7791F]
                                        "
                                    >
                                        ★★★★★
                                    </span>

                                    <span
                                        className="
                                            text-[10px]
                                            text-gray-400
                                        "
                                    >
                                        (124)
                                    </span>
                                    
                                    
                                                  <button
                                                    onClick={() =>
                                                      navigate(`/product/${product._id}`)
                                                    }
                                                    className="
                                                      flex
                                                      items-center
                                                      gap-1
                                                      border-b
                                                      border-[#2B2926]
                                                      pb-0.5
                                                      text-xs
                                                      sm:text-sm
                                                      font-medium
                                                      text-[#2B2926]
                                                      transition
                                                      duration-300
                                                      hover:opacity-60
                                                    "
                                                  >
                                                    View
                                                    <FiArrowUpRight size={14} />
                                    
                                                  </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>


                {/* Mobile View All */}

                <div className="flex justify-center mt-8 sm:hidden">

                    <button
                        onClick={() => navigate('/shop')}
                        className="
                            flex
                            items-center
                            gap-1
                            border-b
                            border-[#2B2926]
                            pb-1
                            text-sm
                            font-medium
                        "
                    >
                        View All Products
                        <FiArrowUpRight size={14} />
                    </button>

                </div>

            </div>

        </section>
    )
}

export default FeaturedProducts