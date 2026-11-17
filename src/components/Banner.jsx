import React from 'react'
import banner1 from '../assets/HeroImg.png'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

function Banner() {

  const navigate = useNavigate()

  return (

    <section
      className="
        relative
        h-[430px]
        sm:h-[480px]
        md:h-[520px]
        lg:h-[560px]
        overflow-hidden
      "
    >

      <style>{`
        @keyframes bannerZoom {
          from {
            transform: scale(1.08);
            opacity: 0.8;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bannerFadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .banner-image-animation {
          animation: bannerZoom 1.4s ease-out both;
        }

        .banner-label-animation {
          animation: bannerFadeUp 0.8s ease-out 0.2s both;
        }

        .banner-heading-animation {
          animation: bannerFadeUp 0.9s ease-out 0.4s both;
        }

        .banner-description-animation {
          animation: bannerFadeUp 0.9s ease-out 0.6s both;
        }

        .banner-button-animation {
          animation: bannerFadeUp 0.9s ease-out 0.8s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-image-animation,
          .banner-label-animation,
          .banner-heading-animation,
          .banner-description-animation,
          .banner-button-animation {
            animation: none;
          }
        }
      `}</style>

      {/* Banner Image */}

      <img
        src={banner1}
        alt="Velaura Accessories"
        className="
          h-full
          w-full
          object-cover
          object-center
          banner-image-animation
        "
      />

      {/* Soft Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-white/15
        "
      ></div>

      {/* Content */}

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          px-6
          sm:px-10
          md:px-14
          lg:px-20
        "
      >

        <div className="max-w-xl">

          {/* Small Label */}

          <p
            className="
              mb-3
              text-[10px]
              sm:text-xs
              uppercase
              tracking-[3px]
              text-black/70
              banner-label-animation
            "
          >
            TIMELESS ACCESSORIES
          </p>

          {/* Main Heading */}

          <h1
            className="
              font-serif
              text-4xl
              sm:text-5xl
              md:text-5xl
              lg:text-6xl
              font-medium
              leading-[1.05]
              tracking-tight
              text-black
              banner-heading-animation
            "
          >
            Small Details.
            <br />
            Big Impact.
          </h1>

          {/* Description */}

          <p
            className="
              mt-5
              max-w-[320px]
              sm:max-w-[350px]
              text-sm
              sm:text-base
              leading-relaxed
              text-black/75
              banner-description-animation
            "
          >
            Discover accessories that complete your look
            and tell your story.
          </p>

          {/* Button */}

          <button
            onClick={() => navigate('/shop')}
            className="
              mt-6
              flex
              items-center
              gap-2
              bg-[#2B2926]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition-all
              duration-300
              ease-out
              hover:bg-black
              hover:-translate-y-1
              hover:shadow-lg
              active:scale-95
              banner-button-animation
              group
            "
          >
            Shop Now

            <FiArrowRight
              size={15}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />

          </button>

        </div>

      </div>

    </section>
  )
}

export default Banner