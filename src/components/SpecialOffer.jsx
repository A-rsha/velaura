import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHeart, FiArrowUpRight, FiAlertTriangle } from 'react-icons/fi'
import API from '../services/axios'
import {
    addWishlist,
    getWishlist,
    removeWishlist
} from '../services/api'
import { toast } from 'react-toastify'
import ScrollReveal from './ScrollReveal'

function SpecialOffer() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [wishlistStatus, setWishlistStatus] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const fetchOfferProducts = async () => {
            try {
                setLoading(true)
                setError(false)

                const res = await API.get('/product/getOfferProduct')

                setProducts(res.data.data || [])
            } catch (error) {
                console.log(
                    'OFFERED PRODUCTS ERROR:',
                    error.response?.data || error
                )

                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchOfferProducts()
    }, [])

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await getWishlist()

                const wishlistProducts = res.data?.wishlist || []
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

        const isWishlisted = wishlistStatus[productId] || false

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
        <section className="special-offer-section bg-white px-5 py-12 sm:px-8 sm:py-14 md:px-10 md:py-16 lg:px-16">
            <div className="mx-auto max-w-6xl">

                {/* Section Heading */}
                <div className="special-heading mb-7 flex items-end justify-between sm:mb-8">
                    <div>
                        <ScrollReveal direction='left' elay={0} once={false}>
                            <p className="mb-2 text-[10px] uppercase tracking-[3px] text-gray-500 sm:text-xs">
                                SPECIAL SELECTION
                            </p>

                            <h2 className="font-serif text-2xl font-medium text-[#2B2926] sm:text-3xl md:text-4xl">
                                Special Offers
                            </h2>
                        </ScrollReveal>
                    </div>

                    {/* View All */}
                    <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="view-all-btn hidden items-center gap-1 border-b border-[#2B2926] pb-1 text-xs text-[#2B2926] transition duration-300 sm:flex sm:text-sm"
                    >
                        View All Products
                        <FiArrowUpRight size={14} />
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-sm text-gray-500">
                        <div className="offer-loader mb-4 h-8 w-8 rounded-full border-[3px] border-[#E8DFD3] border-t-[#9A7958]" />
                        Loading special offers...
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="offer-message py-12 text-center">
                        <p className="text-sm text-red-600">
                            Unable to load special offers.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-4 border border-[#2B2926] px-5 py-2 text-sm transition duration-300 hover:-translate-y-1 hover:bg-[#2B2926] hover:text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && products.length === 0 && (
                    <div className="offer-message py-12 text-center">
                        <p className="text-base text-[#2B2926]">
                            No special offers available right now.
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                            Please check back soon for exciting offers.
                        </p>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && !error && products.length > 0 && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">

                        {products.map((product, index) => (

                            <ScrollReveal
                                key={product._id}
                                direction="up"
                                delay={index * 120}
                                duration={750}
                                once={false}
                            >

                                <div
                                    key={product._id}
                                    style={{
                                        '--card-delay': `${index * 120}ms`
                                    }}
                                    className="offer-product-card group min-w-0 cursor-pointer"
                                >
                                    {/* Product Image */}
                                    <div className="offer-image-container relative aspect-[4/5] overflow-hidden border border-[#DED5C8] bg-[#F5F0E8]">

                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            loading="lazy"
                                            className="offer-product-image h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                        />

                                        {/* Image Shine */}
                                        <div className="offer-image-shine pointer-events-none absolute inset-0" />

                                        {/* Offer Badge */}
                                        {product.isOffer && (
                                            <span className="offer-badge absolute left-2 top-2 rounded-full bg-[#2B2926] px-2 py-1 text-[10px] font-medium text-white sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                                                {product.offerPercentage}% OFF
                                            </span>
                                        )}

                                        {/* Wishlist */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleWishlist(product._id)
                                            }}
                                            aria-label="Add to wishlist"
                                            className="wishlist-btn absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition duration-300 hover:bg-white"
                                        >
                                            <FiHeart
                                                size={16}
                                                strokeWidth={1.5}
                                                className={
                                                    wishlistStatus[product._id]
                                                        ? "wishlist-active fill-red-500 text-red-500"
                                                        : "wishlist-heart text-[#2B2926]"
                                                }
                                            />
                                        </button>
                                    </div>

                                    {/* Product Details */}
                                    <div className="offer-product-details border-x border-b border-[#DED5C8] px-3 py-3 sm:px-4 sm:py-4">

                                        {/* Product Name */}
                                        <h3 className="offer-product-title line-clamp-1 text-xs font-medium text-[#2B2926] transition-colors duration-300 sm:text-sm">
                                            {product.title}
                                        </h3>

                                        {/* Product Price */}
                                        <div className="mt-1">
                                            {product.isOffer ? (
                                                <>
                                                    <p className="text-xs text-gray-500 line-through sm:text-sm">
                                                        ₹{product.price}
                                                    </p>

                                                    <p className="offer-price text-sm font-semibold text-[#2B2926] sm:text-base">
                                                        ₹{product.offerPrice}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="offer-price text-sm font-medium text-[#2B2926] sm:text-base">
                                                    ₹{product.price}
                                                </p>
                                            )}
                                        </div>

                                        {/* View Product */}
                                        <div className="mt-1.5 flex items-center justify-between gap-1">

                                            <span className="text-xs tracking-[1px] text-[#B7791F]">
                                                ★★★★★
                                            </span>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigate(`/product/${product._id}`)
                                                }}
                                                className="offer-view-btn inline-flex items-center gap-1 border-b border-[#2B2926] pb-0.5 text-xs font-medium text-[#2B2926] transition duration-300 sm:text-sm"
                                            >
                                                View
                                                <FiArrowUpRight
                                                    className="offer-arrow"
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

                        {/* Mobile View All */}
                        {!loading && !error && products.length > 0 && (
                            <div className="mt-8 flex justify-center sm:hidden">
                                <button
                                    type="button"
                                    onClick={() => navigate('/shop')}
                                    className="view-all-btn flex items-center gap-1 border-b border-[#2B2926] pb-1 text-sm font-medium"
                                >
                                    View All Products
                                    <FiArrowUpRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

            {/* Animations */}
                <style>{`
                .special-heading {
                    animation: offerHeading 0.8s ease both;
                }

                .offer-product-card {
                    opacity: 0;
                    animation: offerCardEntrance 0.7s ease forwards;
                    animation-delay: var(--card-delay);
                    transition:
                        transform 0.4s ease,
                        box-shadow 0.4s ease;
                }

                .offer-product-card:hover {
                    transform: translateY(-7px);
                    box-shadow: 0 14px 30px rgba(43, 41, 38, 0.10);
                }

                .offer-image-container {
                    isolation: isolate;
                }

                .offer-product-image {
                    will-change: transform;
                }

                .offer-image-shine {
                    z-index: 1;
                    background: linear-gradient(
                        110deg,
                        transparent 30%,
                        rgba(255,255,255,0.22) 50%,
                        transparent 70%
                    );
                    transform: translateX(-120%);
                    transition: transform 0.8s ease;
                }

                .offer-product-card:hover .offer-image-shine {
                    transform: translateX(120%);
                }

                .offer-badge {
                    z-index: 2;
                    animation: badgeEntrance 0.6s ease both;
                    transition: transform 0.3s ease;
                }

                .offer-product-card:hover .offer-badge {
                    transform: scale(1.08);
                }

                .wishlist-btn {
                    z-index: 3;
                    opacity: 0;
                    transform: translateY(-8px) scale(0.8);
                    transition:
                        opacity 0.3s ease,
                        transform 0.3s ease,
                        background-color 0.3s ease;
                }

                .offer-product-card:hover .wishlist-btn {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .wishlist-heart {
                    transition: transform 0.3s ease;
                }

                .wishlist-btn:hover .wishlist-heart {
                    transform: scale(1.2);
                }

                .wishlist-active {
                    animation: heartPop 0.4s ease;
                }

                .offer-product-details {
                    transition: background-color 0.35s ease;
                }

                .offer-product-card:hover .offer-product-details {
                    background-color: #FAF8F4;
                }

                .offer-product-title {
                    transition: color 0.3s ease;
                }

                .offer-product-card:hover .offer-product-title {
                    color: #9A7958;
                }

                .offer-price {
                    transition: transform 0.3s ease;
                }

                .offer-product-card:hover .offer-price {
                    transform: translateX(3px);
                }

                .offer-view-btn {
                    transition:
                        gap 0.3s ease,
                        color 0.3s ease,
                        border-color 0.3s ease;
                }

                .offer-view-btn:hover {
                    gap: 7px;
                    color: #9A7958;
                    border-color: #9A7958;
                }

                .offer-arrow {
                    transition: transform 0.3s ease;
                }

                .offer-view-btn:hover .offer-arrow {
                    transform: translate(3px, -3px);
                }

                .view-all-btn:hover {
                    gap: 8px;
                    color: #9A7958;
                    border-color: #9A7958;
                }

                .offer-loader {
                    animation: offerSpin 0.8s linear infinite;
                }

                .offer-message {
                    animation: offerHeading 0.6s ease both;
                }

                @keyframes offerHeading {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes offerCardEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(35px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes badgeEntrance {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes heartPop {
                    0% {
                        transform: scale(0.7);
                    }
                    50% {
                        transform: scale(1.3);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes offerSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 639px) {
                    .wishlist-btn {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .special-heading,
                    .offer-product-card,
                    .offer-badge,
                    .offer-message {
                        opacity: 1;
                        animation: none;
                    }

                    .offer-product-card,
                    .offer-product-image,
                    .offer-image-shine,
                    .wishlist-btn,
                    .wishlist-heart,
                    .offer-product-details,
                    .offer-product-title,
                    .offer-price,
                    .offer-view-btn,
                    .offer-arrow {
                        transition: none;
                    }

                    .offer-loader {
                        animation: none;
                    }
                }
            `}</style>
        </section>
    )
}

export default SpecialOffer