import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiShoppingBag,
  FiHome,
  FiSettings,
  FiLogOut,
  FiX,
  FiChevronRight,
} from 'react-icons/fi'

function VendorSidebar({ sidebarOpen, setSidebarOpen, vendorName }) {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('role')
    localStorage.removeItem('userName')
    localStorage.removeItem('userId')

    navigate('/login')
  }

  const menuItems = [
    { name: 'Dashboard', icon: FiGrid, path: '/vendorDashboard' },
    { name: 'My Products', icon: FiPackage, path: '/vmanageProducts' },
    { name: 'Add Product', icon: FiPlusCircle, path: '/vaddProduct' },
    { name: 'My Orders', icon: FiShoppingBag, path: '/vendorOrders' },
  ]

  return (
    <>
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#DED5C8] bg-[#FDFBF7] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >

        {/* BRAND */}
        <div className="flex items-center justify-between border-b border-[#DED5C8] px-7 py-7">

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex flex-col"
          >
            <span className="font-serif text-3xl tracking-wide">
              VELAURA
            </span>

            <span className="mt-1 text-[9px] tracking-[4px] text-gray-500">
              SELLER PORTAL
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <FiX size={21} />
          </button>

        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-5 py-8">

          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
            Workspace
          </p>

          <nav className="space-y-2">

            {menuItems.map((item) => {
              const Icon = item.icon
              const active = item.name === 'Dashboard'

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    active
                      ? 'bg-[#2B2926] text-white'
                      : 'text-[#625D56] hover:bg-[#F0EAE0] hover:text-[#2B2926]'
                  }`}
                >
                  <Icon size={18} />

                  <span>{item.name}</span>

                  {active && (
                    <FiChevronRight className="ml-auto" size={16} />
                  )}
                </Link>
              )
            })}

          </nav>

          <p className="mb-4 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
            Account
          </p>

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm text-[#625D56] transition hover:bg-[#F0EAE0]"
          >
            <FiHome size={18} />
            View Website
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#625D56] transition hover:bg-[#F0EAE0]"
          >
            <FiSettings size={18} />
            Settings
          </button>

        </div>

        {/* SIDEBAR FOOTER */}
        <div className="border-t border-[#DED5C8] p-5">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9DFD0] font-serif text-lg">
              {vendorName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {vendorName}
              </p>

              <p className="text-xs text-gray-400">
                Seller Account
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
          >
            <FiLogOut size={17} />
            Logout
          </button>

        </div>

      </aside>
    </>
  )
}

export default VendorSidebar