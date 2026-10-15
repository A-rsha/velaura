import React, { useEffect, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import velauraAdd from '../assets/Addbanner.png'
import API from '../services/axios'

function AddBanner() {
  const [ads, setAds] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch banners uploaded by admin
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await API.get('/ads/getAds')

        const banners =
          response.data.ads ||
          response.data.data ||
          response.data.message ||
          []

        setAds(Array.isArray(banners) ? banners : [])
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  
  const slides = ads.length > 0
    ? ads.map((ad) => ({
        id: ad._id,
        image: ad.image,
      }))
    : [{ id: 'default-banner', image: velauraAdd }]

  // Automatically change banner
  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        (previousIndex + 1) % slides.length
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [slides.length])

  // Previous banner
  const previousSlide = () => {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0
        ? slides.length - 1
        : previousIndex - 1
    )
  }

  // Next banner
  const nextSlide = () => {
    setCurrentIndex((previousIndex) =>
      (previousIndex + 1) % slides.length
    )
  }

  // Reset index if number of banners changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [ads.length])

  const activeSlide = slides[currentIndex] || slides[0]

  return (
    <section className="bg-[#F5F0E8] px-3 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9">
      <div className="mx-auto max-w-[1400px]">

        {/* Banner slider */}
        <div className="group relative overflow-hidden rounded-xl bg-[#E8DED0] shadow-sm sm:rounded-2xl lg:rounded-3xl">

          {/* Banner image */}
          <div className="relative h-[220px] w-full sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px]">

           <img
  key={activeSlide.id}
  src={activeSlide.image}
  alt={`Velaura collection banner ${currentIndex + 1}`}
  className="h-full w-full object-contain sm:object-cover object-center transition-opacity duration-700"
  onError={(event) => {
    event.currentTarget.src = velauraAdd
  }}
/>

            {/* Subtle image overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5" />
          </div>

          {/* Previous button */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#2B2926] shadow-md transition hover:bg-white sm:left-5 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100"
              >
                <FiChevronLeft size={22} />
              </button>

              {/* Next button */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#2B2926] shadow-md transition hover:bg-white sm:right-5 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100"
              >
                <FiChevronRight size={22} />
              </button>
            </>
          )}

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm sm:bottom-5">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  aria-current={currentIndex === index ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Slide count */}
          {slides.length > 1 && (
            <div className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-[#2B2926] backdrop-blur-sm sm:right-5 sm:top-5">
              {currentIndex + 1} / {slides.length}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

export default AddBanner