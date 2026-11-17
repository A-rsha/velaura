import React, { useState, useEffect } from 'react'
import API from '../services/axios'
import { FiStar } from 'react-icons/fi'

function ReviewSection() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await API.get('/review/getAllReviews')

                if (response.data.success) {
                    setReviews(response.data.data)
                }
            } catch (error) {
                console.log('Fetch reviews error:', error)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    return (
        <section className="bg-[#FAF8F4] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 animate-review-section">

            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-10 text-center animate-review-heading">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A7958]">
                        Customer Love
                    </p>

                    <h2 className="font-serif text-3xl text-[#2B2926] sm:text-4xl">
                        What our customer say
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#77716A] sm:text-base">
                        Discover what our customers think about their Velaura experience.
                    </p>

                    <div className="mx-auto mt-4 h-[2px] w-14 bg-[#B99A72] transition-all duration-500 hover:w-24" />

                </div>

                <div>

                    {/* Loading State */}
                    {loading && (
                        <p className="animate-review-state py-10 text-center text-gray-500">
                            Loading reviews...
                        </p>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <p className="animate-review-state py-10 text-center text-red-500">
                            Unable to load reviews. Please try again later.
                        </p>
                    )}

                    {/* Empty State */}
                    {!loading && !error && reviews.length === 0 && (
                        <p className="animate-review-state py-10 text-center text-gray-500">
                            No reviews yet. Be the first to share your experience!
                        </p>
                    )}

                    {/* Reviews Grid */}
                    {!loading && !error && reviews.length > 0 && (

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                            {reviews.map((review, index) => (

                                <div
                                    key={review._id}
                                    style={{
                                        animationDelay: `${index * 120}ms`
                                    }}
                                    className="review-card rounded-xl border border-[#E9E1D6] bg-white p-5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl sm:p-6"
                                >

                                    {/* Customer details */}
                                    <div className="mb-4 flex items-center gap-3">

                                        <div className="review-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8] font-serif text-lg text-[#8B6F4E] transition-all duration-300 hover:scale-110 hover:shadow-md">
                                            {review.userId?.name?.charAt(0)?.toUpperCase() || 'C'}
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-[#2B2926] transition-colors duration-300 hover:text-[#9A7958]">
                                                {review.userId?.name || 'Customer'}
                                            </h3>

                                            <p className="text-xs text-[#8A8178]">
                                                {review.createdAt
                                                    ? new Date(review.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })
                                                    : ''}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Star rating */}
                                    <div className="mb-3 flex items-center gap-1">

                                        {[1, 2, 3, 4, 5].map((star) => (

                                            <FiStar
                                                key={star}
                                                size={16}
                                                style={{
                                                    animationDelay: `${star * 80}ms`
                                                }}
                                                className={`review-star transition-all duration-300 ${
                                                    star <= Number(review.rating)
                                                        ? 'fill-[#C49A6C] text-[#C49A6C] hover:scale-125'
                                                        : 'text-[#D8D0C5]'
                                                }`}
                                            />

                                        ))}

                                        <span className="ml-1 text-sm text-[#77716A]">
                                            {review.rating}/5
                                        </span>

                                    </div>

                                    {/* Review comment */}
                                    <p className="review-comment mb-5 text-sm leading-6 text-[#655F58]">
                                        {review.comment}
                                    </p>

                                    {/* Product details */}
                                    {review.productId && (

                                        <div className="flex items-center gap-3 border-t border-[#F0EBE4] pt-4">

                                            {review.productId.image && (
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F5F0E8]">

                                                    <img
                                                        src={review.productId.image}
                                                        alt={review.productId.title || 'Product'}
                                                        className="h-full w-full rounded-lg object-cover transition-transform duration-500 hover:scale-110"
                                                    />

                                                </div>
                                            )}

                                            <div className="min-w-0">

                                                <p className="text-xs text-[#9A7958]">
                                                    Reviewed product
                                                </p>

                                                <p className="truncate text-sm font-medium text-[#2B2926] transition-colors duration-300 hover:text-[#9A7958]">
                                                    {review.productId.title || 'Velaura product'}
                                                </p>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

            {/* Review Animations */}
            <style>{`

                @keyframes reviewSectionEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes reviewHeadingEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes reviewCardEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes reviewStarPop {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes reviewStateEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-review-section {
                    animation: reviewSectionEntrance 0.8s ease-out both;
                }

                .animate-review-heading {
                    animation: reviewHeadingEntrance 0.8s ease-out both;
                }

                .review-card {
                    animation: reviewCardEntrance 0.7s ease-out both;
                }

                .review-star {
                    animation: reviewStarPop 0.4s ease-out both;
                }

                .review-comment {
                    transition: color 0.3s ease;
                }

                .review-card:hover .review-comment {
                    color: #4B443C;
                }

                .animate-review-state {
                    animation: reviewStateEntrance 0.5s ease-out both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-review-section,
                    .animate-review-heading,
                    .review-card,
                    .review-star,
                    .animate-review-state {
                        animation: none !important;
                    }

                    .review-card,
                    .review-avatar,
                    .review-star,
                    .review-comment {
                        transition: none !important;
                    }
                }

            `}</style>

        </section>
    )
}

export default ReviewSection