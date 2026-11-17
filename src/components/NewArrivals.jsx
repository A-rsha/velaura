import React, { useEffect, useState } from 'react'
import {
    FiArrowUpRight,
    FiHeart,
    FiAlertTriangle
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import API from '../services/axios'

import {
    addWishlist,
    getWishlist,
    removeWishlist
} from '../services/api'

function NewArrivals() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [wishlistStatus, setWishlistStatus] = useState({})

    const navigate = useNavigate()

    // FETCH NEW ARRIVALS

    useEffect(() => {

        const fetchNewArrivals = async () => {

            try {

                setLoading(true)
                setError(false)

                const res = await API.get('/product/newArrivals')

                setProducts(res.data.data || [])

            } catch (error) {

                console.log(
                    'NewArrivals error:',
                    error.response?.data || error
                )

                setError(true)

            } finally {

                setLoading(false)

            }

        }

        fetchNewArrivals()

    }, [])

    // FETCH WISHLIST

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

    // WISHLIST FUNCTION

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
                new-arrivals-section
                bg-white
                px-5
                py-12
                sm:px-8
                sm:py-14
                md:px-10
                md:py-16
                lg:px-16
            "
        >

            <div className="mx-auto max-w-6xl">

                {/* Section Heading */}

                <div className="new-arrivals-heading mb-7 flex items-end justify-between sm:mb-8">

                    <div>

                        <h2
                            className="
                                new-arrivals-title
                                font-serif
                                text-2xl
                                font-medium
                                text-[#2B2926]
                                sm:text-3xl
                                md:text-4xl
                            "
                        >
                            NEW ARRIVALS
                        </h2>

                    </div>

                    {/* View All */}

                    <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="
                            new-arrivals-view-all
                            hidden
                            items-center
                            gap-1
                            border-b
                            border-[#2B2926]
                            pb-1
                            text-xs
                            text-[#2B2926]
                            transition
                            duration-300
                            hover:opacity-60
                            sm:flex
                            sm:text-sm
                        "
                    >

                        View All Products

                        <FiArrowUpRight
                            className="new-arrivals-arrow"
                            size={14}
                        />

                    </button>

                </div>

                {/* Loading State */}

                {loading && (

                    <div className="new-arrivals-state py-12 text-center text-sm text-gray-500">

                        <div className="new-arrivals-loader mx-auto mb-4"></div>

                        Loading NEW ARRIVALS...

                    </div>

                )}

                {/* Error State */}

                {!loading && error && (

                    <div className="new-arrivals-state py-12 text-center">

                        <p className="text-sm text-red-600">
                            Unable to load New Arrivals.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="
                                new-arrivals-retry
                                mt-4
                                border
                                border-[#2B2926]
                                px-5
                                py-2
                                text-sm
                                transition
                                hover:bg-[#2B2926]
                                hover:text-white
                            "
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {/* Empty State */}

                {!loading && !error && products.length === 0 && (

                    <div className="new-arrivals-state py-12 text-center">

                        <p className="text-base text-[#2B2926]">
                            No New Arrivals available right now.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Please check back soon for exciting New Arrivals.
                        </p>

                    </div>

                )}

                {/* Product Grid */}

                {!loading && !error && products.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-x-4
                            gap-y-8
                            sm:gap-x-5
                            md:grid-cols-3
                            lg:grid-cols-4
                            lg:gap-x-6
                        "
                    >

                        {products.map((product, index) => (

                            <div
                                key={product._id}
                                className="new-arrival-card group min-w-0 cursor-pointer"
                                style={{
                                    animationDelay: `${index * 150}ms`
                                }}
                            >

                                {/* Product Image */}

                                <div
                                    className="
                                        new-arrival-image-wrapper
                                        relative
                                        aspect-[4/5]
                                        overflow-hidden
                                        border
                                        border-[#DED5C8]
                                        bg-[#F5F0E8]
                                    "
                                >

                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        loading="lazy"
                                        className="
                                            new-arrival-image
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                    {/* Offer Badge */}

                                    {product.isOffer && (

                                        <span
                                            className="
                                                new-arrival-badge
                                                absolute
                                                left-2
                                                top-2
                                                rounded-full
                                                bg-[#2B2926]
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-medium
                                                text-white
                                                sm:left-3
                                                sm:top-3
                                                sm:px-3
                                                sm:text-xs
                                            "
                                        >
                                            {product.offerPercentage}% OFF
                                        </span>

                                    )}

                                    {/* Wishlist */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleWishlist(product._id)
                                        }
                                        aria-label="Toggle wishlist"
                                        className="
                                            new-arrival-wishlist
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
                                                    ? "new-arrival-heart active-new-heart fill-red-500 text-red-500"
                                                    : "new-arrival-heart text-[#2B2926]"
                                            }
                                        />

                                    </button>

                                </div>

                                {/* Product Details */}

                                <div
                                    className="
                                        new-arrival-details
                                        border-x
                                        border-b
                                        border-[#DED5C8]
                                        px-3
                                        py-3
                                        sm:px-4
                                        sm:py-4
                                    "
                                >

                                    {/* Product Name */}

                                    <h3
                                        className="
                                            new-arrival-name
                                            line-clamp-1
                                            text-xs
                                            font-medium
                                            text-[#2B2926]
                                            sm:text-sm
                                        "
                                    >
                                        {product.title}
                                    </h3>

                                    {/* Product Price */}

                                    <div className="mt-1 new-arrival-price">

                                        {product.isOffer ? (

                                            <>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-gray-500
                                                        line-through
                                                        sm:text-sm
                                                    "
                                                >
                                                    ₹{product.price}
                                                </p>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-[#2B2926]
                                                        sm:text-base
                                                    "
                                                >
                                                    ₹{product.offerPrice}
                                                </p>

                                            </>

                                        ) : (

                                            <p
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-[#2B2926]
                                                    sm:text-base
                                                "
                                            >
                                                ₹{product.price}
                                            </p>

                                        )}

                                    </div>

                                    {/* View Product */}

                                    <div
                                        className="
                                            mt-1.5
                                            flex
                                            items-center
                                            justify-between
                                            gap-1
                                        "
                                    >

                                        <span className="new-arrival-rating text-xs tracking-[1px] text-[#B7791F]">
                                            ★★★★★
                                        </span>

                                        <button
                                            type="button"
                                            onClick={(e) => {

                                                e.stopPropagation()

                                                navigate(
                                                    `/product/${product._id}`
                                                )

                                            }}
                                            className="
                                                new-arrival-view
                                                inline-flex
                                                items-center
                                                gap-1
                                                border-b
                                                border-[#2B2926]
                                                pb-0.5
                                                text-xs
                                                font-medium
                                                text-[#2B2926]
                                                transition
                                                duration-300
                                                hover:opacity-60
                                                sm:text-sm
                                            "
                                        >

                                            View

                                            <FiArrowUpRight
                                                className="new-arrivals-arrow"
                                                size={14}
                                            />

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

                {/* Mobile View All */}

                {!loading && !error && products.length > 0 && (

                    <div className="mt-8 flex justify-center sm:hidden">

                        <button
                            type="button"
                            onClick={() => navigate('/shop')}
                            className="
                                new-arrivals-view-all
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
                                className="new-arrivals-arrow"
                                size={14}
                            />

                        </button>

                    </div>

                )}

            </div>

            {/* ANIMATION STYLES */}

            <style>{`

            

                .new-arrivals-section {
                    animation: arrivalsSectionReveal 0.8s ease both;
                }

                @keyframes arrivalsSectionReveal {
                    from {
                        opacity: 0;
                    }

                    to {
                        opacity: 1;
                    }
                }

                /* Heading Animation */

                .new-arrivals-heading {
                    animation: arrivalsHeadingReveal 0.8s ease both;
                }

                @keyframes arrivalsHeadingReveal {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .new-arrivals-title {
                    transition:
                        letter-spacing 0.4s ease,
                        color 0.4s ease;
                }

                .new-arrivals-heading:hover .new-arrivals-title {
                    letter-spacing: 0.5px;
                }

                /* Product Card Entrance */

                .new-arrival-card {
                    opacity: 0;
                    animation: arrivalCardReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    transition:
                        transform 0.45s ease,
                        box-shadow 0.45s ease;
                }

                @keyframes arrivalCardReveal {
                    from {
                        opacity: 0;
                        transform: translateY(35px) scale(0.96);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Card Hover */

                .new-arrival-card:hover {
                    transform: translateY(-9px);
                    box-shadow: 0 15px 30px rgba(43, 41, 38, 0.10);
                }

                /* Image Hover */

                .new-arrival-image-wrapper {
                    transition:
                        border-color 0.4s ease,
                        box-shadow 0.4s ease;
                }

                .new-arrival-card:hover .new-arrival-image-wrapper {
                    border-color: #B9AA98;
                    box-shadow: 0 8px 20px rgba(43, 41, 38, 0.10);
                }

                .new-arrival-image {
                    transition:
                        transform 0.8s cubic-bezier(0.2, 0.7, 0.2, 1),
                        filter 0.6s ease;
                }

                .new-arrival-card:hover .new-arrival-image {
                    transform: scale(1.09);
                    filter: brightness(1.04);
                }

                /* Offer Badge */

                .new-arrival-badge {
                    animation: arrivalBadgeReveal 0.6s ease both;
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                @keyframes arrivalBadgeReveal {
                    from {
                        opacity: 0;
                        transform: translateX(-12px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .new-arrival-card:hover .new-arrival-badge {
                    transform: scale(1.07);
                    box-shadow: 0 4px 12px rgba(43, 41, 38, 0.2);
                }

                /* Wishlist */

                .new-arrival-wishlist {
                    transition:
                        transform 0.35s ease,
                        background-color 0.35s ease,
                        box-shadow 0.35s ease;
                }

                .new-arrival-wishlist:hover {
                    transform: scale(1.15) rotate(5deg);
                    background-color: white;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
                }

                .new-arrival-wishlist:active {
                    transform: scale(0.85);
                }

                .new-arrival-heart {
                    transition:
                        transform 0.3s ease,
                        color 0.3s ease;
                }

                .new-arrival-wishlist:hover .new-arrival-heart {
                    transform: scale(1.15);
                }

                .active-new-heart {
                    animation: arrivalHeartPop 0.4s ease;
                }

                @keyframes arrivalHeartPop {
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

                /* Product Details */

                .new-arrival-details {
                    transition:
                        background-color 0.4s ease,
                        border-color 0.4s ease;
                }

                .new-arrival-card:hover .new-arrival-details {
                    background-color: #FCFAF7;
                    border-color: #C9BBAA;
                }

                .new-arrival-name {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .new-arrival-card:hover .new-arrival-name {
                    color: #9A7958;
                    transform: translateX(2px);
                }

                .new-arrival-price p {
                    transition: transform 0.3s ease;
                }

                .new-arrival-card:hover .new-arrival-price p {
                    transform: translateX(2px);
                }

                /* Rating */

                .new-arrival-rating {
                    transition: transform 0.3s ease;
                }

                .new-arrival-card:hover .new-arrival-rating {
                    transform: scale(1.08);
                }

                /* View Buttons */

                .new-arrival-view,
                .new-arrivals-view-all {
                    transition:
                        color 0.3s ease,
                        opacity 0.3s ease,
                        gap 0.3s ease;
                }

                .new-arrival-view:hover,
                .new-arrivals-view-all:hover {
                    color: #9A7958;
                    gap: 8px;
                }

                .new-arrivals-arrow {
                    transition: transform 0.35s ease;
                }

                .new-arrival-view:hover .new-arrivals-arrow,
                .new-arrivals-view-all:hover .new-arrivals-arrow {
                    transform: translate(3px, -3px);
                }

                /* Loading and Empty States */

                .new-arrivals-state {
                    animation: arrivalsStateReveal 0.5s ease both;
                }

                @keyframes arrivalsStateReveal {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .new-arrivals-loader {
                    width: 28px;
                    height: 28px;
                    border: 2px solid #DED5C8;
                    border-top-color: #2B2926;
                    border-radius: 50%;
                    animation: arrivalsSpin 0.8s linear infinite;
                }

                @keyframes arrivalsSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* Retry Button */

                .new-arrivals-retry {
                    transition:
                        background-color 0.3s ease,
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .new-arrivals-retry:hover {
                    transform: translateY(-3px);
                }

                .new-arrivals-retry:active {
                    transform: scale(0.96);
                }

                /* Accessibility */

                @media (prefers-reduced-motion: reduce) {

                    .new-arrivals-section,
                    .new-arrivals-heading,
                    .new-arrival-card,
                    .new-arrivals-state,
                    .new-arrivals-loader,
                    .new-arrival-badge,
                    .active-new-heart {
                        animation: none !important;
                    }

                    .new-arrival-card {
                        opacity: 1;
                    }

                    .new-arrival-card,
                    .new-arrival-image,
                    .new-arrival-details,
                    .new-arrival-wishlist,
                    .new-arrival-heart,
                    .new-arrivals-arrow {
                        transition: none !important;
                    }

                }

            `}</style>

        </section>

    )

}

export default NewArrivals