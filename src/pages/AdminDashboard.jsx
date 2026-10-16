
import React, { useEffect, useState } from 'react'
import {
    FiPackage,
    FiShoppingBag,
    FiHome,
    FiTrendingUp,
    FiRefreshCw
} from 'react-icons/fi'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts'

import API from '../services/axios'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'



function AdminDashboard() {
    const navigate = useNavigate()

    const [totalProducts, setTotalProducts] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [period, setPeriod] = useState('6')

    const fetchDashboardData = async () => {
        try {
            setLoading(true)

            const [productResponse, orderResponse] = await Promise.all([
                API.get('/product/getProducts'),
                API.get('/order/getAllOrders')
            ])

            const productData = productResponse.data.data || []
            const orderData = orderResponse.data.orders || []

            setProducts(productData)
            setOrders(orderData)

            setTotalProducts(productData.length)
            setTotalOrders(orderData.length)
        } catch (error) {
            console.error('Dashboard data error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    // Generate monthly counts from the actual createdAt dates.
    const getMonthlyData = () => {
        const months = []
        const currentDate = new Date()
        const numberOfMonths = Number(period)

        for (let i = numberOfMonths - 1; i >= 0; i--) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            )

            months.push({
                year: date.getFullYear(),
                month: date.getMonth(),
                label: date.toLocaleDateString('en-IN', {
                    month: 'short',
                    year: '2-digit'
                }),
                products: 0,
                orders: 0
            })
        }

        products.forEach((product) => {
            if (!product.createdAt) return

            const createdDate = new Date(product.createdAt)

            if (Number.isNaN(createdDate.getTime())) return

            const monthData = months.find(
                (item) =>
                    item.year === createdDate.getFullYear() &&
                    item.month === createdDate.getMonth()
            )

            if (monthData) {
                monthData.products += 1
            }
        })

        orders.forEach((order) => {
            if (!order.createdAt) return

            const createdDate = new Date(order.createdAt)

            if (Number.isNaN(createdDate.getTime())) return

            const monthData = months.find(
                (item) =>
                    item.year === createdDate.getFullYear() &&
                    item.month === createdDate.getMonth()
            )

            if (monthData) {
                monthData.orders += 1
            }
        })

        return months
    }

    const monthlyData = getMonthlyData()

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            <AdminSidebar />

            <main className="min-h-screen lg:ml-64">

                {/* HEADER */}
                <header className="sticky top-0 z-30 border-b border-[#DED5C8] bg-[#FDFBF7]/95 backdrop-blur">
                    <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400">
                                VELAURA ADMIN
                            </p>

                            <h1 className="mt-1 font-serif text-2xl text-[#2B2926] sm:text-3xl">
                                Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={fetchDashboardData}
                                disabled={loading}
                                className="flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white text-[#2B2926] transition hover:bg-[#F5F0E8] disabled:opacity-50"
                                title="Refresh dashboard"
                            >
                                <FiRefreshCw
                                    size={17}
                                    className={loading ? 'animate-spin' : ''}
                                />
                            </button>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2B2926] text-sm font-medium text-white">
                                A
                            </div>

                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-[#2B2926]">
                                    Admin
                                </p>
                                <p className="text-xs text-gray-400">
                                    Administrator
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* DASHBOARD CONTENT */}
                <div className="px-5 py-8 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-7xl">

                        {/* INTRO */}
                        <div className="mb-8">
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                                Store overview
                            </p>

                            <h2 className="mt-2 font-serif text-2xl text-[#2B2926] sm:text-3xl">
                                Welcome back, Admin
                            </h2>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                                Manage your products, orders and VELAURA
                                accessories from one place.
                            </p>
                        </div>

                        {/* SUMMARY CARDS */}
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            {/* TOTAL PRODUCTS */}
                            <div className="border border-[#DED5C8] bg-[#FDFBF7] p-5 transition hover:-translate-y-0.5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Products
                                        </p>

                                        <p className="mt-3 font-serif text-3xl text-[#2B2926]">
                                            {loading ? '...' : totalProducts}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Total products
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center border border-[#DED5C8] bg-[#F5F0E8] text-[#2B2926]">
                                        <FiPackage size={19} />
                                    </div>
                                </div>
                            </div>

                            {/* TOTAL ORDERS */}
                            <div className="border border-[#DED5C8] bg-[#FDFBF7] p-5 transition hover:-translate-y-0.5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Orders
                                        </p>

                                        <p className="mt-3 font-serif text-3xl text-[#2B2926]">
                                            {loading ? '...' : totalOrders}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Total orders
                                        </p>
                                    </div>

                                    <div className="flex h-11 w-11 items-center justify-center border border-[#DED5C8] bg-[#F5F0E8] text-[#2B2926]">
                                        <FiShoppingBag size={19} />
                                    </div>
                                </div>
                            </div>

                            {/* VIEW STORE */}
                            <div className="border border-[#DED5C8] bg-[#FDFBF7] p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Store
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="mt-4 flex w-full items-center justify-between border border-[#DED5C8] px-4 py-3 text-sm text-[#2B2926] transition hover:bg-[#F5F0E8]"
                                >
                                    <span className="flex items-center gap-3">
                                        <FiHome size={17} />
                                        View Store
                                    </span>
                                    <span>→</span>
                                </button>
                            </div>

                            {/* VIEW ORDERS */}
                            <div className="border border-[#DED5C8] bg-[#FDFBF7] p-5">
                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Management
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate('/order')}
                                    className="mt-4 flex w-full items-center justify-between border border-[#DED5C8] px-4 py-3 text-sm text-[#2B2926] transition hover:bg-[#F5F0E8]"
                                >
                                    <span className="flex items-center gap-3">
                                        <FiShoppingBag size={17} />
                                        View Orders
                                    </span>
                                    <span>→</span>
                                </button>
                            </div>
                        </div>

                        {/* MONTHLY GRAPH */}
                        <section className="border border-[#DED5C8] bg-[#FDFBF7] p-5 sm:p-7">

                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <FiTrendingUp
                                            size={20}
                                            className="text-[#9A7958]"
                                        />

                                        <h2 className="font-serif text-xl text-[#2B2926] sm:text-2xl">
                                            Monthly Store Activity
                                        </h2>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Products added and orders received each month.
                                    </p>
                                </div>

                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="w-full border border-[#DED5C8] bg-white px-4 py-3 text-sm text-[#2B2926] outline-none focus:border-[#9A7958] sm:w-44"
                                >
                                    <option value="6">Last 6 months</option>
                                    <option value="12">Last 12 months</option>
                                </select>
                            </div>

                            {/* GRAPH */}
                            {loading ? (
                                <div className="flex h-80 items-center justify-center">
                                    <FiRefreshCw
                                        size={25}
                                        className="animate-spin text-[#9A7958]"
                                    />
                                    <span className="ml-3 text-sm text-gray-500">
                                        Loading monthly data...
                                    </span>
                                </div>
                            ) : (
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={monthlyData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: -20,
                                                bottom: 5
                                            }}
                                            barGap={6}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="label"
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <YAxis
                                                allowDecimals={false}
                                                tick={{ fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />

                                            <Tooltip
                                                cursor={{ fill: '#F5F0E8' }}
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #DED5C8',
                                                    backgroundColor: '#FDFBF7'
                                                }}
                                            />

                                            <Legend />

                                            <Bar
                                                dataKey="products"
                                                name="Products Added"
                                                fill="#B58A5A"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={32}
                                            />

                                            <Bar
                                                dataKey="orders"
                                                name="Orders Received"
                                                fill="#2B2926"
                                                radius={[4, 4, 0, 0]}
                                                maxBarSize={32}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {!loading &&
                                monthlyData.every(
                                    (month) =>
                                        month.products === 0 &&
                                        month.orders === 0
                                ) && (
                                    <p className="mt-3 text-center text-xs text-gray-400">
                                        No products or orders were recorded for this period.
                                        Check that your API responses include createdAt dates.
                                    </p>
                                )}
                        </section>

                        {/* FOOTER */}
                        <p className="mt-6 text-center text-xs text-gray-400">
                            VELAURA Admin Dashboard · Store overview and monthly activity
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard

