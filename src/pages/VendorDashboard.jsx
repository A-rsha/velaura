import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VendorSidebar from '../components/VendorSidebar'
import API from '../services/axios'

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
  FiRefreshCw,
  
} from 'react-icons/fi'

const getArray = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.products)) return data.products
  if (Array.isArray(data?.orders)) return data.orders
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.vendors)) return data.vendors
  return []
}

const getId = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return String(value._id || value.id || '')
}

const getVendorId = (item) => {
  return getId(
    item?.vendorId ||
    item?.vendor?._id ||
    item?.vendor ||
    item?.sellerId ||
    item?.seller?._id ||
    item?.seller
  )
}

const getOrderItems = (order) => {
  return order?.items || order?.orderItems || order?.products || []
}

const getItemProduct = (item) => {
  return item?.product || item?.productId || item?.item || {}
}

const getItemQuantity = (item) => {
  return Number(item?.quantity || item?.qty || 1)
}

const getItemPrice = (item) => {
  const product = getItemProduct(item)

  return Number(
    item?.price ??
    item?.sellingPrice ??
    item?.productPrice ??
    product?.price ??
    product?.sellingPrice ??
    0
  )
}

const getOrderDate = (order) => {
  return new Date(
    order?.createdAt ||
    order?.orderDate ||
    order?.date ||
    Date.now()
  )
}

const getOrderNumber = (order) => {
  return (
    order?.orderId ||
    order?.orderNumber ||
    order?._id?.slice(-8) ||
    'N/A'
  )
}

