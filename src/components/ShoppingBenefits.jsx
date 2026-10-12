import React from 'react'
import { FiTruck, FiShield, FiGift, FiRefreshCw } from 'react-icons/fi'

function ShoppingBenefits() {
const benefits = [
{
icon: <FiTruck />,
title: 'Free Shipping',
description: 'On eligible orders',
},
{
icon: <FiShield />,
title: 'Secure Checkout',
description: 'Safe payment experience',
},
{
icon: <FiGift />,
title: 'Thoughtful Gifting',
description: 'Gifts for every occasion',
},
{
icon: <FiRefreshCw />,
title: 'Easy Returns',
description: 'Shop with confidence',
},
]

return ( <section className="border-y border-[#E8DFD3] bg-[#F5F0E8] px-4 py-8 sm:px-6 sm:py-10 lg:px-8"> <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6">
{benefits.map((benefit, index) => ( <div
         key={index}
         className="flex items-center justify-center gap-3 text-center md:justify-start"
       > <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D9C8B2] bg-white text-xl text-[#9A7958]">
{benefit.icon} </div>


        <div className="text-left">
          <h3 className="text-sm font-semibold text-[#2B2926] sm:text-base">
            {benefit.title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-[#77716A] sm:text-sm">
            {benefit.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</section>


)
}

export default ShoppingBenefits
