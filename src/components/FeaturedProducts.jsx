import React, { useEffect, useState } from 'react'
import { FiHeart, FiArrowUpRight, FiAlertTriangle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'

import API from '../services/axios'
import {
    addWishlist,
    getWishlist,
    removeWishlist
} from '../services/api'
import { toast } from 'react-toastify'

function FeaturedProducts() {

    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [wishlistStatus, setWishlistStatus] = useState({})

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                const res = await API.get('/product/getProducts')

                console.log("FEATURED PRODUCTS:", res.data)

                const productData = res.data.data || []

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

    useEffect(() => {

        const fetchWishlist = async () => {
            try {
                const res = await getWishlist()

                const wishlistProducts =
                    res.data?.wishlist || []

                const status = {}

                wishlistProducts.forEach((item) => {

                    const productId =
                        item.productId?._id ||
                        item.productId ||
                        item._id

                    if (productId) {
                        status[productId] = true
                    }

                })

                setWishlistStatus(status)

            } catch (error) {
                console.log(
                    "WISHLIST ERROR:",
                    error.response?.data || error
                )
            }
        }

        fetchWishlist()

    }, [])

    const handleWishlist = async (productId) => {

        const token = localStorage.getItem("token")

        if (!token) {
            toast.warn("please login to add products to your wishlist", {
                icon: <FiAlertTriangle size={21} color='#9A7958' />
            })
            return
        }

        const isWishlisted =
            wishlistStatus[productId] || false

        setWishlistStatus((prev) => ({
            ...prev,
            [productId]: !isWishlisted
        }))

        try {

            if (isWishlisted) {
                await removeWishlist(productId)
            } else {
                await addWishlist(productId)
            }

        } catch (error) {

            console.log(
                "WISHLIST ERROR:",
                error.response?.data || error
            )

            setWishlistStatus((prev) => ({
                ...prev,
                [productId]: isWishlisted
            }))

        }
    }

    return (

        <section
            className="
                featured-section
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
                        featured-heading
                        flex
                        items-end
                        justify-between
                        mb-7
                        sm:mb-8
                    "
                >

                    <div>
                        <ScrollReveal direction='left' delay={0} once={false}>

                            <p
                                className="
                                featured-label
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
                                featured-title
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
                        </ScrollReveal>

                    </div>

                    {/* View All */}

                    <button
                        onClick={() => navigate('/shop')}
                        className="
                            featured-view-all
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
                            transition-all
                            duration-300
                            hover:opacity-60
                        "
                    >
                        View All Products

                        <FiArrowUpRight
                            className="view-arrow"
                            size={14}
                        />

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

                    {products.map((product, index) => (

                        <ScrollReveal
                            key={product._id}
                            direction="up"
                            delay={index * 120}
                            duration={750}
                            once={false}
                        >

                            {/* Image */}

                            <div
                                className="
                                    featured-image-wrapper
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
                                        featured-product-image
                                        h-full
                                        w-full
                                        object-cover
                                    "
                                />

                                {/* Offer Badge */}

                                {product.isOffer && (

                                    <span
                                        className="
                                            offer-badge
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

                                {/* Wishlist */}

                                <button
                                    onClick={() =>
                                        handleWishlist(product._id)
                                    }
                                    aria-label="Toggle wishlist"
                                    className="
                                        wishlist-button
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
                                    "
                                >

                                    <FiHeart
                                        size={16}
                                        strokeWidth={1.5}
                                        className={
                                            wishlistStatus[product._id]
                                                ? "wishlist-heart active-heart fill-red-500 text-red-500"
                                                : "wishlist-heart text-[#2B2926]"
                                        }
                                    />

                                </button>

                            </div>

                            {/* Product Info */}

                            <div
                                className="
                                    featured-product-info
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
                                        featured-product-name
                                        line-clamp-1
                                        text-xs
                                        sm:text-sm
                                        font-medium
                                        text-[#2B2926]
                                    "
                                >
                                    {product.title}
                                </h3>

                                {/* Price */}

                                <div className="product-price">

                                    {product.isOffer ? (

                                        <>
                                            <p className='text-sm text-gray-600 line-through'>
                                                ₹{product.price}
                                            </p>

                                            <p className='text-sm sm:text-base font-semibold text-[#2B2926]'>
                                                ₹{product.offerPrice}
                                            </p>
                                        </>

                                    ) : (

                                        <p className='text-sm sm:text-base font-medium text-[#2B2926]'>
                                            ₹{product.price}
                                        </p>

                                    )}

                                </div>

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
                                            product-rating
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

                                    {/* View Button */}

                                    <button
                                        onClick={() =>
                                            navigate(`/product/${product._id}`)
                                        }
                                        className="
                                            product-view-button
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
                                        "
                                    >

                                        View

                                        <FiArrowUpRight
                                            className="view-arrow"
                                            size={14}
                                        />

                                    </button>

                                </div>

                            </div>

                        </ScrollReveal>

                    ))}

                </div>

                {/* Mobile View All */}

                <div className="flex justify-center mt-8 sm:hidden">

                    <button
                        onClick={() => navigate('/shop')}
                        className="
                            featured-view-all
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

                        <FiArrowUpRight
                            className="view-arrow"
                            size={14}
                        />

                    </button>

                </div>

            </div>

            {/* Animation Styles */}

            <style>{`

                /* Section Animation */

                .featured-section {
                    animation: sectionReveal 0.8s ease both;
                }

                @keyframes sectionReveal {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* Heading Animation */

                .featured-heading {
                    animation: headingReveal 0.8s ease both;
                }

                @keyframes headingReveal {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .featured-label {
                    animation: labelReveal 1s ease both;
                }

                @keyframes labelReveal {
                    from {
                        opacity: 0;
                        letter-spacing: 6px;
                    }
                    to {
                        opacity: 1;
                        letter-spacing: 3px;
                    }
                }

                .featured-title {
                    transition: letter-spacing 0.4s ease;
                }

                .featured-heading:hover .featured-title {
                    letter-spacing: 0.5px;
                }

                /* Product Card Entrance */

               .featured-card {
    transition:
        transform 0.45s ease,
        box-shadow 0.45s ease;
}


                .featured-card:hover {
                    transform: translateY(-9px);
                    box-shadow: 0 15px 30px rgba(43, 41, 38, 0.10);
                }

                /* Product Image */

                .featured-image-wrapper {
                    transition:
                        border-color 0.4s ease,
                        box-shadow 0.4s ease;
                }

                .featured-card:hover .featured-image-wrapper {
                    border-color: #B9AA98;
                    box-shadow: 0 8px 20px rgba(43, 41, 38, 0.10);
                }

                .featured-product-image {
                    transition:
                        transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1),
                        filter 0.6s ease;
                }

                .featured-card:hover .featured-product-image {
                    transform: scale(1.09);
                    filter: brightness(1.04);
                }

                /* Product Info */

                .featured-product-info {
                    transition:
                        background-color 0.4s ease,
                        border-color 0.4s ease;
                }

                .featured-card:hover .featured-product-info {
                    border-color: #C9BBAA;
                    background-color: #FCFAF7;
                }

                .featured-product-name {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .featured-card:hover .featured-product-name {
                    color: #9A7958;
                    transform: translateX(2px);
                }

                .product-price p {
                    transition: transform 0.3s ease;
                }

                .featured-card:hover .product-price p {
                    transform: translateX(2px);
                }

                /* Offer Badge */

                .offer-badge {
                    animation: badgeReveal 0.6s ease both;
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                @keyframes badgeReveal {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .featured-card:hover .offer-badge {
                    transform: scale(1.07);
                    box-shadow: 0 4px 12px rgba(43, 41, 38, 0.2);
                }

                /* Wishlist Button */

                .wishlist-button {
                    transition:
                        transform 0.35s ease,
                        background-color 0.35s ease,
                        box-shadow 0.35s ease;
                }

                .wishlist-button:hover {
                    transform: scale(1.15) rotate(5deg);
                    background-color: white;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
                }

                .wishlist-button:active {
                    transform: scale(0.85);
                }

                .wishlist-heart {
                    transition:
                        transform 0.3s ease,
                        color 0.3s ease;
                }

                .wishlist-button:hover .wishlist-heart {
                    transform: scale(1.15);
                }

                .active-heart {
                    animation: heartPop 0.4s ease;
                }

                @keyframes heartPop {
                    0% {
                        transform: scale(1);
                    }
                    40% {
                        transform: scale(1.5);
                    }
                    70% {
                        transform: scale(0.85);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                /* Rating */

                .product-rating {
                    transition: transform 0.3s ease;
                }

                .featured-card:hover .product-rating {
                    transform: scale(1.08);
                }

                /* View Buttons */

                .featured-view-all,
                .product-view-button {
                    transition:
                        color 0.3s ease,
                        opacity 0.3s ease,
                        gap 0.3s ease;
                }

                .featured-view-all:hover,
                .product-view-button:hover {
                    color: #9A7958;
                    gap: 8px;
                }

                .view-arrow {
                    transition: transform 0.35s ease;
                }

                .featured-view-all:hover .view-arrow,
                .product-view-button:hover .view-arrow {
                    transform: translate(3px, -3px);
                }

                /* Accessibility */

                @media (prefers-reduced-motion: reduce) {
                    .featured-section,
                    .featured-heading,
                    .featured-label,
                    .featured-card,
                    .offer-badge,
                    .active-heart {
                        animation: none !important;
                        opacity: 1 !important;
                    }

                    .featured-card,
                    .featured-product-image,
                    .featured-product-info,
                    .wishlist-button,
                    .wishlist-heart,
                    .view-arrow {
                        transition: none !important;
                    }
                }

            `}</style>

        </section>
    )
}

export default FeaturedProducts