
import React from 'react'
import velauraAdd from '../assets/Addbanner.png'

function AddBanner() {
  return (
    <section className="bg-[#F5F0E8] px-3 py-5 sm:px-5 sm:py-7 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-xl sm:rounded-2xl">
          <img
            src={velauraAdd}
            alt="Velaura fashion jewellery and accessories collection"
            className="block h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default AddBanner



