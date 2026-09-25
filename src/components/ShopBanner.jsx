import React from 'react'
import shopBanner from '../assets/shopBanner.jpeg'

function ShopBanner() {
  return (
<section
  className="
    relative 
    mx-3 sm:mx-5 md:mx-7 lg:mx-10
    mt-4 sm:mt-6
    h-[300px] sm:h-[380px] md:h-[500px] lg:h-[600px]
    overflow-hidden 
    rounded-xl sm:rounded-2xl
  "
>
        <img src={shopBanner} alt="jwelrysimg" className='object-cover w-full' />
    </section>
  )
}

export default ShopBanner