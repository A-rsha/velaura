import React, { useEffect, useState } from 'react'

import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import { getWishlist, removeWishlist } from '../services/api'

import { FiHeart, FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Wishlist() {

    const [products, setProducts] = useState([])
    const [wishlistStatus, setWishlistStatus] = useState({})
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
            wishlistStatus[productId] || false

        setWishlistStatus((prev) => ({
            ...prev,
            [productId]: false
        }))

        setProducts((prev) =>
            prev.filter(
                (product) => product._id !== productId
            )
        )

        try {

            if (isWishlisted) {
                await removeWishlist(productId)
            }

        } catch (error) {

            console.error(
                "Wishlist Error:",
                error.response?.data || error.message
            )

            setWishlistStatus((prev) => ({
                ...prev,
                [productId]: true
            }))

            try {

                const res = await getWishlist()

                setProducts(
                    res.data?.wishlist || []
                )

            } catch (fetchError) {

                console.error(
                    "Wishlist Restore Error:",
                    fetchError.response?.data ||
                    fetchError.message
                )

            }

        }

    }


    return (

        <div className="wishlist-page bg-white text-[#2B2926]">

            <Navbar />

            <main className="min-h-screen pt-24 pb-16 sm:pt-28">

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

                    <ScrollReveal direction="up" duration={800}>

                        <div className="wishlist-heading mb-10 sm:mb-12">

                            <p
                                className="
                                    wishlist-subtitle
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
                                    wishlist-title
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
                                    wishlist-description
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

                    </ScrollReveal>


                    {/* Loading */}

                    {loading && (

                        <div className="wishlist-loading flex justify-center py-20">

                            <div className="flex flex-col items-center gap-4">

                                <div className="wishlist-loader"></div>

                                <p className="text-sm text-gray-500">
                                    Loading wishlist...
                                </p>

                            </div>

                        </div>

                    )}


                    {/* Empty Wishlist */}

                    {!loading && products.length === 0 && (

                        <ScrollReveal direction="up" duration={850}>

                            <div className="wishlist-empty border border-[#DED5C8] bg-[#F5F0E8] px-6 py-20 text-center">

                                <div className="empty-heart-wrapper">

                                    <FiHeart
                                        size={28}
                                        strokeWidth={1}
                                        className="mx-auto text-gray-500"
                                    />

                                </div>

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
                                        wishlist-explore-btn
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

                        </ScrollReveal>

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

                            {products.map((product, index) => (

                                <ScrollReveal
                                    key={product._id}
                                    direction="up"
                                    delay={index * 120}
                                    duration={750}
                                >

                                    <div className="wishlist-product group">

                                        {/* Product Image */}

                                        <div
                                            className="
                                                wishlist-image-wrapper
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
                                                        wishlist-product-image
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


                                            {/* Offer Badge */}

                                            {product.isOffer && (

                                                <span
                                                    className="
                                                        wishlist-offer
                                                        absolute
                                                        left-3
                                                        top-3
                                                        rounded-full
                                                        bg-[#2B2926]
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-medium
                                                        text-white
                                                    "
                                                >
                                                    {product.offerPercentage}% OFF
                                                </span>

                                            )}


                                            {/* Wishlist Button */}

                                            <button
                                                onClick={() =>
                                                    handleWishlist(product._id)
                                                }
                                                aria-label="Remove from wishlist"
                                                className="
                                                    wishlist-heart-btn
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
                                                            : "text-[#2B2926]"
                                                    }
                                                />

                                            </button>

                                        </div>


                                        {/* Product Details */}

                                        <div
                                            className="
                                                wishlist-details
                                                border-x
                                                border-b
                                                border-[#DED5C8]
                                                p-4
                                                sm:p-5
                                            "
                                        >

                                            <h2
                                                className="
                                                    wishlist-product-title
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

                                                <div className="wishlist-price">

                                                    {product.isOffer ? (

                                                        <>

                                                            <p className="text-sm text-gray-600 line-through">
                                                                ₹{product.price}
                                                            </p>

                                                            <p className="text-sm sm:text-base font-semibold text-[#2B2926]">
                                                                ₹{product.offerPrice}
                                                            </p>

                                                        </>

                                                    ) : (

                                                        <p className="text-sm sm:text-base font-medium text-[#2B2926]">
                                                            ₹{product.price}
                                                        </p>

                                                    )}

                                                </div>


                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/product/${product._id}`
                                                        )
                                                    }
                                                    className="
                                                        wishlist-view-btn
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

                                                    <FiArrowUpRight
                                                        className="wishlist-view-arrow"
                                                        size={14}
                                                    />

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </ScrollReveal>

                            ))}

                        </div>

                    )}

                </div>

            </main>


            <Footer />


            {/* Wishlist Animations */}

            <style>{`

                /* Heading */

                .wishlist-heading {
                    position: relative;
                }

                .wishlist-subtitle {
                    letter-spacing: 3px;
                }

                .wishlist-title {
                    transition: letter-spacing 0.4s ease;
                }

                .wishlist-heading:hover .wishlist-title {
                    letter-spacing: 0.5px;
                }


                /* Product Cards */

                .wishlist-product {
                    position: relative;
                    transition:
                        transform 0.4s ease,
                        box-shadow 0.4s ease;
                }

                .wishlist-product:hover {
                    transform: translateY(-7px);
                }


                /* Product Image */

                .wishlist-image-wrapper {
                    transition:
                        box-shadow 0.4s ease,
                        border-color 0.4s ease;
                }

                .wishlist-product:hover .wishlist-image-wrapper {
                    border-color: #b8a995;
                    box-shadow: 0 12px 30px rgba(43, 41, 38, 0.13);
                }

                .wishlist-product-image {
                    transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.3, 1);
                }

                .wishlist-product:hover .wishlist-product-image {
                    transform: scale(1.09);
                }


                /* Offer Badge */

                .wishlist-offer {
                    animation: offerBadgeEnter 0.6s ease both;
                    transition:
                        transform 0.3s ease,
                        background 0.3s ease;
                }

                .wishlist-product:hover .wishlist-offer {
                    transform: translateY(-3px);
                    background: #51483d;
                }

                @keyframes offerBadgeEnter {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }


                /* Heart Button */

                .wishlist-heart-btn {
                    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .wishlist-heart-btn:hover {
                    transform: scale(1.13);
                    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.16);
                }

                .wishlist-heart-btn:active {
                    transform: scale(0.88);
                }

                .wishlist-heart-btn svg {
                    transition:
                        transform 0.35s ease,
                        color 0.3s ease;
                }

                .wishlist-heart-btn:hover svg {
                    transform: rotate(-12deg) scale(1.15);
                }


                /* Product Details */

                .wishlist-details {
                    transition:
                        background 0.35s ease,
                        border-color 0.35s ease;
                }

                .wishlist-product:hover .wishlist-details {
                    background: #fcfaf7;
                    border-color: #c8bba9;
                }

                .wishlist-product-title {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .wishlist-product:hover .wishlist-product-title {
                    color: #8a7054;
                    transform: translateX(2px);
                }


                /* Price */

                .wishlist-price {
                    transition: transform 0.3s ease;
                }

                .wishlist-product:hover .wishlist-price {
                    transform: translateY(-2px);
                }


                /* View Button */

                .wishlist-view-btn {
                    transition:
                        gap 0.3s ease,
                        opacity 0.3s ease,
                        color 0.3s ease;
                }

                .wishlist-view-btn:hover {
                    gap: 7px;
                    color: #927858;
                }

                .wishlist-view-arrow {
                    transition: transform 0.3s ease;
                }

                .wishlist-view-btn:hover .wishlist-view-arrow {
                    transform: translate(3px, -3px);
                }


                /* Empty Wishlist */

                .wishlist-empty {
                    transition:
                        border-color 0.4s ease,
                        box-shadow 0.4s ease;
                }

                .wishlist-empty:hover {
                    border-color: #c8bba9;
                    box-shadow: 0 12px 30px rgba(43, 41, 38, 0.06);
                }

                .empty-heart-wrapper {
                    animation: emptyHeartFloat 2.5s ease-in-out infinite;
                }

                @keyframes emptyHeartFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }

                    50% {
                        transform: translateY(-7px);
                    }
                }


                /* Explore Button */

                .wishlist-explore-btn {
                    transition:
                        background 0.3s ease,
                        color 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .wishlist-explore-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 7px 18px rgba(43, 41, 38, 0.15);
                }

                .wishlist-explore-btn:active {
                    transform: scale(0.96);
                }


                /* Loading */

                .wishlist-loader {
                    width: 32px;
                    height: 32px;
                    border: 2px solid #DED5C8;
                    border-top-color: #2B2926;
                    border-radius: 50%;
                    animation: wishlistSpin 0.8s linear infinite;
                }

                @keyframes wishlistSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                .wishlist-loading {
                    animation: wishlistLoadingEnter 0.5s ease both;
                }

                @keyframes wishlistLoadingEnter {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }


                /* Accessibility */

                @media (prefers-reduced-motion: reduce) {

                    .empty-heart-wrapper,
                    .wishlist-offer,
                    .wishlist-loading,
                    .wishlist-loader {
                        animation: none !important;
                    }

                    .wishlist-product,
                    .wishlist-product-image,
                    .wishlist-details,
                    .wishlist-heart-btn,
                    .wishlist-view-btn,
                    .wishlist-empty {
                        transition: none !important;
                    }

                }

            `}</style>

        </div>

    )

}

export default Wishlist