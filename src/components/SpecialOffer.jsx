import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHeart, FiArrowUpRight, FiAlertTriangle  } from 'react-icons/fi'
import API from '../services/axios'
import {
    addWishlist,
    getWishlist,
    removeWishlist
} from '../services/api'
import { toast } from 'react-toastify'

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
                toast.warn("please login to add products to your wishlist",{
                    icon: <FiAlertTriangle size={21} color='#9A7958'/>
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
                <div className="mb-7 flex items-end justify-between sm:mb-8">
                    <div>
                        <p
                            className="
                                mb-2
                                text-[10px]
                                uppercase
                                tracking-[3px]
                                text-gray-500
                                sm:text-xs
                            "
                        >
                            SPECIAL SELECTION
                        </p>

                        <h2
                            className="
                                font-serif
                                text-2xl
                                font-medium
                                text-[#2B2926]
                                sm:text-3xl
                                md:text-4xl
                            "
                        >
                            Special Offers
                        </h2>
                    </div>

                    {/* View All */}
                    <button
                        type="button"
                        onClick={() => navigate('/shop')}
                        className="
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
                        <FiArrowUpRight size={14} />
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-12 text-center text-sm text-gray-500">
                        Loading special offers...
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="py-12 text-center">
                        <p className="text-sm text-red-600">
                            Unable to load special offers.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="
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
                    <div className="py-12 text-center">
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
                        {products.map((product) => (
                            <div
                                key={product._id}
                               
                                className="group min-w-0 cursor-pointer"
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
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        loading="lazy"
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                            transition
                                            duration-500
                                            group-hover:scale-105
                                        "
                                    />

                                    {/* Offer Badge */}
                                    {product.isOffer && (
                                        <span
                                            className="
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
                                    <div className="mt-1">
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
                                        <span className="text-xs tracking-[1px] text-[#B7791F]">
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
                                            <FiArrowUpRight size={14} />
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
                )}
            </div>
        </section>
    )
}

export default SpecialOffer