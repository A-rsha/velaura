import React, { useState } from 'react'
import {
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi'

import { Link, NavLink } from 'react-router-dom'


function Navbar({ cartCount }) {

  const [menuOpen, setMenuOpen] = useState(false)

  const userName = localStorage.getItem("userName")


  // Get first 2 letters from user's name
  const userInitials = userName
    ? userName
        .trim()
        .slice(0, 2)
        .toUpperCase()
    : ""


  // Common navigation style
  const navClass = ({ isActive }) =>
    `
      relative
      pb-1
      text-sm
      font-medium
      transition
      duration-300
      hover:text-gray-500
      ${
        isActive
          ? "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[1px] after:bg-[#2B2926]"
          : ""
      }
    `


  return (

    <nav
      className="
        sticky
        top-0
        z-50
        border-b
        border-[#E5DED4]
        bg-[#F5F0E8]/95
        backdrop-blur-sm
      "
    >

      <div
        className="
          mx-auto
          flex
          h-[68px]
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-10
        "
      >

        {/* ================= MOBILE MENU BUTTON ================= */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            flex
            items-center
            justify-center
            text-[#2B2926]
            md:hidden
          "
          aria-label="Toggle menu"
        >

          {menuOpen ? (
            <FiX size={22} strokeWidth={1.5} />
          ) : (
            <FiMenu size={22} strokeWidth={1.5} />
          )}

        </button>


        {/* ================= LOGO ================= */}

        <div
          className="
            md:absolute
            md:left-1/2
            md:-translate-x-1/2
          "
        >

          <Link
            to="/"
            className="
              flex
              flex-col
              items-center
              leading-none
            "
          >

            <span
              className="
                font-serif
                text-xl
                font-medium
                tracking-[3px]
                text-[#2B2926]
                sm:text-2xl
              "
            >
              VELAURA
            </span>

            <span
              className="
                mt-1
                text-[7px]
                font-normal
                tracking-[3px]
                text-[#2B2926]
                sm:text-[8px]
              "
            >
              ACCESSORIES
            </span>

          </Link>

        </div>


        {/* ================= DESKTOP NAVIGATION ================= */}

        <div
          className="
            hidden
            items-center
            gap-6
            text-[#2B2926]
            md:flex
            lg:gap-8
          "
        >

          <NavLink
            to="/"
            className={navClass}
          >
            Home
          </NavLink>


          <NavLink
            to="/shop"
            className={navClass}
          >
            Shop
          </NavLink>


          <NavLink
            to="/about"
            className={navClass}
          >
            About
          </NavLink>


          {/* My Orders */}

          <NavLink
            to="/myOrder"
            className={navClass}
          >
            My Orders
          </NavLink>

        </div>


        {/* ================= DESKTOP ICONS ================= */}

        <div
          className="
            hidden
            items-center
            gap-5
            text-[#2B2926]
            md:flex
          "
        >

          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="
              transition
              duration-300
              hover:opacity-50
            "
            aria-label="Wishlist"
          >

            <FiHeart
              size={19}
              strokeWidth={1.4}
            />

          </Link>


          {/* Cart */}

          <Link
            to="/cart"
            className="
              relative
              transition
              duration-300
              hover:opacity-50
            "
            aria-label="Cart"
          >

            <FiShoppingBag
              size={19}
              strokeWidth={1.4}
            />

            {cartCount > 0 && (

              <span
                className="
                  absolute
                  -right-2.5
                  -top-2.5
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2B2926]
                  px-1
                  text-[9px]
                  font-medium
                  text-white
                "
              >
                {cartCount}
              </span>

            )}

          </Link>


          {/* Account / User Initials */}

          <Link
            to="/login"
            className="
              flex
              items-center
              justify-center
              transition
              duration-300
              hover:opacity-70
            "
            aria-label="Account"
          >

            {userName ? (

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#2B2926]
                  bg-[#E8DFD2]
                  text-[11px]
                  font-medium
                  tracking-wide
                  text-[#2B2926]
                "
              >
                {userInitials}
              </span>

            ) : (

              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#2B2926]
                "
              >
                <span className="text-xs">
                  <FiUser/>
                </span>
              </span>

            )}

          </Link>

        </div>


        {/* ================= MOBILE RIGHT ICONS ================= */}

        <div
          className="
            flex
            items-center
            gap-3
            text-[#2B2926]
            sm:gap-4
            md:hidden
          "
        >

          {/* Wishlist */}

          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative"
          >

            <FiHeart
              size={19}
              strokeWidth={1.4}
            />

          </Link>


          {/* Cart */}

          <Link
            to="/cart"
            aria-label="Cart"
            className="relative"
          >

            <FiShoppingBag
              size={19}
              strokeWidth={1.4}
            />

            {cartCount > 0 && (

              <span
                className="
                  absolute
                  -right-2
                  -top-2
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-[#2B2926]
                  px-1
                  text-[9px]
                  text-white
                "
              >
                {cartCount}
              </span>

            )}

          </Link>

        </div>

      </div>


      {/* ================= MOBILE MENU ================= */}

      {menuOpen && (

        <div
          className="
            border-t
            border-[#E5DED4]
            bg-[#F5F0E8]
            px-5
            py-6
            md:hidden
          "
        >

          <div
            className="
              flex
              flex-col
              items-center
              gap-5
              text-sm
              text-[#2B2926]
            "
          >

            {/* User */}

            {userName && (

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="
                  mb-1
                  flex
                  items-center
                  gap-3
                "
              >

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#2B2926]
                    bg-[#E8DFD2]
                    text-[11px]
                    font-medium
                    tracking-wide
                  "
                >
                  {userInitials}
                </span>

                <span className="text-sm">
                  {userName}
                </span>

              </Link>

            )}


            {/* Home */}

            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Home
            </NavLink>


            {/* Shop */}

            <NavLink
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Shop
            </NavLink>


            {/* About */}

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              About
            </NavLink>


            {/* My Orders */}

            <NavLink
              to="/myOrder"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              My Orders
            </NavLink>


            {/* Wishlist */}

            <NavLink
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Wishlist
            </NavLink>


            {/* Cart */}

            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className={navClass}
            >
              Cart
            </NavLink>


            {/* Login only when user is not logged in */}

            {!userName && (

              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                Login
              </NavLink>

            )}

          </div>

        </div>

      )}

    </nav>

  )
}


export default Navbar