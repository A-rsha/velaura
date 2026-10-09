import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import API from '../services/axios'

function ProductDetails({ cartCount, setCartCount, setCartItems }) {
    const { id } = useParams()

    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [activeTab, setActiveTab] = useState('description')
    const [loadingReviews, setLoadingReviews] = useState(true)
    const [submittingReview, setSubmittingReview] = useState(false)
    const [showReviewForm, setShowReviewForm] = useState(false)

   
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/product/getProduct/${id}`)
                setProduct(res.data.data)
            } catch (error) {
                console.log(
                    'Error fetching product:',
                    error.response?.data || error
                )
            }
        }

        fetchProduct()
    }, [id])

 
    const fetchReviews = async () => {
        try {
            setLoadingReviews(true)

            const res = await API.get(`/review/getReview/${id}`)
            setReviews(res.data.data || [])
        } catch (error) {
            console.log(
                'Error fetching reviews:',
                error.response?.data || error
            )
        } finally {
            setLoadingReviews(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [id])

    const totalReviews = reviews.length

    const averageRating = totalReviews > 0
        ? reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0
        ) / totalReviews
        : 0

    const handleAddToCart = async () => {
        try {
            await API.post('/cart/add', {
                productId: product._id
            })

            alert('Product added to cart')

            if (setCartCount) {
                setCartCount(prev => prev + 1)
            }
        } catch (error) {
            console.log(
                'Add to cart error:',
                error.response?.data || error
            )

            alert(
                error.response?.data?.message ||
                'Add To Cart Failed'
            )
        }
    }

  
    const handleSubmitReview = async (e) => {
        e.preventDefault()

        if (rating < 1 || rating > 5) {
            alert('Please select a star rating')
            return
        }

        if (!comment.trim()) {
            alert('Please write your review')
            return
        }

        try {
            setSubmittingReview(true)

            await API.post('/review/addReview', {
                productId: id,
                rating,
                comment: comment.trim()
            })

            alert('Review submitted successfully')

            setRating(0)
            setComment('')
            setShowReviewForm(false)

            await fetchReviews()
        } catch (error) {
            console.log(
                'Submit review error:',
                error.response?.data || error
            )

            if (error.response?.status === 401) {
                alert('Please login to submit a review')
            } else if (error.response?.status === 403) {
                alert(
                    'You can review this product only after purchasing it.'
                )
            } else {
                alert(
                    error.response?.data?.message ||
                    'Unable to submit review'
                )
            }
        } finally {
            setSubmittingReview(false)
        }
    }


    const handleCancelReview = () => {
        setShowReviewForm(false)
        setRating(0)
        setComment('')
    }


    if (!product) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F5F0E8]">
                <p className="text-sm text-gray-500">
                    Loading product...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">

            <Navbar cartCount={cartCount} />

            <main className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-12">
                <div className="mx-auto max-w-6xl">

                   
                    <p className="mb-6 break-words text-xs text-gray-500 sm:text-sm">
                        Home / Shop / {product.title}
                    </p>

                    {/* Product Details */}
                    <section className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">

                        {/* Product Image */}
                        <div className="relative overflow-hidden border border-[#DED5C8] bg-white">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="aspect-[4/5] w-full object-cover transition duration-500 hover:scale-105"
                            />

                            {product.isOffer && (
                                <span className="absolute left-3 top-3 rounded-full bg-[#2B2926] px-3 py-1.5 text-xs text-white">
                                    {product.offerPercentage}% OFF
                                </span>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="flex flex-col justify-center py-2 md:py-6">

                            <p className="text-[10px] uppercase tracking-[3px] text-gray-500 sm:text-xs">
                                {product.category}
                            </p>

                            <h1 className="mt-3 break-words font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                                {product.title}
                            </h1>

                            {/* Price */}
                            <div className="mt-5 flex flex-wrap items-center gap-3">
                                {product.isOffer ? (
                                    <>
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{product.price}
                                        </span>

                                        <span className="text-xl font-semibold">
                                            ₹{product.offerPrice}
                                        </span>

                                        <span className="text-xs text-green-700">
                                            {product.offerPercentage}% off
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xl font-medium">
                                        ₹{product.price}
                                    </span>
                                )}
                            </div>

                            <div className="mt-6 border-t border-[#DED5C8]" />

                            <p className="mt-6 text-sm leading-7 text-gray-600 sm:text-base">
                                {product.description}
                            </p>

                            {/* Category */}
                            <div className="mt-6 border-y border-[#DED5C8] py-4">
                                <p className="text-xs uppercase tracking-[2px] text-gray-500">
                                    Category
                                </p>

                                <p className="mt-2 text-sm">
                                    {product.category}
                                </p>
                            </div>

                            {/* Add to Cart */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="mt-7 w-full bg-[#2B2926] py-3.5 text-sm font-medium text-white transition hover:bg-black"
                            >
                                Add to Cart
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-500">
                                Add this piece to your collection.
                            </p>

                        </div>
                    </section>

                    {/* Description & Reviews */}
                    <section className="mt-16 border-t border-[#DED5C8] sm:mt-20">

                        {/* Tabs */}
                        <div className="flex gap-6 overflow-x-auto border-b border-[#DED5C8] sm:gap-10">

                            <button
                                type="button"
                                onClick={() => setActiveTab('description')}
                                className={`shrink-0 border-b-2 py-4 text-sm transition ${
                                    activeTab === 'description'
                                        ? 'border-[#2B2926] font-medium'
                                        : 'border-transparent text-gray-500 hover:text-[#2B2926]'
                                }`}
                            >
                                Description
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('reviews')}
                                className={`shrink-0 border-b-2 py-4 text-sm transition ${
                                    activeTab === 'reviews'
                                        ? 'border-[#2B2926] font-medium'
                                        : 'border-transparent text-gray-500 hover:text-[#2B2926]'
                                }`}
                            >
                                Reviews & Ratings ({totalReviews})
                            </button>

                        </div>

                        <div className="py-8 sm:py-10">

                            {/* Description Tab */}
                            {activeTab === 'description' && (
                                <div className="max-w-3xl">
                                    <p className="text-xs uppercase tracking-[3px] text-gray-500">
                                        Product Information
                                    </p>

                                    <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                                        About this piece
                                    </h2>

                                    <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
                                        {product.description}
                                    </p>

                                    <div className="mt-6">
                                        <p className="text-xs uppercase tracking-[2px] text-gray-500">
                                            Category
                                        </p>

                                        <p className="mt-2 text-sm">
                                            {product.category}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === 'reviews' && (
                                <div>

                                    {/* Rating Summary */}
                                    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[240px_1fr] lg:gap-10">

                                        <div className="h-fit border border-[#DED5C8] bg-white/50 p-6 sm:p-8">

                                            <p className="text-xs uppercase tracking-[2px] text-gray-500">
                                                Customer Rating
                                            </p>

                                            <div className="mt-4 flex items-baseline gap-2">
                                                <span className="font-serif text-5xl">
                                                    {averageRating.toFixed(1)}
                                                </span>

                                                <span className="text-sm text-gray-400">
                                                    / 5
                                                </span>
                                            </div>

                                            <div
                                                className="mt-3 flex text-xl text-amber-500"
                                                aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
                                            >
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <span key={star}>
                                                        {star <= Math.round(averageRating)
                                                            ? '★'
                                                            : '☆'}
                                                    </span>
                                                ))}
                                            </div>

                                            <p className="mt-3 text-xs text-gray-500">
                                                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                                            </p>

                                        </div>

                                        {/* Write Review Button / Form */}
                                        <div className="border border-[#DED5C8] bg-white/50 p-5 sm:p-7">

                                            {!showReviewForm ? (
                                                <div>
                                                    <p className="text-xs uppercase tracking-[2px] text-gray-500">
                                                        Share Your Experience
                                                    </p>

                                                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                                                        Have something to share?
                                                    </h2>

                                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                                        Tell other customers about your experience with this product.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        onClick={() => setShowReviewForm(true)}
                                                        className="mt-6 w-full bg-[#2B2926] px-6 py-3 text-sm font-medium text-white transition hover:bg-black sm:w-auto"
                                                    >
                                                        Write a Review
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[2px] text-gray-500">
                                                                Share Your Experience
                                                            </p>

                                                            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                                                                Write a Review
                                                            </h2>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={handleCancelReview}
                                                            className="shrink-0 text-sm text-gray-500 underline underline-offset-4 hover:text-[#2B2926]"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>

                                                    <form
                                                        onSubmit={handleSubmitReview}
                                                        className="mt-6"
                                                    >
                                                        {/* Rating */}
                                                        <label className="block text-sm font-medium">
                                                            Your Rating
                                                        </label>

                                                        <div className="mt-3 flex gap-2">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setRating(star)}
                                                                    aria-label={`Rate ${star} out of 5 stars`}
                                                                    aria-pressed={rating === star}
                                                                    className={`text-3xl transition hover:scale-110 sm:text-4xl ${
                                                                        star <= rating
                                                                            ? 'text-amber-500'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>

                                                        {/* Comment */}
                                                        <label
                                                            htmlFor="reviewComment"
                                                            className="mt-6 block text-sm font-medium"
                                                        >
                                                            Your Review
                                                        </label>

                                                        <textarea
                                                            id="reviewComment"
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            placeholder="Tell us about your experience with this product..."
                                                            rows="4"
                                                            maxLength={1000}
                                                            required
                                                            className="mt-3 w-full resize-y border border-[#DED5C8] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#2B2926]"
                                                        />

                                                        <p className="mt-1 text-right text-xs text-gray-400">
                                                            {comment.length}/1000
                                                        </p>

                                                        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                                            <button
                                                                type="submit"
                                                                disabled={submittingReview}
                                                                className="w-full bg-[#2B2926] px-8 py-3 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                                            >
                                                                {submittingReview
                                                                    ? 'Submitting...'
                                                                    : 'Submit Review'}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={handleCancelReview}
                                                                disabled={submittingReview}
                                                                className="w-full border border-[#DED5C8] px-8 py-3 text-sm transition hover:bg-[#F5F0E8] disabled:opacity-60 sm:w-auto"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                </>
                                            )}

                                        </div>
                                    </div>

                                    {/* Customer Reviews */}
                                    <div className="mt-12">

                                        <div className="flex flex-col gap-2 border-b border-[#DED5C8] pb-4 sm:flex-row sm:items-end sm:justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-[2px] text-gray-500">
                                                    What Customers Say
                                                </p>

                                                <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                                                    Customer Reviews
                                                </h2>
                                            </div>

                                            <p className="text-sm text-gray-500">
                                                {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                                            </p>
                                        </div>

                                        {loadingReviews ? (
                                            <p className="py-8 text-sm text-gray-500">
                                                Loading reviews...
                                            </p>
                                        ) : reviews.length === 0 ? (
                                            <div className="border-b border-[#DED5C8] py-12 text-center">
                                                <div className="text-3xl text-gray-400">
                                                    ☆
                                                </div>

                                                <h3 className="mt-3 font-serif text-xl">
                                                    No reviews yet
                                                </h3>

                                                <p className="mt-2 text-sm text-gray-500">
                                                    Be the first to share your experience with this product.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-[#DED5C8]">
                                                {reviews.map(review => (
                                                    <article
                                                        key={review._id}
                                                        className="py-6 sm:py-8"
                                                    >
                                                        <div className="flex items-start gap-4">

                                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8DED0] text-sm font-medium uppercase">
                                                                {review.userId?.name?.charAt(0) || 'C'}
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                    <div>
                                                                        <h3 className="break-words text-sm font-medium">
                                                                            {review.userId?.name || 'Customer'}
                                                                        </h3>

                                                                        <div className="mt-1 flex text-sm text-amber-500">
                                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                                <span key={star}>
                                                                                    {star <= Number(review.rating)
                                                                                        ? '★'
                                                                                        : '☆'}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <p className="text-xs text-gray-400">
                                                                        {review.createdAt
                                                                            ? new Date(review.createdAt).toLocaleDateString()
                                                                            : ''}
                                                                    </p>
                                                                </div>

                                                                <p className="mt-4 break-words whitespace-pre-wrap text-sm leading-7 text-gray-600">
                                                                    {review.comment}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            )}

                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ProductDetails

