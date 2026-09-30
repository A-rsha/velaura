
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

  const userName = localStorage.getItem("userName")


  const userInitials = userName
    ? userName
        .trim()
        .slice(0, 2)
        .toUpperCase()
    : ""




  useEffect(() => {

    const getProfile = async () => {

      const token = localStorage.getItem("token")

      if (!token) {
        return
      }

      try {

        const res = await API.get('/auth/profile')

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

    <>


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


            <NavLink
              to="/myOrder"
              className={navClass}
            >
              My Orders
            </NavLink>

          </div>


          

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
                    <FiUser />
                  </span>
                </span>

              )}

            </button>

          </div>




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


      {/* ================= PROFILE OVERLAY ================= */}

      {profileOpen && (

        <div
          className="
            fixed
            inset-0
            z-[60]
            bg-black/30
          "
          onClick={() => setProfileOpen(false)}
        >

          {/* ================= PROFILE SIDEBAR ================= */}

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
              animate-[slideIn_0.3s_ease-out]
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
                  transition
                  hover:opacity-50
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
                className="
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
                  transition
                  hover:opacity-60
                "
              >

                <FiPackage
                  size={19}
                  strokeWidth={1.4}
                />

                <span>
                  My Orders
                </span>

              </button>


              {/* Wishlist */}

              <button
                onClick={() => {
                  setProfileOpen(false)
                  navigate("/wishlist")
                }}
                className="
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
                  transition
                  hover:opacity-60
                "
              >

                <FiHeart
                  size={19}
                  strokeWidth={1.4}
                />

                <span>
                  Wishlist
                </span>

              </button>


              {/* Logout */}

              {userName && (

                <button
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    py-4
                    text-left
                    text-sm
                    text-[#2B2926]
                    transition
                    hover:opacity-60
                  "
                >

                  <FiLogOut
                    size={19}
                    strokeWidth={1.4}
                  />

                  <span>
                    Logout
                  </span>

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

