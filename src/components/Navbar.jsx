
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar({ cartCount }) {

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="px-4 sm:px-6 md:px-8 lg:px-10 py-4">

      <div className="flex items-center justify-between">

       
        <div className="text-lg sm:text-xl md:text-2xl font-bold">
          <Link to="/">
            VELAURA.
          </Link>
        </div>


      
        <div className="hidden md:flex items-center gap-4 lg:gap-7 text-sm lg:text-base">

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/cart" className="flex items-center">
            Cart

            {cartCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {cartCount}
              </span>
            )}
          </Link>

        </div>


        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-sm lg:text-base">

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/login">
            Login
          </Link>

        </div>


        
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>


     
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 pt-5 text-sm">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>

          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center"
          >
            Cart

            {cartCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
          >
            Wishlist
          </Link>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

        </div>
      )}

    </nav>
  )
}

export default Navbar
