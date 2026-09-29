import React from 'react'
import shopBanner from '../assets/shopBanner.jpeg'

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
        "
      />

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>


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

    </section>
  )
}

export default ShopBanner