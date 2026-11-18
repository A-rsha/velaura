import React from 'react'
import shopBanner from '../assets/shopimg.png'
import ScrollReveal from './ScrollReveal'

function ShopBanner() {
  return (

    <ScrollReveal
      direction="up"
      duration={800}
      once={false}
    >

      <section
        className="
          relative
          mx-4 sm:mx-6 md:mx-10 lg:mx-16
          mt-4 sm:mt-6
          h-[280px]
          sm:h-[360px]
          md:h-[450px]
          lg:h-[520px]
          overflow-hidden
          shop-banner
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
            src={shopBanner}
            alt="Velaura Collection"
            className="
              h-full
              w-full
              object-cover
              object-center
              shop-banner-image
            "
          />

        </ScrollReveal>

        {/* Soft Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-black/10
            transition-colors
            duration-700
            hover:bg-black/[0.07]
          "
        ></div>

        {/* Banner Content */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-center
            px-6
          "
        >

        </div>

        {/* Shop Banner Animations */}

        <style>{`

          .shop-banner-image {
            transition: transform 1s ease;
          }

          .shop-banner:hover .shop-banner-image {
            transform: scale(1.025);
          }

          @media (prefers-reduced-motion: reduce) {

            .shop-banner-image {
              transition: none !important;
            }

          }

        `}</style>

      </section>

    </ScrollReveal>

  )
}

export default ShopBanner