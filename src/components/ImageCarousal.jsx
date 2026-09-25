
import React, { useState } from 'react'
import images1 from '../assets/img1.jpeg'
import images2 from '../assets/img2.jpeg'
import images3 from '../assets/img3.jpeg'

function ImageCarousal() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = [
    images1,
    images2,
    images3
  ]

  return (
    <div className="relative mx-5 mt-6 h-[700px] overflow-hidden rounded-2xl">

      <img
        src={images[currentIndex]}
        alt="VELAURA accessories"
        className="w-full object-fit rounded-xl"
      />

      <button
        onClick={() =>
          setCurrentIndex((currentIndex - 1 + images.length) % images.length)
        }
        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-orange-200 px-5 py-3 text-black hover:bg-orange-300"
      >
        →
      </button>

    </div>
  )
}

export default ImageCarousal
