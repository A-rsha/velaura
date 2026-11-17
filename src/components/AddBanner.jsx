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
    <section className="bg-[#F5F0E8] px-3 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-9 animate-banner-section">

      <div className="mx-auto max-w-[1400px]">

        {/* Banner slider */}
        <div className="group relative overflow-hidden rounded-xl bg-[#E8DED0] shadow-sm transition-shadow duration-500 hover:shadow-xl sm:rounded-2xl lg:rounded-3xl">

          {/* Banner image */}
          <div className="relative h-[220px] w-full overflow-hidden sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[520px]">

            <img
              key={activeSlide.id}
              src={activeSlide.image}
              alt={`Velaura collection banner ${currentIndex + 1}`}
              className="h-full w-full object-contain object-center transition-opacity duration-700 sm:object-cover animate-banner-image"
              onError={(event) => {
                event.currentTarget.src = velauraAdd
              }}
            />

            {/* Subtle image overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5 transition-all duration-500 group-hover:from-black/15" />

          </div>

          {/* Previous and Next buttons */}
          {slides.length > 1 && (
            <>
              {/* Previous button */}
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#2B2926] shadow-md opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg active:scale-90 sm:left-5 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-x-1"
              >
                <FiChevronLeft
                  size={22}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </button>

              {/* Next button */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[#2B2926] shadow-md opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-lg active:scale-90 sm:right-5 sm:h-11 sm:w-11 md:opacity-0 md:group-hover:opacity-100 md:group-hover:-translate-x-1"
              >
                <FiChevronRight
                  size={22}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </>
          )}

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:bg-black/30 sm:bottom-5">

              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                  aria-current={currentIndex === index ? 'true' : undefined}
                  className={`h-2 rounded-full transition-all duration-500 ease-in-out hover:scale-110 ${
                    currentIndex === index
                      ? 'w-7 bg-white shadow-sm'
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}

            </div>
          )}

          {/* Slide count */}
          {slides.length > 1 && (
            <div
              key={currentIndex}
              className="absolute right-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-[#2B2926] shadow-sm backdrop-blur-sm animate-banner-count sm:right-5 sm:top-5"
            >
              {currentIndex + 1} / {slides.length}
            </div>
          )}

        </div>
      </div>

      {/* Banner animations */}
      <style>{`
        @keyframes bannerSectionEntrance {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bannerImageEntrance {
          from {
            opacity: 0;
            transform: scale(1.04);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bannerCountEntrance {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-banner-section {
          animation: bannerSectionEntrance 0.8s ease-out both;
        }

        .animate-banner-image {
          animation: bannerImageEntrance 0.9s ease-out both;
        }

        .animate-banner-count {
          animation: bannerCountEntrance 0.4s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-banner-section,
          .animate-banner-image,
          .animate-banner-count {
            animation: none !important;
          }
        }
      `}</style>

    </section>
  )
}

export default AddBanner