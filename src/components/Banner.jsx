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

      {/* Background Image */}

      <img
        src={banner1}
        alt="Velaura Accessories"
        className="
          h-full
          w-full
          object-cover
          object-center
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
              transition
              duration-300
              hover:bg-black
            "
          >
            Shop Now
            <FiArrowRight size={15} />
          </button>


        </div>

      </div>



    </section>
  )
}

export default Banner