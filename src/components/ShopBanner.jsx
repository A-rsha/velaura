import React from 'react'
import shopBanner from '../assets/shopimg.png'

function ShopBanner() {
  return (
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
        animate-shop-banner
      "
    >

      {/* Banner Image */}
      <img
        src={shopBanner}
        alt="Velaura Collection"
        className="
          h-full
          w-full
          object-cover
          object-center
          animate-shop-image
        "
      />

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-black/10 transition-colors duration-700 hover:bg-black/[0.07]"></div>

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

        @keyframes shopBannerEntrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shopImageEntrance {
          from {
            opacity: 0.7;
            transform: scale(1.06);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-shop-banner {
          animation: shopBannerEntrance 0.8s ease-out both;
        }

        .animate-shop-image {
          animation: shopImageEntrance 1.3s ease-out both;
          transition: transform 1s ease;
        }

        .animate-shop-banner:hover .animate-shop-image {
          transform: scale(1.025);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-shop-banner,
          .animate-shop-image {
            animation: none !important;
            transition: none !important;
          }
        }

      `}</style>

    </section>
  )
}

export default ShopBanner