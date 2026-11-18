import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
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

        console.log(
          'Error fetching product:',
          error.response?.data || error
        )

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

        console.log(
          'Error fetching related products:',
          error.response?.data || error
        )

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

      toast.success('Product added to cart', {
        icon: <FiCheckCircle size={21} />,
      })

      if (setCartCount) {
        setCartCount((prev) => prev + 1)
      }

    } catch (error) {

      console.log(
        'Add to cart error:',
        error.response?.data || error
      )

      toast.error(
        error.response?.data?.message || 'Add To Cart Failed'
      )

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

      console.log(
        'Submit review error:',
        error.response?.data || error
      )

      if (error.response?.status === 401) {

        toast.warn('Please login to submit a review', {
          icon: <FiAlertTriangle size={21} />,
        })

      } else if (error.response?.status === 403) {

        toast.warn(
          'You can review this product only after purchasing it.',
          {
            icon: <FiAlertTriangle size={21} />,
          }
        )

      } else {

        toast.error(
          error.response?.data?.message || 'Unable to submit review',
          {
            icon: <FiXCircle size={21} />,
          }
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

      <div className="product-loading-page flex min-h-screen items-center justify-center bg-[#F7F4EF]">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#D9D0C4] border-t-[#292723]" />

          <p className="text-sm tracking-wide text-[#777168]">
            Loading product...
          </p>

        </div>

        <style>{`

          .product-loading-page {
            animation: productPageFade 0.6s ease both;
          }

          @keyframes productPageFade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .product-loading-page div {
              animation: none !important;
            }
          }

        `}</style>

      </div>

    )

  }


  const displayPrice = product.isOffer
    ? product.offerPrice
    : product.price


  return (

    <div className="product-details-page min-h-screen bg-[#FAF8F4] text-[#292723]">

      <Navbar cartCount={cartCount} />


      <main className="px-4 pb-16 pt-24 sm:px-6 sm:pt-28 lg:px-10">

        <div className="mx-auto max-w-7xl">


          {/* Breadcrumb */}

          <ScrollReveal direction="down" duration={700}>

            <nav
              className="product-breadcrumb mb-7 flex flex-wrap items-center gap-2 text-xs text-[#898278] sm:mb-10 sm:text-sm"
              aria-label="Breadcrumb"
            >

              <button
                onClick={() => navigate('/')}
                className="breadcrumb-link transition hover:text-[#292723]"
              >
                Home
              </button>

              <FiChevronRight className="h-3 w-3" />

              <button
                onClick={() => navigate('/shop')}
                className="breadcrumb-link transition hover:text-[#292723]"
              >
                Shop
              </button>

              <FiChevronRight className="h-3 w-3" />

              <span className="max-w-[190px] truncate text-[#292723]">
                {product.title}
              </span>

            </nav>

          </ScrollReveal>


          {/* Product Overview */}

          <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.85fr)] lg:gap-14 xl:gap-20">


            {/* Product Gallery */}

            <ScrollReveal direction="left" duration={850}>

              <div className="product-gallery grid grid-cols-1 gap-3 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-4">


                {/* Thumbnails */}

                {productImages.length > 1 && (

                  <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">

                    {productImages.map((image, index) => (

                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(image)}
                        aria-label={`View image ${index + 1}`}
                        aria-pressed={selectedImage === image}
                        className={`product-thumbnail h-[72px] w-[72px] shrink-0 overflow-hidden rounded-sm border bg-white p-1 transition sm:h-[76px] sm:w-[76px] ${
                          selectedImage === image
                            ? 'border-[#292723] ring-1 ring-[#292723]'
                            : 'border-[#E6E0D7] hover:border-[#9A9083]'
                        }`}
                      >

                        <img
                          src={image}
                          alt={`${product.title} view ${index + 1}`}
                          className="h-full w-full object-contain"
                        />

                      </button>

                    ))}

                  </div>

                )}


                {/* Main Image */}

                <div className="product-main-image group relative order-1 min-w-0 overflow-hidden rounded-sm bg-[#F0ECE5]">

                  <div className="absolute left-4 top-4 z-10 flex flex-col items-start gap-2">

                    {product.isOffer && (

                      <span className="product-offer-badge bg-[#292723] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1.5px] text-white">

                        {product.offerPercentage}% off

                      </span>

                    )}

                    <span className="product-edit-badge bg-white/90 px-3 py-1.5 text-[10px] uppercase tracking-[1.5px] text-[#4B463F]">

                      Velaura edit

                    </span>

                  </div>


                  <img
                    key={selectedImage}
                    src={selectedImage || product.image}
                    alt={product.title}
                    className="product-feature-image aspect-[4/5] w-full object-contain p-3 transition-transform duration-700 group-hover:scale-[1.025] sm:p-5"
                  />


                  {productImages.length > 1 && (

                    <div className="product-image-count absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-xs text-[#292723]">

                      {Math.max(productImages.indexOf(selectedImage), 0) + 1} / {productImages.length}

                    </div>

                  )}

                </div>

              </div>

            </ScrollReveal>


            {/* Product Information */}

            <ScrollReveal direction="right" delay={150} duration={850}>

              <div className="product-information lg:sticky lg:top-28">

                <p className="product-category text-[10px] font-medium uppercase tracking-[3px] text-[#8C8174] sm:text-xs">

                  {product.category}

                </p>


                <h1 className="product-name mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl xl:text-[42px]">

                  {product.title}

                </h1>


                {/* Rating */}

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews')
                    document.getElementById('product-information')?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }}
                  className="product-rating mt-4 inline-flex items-center gap-2 text-sm text-[#756D63] transition hover:text-[#292723]"
                >

                  <span className="flex items-center gap-0.5 text-[#B18A4B]">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <FiStar
                        key={star}
                        className={`product-rating-star h-3.5 w-3.5 ${
                          star <= Math.round(averageRating)
                            ? 'fill-current'
                            : ''
                        }`}
                      />

                    ))}

                  </span>

                  <span>{averageRating.toFixed(1)}</span>

                  <span className="text-[#B9B0A5]">|</span>

                  <span>
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </span>

                </button>


                {/* Price */}

                <div className="product-price-area mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">

                  {product.isOffer && (

                    <span className="text-base text-[#A59B8F] line-through">
                      ₹{product.price}
                    </span>

                  )}

                  <span className="product-price text-2xl font-medium tracking-tight sm:text-3xl">
                    ₹{displayPrice}
                  </span>

                  {product.isOffer && (

                    <span className="product-save-badge rounded-full bg-[#E7EEE4] px-3 py-1 text-xs font-medium text-[#496346]">
                      Save {product.offerPercentage}%
                    </span>

                  )}

                </div>


                {/* Description */}

                <p className="product-description mt-6 max-w-xl whitespace-pre-line text-sm leading-7 text-[#756D63] sm:text-[15px]">

                  {product.description}

                </p>


                <div className="my-7 border-t border-[#E7E0D6]" />


                {/* Product Benefits */}

                <div className="space-y-4">

                  <div className="product-benefit flex items-center gap-3 text-sm text-[#5E584F]">

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0ECE5]">
                      <FiTruck className="h-4 w-4" />
                    </span>

                    <div>
                      <p className="font-medium text-[#292723]">
                        Thoughtful delivery
                      </p>

                      <p className="mt-0.5 text-xs text-[#898278]">
                        Carefully packed for your order
                      </p>
                    </div>

                  </div>


                  <div className="product-benefit flex items-center gap-3 text-sm text-[#5E584F]">

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0ECE5]">
                      <FiShield className="h-4 w-4" />
                    </span>

                    <div>
                      <p className="font-medium text-[#292723]">
                        Secure checkout
                      </p>

                      <p className="mt-0.5 text-xs text-[#898278]">
                        Your shopping experience matters to us
                      </p>
                    </div>

                  </div>


                  <div className="product-benefit flex items-center gap-3 text-sm text-[#5E584F]">

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0ECE5]">
                      <FiRotateCcw className="h-4 w-4" />
                    </span>

                    <div>
                      <p className="font-medium text-[#292723]">
                        Easy returns
                      </p>

                      <p className="mt-0.5 text-xs text-[#898278]">
                        Shop with added peace of mind
                      </p>
                    </div>

                  </div>

                </div>


                {/* Add To Cart */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="product-add-button mt-8 flex w-full items-center justify-center gap-3 bg-[#292723] px-6 py-4 text-xs font-semibold uppercase tracking-[2px] text-white transition duration-300 hover:bg-[#49443D] focus:outline-none focus:ring-2 focus:ring-[#292723] focus:ring-offset-2"
                >

                  <FiShoppingBag className="h-4 w-4" />

                  Add to bag

                </button>


                <p className="mt-4 text-center text-[11px] uppercase tracking-[1.4px] text-[#948A7D]">

                  A little detail. A lasting impression.

                </p>


                {/* Product Info */}

                <div className="mt-7 border-y border-[#E7E0D6] py-4">

                  <div className="flex items-center justify-between gap-4 text-sm">

                    <span className="text-[#898278]">
                      Category
                    </span>

                    <span className="capitalize text-[#292723]">
                      {product.category}
                    </span>

                  </div>


                  <div className="mt-3 flex items-center justify-between gap-4 text-sm">

                    <span className="text-[#898278]">
                      Product code
                    </span>

                    <span className="text-xs tracking-wide text-[#5E584F]">
                      {String(product._id).slice(-8).toUpperCase()}
                    </span>

                  </div>

                </div>

              </div>

            </ScrollReveal>

          </section>


          {/* Related Products */}

          {relatedProducts.length > 0 && (

            <section className="related-section mt-20 border-t border-[#E7E0D6] pt-12 sm:mt-24 sm:pt-16">

              <ScrollReveal direction="up" duration={750}>

                <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">

                  <div>

                    <p className="text-[10px] uppercase tracking-[3px] text-[#8C8174] sm:text-xs">
                      Curated for you
                    </p>

                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                      You may also like
                    </h2>

                  </div>

                  <button
                    onClick={() => navigate('/shop')}
                    className="shrink-0 text-xs uppercase tracking-[1.5px] text-[#5E584F] underline underline-offset-4 transition hover:text-black"
                  >
                    View all
                  </button>

                </div>

              </ScrollReveal>


              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">

                {relatedProducts.map((item, index) => (

                  <ScrollReveal
                    key={item._id}
                    direction="up"
                    delay={index * 120}
                    duration={700}
                  >

                    <button
                      type="button"
                      onClick={() => {
                        navigate(`/product/${item._id}`)
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        })
                      }}
                      className="related-product-card group min-w-0 text-left"
                    >

                      <div className="related-product-image relative overflow-hidden bg-[#F0ECE5]">

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

                        <p className="related-product-title truncate text-sm text-[#292723]">
                          {item.title}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2">

                          {item.isOffer && (

                            <span className="text-xs text-[#A59B8F] line-through">
                              ₹{item.price}
                            </span>

                          )}

                          <span className="text-sm font-medium">
                            ₹{item.isOffer ? item.offerPrice : item.price}
                          </span>

                        </div>

                      </div>

                    </button>

                  </ScrollReveal>

                ))}

              </div>

            </section>

          )}


          {/* Description and Reviews */}

          <ScrollReveal direction="up" duration={800}>

            <section
              id="product-information"
              className="product-tabs-section mt-20 border-t border-[#E7E0D6] sm:mt-24"
            >

              <div className="flex gap-7 overflow-x-auto border-b border-[#E7E0D6] sm:gap-10">

                <button
                  type="button"
                  onClick={() => setActiveTab('description')}
                  className={`product-tab shrink-0 border-b-2 py-5 text-xs uppercase tracking-[1.6px] transition sm:text-sm ${
                    activeTab === 'description'
                      ? 'border-[#292723] font-semibold text-[#292723]'
                      : 'border-transparent text-[#92887D] hover:text-[#292723]'
                  }`}
                >
                  Product details
                </button>


                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`product-tab shrink-0 border-b-2 py-5 text-xs uppercase tracking-[1.6px] transition sm:text-sm ${
                    activeTab === 'reviews'
                      ? 'border-[#292723] font-semibold text-[#292723]'
                      : 'border-transparent text-[#92887D] hover:text-[#292723]'
                  }`}
                >
                  Reviews ({totalReviews})
                </button>

              </div>


              <div key={activeTab} className="product-tab-content py-9 sm:py-12">


                {/* Description Tab */}

                {activeTab === 'description' && (

                  <div className="grid gap-8 md:grid-cols-[1fr_280px] md:gap-16">

                    <ScrollReveal direction="left" duration={700}>

                      <div className="max-w-3xl">

                        <p className="text-[10px] uppercase tracking-[3px] text-[#8C8174] sm:text-xs">
                          The details
                        </p>

                        <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
                          Made to complement your style.
                        </h2>

                        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#756D63] sm:text-[15px]">
                          {product.description}
                        </p>

                      </div>

                    </ScrollReveal>


                    <ScrollReveal direction="right" delay={150} duration={700}>

                      <div className="product-info-card h-fit border border-[#E7E0D6] p-5 sm:p-6">

                        <div className="flex items-center gap-3">

                          <FiPackage className="h-5 w-5 text-[#8C8174]" />

                          <p className="text-sm font-medium">
                            Product information
                          </p>

                        </div>


                        <div className="mt-5 border-t border-[#E7E0D6] pt-4">

                          <p className="text-xs text-[#92887D]">
                            Category
                          </p>

                          <p className="mt-1 text-sm capitalize">
                            {product.category}
                          </p>

                        </div>


                        <div className="mt-4 border-t border-[#E7E0D6] pt-4">

                          <p className="text-xs text-[#92887D]">
                            Availability
                          </p>

                          <p className="mt-1 text-sm">
                            Available to order
                          </p>

                        </div>

                      </div>

                    </ScrollReveal>

                  </div>

                )}


                {/* Reviews Tab */}

                {activeTab === 'reviews' && (

                  <div>

                    <div className="grid gap-5 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8">


                      {/* Rating Summary */}

                      <ScrollReveal direction="left" duration={700}>

                        <div className="rating-summary-card border border-[#E7E0D6] bg-white/60 p-6 sm:p-8">

                          <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">
                            Customer rating
                          </p>

                          <div className="mt-4 flex items-baseline gap-2">

                            <span className="font-serif text-5xl">
                              {averageRating.toFixed(1)}
                            </span>

                            <span className="text-sm text-[#A59B8F]">
                              / 5
                            </span>

                          </div>

                          <div className="mt-3 flex gap-1 text-[#B18A4B]">

                            {[1, 2, 3, 4, 5].map((star) => (

                              <FiStar
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(averageRating)
                                    ? 'fill-current'
                                    : ''
                                }`}
                              />

                            ))}

                          </div>

                          <p className="mt-3 text-xs text-[#898278]">
                            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                          </p>

                        </div>

                      </ScrollReveal>


                      {/* Review Form */}

                      <ScrollReveal direction="right" delay={150} duration={700}>

                        <div className="review-form-card border border-[#E7E0D6] bg-white/60 p-5 sm:p-7">

                          {!showReviewForm ? (

                            <div>

                              <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">
                                Your experience matters
                              </p>

                              <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                                Share your thoughts
                              </h2>

                              <p className="mt-3 max-w-xl text-sm leading-6 text-[#756D63]">
                                Help other customers discover what makes this piece special.
                              </p>

                              <button
                                type="button"
                                onClick={() => setShowReviewForm(true)}
                                className="review-action-btn mt-6 bg-[#292723] px-6 py-3.5 text-xs font-semibold uppercase tracking-[1.5px] text-white transition hover:bg-[#49443D]"
                              >
                                Write a review
                              </button>

                            </div>

                          ) : (

                            <>

                              <div className="flex items-start justify-between gap-4">

                                <div>

                                  <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">
                                    Your experience matters
                                  </p>

                                  <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                                    Write a review
                                  </h2>

                                </div>

                                <button
                                  type="button"
                                  onClick={handleCancelReview}
                                  className="text-xs uppercase tracking-wider text-[#898278] underline underline-offset-4 hover:text-[#292723]"
                                >
                                  Cancel
                                </button>

                              </div>


                              <form onSubmit={handleSubmitReview} className="mt-6">

                                <label className="block text-sm font-medium">
                                  Your rating
                                </label>

                                <div className="mt-3 flex gap-2">

                                  {[1, 2, 3, 4, 5].map((star) => (

                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRating(star)}
                                      aria-label={`Rate ${star} out of 5 stars`}
                                      aria-pressed={rating === star}
                                      className={`review-star text-3xl transition hover:scale-110 ${
                                        star <= rating
                                          ? 'text-[#B18A4B]'
                                          : 'text-[#D8D0C6]'
                                      }`}
                                    >
                                      ★
                                    </button>

                                  ))}

                                </div>


                                <label
                                  htmlFor="reviewComment"
                                  className="mt-6 block text-sm font-medium"
                                >
                                  Your review
                                </label>

                                <textarea
                                  id="reviewComment"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  placeholder="Tell us about your experience with this product..."
                                  rows="4"
                                  maxLength={1000}
                                  required
                                  className="review-textarea mt-3 w-full resize-y border border-[#E0D8CE] bg-[#FFFEFC] px-4 py-3 text-sm outline-none transition placeholder:text-[#B1A79A] focus:border-[#292723]"
                                />

                                <p className="mt-1 text-right text-xs text-[#A59B8F]">
                                  {comment.length}/1000
                                </p>


                                <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                                  <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="review-action-btn bg-[#292723] px-7 py-3.5 text-xs font-semibold uppercase tracking-[1.4px] text-white transition hover:bg-[#49443D] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {submittingReview ? 'Submitting...' : 'Submit review'}
                                  </button>


                                  <button
                                    type="button"
                                    onClick={handleCancelReview}
                                    disabled={submittingReview}
                                    className="review-cancel-btn border border-[#DED5C8] px-7 py-3.5 text-xs font-semibold uppercase tracking-[1.4px] transition hover:bg-[#F0ECE5] disabled:opacity-60"
                                  >
                                    Cancel
                                  </button>

                                </div>

                              </form>

                            </>

                          )}

                        </div>

                      </ScrollReveal>

                    </div>


                    {/* Customer Reviews */}

                    <div className="mt-12">

                      <ScrollReveal direction="up" duration={700}>

                        <div className="flex flex-col gap-2 border-b border-[#E7E0D6] pb-5 sm:flex-row sm:items-end sm:justify-between">

                          <div>

                            <p className="text-[10px] uppercase tracking-[2px] text-[#8C8174]">
                              Customer stories
                            </p>

                            <h2 className="mt-2 font-serif text-2xl sm:text-3xl">
                              What customers say
                            </h2>

                          </div>

                          <p className="text-xs text-[#898278]">
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                          </p>

                        </div>

                      </ScrollReveal>


                      {loadingReviews ? (

                        <p className="py-8 text-sm text-[#898278]">
                          Loading reviews...
                        </p>

                      ) : reviews.length === 0 ? (

                        <ScrollReveal direction="up" duration={700}>

                          <div className="no-reviews py-14 text-center">

                            <FiHeart className="mx-auto h-7 w-7 text-[#B9B0A5]" />

                            <h3 className="mt-4 font-serif text-xl">
                              No reviews yet
                            </h3>

                            <p className="mt-2 text-sm text-[#898278]">
                              Be the first to share your experience with this product.
                            </p>

                          </div>

                        </ScrollReveal>

                      ) : (

                        <div className="divide-y divide-[#E7E0D6]">

                          {reviews.map((review, index) => (

                            <ScrollReveal
                              key={review._id}
                              direction="up"
                              delay={index * 100}
                              duration={650}
                            >

                              <article className="customer-review-card py-6 sm:py-8">

                                <div className="flex items-start gap-4">

                                  <div className="review-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EDE6DC] text-sm font-medium uppercase text-[#5E584F]">

                                    {review.userId?.name?.charAt(0) || 'C'}

                                  </div>


                                  <div className="min-w-0 flex-1">

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                      <div>

                                        <h3 className="break-words text-sm font-semibold">
                                          {review.userId?.name || 'Customer'}
                                        </h3>

                                        <div className="mt-1 flex gap-0.5 text-[#B18A4B]">

                                          {[1, 2, 3, 4, 5].map((star) => (

                                            <FiStar
                                              key={star}
                                              className={`h-3.5 w-3.5 ${
                                                star <= Number(review.rating)
                                                  ? 'fill-current'
                                                  : ''
                                              }`}
                                            />

                                          ))}

                                        </div>

                                      </div>

                                      <p className="text-xs text-[#A59B8F]">

                                        {review.createdAt
                                          ? new Date(review.createdAt).toLocaleDateString()
                                          : ''}

                                      </p>

                                    </div>


                                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#756D63]">

                                      {review.comment}

                                    </p>

                                  </div>

                                </div>

                              </article>

                            </ScrollReveal>

                          ))}

                        </div>

                      )}

                    </div>

                  </div>

                )}

              </div>

            </section>

          </ScrollReveal>

        </div>

      </main>


      <Footer />


      {/* Premium Product Details Animations */}

      <style>{`

        /* Breadcrumb */

        .breadcrumb-link {
          position: relative;
        }

        .breadcrumb-link::after {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 1px;
          background: #292723;
          transition: width 0.3s ease;
        }

        .breadcrumb-link:hover::after {
          width: 100%;
        }


        /* Main Image */

        .product-main-image {
          box-shadow: 0 4px 20px rgba(41, 39, 35, 0.03);
          transition: box-shadow 0.4s ease;
        }

        .product-main-image:hover {
          box-shadow: 0 15px 35px rgba(41, 39, 35, 0.12);
        }

        .product-feature-image {
          animation: productImageEnter 0.6s ease both;
        }

        @keyframes productImageEnter {
          from {
            opacity: 0;
            transform: scale(1.035);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .product-main-image:hover .product-feature-image {
          transform: scale(1.045);
        }


        /* Thumbnail */

        .product-thumbnail {
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .product-thumbnail:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 12px rgba(41, 39, 35, 0.12);
        }

        .product-thumbnail img {
          transition: transform 0.35s ease;
        }

        .product-thumbnail:hover img {
          transform: scale(1.08);
        }


        /* Badges */

        .product-offer-badge {
          animation: badgeEnter 0.6s ease both;
        }

        .product-edit-badge {
          animation: badgeEnter 0.7s ease both;
          animation-delay: 0.12s;
          animation-fill-mode: both;
        }

        @keyframes badgeEnter {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .product-image-count {
          animation: countEnter 0.5s ease both;
        }

        @keyframes countEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* Product Information */

        .product-category {
          animation: productFadeUp 0.7s ease both;
        }

        .product-name {
          animation: productFadeUp 0.8s ease both;
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .product-description {
          animation: productFadeUp 0.8s ease both;
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .product-price-area {
          animation: productFadeUp 0.7s ease both;
          animation-delay: 0.15s;
          animation-fill-mode: both;
        }

        @keyframes productFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* Rating */

        .product-rating {
          transition: transform 0.3s ease;
        }

        .product-rating:hover {
          transform: translateX(3px);
        }

        .product-rating-star {
          transition:
            transform 0.25s ease,
            color 0.25s ease;
        }

        .product-rating:hover .product-rating-star {
          transform: scale(1.12);
        }


        /* Save Badge */

        .product-save-badge {
          transition:
            transform 0.3s ease,
            background 0.3s ease;
        }

        .product-save-badge:hover {
          transform: scale(1.06);
          background: #DDE9D9;
        }


        /* Benefits */

        .product-benefit {
          transition:
            transform 0.3s ease,
            color 0.3s ease;
        }

        .product-benefit:hover {
          transform: translateX(5px);
        }

        .product-benefit > span {
          transition:
            background 0.3s ease,
            transform 0.3s ease;
        }

        .product-benefit:hover > span {
          background: #E6DED2;
          transform: scale(1.08);
        }


        /* Add To Bag */

        .product-add-button {
          position: relative;
          overflow: hidden;
          transition:
            background 0.3s ease,
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .product-add-button::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            110deg,
            transparent,
            rgba(255,255,255,0.22),
            transparent
          );
          transform: skewX(-20deg);
          transition: left 0.7s ease;
        }

        .product-add-button:hover::before {
          left: 150%;
        }

        .product-add-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 9px 22px rgba(41, 39, 35, 0.2);
        }

        .product-add-button:active {
          transform: scale(0.98);
        }

        .product-add-button svg {
          transition: transform 0.3s ease;
        }

        .product-add-button:hover svg {
          transform: translateY(-2px) rotate(-5deg);
        }


        /* Related Products */

        .related-product-card {
          transition: transform 0.35s ease;
        }

        .related-product-card:hover {
          transform: translateY(-6px);
        }

        .related-product-image {
          transition: box-shadow 0.35s ease;
        }

        .related-product-card:hover .related-product-image {
          box-shadow: 0 10px 24px rgba(41, 39, 35, 0.12);
        }

        .related-product-image img {
          transition: transform 0.6s ease;
        }

        .related-product-card:hover .related-product-image img {
          transform: scale(1.08);
        }

        .related-product-title {
          transition: color 0.3s ease;
        }

        .related-product-card:hover .related-product-title {
          color: #927858;
        }


        /* Tabs */

        .product-tab {
          position: relative;
          transition:
            color 0.3s ease,
            border-color 0.3s ease;
        }

        .product-tab:hover {
          transform: translateY(-1px);
        }

        .product-tab-content {
          animation: tabContentEnter 0.45s ease both;
        }

        @keyframes tabContentEnter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* Product Info Card */

        .product-info-card {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .product-info-card:hover {
          transform: translateY(-4px);
          border-color: #C8BBA9;
          box-shadow: 0 10px 25px rgba(41, 39, 35, 0.07);
        }


        /* Rating Summary */

        .rating-summary-card {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease;
        }

        .rating-summary-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(41, 39, 35, 0.07);
        }


        /* Review Form */

        .review-form-card {
          transition:
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .review-form-card:hover {
          border-color: #D4C8B8;
          box-shadow: 0 8px 25px rgba(41, 39, 35, 0.05);
        }

        .review-action-btn {
          position: relative;
          overflow: hidden;
          transition:
            transform 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .review-action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 17px rgba(41, 39, 35, 0.16);
        }

        .review-action-btn:active {
          transform: scale(0.97);
        }

        .review-cancel-btn {
          transition:
            transform 0.3s ease,
            background 0.3s ease;
        }

        .review-cancel-btn:hover {
          transform: translateY(-2px);
        }


        /* Review Stars */

        .review-star {
          transition:
            transform 0.25s ease,
            color 0.25s ease;
        }

        .review-star:hover {
          transform: scale(1.2) rotate(-8deg);
        }

        .review-textarea {
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .review-textarea:focus {
          box-shadow: 0 0 0 3px rgba(41, 39, 35, 0.07);
        }


        /* Customer Reviews */

        .customer-review-card {
          transition: padding-left 0.3s ease;
        }

        .customer-review-card:hover {
          padding-left: 8px;
        }

        .review-avatar {
          transition:
            transform 0.3s ease,
            background 0.3s ease;
        }

        .customer-review-card:hover .review-avatar {
          transform: scale(1.08);
          background: #E5DCCF;
        }


        /* No Reviews */

        .no-reviews svg {
          animation: emptyReviewFloat 2.5s ease-in-out infinite;
        }

        @keyframes emptyReviewFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }


        /* Reduced Motion */

        @media (prefers-reduced-motion: reduce) {

          .product-details-page,
          .product-name,
          .product-description,
          .product-category,
          .product-price-area,
          .product-tab-content,
          .no-reviews,
          .no-reviews svg,
          .product-feature-image {
            animation: none !important;
          }

          .product-thumbnail,
          .product-benefit,
          .product-add-button,
          .related-product-card,
          .review-action-btn {
            transition: none !important;
          }

        }

      `}</style>

    </div>

  )

}

export default ProductDetails