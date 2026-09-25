
import React from 'react'
import bannerImg from '../assets/banner.jpg'
import { useNavigate } from 'react-router-dom'

function Banner() {

  const navigate = useNavigate()

  return (
    <section className="relative mx-3 sm:mx-5 md:mx-7 lg:mx-10 mt-4 sm:mt-6
                        h-[420px] sm:h-[480px] md:h-[550px] lg:h-[600px]
                        overflow-hidden rounded-xl sm:rounded-2xl">

      
      <img
        src={bannerImg}
        alt="Velaura Accessories"
        className="h-full w-full object-cover"
      />

    
      <div className="absolute inset-0 bg-black/30"></div>


     
      <div className="absolute inset-0 flex items-center justify-center
                      px-4 sm:px-6 text-center text-white">

        <div className="max-w-2xl">

          
          <p className="mb-2 sm:mb-3
                        text-xs sm:text-sm
                        uppercase tracking-[2px] sm:tracking-[3px]">
            Velaura Accessories
          </p>


       
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                         font-bold leading-tight">
            Elevate Your Style
          </h1>


         
          <p className="mt-3 sm:mt-4
                        text-sm sm:text-base md:text-lg
                        leading-relaxed">
            Discover accessories made to define you.
          </p>


          
          <button
            className="mt-5 sm:mt-6
                       rounded-full
                       bg-white
                       px-5 sm:px-7
                       py-2.5 sm:py-3
                       text-sm sm:text-base
                       font-medium text-black
                       transition hover:bg-gray-100"
            onClick={() => navigate('/shop')}
          >
            Shop Now
          </button>

        </div>

      </div>

    </section>
  )
}

export default Banner

