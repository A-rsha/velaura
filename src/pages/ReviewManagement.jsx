
import React, { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import API from '../services/axios'

import {
    FiStar,
    FiSearch,
    FiMessageSquare,
    FiTrendingUp,
    FiAward,
    FiRefreshCw,
    FiPackage,
    FiFilter,
    FiAlertCircle,
    FiTrash2
} from 'react-icons/fi'

function ReviewManagement() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [selectedRating, setSelectedRating] = useState('all')
    const [deletingId, setDeletingId] = useState(null)

    // Fetch all reviews
    const fetchReviews = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await API.get('/review/getAllReviews')

            if (response.data.success) {
                setReviews(response.data.data || [])
            } else {
                setReviews([])
                setError('Unable to load reviews. Please try again.')
            }
        } catch (error) {
            console.error('Fetch reviews error:', error)
            setError('Unable to load reviews. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    // Delete a review
    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this review? This action cannot be undone.'
        )

        if (!confirmDelete) {
            return
        }

        try {
            setDeletingId(reviewId)

            const response = await API.delete(
                `/review/deleteReview/${reviewId}`
            )

            if (response.data.success) {
                setReviews((prevReviews) =>
                    prevReviews.filter(
                        (review) => review._id !== reviewId
                    )
                )

                window.alert('Review deleted successfully!')
            } else {
                window.alert(
                    response.data.message || 'Failed to delete review.'
                )
            }
        } catch (error) {
            console.error('Delete review error:', error)

            window.alert(
                error.response?.data?.message ||
                'Failed to delete review. Please try again.'
            )
        } finally {
            setDeletingId(null)
        }
    }

    // Dashboard statistics
    const totalReviews = reviews.length

    const averageRating = totalReviews
        ? (
            reviews.reduce(
                (total, review) => total + Number(review.rating || 0),
                0
            ) / totalReviews
        ).toFixed(1)
        : '0.0'

    const fiveStarReviews = reviews.filter(
        (review) => Number(review.rating) === 5
    ).length

    // Search and rating filter
    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const customerName = review.userId?.name || 'Customer'
            const productName = review.productId?.title || ''
            const comment = review.comment || ''

            const searchText = search.toLowerCase().trim()

            const matchesSearch =
                customerName.toLowerCase().includes(searchText) ||
                productName.toLowerCase().includes(searchText) ||
                comment.toLowerCase().includes(searchText)

            const matchesRating =
                selectedRating === 'all' ||
                Number(review.rating) === Number(selectedRating)

            return matchesSearch && matchesRating
        })
    }, [reviews, search, selectedRating])

    // Display rating stars
    const renderStars = (rating) => (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                    key={star}
                    size={16}
                    className={
                        star <= Number(rating)
                            ? 'fill-[#B58A5A] text-[#B58A5A]'
                            : 'text-[#D8D0C5]'
                    }
                />
            ))}
        </div>
    )

    // Format review date
    const formatDate = (date) => {
        if (!date) return 'Date unavailable'

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date unavailable'
        }

        return parsedDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Summary cards
    const stats = [
        {
            title: 'Total Reviews',
            value: totalReviews,
            icon: FiMessageSquare,
            description: 'Customer feedback received'
        },
        {
            title: 'Average Rating',
            value: averageRating,
            icon: FiTrendingUp,
            description: 'Out of 5 stars'
        },
        {
            title: '5-Star Reviews',
            value: fiveStarReviews,
            icon: FiAward,
            description: 'Excellent customer ratings'
        }
    ]

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            <AdminSidebar />

            <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:ml-64 lg:px-10">
                <div className="mx-auto max-w-7xl">

                    {/* PAGE HEADER */}
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A7958]">
                                VELAURA ADMINISTRATION
                            </p>

                            <h1 className="mt-3 font-serif text-3xl text-[#2B2926] sm:text-4xl">
                                Review Management
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#82796F]">
                                Monitor customer feedback, explore product ratings,
                                and understand your customers' shopping experience.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchReviews}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#D8CEC0] bg-white px-4 py-3 text-sm font-medium text-[#2B2926] transition hover:bg-[#EEE8DE] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                        >
                            <FiRefreshCw
                                size={16}
                                className={loading ? 'animate-spin' : ''}
                            />
                            Refresh Reviews
                        </button>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {stats.map((stat) => {
                            const Icon = stat.icon

                            return (
                                <div
                                    key={stat.title}
                                    className="rounded-2xl border border-[#E4DCCF] bg-white p-5 sm:p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-[#82796F]">
                                                {stat.title}
                                            </p>

                                            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2B2926]">
                                                {stat.value}

                                                {stat.title === 'Average Rating' && (
                                                    <span className="ml-2 text-sm font-normal text-[#82796F]">
                                                        / 5
                                                    </span>
                                                )}
                                            </h2>
                                        </div>

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F5F0E8] text-[#9A7958]">
                                            <Icon size={22} />
                                        </div>
                                    </div>

                                    <p className="mt-4 text-xs text-[#9A9187]">
                                        {stat.description}
                                    </p>

                                    {stat.title === 'Average Rating' && totalReviews > 0 && (
                                        <div className="mt-3">
                                            {renderStars(
                                                Math.round(Number(averageRating))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* REVIEWS SECTION */}
                    <section className="overflow-hidden rounded-2xl border border-[#E4DCCF] bg-white">

                        {/* SECTION HEADER */}
                        <div className="border-b border-[#EEE8DE] p-5 sm:p-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#2B2926]">
                                        Customer Feedback
                                    </h2>

                                    <p className="mt-1 text-sm text-[#8A8178]">
                                        View ratings and reviews submitted by your customers.
                                    </p>
                                </div>

                                <span className="inline-flex w-fit items-center rounded-full bg-[#F5F0E8] px-3 py-1.5 text-xs font-medium text-[#8B6F4E]">
                                    {filteredReviews.length} of {totalReviews} reviews
                                </span>
                            </div>

                            {/* SEARCH AND FILTER */}
                            <div className="mt-5 flex flex-col gap-3 md:flex-row">
                                <div className="relative flex-1">
                                    <FiSearch
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A39A90]"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search customer, product, or comment..."
                                        className="w-full rounded-lg border border-[#E2D9CD] bg-[#FDFBF8] py-3 pl-11 pr-4 text-sm text-[#2B2926] outline-none transition placeholder:text-[#AAA197] focus:border-[#A58A6A]"
                                    />
                                </div>

                                <div className="relative md:w-52">
                                    <FiFilter
                                        size={16}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8178]"
                                    />

                                    <select
                                        value={selectedRating}
                                        onChange={(e) => setSelectedRating(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-[#E2D9CD] bg-[#FDFBF8] py-3 pl-9 pr-4 text-sm text-[#2B2926] outline-none focus:border-[#A58A6A]"
                                    >
                                        <option value="all">All Ratings</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* REVIEW CONTENT */}
                        <div className="p-4 sm:p-6">

                            {/* LOADING */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <FiRefreshCw
                                        size={28}
                                        className="animate-spin text-[#9A7958]"
                                    />

                                    <p className="mt-4 text-sm text-[#82796F]">
                                        Loading customer reviews...
                                    </p>
                                </div>
                            )}

                            {/* ERROR */}
                            {!loading && error && (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FiAlertCircle
                                        size={32}
                                        className="text-red-500"
                                    />

                                    <p className="mt-3 text-sm text-[#655F58]">
                                        {error}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={fetchReviews}
                                        className="mt-4 rounded-lg bg-[#2B2926] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#403D39]"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* EMPTY STATE */}
                            {!loading && !error && filteredReviews.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8] text-[#9A7958]">
                                        <FiMessageSquare size={28} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-medium text-[#2B2926]">
                                        {totalReviews === 0
                                            ? 'No reviews yet'
                                            : 'No matching reviews'}
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#8A8178]">
                                        {totalReviews === 0
                                            ? 'Customer reviews will appear here when customers start sharing their feedback.'
                                            : 'Try another search term or select a different rating filter.'}
                                    </p>

                                    {(search || selectedRating !== 'all') && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('')
                                                setSelectedRating('all')
                                            }}
                                            className="mt-4 text-sm font-medium text-[#8B6F4E] underline underline-offset-4 hover:text-[#2B2926]"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* REVIEW CARDS */}
                            {!loading && !error && filteredReviews.length > 0 && (
                                <div className="space-y-4">
                                    {filteredReviews.map((review) => {
                                        const customerName =
                                            review.userId?.name || 'Customer'

                                        const initial =
                                            customerName.charAt(0).toUpperCase()

                                        return (
                                            <article
                                                key={review._id}
                                                className="rounded-xl border border-[#EEE8DE] bg-[#FFFEFC] p-4 transition hover:border-[#D8C6AF] sm:p-5"
                                            >
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                                                    {/* CUSTOMER DETAILS */}
                                                    <div className="flex min-w-0 items-center gap-3 lg:w-56 lg:shrink-0">
                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E4D6C4] bg-[#F5F0E8] font-serif text-lg text-[#8B6F4E]">
                                                            {initial}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm font-semibold text-[#2B2926]">
                                                                {customerName}
                                                            </h3>

                                                            <p className="mt-1 text-xs text-[#9A9187]">
                                                                {formatDate(review.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* RATING AND COMMENT */}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            {renderStars(review.rating)}

                                                            <span className="rounded-md bg-[#F5F0E8] px-2 py-1 text-xs font-semibold text-[#8B6F4E]">
                                                                {Number(review.rating) || 0}.0 / 5
                                                            </span>
                                                        </div>

                                                        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#655F58]">
                                                            {review.comment || 'No written comment.'}
                                                        </p>
                                                    </div>

                                                    {/* PRODUCT DETAILS */}
                                                    <div className="border-t border-[#EEE8DE] pt-4 lg:w-56 lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                                                        {review.productId ? (
                                                            <div className="flex items-center gap-3">
                                                                {review.productId.image ? (
                                                                    <img
                                                                        src={review.productId.image}
                                                                        alt={review.productId.title || 'Product'}
                                                                        className="h-14 w-14 shrink-0 rounded-lg border border-[#EEE8DE] bg-[#F5F0E8] object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F5F0E8] text-[#9A7958]">
                                                                        <FiPackage size={22} />
                                                                    </div>
                                                                )}

                                                                <div className="min-w-0">
                                                                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#A08A72]">
                                                                        Product
                                                                    </p>

                                                                    <p className="mt-1 break-words text-sm font-medium text-[#2B2926]">
                                                                        {review.productId.title || 'VELAURA Product'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-sm text-[#9A9187]">
                                                                <FiPackage size={18} />
                                                                Product unavailable
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* DELETE BUTTON */}
                                                <div className="mt-4 flex justify-end border-t border-[#EEE8DE] pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteReview(review._id)}
                                                        disabled={deletingId === review._id}
                                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {deletingId === review._id ? (
                                                            <FiRefreshCw
                                                                size={16}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <FiTrash2 size={16} />
                                                        )}

                                                        {deletingId === review._id
                                                            ? 'Deleting...'
                                                            : 'Delete Review'}
                                                    </button>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* FOOTER NOTE */}
                    {!loading && !error && totalReviews > 0 && (
                        <p className="mt-5 text-center text-xs text-[#9A9187]">
                            Showing {filteredReviews.length} customer reviews from your VELAURA store.
                        </p>
                    )}
                </div>
            </main>
        </div>
    )
}

export default ReviewManagement

