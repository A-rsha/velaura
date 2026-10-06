import React, { useEffect, useState } from 'react'

import Footer from '../components/Footer'
import { getWishlist , removeWishlist } from '../services/api'

import { FiHeart, FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


function Wishlist() {

    const [products, setProducts] = useState([])
    const [wishlistStatus, setWishlistStatus] =useState({})
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()


    useEffect(() => {

        const fetchWishlist = async () => {

            try {

                const res = await getWishlist()

                console.log("WISHLIST RESPONSE:", res.data)
                const wishlistProducts =
                    res.data?.wishlist || []
                setProducts(wishlistProducts)

                const status = {}
                wishlistProducts.forEach((product) => {
                    const productId =
                        product.productId?._id ||
                        product.productId ||
                        product._id

                    if (productId) {
                        status[productId] = true
                    }
                })
                setWishlistStatus(status)
            } catch (error) {

                console.error(
                    "Wishlist Error:",
                    error.response?.data || error.message
                )

            } finally {

                setLoading(false)

            }

        }

        fetchWishlist()

    }, [])


    const handleWishlist = async (productId) => {

        const isWishlisted =
        wishlistStatus[productId]|| false

        setWishlistStatus((prev)=>({
            ...prev,
            [productId]:false
        }))

        setProducts((prev)=>
        prev.filter(
            (product)=> product._id !== productId
        ))

        try {
            if(isWishlisted){
                await removeWishlist(productId)
            }
               
        } catch (error) {

            console.error(
                "Wishlist Error:",
                error.response?.data || error.message
            )

            setWishlistStatus((prev)=>({
                ...prev,
                [productId]:true
            }))

            try {
                const res =await getWishlist()
                setProducts(
                    res.data?.wishlist || []
                )
            } catch (error) {
                console.error(
                    "Wishlist Restore Error:",
                    fetchError.response?.data ||
                    fetchError.message
                )
            }

        }

    }


    return (
        <div className="bg-white text-[#2B2926]">

            <Navbar />


            <main className="min-h-screen pt-24 sm:pt-28 pb-16">

                <div
                    className="
                        mx-auto
                        max-w-7xl
                        px-5
                        sm:px-8
                        md:px-10
                        lg:px-12
                    "
                >

                    {/* Heading */}

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
                            YOUR SAVED PIECES
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
                            My Wishlist
                        </h1>

                        <p
                            className="
                                mt-3
                                max-w-md
                                text-sm
                                sm:text-base
                                leading-relaxed
                                text-gray-500
                            "
                        >
                            Your favorite pieces, saved in one place.
                        </p>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="flex justify-center py-20">

                            <p className="text-sm text-gray-500">
                                Loading wishlist...
                            </p>

                        </div>

                    )}


                    {/* Empty Wishlist */}

                    {!loading && products.length === 0 && (

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

                            <FiHeart
                                size={28}
                                strokeWidth={1}
                                className="mx-auto text-gray-500"
                            />

                            <h2
                                className="
                                    mt-5
                                    font-serif
                                    text-xl
                                    sm:text-2xl
                                "
                            >
                                Your wishlist is empty
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Save your favorite accessories here.
                            </p>

                            <button
                                onClick={() => navigate('/shop')}
                                className="
                                    mt-6
                                    border
                                    border-[#2B2926]
                                    px-6
                                    py-2.5
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

                    )}


                    {/* Wishlist Products */}

                    {!loading && products.length > 0 && (

                        <div
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                                gap-x-4
                                sm:gap-x-5
                                md:gap-x-6
                                gap-y-10
                                sm:gap-y-12
                            "
                        >

                            {products.map((product) => (

                                <div
                                    key={product._id}
                                    className="group"
                                >

                                    {/* Product Image */}

                                    <div
                                        className="
                                            relative
                                            aspect-[4/5]
                                            overflow-hidden
                                            border
                                            border-[#DED5C8]
                                            bg-[#F5F0E8]
                                        "
                                    >

                                        {product.image ? (

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

                                        ) : (

                                            <div
                                                className="
                                                    flex
                                                    h-full
                                                    items-center
                                                    justify-center
                                                    text-sm
                                                    text-gray-400
                                                "
                                            >
                                                No Image
                                            </div>

                                        )}


                                        {/* Wishlist Button */}

                                        <button
                                            onClick={() =>
                                                handleWishlist(product._id)
                                            }
                                            className="
                                                absolute
                                                right-3
                                                top-3
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-white/95
                                                transition
                                                duration-300
                                                hover:scale-105
                                            "
                                        >

                                            <FiHeart
                                                size={18}
                                                strokeWidth={1.5}
                                                className={
                                                    wishlistStatus[product._id]
                                                    ? "fill-red-500 text-red-500"
                                                    :" text-[#2B2926]"
                                                }
                                            />

                                        </button>

                                    </div>


                                    {/* Product Details */}

                                    <div
                                        className="
                                            border-x
                                            border-b
                                            border-[#DED5C8]
                                            p-4
                                            sm:p-5
                                        "
                                    >

                                        <h2
                                            className="
                                                line-clamp-1
                                                text-sm
                                                sm:text-base
                                                font-medium
                                                text-[#2B2926]
                                            "
                                        >
                                            {product.title}
                                        </h2>


                                        <p
                                            className="
                                                mt-1.5
                                                line-clamp-2
                                                text-xs
                                                sm:text-sm
                                                leading-relaxed
                                                text-gray-500
                                            "
                                        >
                                            {product.description}
                                        </p>


                                        {/* Price + View */}

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                justify-between
                                                gap-2
                                            "
                                        >

                                            <p
                                                className="
                                                    text-sm
                                                    sm:text-base
                                                    font-medium
                                                    text-[#2B2926]
                                                "
                                            >
                                                ₹{product.price}
                                            </p>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/product/${product._id}`
                                                    )
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

                    )}

                </div>

            </main>


            <Footer />

        </div>
    )
}


export default Wishlist