function VendorDashboard() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const [vendorName] = useState(
    localStorage.getItem('userName') || 'Vendor'
  )

  const [vendorId, setVendorId] = useState(
    localStorage.getItem('userId') || ''
  )

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [subscription, setSubscription] = useState({
    plan: null,
    status: 'inactive',
    endDate: null
  })

  // Decode vendor ID from JWT if it is not stored separately.
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return ''

      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )

      return payload.userId || payload.id || payload._id || ''
    } catch {
      return ''
    }
  }

  const currentVendorId = vendorId || getUserIdFromToken()

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setError('')

      const [productResponse, profileResponse] = await Promise.allSettled([
        API.get('/product/getProducts'),
        API.get('/auth/profile')
      ])

      // PRODUCTS
      if (productResponse.status === 'fulfilled') {
        const allProducts = getArray(productResponse.value.data)

        const myProducts = currentVendorId
          ? allProducts.filter(product => {
              const ownerId = getVendorId(product)
              return ownerId === currentVendorId
            })
          : []

        setProducts(myProducts)
      } else {
        console.error('Product fetch error:', productResponse.reason)
        setProducts([])
      }

      // PROFILE + SUBSCRIPTION
      if (profileResponse.status === 'fulfilled') {
        const profileData = profileResponse.value.data

        const user =
          profileData?.user ||
          profileData?.data?.user ||
          profileData?.data ||
          profileData

        if (user?._id) {
          setVendorId(String(user._id))
        }

        if (user?.subscription) {
          setSubscription(user.subscription)
        }
      }

      // ORDERS
      // Try the vendor order endpoints used by the backend.
      let orderData = null

      const orderEndpoints = [
        
        '/order/getVendorOrders'
        
      ]

      for (const endpoint of orderEndpoints) {
        try {
          const response = await API.get(endpoint)
          orderData = getArray(response.data)
          break
        } catch (err) {
          console.log(`Order endpoint unavailable: ${endpoint}`)
        }
      }

      if (orderData) {
        setOrders(orderData)
      } else {
        setOrders([])
        setError(
          'Vendor orders API is not available. Please check your backend order route.'
        )
      }

    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Unable to load dashboard information.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [currentVendorId])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  // Filter orders containing this vendor's products.
  const getMyOrderItems = (order) => {
    return getOrderItems(order).filter(item => {
      const product = getItemProduct(item)
      const itemVendorId = getVendorId(item)
      const productVendorId = getVendorId(product)

      return (
        itemVendorId === currentVendorId ||
        productVendorId === currentVendorId
      )
    })
  }

  const vendorOrders = orders.filter(order => {
    return getMyOrderItems(order).length > 0
  })

  // Calculate total sales from this vendor's products.
  const totalSales = vendorOrders.reduce((total, order) => {
    const items = getMyOrderItems(order)

    const orderTotal = items.reduce((sum, item) => {
      return sum + getItemPrice(item) * getItemQuantity(item)
    }, 0)

    return total + orderTotal
  }, 0)

  // Only count paid orders as completed sales.
  const paidOrders = vendorOrders.filter(order => {
    const status = String(
      order?.paymentStatus || order?.payment?.status || ''
    ).toLowerCase()

    return ['paid', 'success', 'successful', 'completed'].includes(status)
  })

  const completedSales = paidOrders.reduce((total, order) => {
    return total + getMyOrderItems(order).reduce((sum, item) => {
      return sum + getItemPrice(item) * getItemQuantity(item)
    }, 0)
  }, 0)

  // Last 6 months sales data.
  const monthlySales = Array.from({ length: 6 }, (_, index) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - index))

    return {
      month: date.toLocaleString('en-IN', { month: 'short' }),
      monthNumber: date.getMonth(),
      year: date.getFullYear(),
      sales: 0
    }
  })

  paidOrders.forEach(order => {
    const date = getOrderDate(order)

    const month = monthlySales.find(item =>
      item.monthNumber === date.getMonth() &&
      item.year === date.getFullYear()
    )

    if (month) {
      const amount = getMyOrderItems(order).reduce((sum, item) => {
        return sum + getItemPrice(item) * getItemQuantity(item)
      }, 0)

      month.sales += amount
    }
  })

  const maximumSales = Math.max(
    ...monthlySales.map(item => item.sales),
    1
  )

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      note: 'Products in your store',
      icon: FiPackage
    },
    {
      title: 'Total Orders',
      value: vendorOrders.length,
      note: 'Orders received',
      icon: FiShoppingBag
    },
    {
      title: 'Total Sales',
      value: `₹${completedSales.toLocaleString('en-IN')}`,
      note: 'Paid sales amount',
      icon: FiTrendingUp
    },
    {
      title: 'Subscription',
      value: subscription.status || 'Inactive',
      note: subscription.plan
        ? `${subscription.plan} plan`
        : 'Seller account',
      icon: FiCreditCard
    }
  ]

  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getSubscriptionStatus = () => {
    if (
      subscription.status === 'active' &&
      subscription.endDate &&
      new Date(subscription.endDate) < new Date()
    ) {
      return 'Expired'
    }

    return subscription.status || 'Inactive'
  }

  const subscriptionStatus = getSubscriptionStatus()

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">

      <VendorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        vendorName={vendorName}
      />

      <main className="min-h-screen lg:ml-72">

        {/* HEADER */}
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
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white transition hover:bg-[#F5F0E8] disabled:opacity-50"
                title="Refresh dashboard"
              >
                <FiRefreshCw
                  size={17}
                  className={refreshing ? 'animate-spin' : ''}
                />
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

            {/* WELCOME */}
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

            {/* SUBSCRIPTION */}
            <section className="mb-8 flex flex-col justify-between gap-4 border border-[#D8C8B3] bg-[#EEE5D8] p-5 sm:flex-row sm:items-center sm:p-6">

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#FDFBF7] text-[#9A7958]">
                  <FiCreditCard size={20} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg">
                      Seller Subscription
                    </h3>

                    <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      subscriptionStatus === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {subscriptionStatus}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {subscription.plan
                      ? `${subscription.plan} subscription`
                      : 'No subscription plan selected'}
                  </p>

                  {subscription.endDate && (
                    <p className="mt-1 text-xs text-gray-500">
                      Expires on: {formatDate(subscription.endDate)}
                    </p>
                  )}
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

            {/* ERROR MESSAGE */}
            {error && (
              <div className="mb-6 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
                {error}
              </div>
            )}

            {/* STATISTICS */}
            <section className="mb-9">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                    Performance
                  </p>
                  <h3 className="mt-1 font-serif text-2xl">
                    Store at a glance
                  </h3>
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

                      <p className="mt-5 font-serif text-3xl capitalize">
                        {loading ? '...' : stat.value}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {stat.note}
                      </p>
                    </div>
                  )
                })}

              </div>
            </section>

            {/* SALES + QUICK ACTIONS */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

              {/* QUICK ACTIONS */}
              <section className="border border-[#DED5C8] bg-[#FDFBF7] p-6">

                <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                  Manage your store
                </p>

                <h3 className="mt-2 font-serif text-2xl">
                  Quick Actions
                </h3>

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

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                      Business overview
                    </p>

                    <h3 className="mt-2 font-serif text-2xl">
                      Sales Overview
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Your paid sales performance over the last six months.
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center bg-[#F0EAE0] text-[#9A7958]">
                    <FiTrendingUp size={20} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-6 items-end gap-3">

                  {monthlySales.map((month) => (
                    <div
                      key={`${month.month}-${month.year}`}
                      className="flex flex-col items-center"
                    >
                      <p className="mb-2 text-[10px] text-gray-500">
                        {month.sales > 0
                          ? `₹${month.sales.toLocaleString('en-IN')}`
                          : '₹0'}
                      </p>

                      <div className="flex h-36 w-full items-end justify-center bg-[#F5F0E8]">
                        <div
                          className="w-full max-w-10 bg-[#9A7958] transition-all duration-500"
                          style={{
                            height: `${month.sales > 0
                              ? Math.max(
                                  (month.sales / maximumSales) * 100,
                                  5
                                )
                              : 2}%`
                          }}
                        />
                      </div>

                      <p className="mt-3 text-xs font-medium text-gray-500">
                        {month.month}
                      </p>
                    </div>
                  ))}

                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#DED5C8] pt-5">

                  <div>
                    <p className="text-xs text-gray-400">
                      Total paid sales
                    </p>

                    <p className="mt-1 font-serif text-2xl">
                      ₹{completedSales.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Total orders
                    </p>

                    <p className="mt-1 font-serif text-2xl">
                      {vendorOrders.length}
                    </p>
                  </div>

                </div>

              </section>
            </div>

            {/* RECENT ORDERS */}
            <section className="mt-8 border border-[#DED5C8] bg-[#FDFBF7] p-6">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                    Latest activity
                  </p>

                  <h3 className="mt-2 font-serif text-2xl">
                    Recent Orders
                  </h3>
                </div>

                <Link
                  to="/vendorOrders"
                  className="text-xs font-semibold text-[#9A7958] hover:underline"
                >
                  View All
                </Link>
              </div>

              {loading ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  Loading orders...
                </p>
              ) : vendorOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <FiShoppingBag
                    size={30}
                    className="mx-auto text-[#BBA88F]"
                  />

                  <p className="mt-3 font-serif text-lg">
                    No orders yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Your customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[550px] text-left">

                    <thead>
                      <tr className="border-b border-[#DED5C8] text-[10px] uppercase tracking-wider text-gray-400">
                        <th className="px-3 py-3">Order ID</th>
                        <th className="px-3 py-3">Date</th>
                        <th className="px-3 py-3">Items</th>
                        <th className="px-3 py-3">Amount</th>
                        <th className="px-3 py-3">Payment</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...vendorOrders]
                        .sort((a, b) =>
                          getOrderDate(b) - getOrderDate(a)
                        )
                        .slice(0, 5)
                        .map(order => {
                          const items = getMyOrderItems(order)

                          const amount = items.reduce((sum, item) => {
                            return sum +
                              getItemPrice(item) * getItemQuantity(item)
                          }, 0)

                          return (
                            <tr
                              key={order._id}
                              className="border-b border-[#EEE8DE] text-sm last:border-0"
                            >
                              <td className="px-3 py-4 font-medium">
                                #{getOrderNumber(order)}
                              </td>

                              <td className="px-3 py-4 text-gray-500">
                                {formatDate(getOrderDate(order))}
                              </td>

                              <td className="px-3 py-4">
                                {items.length}
                              </td>

                              <td className="px-3 py-4 font-semibold">
                                ₹{amount.toLocaleString('en-IN')}
                              </td>

                              <td className="px-3 py-4">
                                <span className="bg-[#F0EAE0] px-2 py-1 text-xs capitalize">
                                  {order.paymentStatus || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>

                  </table>
                </div>
              )}

            </section>

            {/* FOOTER */}
            <footer className="mt-10 border-t border-[#DED5C8] py-6 text-center">

              <p className="font-serif text-lg tracking-wider">
                VELAURA
              </p>

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