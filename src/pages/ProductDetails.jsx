import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiChevronRight,
  FiStar,
  FiPackage,
  FiHeart,
} from 'react-icons/fi'

function ProductDetails({ cartCount, setCartCount, setCartItems }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  const productImages = product
    ? [...new Set([
        product.image,
        ...(Array.isArray(product.images) ? product.images : []),
      ].filter(Boolean))]
    : []

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/getProduct/${id}`)
        setProduct(res.data.data)
      } catch (error) {
        console.log('Error fetching product:', error.response?.data || error)
      }
    }

    fetchProduct()
  }, [id])

  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0])
    }
  }, [productImages.join('|')])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await API.get('/product/getProducts')
        const allProducts = res.data.data || []
        const related = allProducts.filter(
          (item) =>
            item.category === product?.category &&
            String(item._id) !== String(id)
        )
        setRelatedProducts(related.slice(0, 4))
      } catch (error) {
        console.log('Error fetching related products:', error.response?.data || error)
      }
    }

    if (product) fetchRelatedProducts()
  }, [product, id])

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true)
      const res = await API.get(`/review/getReview/${id}`)
      setReviews(res.data.data || [])
    } catch (error) {
      console.log('Error fetching reviews:', error.response?.data || error)
    } finally {
      setLoadingReviews(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [id])

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / totalReviews
    : 0

  const handleAddToCart = async () => {
    try {
      await API.post('/cart/add', { productId: product._id })

      toast.success('Product added to cart', {
        icon: <FiCheckCircle size={21} />,
      })

      if (setCartCount) setCartCount((prev) => prev + 1)
    } catch (error) {
      console.log('Add to cart error:', error.response?.data || error)
      toast.error(error.response?.data?.message || 'Add To Cart Failed')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (rating < 1 || rating > 5) {
      toast.warn('Please select a star rating', {
        icon: <FiAlertTriangle size={21} />,
      })
      return
    }

    if (!comment.trim()) {
      toast.warn('Please write your review', {
        icon: <FiAlertTriangle size={21} />,
      })
      return
    }

    try {
      setSubmittingReview(true)

      await API.post('/review/addReview', {
        productId: id,
        rating,
        comment: comment.trim(),
      })

      toast.success('Review submitted successfully', {
        icon: <FiCheckCircle size={21} />,
      })

      setRating(0)
      setComment('')
      setShowReviewForm(false)
      await fetchReviews()
    } catch (error) {
      console.log('Submit review error:', error.response?.data || error)

      if (error.response?.status === 401) {
        toast.warn('Please login to submit a review', {
          icon: <FiAlertTriangle size={21} />,
        })
      } else if (error.response?.status === 403) {
        toast.warn('You can review this product only after purchasing it.', {
          icon: <FiAlertTriangle size={21} />,
        })
      } else {
        toast.error(error.response?.data?.message || 'Unable to submit review', {
          icon: <FiXCircle size={21} />,
        })
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
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#D9D0C4] border-t-[#292723]" />
          <p className="text-sm tracking-wide text-[#777168]">Loading product...</p>
        </div>
      </div>
    )
  }

  const displayPrice = product.isOffer ? product.offerPrice : product.price

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#292723]">
      <Navbar cartCount={cartCount} />

      <main className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="mb-7 flex flex-wrap items-center gap-2 text-xs text-[#898278] sm:mb-10 sm:text-sm" aria-label="Breadcrumb">
            <button onClick={() => navigate('/')} className="transition hover:text-[#292723]">Home</button>
            <FiChevronRight className="h-3 w-3" />
            <button onClick={() => navigate('/shop')} className="transition hover:text-[#292723]">Shop</button>
            <FiChevronRight className="h-3 w-3" />
            <span className="max-w-[190px] truncate text-[#292723]">{product.title}</span>
          </nav>

          {/* Product overview */}
          <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.85fr)] lg:gap-14 xl:gap-20">
            {/* Gallery */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4">
              {productImages.length > 1 && (
                <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
                  {productImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={selectedImage === image}
                      className={`h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm border bg-white p-1 transition sm:h-[76px] sm:w-[76px] ${
                        selectedImage === image
                          ? 'border-[#292723] ring-1 ring-[#292723]'
                          : 'border-[#E6E0D7] hover:border-[#9A9083]'
                      }`}
                    >
                      <img src={image} alt={`${product.title} view ${index + 1}`} className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              <div className="group relative order-1 min-w-0 overflow-hidden rounded-sm bg-[#F0ECE5] sm:order-2">
                <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2">
                  {product.isOffer && (
                    <span className="bg-[#292723] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-white">
                      {product.offerPercentage}% off
                    </span>
                  )}
                  <span className="bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] text-[#4B463F]">
                    Velaura edit
                  </span>
                </div>
                <img
                  src={selectedImage || product.image}
                  alt={product.title}
                  className="aspect-[4/5] w-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.025] sm:p-5"
                />
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-[#292723]">
                    {Math.max(productImages.indexOf(selectedImage), 0) + 1} / {productImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Product information */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-medium uppercase tracking-[3px] text-[#8C8174] sm:text-xs">
                {product.category}
              </p>

              <h1 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl xl:text-[42px]">
                {product.title}
              </h1>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews')
                  document.getElementById('product-information')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#756D63] transition hover:text-[#292723]"
              >
                <span className="flex items-center gap-0.5 text-[#B18A4B]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className={`h-3.5 w-3.5 ${star <= Math.round(averageRating) ? 'fill-current' : ''}`} />
                  ))}
                </span>
                <span>{averageRating.toFixed(1)}</span>
                <span className="text-[#B9B0A5]">|</span>
                <span>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</span>
              </button>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                {product.isOffer && (
                  <span className="text-base text-[#A59B8F] line-through">₹{product.price}</span>
                )}
                <span className="text-2xl font-medium tracking-tight sm:text-3xl">₹{displayPrice}</span>
                {product.isOffer && (
                  <span className="rounded-full bg-[#E7EEE4] px-3 py-1 text-xs font-medium text-[#496346]">
                    Save {product.offerPercentage}%
                  </span>
                )}
              </div>

              <p className="mt-6 max-w-xl whitespace-pre-line text-sm leading-7 text-[#756D63] sm:text-[15px]">
                {product.description}
              </p>

              <div className="my-7 border-t border-[#E7E0D6]" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-[#5E584F]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0ECE5]"><FiTruck className="h-4 w-4" /></span>
                  <div>
                    <p className="font-medium text-[#292723]">Thoughtful delivery</p>
                    <p className="mt-0.5 text-xs text-[#898278]">Carefully packed for your order</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5E584F]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0ECE5]"><FiShield className="h-4 w-4" /></span>
                  <div>
                    <p className="font-medium text-[#292723]">Secure checkout</p>
                    <p className="mt-0.5 text-xs text-[#898278]">Your shopping experience matters to us</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#5E584F]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0ECE5]"><FiRotateCcw className="h-4 w-4" /></span>
                  <div>
                    <p className="font-medium text-[#292723]">Easy returns</p>
                    <p className="mt-0.5 text-xs text-[#898278]">Shop with added peace of mind</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="mt-8 flex w-full items-center justify-center gap-3 bg-[#292723] px-6 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition duration-300 hover:bg-[#49443D] focus:outline-none focus:ring-2 focus:ring-[#292723] focus:ring-offset-2"
              >
                <FiShoppingBag className="h-4 w-4" />
                Add to bag
              </button>

              <p className="mt-4 text-center text-[11px] uppercase tracking-[1.4px] text-[#948A7D]">
                A little detail. A lasting impression.
              </p>

              <div className="mt-7 border-y border-[#E7E0D6] py-4">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#898278]">Category</span>
                  <span className="capitalize text-[#292723]">{product.category}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#898278]">Product code</span>
                  <span className="text-xs tracking-wide text-[#5E584F]">{String(product._id).slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 border-t border-[#E7E0D6] pt-12 sm:mt-24 sm:pt-16">
              <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
                <div>
                  <p className="text-[10px] uppercase tracking-[3px] text-[#8C8174] sm:text-xs">Curated for you</p>
                  <h2 className="mt-2 font-serif text-2xl sm:text-3xl">You may also like</h2>
                </div>
                <button onClick={() => navigate('/shop')} className="shrink-0 text-xs uppercase tracking-[1.5px] text-[#5E584F] underline underline-offset-4 transition hover:text-black">
                  View all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {relatedProducts.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      navigate(`/product/${item._id}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="group min-w-0 text-left"
                  >
                    <div className="relative overflow-hidden bg-[#F0ECE5]">
                      {item.isOffer && (
                        <span className="absolute left-2 top-2 z-10 bg-[#292723] px-2 py-1 text-[9px] uppercase tracking-wider text-white sm:left-3 sm:top-3">
                          {item.offerPercentage}% off
                        </span>
                      )}
                      <img
                        src={item.image || item.images?.[0]}
                        alt={item.title}
                        className="aspect-[4/5] w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 sm:p-4"
                      />
                    </div>
                    <div className="pt-3 sm:pt-4">
                      <p className="truncate text-sm text-[#292723]">{item.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {item.isOffer && <span className="text-xs text-[#A59B8F] line-through">₹{item.price}</span>}
                        <span className="text-sm font-medium">₹{item.isOffer ? item.offerPrice : item.price}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Description and reviews */}
          <section id="product-information" className="mt-20 border-t border-[#E7E0D6] sm:mt-24">
            <div className="flex gap-7 overflow-x-auto border-b border-[#E7E0D6] sm:gap-10">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`shrink-0 border-b-2 py-5 text-xs uppercase tracking-[1.6px] transition sm:text-sm ${activeTab === 'description' ? 'border-[#292723] font-semibold text-[#292723]' : 'border-transparent text-[#92887D] hover:text-[#292723]'}`}
              >
                Product details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`shrink-0 border-b-2 py-5 text-xs uppercase tracking-[1.6px] transition sm:text-sm ${activeTab === 'reviews' ? 'border-[#292723] font-semibold text-[#292723]' : 'border-transparent text-[#92887D] hover:text-[#292723]'}`}
              >
                Reviews ({totalReviews})
              </button>
            </div>

            <div className="py-9 sm:py-12">
              {activeTab === 'description' && (
                <div className="grid gap-8 md:grid-cols-[1fr_280px] md:gap-16">
                  <div className="max-w-3xl">
                    <p className="text-[10px] uppercase tracking-[3px] text-[#8C8174] sm:text-xs">The details</p>
                    <h2 className="mt-3 font-serif text-2xl sm:text-3xl">Made to complement your style.</h2>
                    <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#756D63] sm:text-[15px]">{product.description}</p>
                  </div>
                  <div className="h-fit border border-[#E7E0D6] p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <FiPackage className="h-5 w-5 text-[#8C8174]" />
                      <p className="text-sm font-medium">Product information</p>
                    </div>
                    <div className="mt-5 border-t border-[#E7E0D6] pt-4">
                      <p className="text-xs text-[#92887D]">Category</p>
                      <p className="mt-1 text-sm capitalize">{product.category}</p>
                    </div>
                    <div className="mt-4 border-t border-[#E7E0D6] pt-4">
                      <p className="text-xs text-[#92887D]">Availability</p>
                      <p className="mt-1 text-sm">Available to order</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="grid gap-5 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8">
                    <div className="border border-[#E7E0D6] bg-white/60 p-6 sm:p-8">
                      <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">Customer rating</p>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="font-serif text-5xl">{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-[#A59B8F]">/ 5</span>
                      </div>
                      <div className="mt-3 flex gap-1 text-[#B18A4B]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar key={star} className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <p className="mt-3 text-xs text-[#898278]">Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                    </div>

                    <div className="border border-[#E7E0D6] bg-white/60 p-5 sm:p-7">
                      {!showReviewForm ? (
                        <div>
                          <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">Your experience matters</p>
                          <h2 className="mt-2 font-serif text-2xl sm:text-3xl">Share your thoughts</h2>
                          <p className="mt-3 max-w-xl text-sm leading-6 text-[#756D63]">Help other customers discover what makes this piece special.</p>
                          <button type="button" onClick={() => setShowReviewForm(true)} className="mt-6 bg-[#292723] px-6 py-3.5 text-xs font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#49443D]">
                            Write a review
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">Your experience matters</p>
                              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">Write a review</h2>
                            </div>
                            <button type="button" onClick={handleCancelReview} className="text-xs uppercase tracking-wider text-[#898278] underline underline-offset-4 hover:text-[#292723]">Cancel</button>
                          </div>

                          <form onSubmit={handleSubmitReview} className="mt-6">
                            <label className="block text-sm font-medium">Your rating</label>
                            <div className="mt-3 flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  aria-label={`Rate ${star} out of 5 stars`}
                                  aria-pressed={rating === star}
                                  className={`text-3xl transition hover:scale-110 ${star <= rating ? 'text-[#B18A4B]' : 'text-[#D8D0C6]'}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>

                            <label htmlFor="reviewComment" className="mt-6 block text-sm font-medium">Your review</label>
                            <textarea
                              id="reviewComment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Tell us about your experience with this product..."
                              rows="4"
                              maxLength={1000}
                              required
                              className="mt-3 w-full resize-y border border-[#E0D8CE] bg-[#FFFEFC] px-4 py-3 text-sm outline-none transition placeholder:text-[#B1A79A] focus:border-[#292723]"
                            />
                            <p className="mt-1 text-right text-xs text-[#A59B8F]">{comment.length}/1000</p>

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                              <button type="submit" disabled={submittingReview} className="bg-[#292723] px-7 py-3.5 text-xs font-semibold uppercase tracking-[1.4px] text-white transition hover:bg-[#49443D] disabled:cursor-not-allowed disabled:opacity-60">
                                {submittingReview ? 'Submitting...' : 'Submit review'}
                              </button>
                              <button type="button" onClick={handleCancelReview} disabled={submittingReview} className="border border-[#DED5C8] px-7 py-3.5 text-xs font-semibold uppercase tracking-[1.4px] transition hover:bg-[#F0ECE5] disabled:opacity-60">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-12">
                    <div className="flex flex-col gap-2 border-b border-[#E7E0D6] pb-5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">Customer stories</p>
                        <h2 className="mt-2 font-serif text-2xl sm:text-3xl">What customers say</h2>
                      </div>
                      <p className="text-xs text-[#898278]">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                    </div>

                    {loadingReviews ? (
                      <p className="py-8 text-sm text-[#898278]">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <div className="py-14 text-center">
                        <FiHeart className="mx-auto h-7 w-7 text-[#B9B0A5]" />
                        <h3 className="mt-4 font-serif text-xl">No reviews yet</h3>
                        <p className="mt-2 text-sm text-[#898278]">Be the first to share your experience with this product.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#E7E0D6]">
                        {reviews.map((review) => (
                          <article key={review._id} className="py-6 sm:py-8">
                            <div className="flex items-start gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE6DC] text-sm font-medium uppercase text-[#5E584F]">
                                {review.userId?.name?.charAt(0) || 'C'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <div>
                                    <h3 className="break-words text-sm font-semibold">{review.userId?.name || 'Customer'}</h3>
                                    <div className="mt-1 flex gap-0.5 text-[#B18A4B]">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <FiStar key={star} className={`h-3.5 w-3.5 ${star <= Number(review.rating) ? 'fill-current' : ''}`} />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-xs text-[#A59B8F]">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</p>
                                </div>
                                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#756D63]">{review.comment}</p>
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