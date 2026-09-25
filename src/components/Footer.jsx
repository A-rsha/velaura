
import React from 'react'

function Footer() {
  return (
    <footer className="bg-orange-100 text-black px-5 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12 mt-9">

      {/* Footer Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

        {/* Brand */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">
            VELAURA. Accessories
          </h1>
        </div>


        {/* Shop */}
        <div className="text-base sm:text-lg font-semibold text-gray-900">
          <h1 className="mb-3">
            SHOP
          </h1>

          <p>Jewelry</p>
          <p>Watches</p>
          <p>Bags</p>
          <p>Sunglasses</p>
          <p>Wallets</p>
          <p>Hair Accessories</p>
          <p>Beauty Accessories</p>
        </div>


        {/* Quick Links */}
        <div className="text-base sm:text-lg font-semibold text-gray-900">
          <h1 className="mb-3">
            QUICK LINKS
          </h1>

          <p>Home</p>
          <p>Shop</p>
          <p>About</p>
          <p>Wishlist</p>
          <p>Cart</p>
        </div>


        {/* Help */}
        <div className="text-base sm:text-lg font-semibold text-gray-900">
          <h1 className="mb-3">
            HELP
          </h1>

          <p>Contact</p>
          <p>FAQ</p>
          <p>Shipping</p>
          <p>Returns</p>
        </div>

      </div>


      {/* Copyright */}
      <div className="border-t border-orange-200 mt-8 pt-5">
        <h2 className="text-center text-sm sm:text-base">
          © 2026 VELAURA. All rights reserved.
        </h2>
      </div>

    </footer>
  )
}

export default Footer

