import React from 'react'
import API from '../services/axios'
import { useState } from 'react'
import { useEffect } from 'react'
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
        <section className="bg-[#FAF8F4] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className='mx-auto max-w-7xl'>

                <div className='mb-10 text-center'>
                    <p className='mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A7958]'>
                        Customer Love
                    </p>

                    <h2 className='font-serif text-3xl text-[#2B2926] sm:text-4xl'>
                        What our customer say
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#77716A] sm:text-base">
                        Discover what our customers think about their Velaura experience.
                    </p>
                    <div className="mx-auto mt-4 h-[2px] w-14 bg-[#B99A72]" />
                </div>
                <div>
                    {loading && (
                        <p className="py-10 text-center text-gray-500">
                            Loading reviews...
                        </p>
                    )}

                    {!loading && error && (
                        <p className="py-10 text-center text-red-500">
                            Unable to load reviews. Please try again later.
                        </p>
                    )}

                    {!loading && !error && reviews.length === 0 && (
                        <p className="py-10 text-center text-gray-500">
                            No reviews yet. Be the first to share your experience!
                        </p>
                    )}

                    {!loading && !error && reviews.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="rounded-xl border border-[#E9E1D6] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6"
                                >
                                    {/* Customer details */}
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8] font-serif text-lg text-[#8B6F4E]">
                                            {review.userId?.name?.charAt(0)?.toUpperCase() || 'C'}
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-[#2B2926]">
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
                                                className={
                                                    star <= Number(review.rating)
                                                        ? 'fill-[#C49A6C] text-[#C49A6C]'
                                                        : 'text-[#D8D0C5]'
                                                }
                                            />
                                        ))}

                                        <span className="ml-1 text-sm text-[#77716A]">
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    {/* Review comment */}
                                    <p className="mb-5 text-sm leading-6 text-[#655F58]">
                                        {review.comment}
                                    </p>

                                    {/* Product details */}
                                    {review.productId && (
                                        <div className="flex items-center gap-3 border-t border-[#F0EBE4] pt-4">
                                            {review.productId.image && (
                                                <img
                                                    src={review.productId.image}
                                                    alt={review.productId.title || 'Product'}
                                                    className="h-12 w-12 rounded-lg bg-[#F5F0E8] object-cover"
                                                />
                                            )}

                                            <div className="min-w-0">
                                                <p className="text-xs text-[#9A7958]">
                                                    Reviewed product
                                                </p>

                                                <p className="truncate text-sm font-medium text-[#2B2926]">
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

        </section>
    )
}

export default ReviewSection