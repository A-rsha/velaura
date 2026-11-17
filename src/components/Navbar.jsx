import React, { useEffect, useState } from 'react'
import {
  FiHeart,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiPackage
} from 'react-icons/fi'

import { Link, NavLink, useNavigate } from 'react-router-dom'
import API from '../services/axios'

function Navbar({ cartCount }) {

  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profile, setProfile] = useState(null)

  const navigate = useNavigate()

  const role = localStorage.getItem("role")

  const userName =
    role === "user"
      ? localStorage.getItem("userName")
      : null

  const userInitials = userName
    ? userName.trim().slice(0, 2).toUpperCase()
    : ""

  useEffect(() => {
    const getProfile = async () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")

      if (!token || role !== "user") {
        setProfile(null)
        return
      }

      try {
        const res = await API.get("/auth/profile")
        setProfile(res.data.user)
      } catch (error) {
        console.error(
          "Profile error:",
          error.response?.data || error.message
        )
      }
    }

    getProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("role")

    setProfileOpen(false)
    setMenuOpen(false)

    navigate("/")
    window.location.reload()
  }

  const navClass = ({ isActive }) =>
    `
      relative
      pb-1
      text-sm
      font-medium
      transition-all
      duration-300
      hover:text-gray-500
      after:absolute
      after:left-0
      after:right-0
      after:-bottom-0.5
      after:h-[1px]
      after:bg-[#2B2926]
      after:origin-left
      after:transition-transform
      after:duration-300
      ${
        isActive
          ? "after:scale-x-100"
          : "after:scale-x-0 hover:after:scale-x-100"
      }
    `

  const iconHover =
    "transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 hover:opacity-60 active:scale-95"

  const menuItemHover =
    "transition-all duration-300 ease-out hover:translate-x-1 hover:opacity-60 active:scale-[0.98]"

  return (
    <>

      {/* Animation styles */}

      <style>{`
        @keyframes navbarFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes menuSlideDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOverlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes profileSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cartPop {
          0% {
            transform: scale(0);
          }
          70% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes profileInfoIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .navbar-entrance {
          animation: navbarFadeIn 0.5s ease-out both;
        }

        .mobile-menu-animation {
          animation: menuSlideDown 0.3s ease-out both;
          transform-origin: top;
        }

        .profile-overlay-animation {
          animation: fadeOverlay 0.25s ease-out both;
        }

        .profile-sidebar-animation {
          animation: profileSlideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .cart-count-animation {
          animation: cartPop 0.3s ease-out both;
        }

        .profile-info-animation {
          animation: profileInfoIn 0.4s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar-entrance,
          .mobile-menu-animation,
          .profile-overlay-animation,
          .profile-sidebar-animation,
          .cart-count-animation,
          .profile-info-animation {
            animation: none;
          }
        }
      `}</style>

      {/* NAVBAR */}

      <nav
        className="
          sticky
          top-0
          z-50
          border-b
          border-[#E5DED4]
          bg-[#F5F0E8]/95
          backdrop-blur-sm
          navbar-entrance
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

          {/* Mobile menu button */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              flex
              items-center
              justify-center
              text-[#2B2926]
              transition-all
              duration-300
              hover:scale-110
              active:scale-90
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

          {/* Logo */}

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
                transition-transform
                duration-300
                hover:scale-[1.04]
              "
            >

              <span
                className="
                  font-serif
                  text-xl
                  font-medium
                  tracking-[3px]
                  text-[#2B2926]
                  transition-all
                  duration-300
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
                  transition-all
                  duration-300
                  group-hover:tracking-[4px]
                  sm:text-[8px]
                "
              >
                ACCESSORIES
              </span>

            </Link>

          </div>

          {/* Desktop navigation */}

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

            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/shop" className={navClass}>
              Shop
            </NavLink>

            <NavLink to="/about" className={navClass}>
              About
            </NavLink>

            <NavLink to="/myOrder" className={navClass}>
              My Orders
            </NavLink>

          </div>

          {/* Desktop icons */}

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
              className={iconHover}
              aria-label="Wishlist"
            >
              <FiHeart size={19} strokeWidth={1.4} />
            </Link>

            {/* Cart */}

            <Link
              to="/cart"
              className={`
                relative
                ${iconHover}
              `}
              aria-label="Cart"
            >

              <FiShoppingBag size={19} strokeWidth={1.4} />

              {cartCount > 0 && (
                <span
                  key={cartCount}
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
                    cart-count-animation
                  "
                >
                  {cartCount}
                </span>
              )}

            </Link>

            {/* Account */}

            <button
              onClick={() => {
                if (userName) {
                  setProfileOpen(true)
                } else {
                  navigate("/login")
                }
              }}
              className="
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:scale-110
                hover:opacity-70
                active:scale-95
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
                    transition-all
                    duration-300
                    hover:rotate-6
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
                    transition-all
                    duration-300
                    hover:bg-[#E8DFD2]
                  "
                >
                  <span className="text-xs">
                    <FiUser />
                  </span>
                </span>

              )}

            </button>

          </div>

          {/* Mobile icons */}

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

            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className={iconHover}
            >
              <FiHeart size={19} strokeWidth={1.4} />
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className={`
                relative
                ${iconHover}
              `}
            >

              <FiShoppingBag size={19} strokeWidth={1.4} />

              {cartCount > 0 && (
                <span
                  key={cartCount}
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
                    cart-count-animation
                  "
                >
                  {cartCount}
                </span>
              )}

            </Link>

          </div>

        </div>

        {/* MOBILE MENU */}

        {menuOpen && (

          <div
            className="
              border-t
              border-[#E5DED4]
              bg-[#F5F0E8]
              px-5
              py-6
              md:hidden
              mobile-menu-animation
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

                <button
                  onClick={() => {
                    setProfileOpen(true)
                    setMenuOpen(false)
                  }}
                  className="
                    mb-1
                    flex
                    items-center
                    gap-3
                    transition-all
                    duration-300
                    hover:scale-[1.03]
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

                </button>

              )}

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                Shop
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                About
              </NavLink>

              <NavLink
                to="/myOrder"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                My Orders
              </NavLink>

              <NavLink
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                Wishlist
              </NavLink>

              <NavLink
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className={navClass}
              >
                Cart
              </NavLink>

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

      {/* PROFILE OVERLAY */}

      {profileOpen && (

        <div
          className="
            fixed
            inset-0
            z-[60]
            bg-black/30
            profile-overlay-animation
          "
          onClick={() => setProfileOpen(false)}
        >

          {/* PROFILE SIDEBAR */}

          <div
            className="
              absolute
              right-0
              top-0
              h-full
              w-full
              max-w-sm
              bg-[#F5F0E8]
              shadow-xl
              profile-sidebar-animation
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* Sidebar Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#E5DED4]
                px-6
                py-5
              "
            >

              <span
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[2px]
                  text-[#2B2926]
                "
              >
                My Account
              </span>

              <button
                onClick={() => setProfileOpen(false)}
                className="
                  text-[#2B2926]
                  transition-all
                  duration-300
                  hover:rotate-90
                  hover:opacity-50
                  active:scale-90
                "
                aria-label="Close profile"
              >
                <FiX size={22} strokeWidth={1.4} />
              </button>

            </div>

            {/* Profile Info */}

            <div
              className="
                flex
                flex-col
                items-center
                border-b
                border-[#E5DED4]
                px-6
                py-8
                profile-info-animation
              "
            >

              <div
                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#2B2926]
                  bg-[#E8DFD2]
                  text-xl
                  font-medium
                  tracking-wide
                  text-[#2B2926]
                  transition-transform
                  duration-300
                  hover:scale-105
                "
              >
                {userInitials || <FiUser size={25} />}
              </div>

              <h3
                className="
                  mt-4
                  font-serif
                  text-xl
                  text-[#2B2926]
                "
              >
                {profile?.name || userName || "Guest"}
              </h3>

              {profile?.email && (

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#6F6A63]
                  "
                >
                  {profile.email}
                </p>

              )}

            </div>

            {/* Profile Menu */}

            <div className="px-6 py-5">

              {/* My Orders */}

              <button
                onClick={() => {
                  setProfileOpen(false)
                  navigate("/myOrder")
                }}
                className={`
                  flex
                  w-full
                  items-center
                  gap-4
                  border-b
                  border-[#E5DED4]
                  py-4
                  text-left
                  text-sm
                  text-[#2B2926]
                  ${menuItemHover}
                `}
              >

                <FiPackage size={19} strokeWidth={1.4} />

                <span>My Orders</span>

              </button>

              {/* Wishlist */}

              <button
                onClick={() => {
                  setProfileOpen(false)
                  navigate("/wishlist")
                }}
                className={`
                  flex
                  w-full
                  items-center
                  gap-4
                  border-b
                  border-[#E5DED4]
                  py-4
                  text-left
                  text-sm
                  text-[#2B2926]
                  ${menuItemHover}
                `}
              >

                <FiHeart size={19} strokeWidth={1.4} />

                <span>Wishlist</span>

              </button>

              {/* Become a seller */}

              <button
                onClick={() => {
                  setProfileOpen(false)
                  navigate("/vendorRegistration")
                }}
                className={`
                  flex
                  w-full
                  items-center
                  gap-4
                  border-b
                  border-[#E5DED4]
                  py-4
                  text-left
                  text-sm
                  text-[#2B2926]
                  ${menuItemHover}
                `}
              >

                <FiUser size={15} strokeWidth={1.4} />

                <span>Become a seller</span>

              </button>

              {/* Logout */}

              {userName && (

                <button
                  onClick={handleLogout}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-4
                    py-4
                    text-left
                    text-sm
                    text-[#2B2926]
                    ${menuItemHover}
                  `}
                >

                  <FiLogOut size={19} strokeWidth={1.4} />

                  <span>Logout</span>

                </button>

              )}

            </div>

          </div>

        </div>

      )}

    </>

  )
}

export default Navbar