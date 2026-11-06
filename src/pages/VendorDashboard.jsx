import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VendorSidebar from '../components/VendorSidebar'

import {
  FiPackage,
  FiPlusCircle,
  FiShoppingBag,
  FiMenu,
  FiArrowUpRight,
  FiTrendingUp,
  FiCalendar,
  FiCreditCard,
  FiChevronRight,
  FiBell,
} from 'react-icons/fi'

function VendorDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const vendorName = localStorage.getItem('userName') || 'Vendor'

  const stats = [
    {
      title: 'Total Products',
      value: '—',
      note: 'Products in your store',
      icon: FiPackage,
    },
    {
      title: 'Total Orders',
      value: '—',
      note: 'Orders received',
      icon: FiShoppingBag,
    },
    {
      title: 'Total Sales',
      value: '—',
      note: 'Sales overview',
      icon: FiTrendingUp,
    },
    {
      title: 'Subscription',
      value: 'Active',
      note: 'Your seller account',
      icon: FiCreditCard,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">

      {/* SIDEBAR COMPONENT */}
      <VendorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        vendorName={vendorName}
      />

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-72">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 border-b border-[#DED5C8] bg-[#FDFBF7]/95 backdrop-blur">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white lg:hidden"
                aria-label="Open sidebar"
              >
                <FiMenu size={20} />
              </button>

              <div>
                <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                  Seller workspace
                </p>
                <h1 className="mt-1 font-serif text-xl sm:text-2xl">
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white text-[#625D56] transition hover:bg-[#F5F0E8]"
                title="Notifications"
              >
                <FiBell size={18} />
              </button>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{vendorName}</p>
                <p className="text-xs text-gray-400">Vendor</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B2926] font-serif text-lg text-white">
                {vendorName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div className="px-5 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">

            {/* WELCOME SECTION */}
            <section className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#9A7958]">
                  Store overview
                </p>

                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                  Welcome back, {vendorName}
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                  Manage your products, monitor orders and keep your VELAURA
                  store running smoothly.
                </p>
              </div>

              <Link
                to="/vaddProduct"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#2B2926] px-6 text-sm font-medium text-white transition hover:bg-[#51483E]"
              >
                <FiPlusCircle size={17} />
                Add New Product
              </Link>
            </section>

            {/* SUBSCRIPTION BANNER */}
            <section className="mb-8 flex flex-col justify-between gap-4 border border-[#D8C8B3] bg-[#EEE5D8] p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#FDFBF7] text-[#9A7958]">
                  <FiCreditCard size={20} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg">Seller Subscription</h3>
                    <span className="bg-green-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Your seller subscription is currently active.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/sellerPlans')}
                className="inline-flex items-center gap-2 self-start border border-[#BBA88F] bg-[#FDFBF7] px-4 py-3 text-xs font-semibold transition hover:bg-white sm:self-auto"
              >
                View Plans
                <FiArrowUpRight size={15} />
              </button>
            </section>

            {/* STATISTICS */}
            <section className="mb-9">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                    Performance
                  </p>
                  <h3 className="mt-1 font-serif text-2xl">Store at a glance</h3>
                </div>

                <span className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
                  <FiCalendar size={14} />
                  Overall summary
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon

                  return (
                    <div
                      key={stat.title}
                      className="border border-[#DED5C8] bg-[#FDFBF7] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#BBA88F]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                          {stat.title}
                        </p>

                        <div className="flex h-10 w-10 items-center justify-center bg-[#F0EAE0] text-[#8C7155]">
                          <Icon size={19} />
                        </div>
                      </div>

                      <p className="mt-5 font-serif text-3xl">{stat.value}</p>
                      <p className="mt-1 text-xs text-gray-400">{stat.note}</p>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* QUICK ACTIONS AND OVERVIEW */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

              {/* QUICK ACTIONS */}
              <section className="border border-[#DED5C8] bg-[#FDFBF7] p-6">
                <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                  Manage your store
                </p>
                <h3 className="mt-2 font-serif text-2xl">Quick Actions</h3>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/vaddProduct"
                    className="flex items-center justify-between border border-[#DED5C8] p-4 transition hover:bg-[#F5F0E8]"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <FiPlusCircle size={18} className="text-[#9A7958]" />
                      Add a product
                    </span>
                    <FiChevronRight size={17} />
                  </Link>

                  <Link
                    to="/vmanageProducts"
                    className="flex items-center justify-between border border-[#DED5C8] p-4 transition hover:bg-[#F5F0E8]"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <FiPackage size={18} className="text-[#9A7958]" />
                      Manage products
                    </span>
                    <FiChevronRight size={17} />
                  </Link>

                  <Link
                    to="/vendorOrders"
                    className="flex items-center justify-between border border-[#DED5C8] p-4 transition hover:bg-[#F5F0E8]"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium">
                      <FiShoppingBag size={18} className="text-[#9A7958]" />
                      View orders
                    </span>
                    <FiChevronRight size={17} />
                  </Link>
                </div>
              </section>

              {/* SALES OVERVIEW */}
              <section className="border border-[#DED5C8] bg-[#FDFBF7] p-6 xl:col-span-2">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                      Business overview
                    </p>
                    <h3 className="mt-2 font-serif text-2xl">Sales Overview</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Your store's sales performance will appear here.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center bg-[#F0EAE0] text-[#9A7958]">
                    <FiTrendingUp size={20} />
                  </div>
                </div>

                <div className="mt-8 flex min-h-44 flex-col items-center justify-center border border-dashed border-[#D8C8B3] bg-[#FAF7F1] px-5 text-center">
                  <FiTrendingUp size={30} className="text-[#B58A5A]" />
                  <p className="mt-3 font-serif text-xl">Your sales journey starts here</p>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-gray-400">
                    Once your products receive orders, your sales information
                    and performance can be displayed in this section.
                  </p>
                </div>
              </section>
            </div>

            {/* FOOTER */}
            <footer className="mt-10 border-t border-[#DED5C8] py-6 text-center">
              <p className="font-serif text-lg tracking-wider">VELAURA</p>
              <p className="mt-1 text-[9px] uppercase tracking-[3px] text-gray-400">
                Seller workspace
              </p>
              <p className="mt-3 text-xs text-gray-400">
                © {new Date().getFullYear()} VELAURA. All rights reserved.
              </p>
            </footer>

          </div>
        </div>
      </main>
    </div>
  )
}

export default VendorDashboard