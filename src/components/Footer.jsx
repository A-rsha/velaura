import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#F5F0E8] text-[#2B2926] px-6 sm:px-10 md:px-14 lg:px-20 py-12 sm:py-14 mt-12">

      {/* Footer Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12">

        {/* Brand */}
        <div>
          <h1 className=" font-serif text-2xl sm:text-3xl font-medium tracking-wide">
            VELAURA
          </h1>

          <p className="mt-1 text-[9px] tracking-[3px] text-gray-600">
            ACCESSORIES
          </p>

          <p className="mt-5 max-w-[240px] text-sm leading-relaxed text-gray-600">
            Thoughtfully chosen accessories to complete your everyday style.
          </p>
        </div>


        {/* Shop */}
        <div>
          <h2 className="mb-5 text-xs tracking-[2px] font-medium">
            SHOP
          </h2>

          <div className="space-y-2.5 text-sm text-gray-600">
            <p>Jewelry</p>
            <p>Watches</p>
            <p>Bags</p>
            <p>Sunglasses</p>
            <p>Wallets</p>
            <p>Hair Accessories</p>
            <p>Beauty Accessories</p>
          </div>
        </div>


        {/* Quick Links */}
        <div>
          <h2 className="mb-5 text-xs tracking-[2px] font-medium">
            QUICK LINKS
          </h2>

          <div className="space-y-2.5 text-sm text-gray-600">
            <p>Home</p>
            <p>Shop</p>
            <p>About</p>
            <p>Wishlist</p>
            <p>Cart</p>
          </div>
        </div>


        
        <div>
          <h2 className="mb-5 text-xs tracking-[2px] font-medium">
            HELP
          </h2>

          <div className="space-y-2.5 text-sm text-gray-600">
            <p>Contact</p>
            <p>FAQ</p>
            <p>Shipping</p>
            <p>Returns</p>
          </div>
        </div>

      </div>


      
      <div className="border-t border-[#DCCFBE] mt-10 pt-6">
        <p className="text-center text-xs sm:text-sm text-gray-500">
          © 2026 VELAURA. All rights reserved.
        </p>
      </div>

    </footer>
  )
}

export default Footer