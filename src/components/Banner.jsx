import React from 'react'
import banner1 from '../assets/HeroImg.png'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import ScrollReveal from './ScrollReveal'

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

      {/* Banner Image - Zoom Reveal */}

      <ScrollReveal
        direction="zoom"
        duration={1200}
        once={false}
        className="absolute inset-0 h-full w-full"
      >

        <img
          src={banner1}
          alt="Velaura Accessories"
          className="
            h-full
            w-full
            object-cover
            object-center
            banner-image
          "
        />

      </ScrollReveal>

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

          {/* Small Label - Slide Down */}

          <ScrollReveal
            direction="down"
            delay={150}
            duration={700}
            once={false}
          >

            <p
              className="
                mb-3
                text-[10px]
                sm:text-xs
                uppercase
                tracking-[3px]
                text-black/70
              "
            >
              TIMELESS ACCESSORIES
            </p>

          </ScrollReveal>

          {/* Main Heading - Slide Up */}

          <ScrollReveal
            direction="up"
            delay={300}
            duration={850}
            once={false}
          >

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
              "
            >
              Small Details.
              <br />
              Big Impact.
            </h1>

          </ScrollReveal>

          {/* Description - Fade Reveal */}

          <ScrollReveal
            direction="fade"
            delay={450}
            duration={900}
            once={false}
          >

            <p
              className="
                mt-5
                max-w-[320px]
                sm:max-w-[350px]
                text-sm
                sm:text-base
                leading-relaxed
                text-black/75
              "
            >
              Discover accessories that complete your look
              and tell your story.
            </p>

          </ScrollReveal>

          {/* Button - Slide Up */}

          <ScrollReveal
            direction="up"
            delay={600}
            duration={800}
            once={false}
          >

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

          </ScrollReveal>

        </div>

      </div>

      {/* Additional Image Hover Animation */}

      <style>{`

        .banner-image {
          transition: transform 1.2s ease;
        }

        section:hover .banner-image {
          transform: scale(1.025);
        }

        @media (prefers-reduced-motion: reduce) {

          .banner-image {
            transition: none !important;
          }

        }

      `}</style>

    </section>
  )
}

export default Banner