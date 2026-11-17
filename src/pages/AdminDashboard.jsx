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

    // MONTHLY DATA
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
        <div className="admin-dashboard-page min-h-screen bg-[#F5F0E8]">

            <AdminSidebar />

            <style>{`
                /* PAGE ENTRANCE */
                .admin-dashboard-page {
                    animation: dashboardPageEnter 0.65s ease both;
                }

                @keyframes dashboardPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* HEADER */
                .dashboard-header {
                    animation: headerEnter 0.6s ease both;
                }

                @keyframes headerEnter {
                    from {
                        opacity: 0;
                        transform: translateY(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* REFRESH BUTTON */
                .dashboard-refresh {
                    transition:
                        background 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .dashboard-refresh:hover:not(:disabled) {
                    background: #F5F0E8;
                    transform: rotate(-12deg) scale(1.08);
                    box-shadow: 0 4px 12px rgba(43,41,38,0.1);
                }

                .dashboard-refresh:active {
                    transform: scale(0.94);
                }

                /* AVATAR */
                .dashboard-avatar {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .dashboard-avatar:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 0 4px rgba(181,138,90,0.2);
                }

                /* INTRO */
                .dashboard-intro {
                    animation: introEnter 0.7s ease 0.15s both;
                }

                @keyframes introEnter {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* SUMMARY CARDS */
                .dashboard-stat-card {
                    animation: statCardEnter 0.65s cubic-bezier(0.2,0.8,0.2,1) both;
                    transition:
                        transform 0.35s ease,
                        box-shadow 0.35s ease,
                        border-color 0.35s ease;
                }

                @keyframes statCardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dashboard-stat-card:hover {
                    transform: translateY(-6px);
                    border-color: #BBA88F;
                    box-shadow: 0 12px 25px rgba(43,41,38,0.09);
                }

                .dashboard-stat-icon {
                    transition:
                        transform 0.35s ease,
                        background 0.35s ease,
                        color 0.35s ease;
                }

                .dashboard-stat-card:hover .dashboard-stat-icon {
                    transform: rotate(-8deg) scale(1.1);
                    background: #2B2926;
                    color: white;
                }

                /* STAT NUMBER */
                .dashboard-stat-number {
                    transition: color 0.3s ease;
                }

                .dashboard-stat-card:hover .dashboard-stat-number {
                    color: #9A7958;
                }

                /* QUICK ACTIONS */
                .dashboard-action-btn {
                    position: relative;
                    overflow: hidden;
                    transition:
                        background 0.3s ease,
                        transform 0.3s ease,
                        border-color 0.3s ease;
                }

                .dashboard-action-btn:hover {
                    background: #F5F0E8;
                    border-color: #BBA88F;
                    transform: translateY(-2px);
                }

                .dashboard-action-btn svg {
                    transition: transform 0.3s ease;
                }

                .dashboard-action-btn:hover svg {
                    transform: scale(1.15);
                }

                .dashboard-action-arrow {
                    transition: transform 0.3s ease;
                }

                .dashboard-action-btn:hover .dashboard-action-arrow {
                    transform: translateX(5px);
                }

                /* CHART SECTION */
                .dashboard-chart-section {
                    animation: chartEnter 0.8s ease 0.35s both;
                    transition:
                        box-shadow 0.35s ease,
                        border-color 0.35s ease;
                }

                @keyframes chartEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dashboard-chart-section:hover {
                    border-color: #C8B9A5;
                    box-shadow: 0 12px 28px rgba(43,41,38,0.05);
                }

                /* CHART TITLE ICON */
                .dashboard-chart-icon {
                    transition: transform 0.4s ease;
                }

                .dashboard-chart-section:hover .dashboard-chart-icon {
                    transform: translateY(-3px) scale(1.12);
                }

                /* PERIOD SELECT */
                .dashboard-period-select {
                    transition:
                        border-color 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .dashboard-period-select:focus {
                    border-color: #9A7958;
                    box-shadow: 0 0 0 3px rgba(154,121,88,0.12);
                }

                /* FOOTER */
                .dashboard-footer {
                    animation: footerEnter 0.7s ease 0.6s both;
                }

                @keyframes footerEnter {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .admin-dashboard-page *,
                    .admin-dashboard-page *::before,
                    .admin-dashboard-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <main className="min-h-screen lg:ml-64">

                {/* HEADER */}
                <header className="dashboard-header sticky top-0 z-30 border-b border-[#DED5C8] bg-[#FDFBF7]/95 backdrop-blur">

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
                                className="dashboard-refresh flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white text-[#2B2926] disabled:opacity-50"
                                title="Refresh dashboard"
                            >
                                <FiRefreshCw
                                    size={17}
                                    className={loading ? 'animate-spin' : ''}
                                />
                            </button>

                            <div className="dashboard-avatar flex h-10 w-10 items-center justify-center rounded-full bg-[#2B2926] text-sm font-medium text-white">
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
                        <div className="dashboard-intro mb-8">

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
                            <div
                                style={{ animationDelay: '0.1s' }}
                                className="dashboard-stat-card border border-[#DED5C8] bg-[#FDFBF7] p-5"
                            >

                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Products
                                        </p>

                                        <p className="dashboard-stat-number mt-3 font-serif text-3xl text-[#2B2926]">
                                            {loading ? '...' : totalProducts}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Total products
                                        </p>
                                    </div>

                                    <div className="dashboard-stat-icon flex h-11 w-11 items-center justify-center border border-[#DED5C8] bg-[#F5F0E8] text-[#2B2926]">
                                        <FiPackage size={19} />
                                    </div>

                                </div>
                            </div>

                            {/* TOTAL ORDERS */}
                            <div
                                style={{ animationDelay: '0.2s' }}
                                className="dashboard-stat-card border border-[#DED5C8] bg-[#FDFBF7] p-5"
                            >

                                <div className="flex items-start justify-between">

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Orders
                                        </p>

                                        <p className="dashboard-stat-number mt-3 font-serif text-3xl text-[#2B2926]">
                                            {loading ? '...' : totalOrders}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Total orders
                                        </p>
                                    </div>

                                    <div className="dashboard-stat-icon flex h-11 w-11 items-center justify-center border border-[#DED5C8] bg-[#F5F0E8] text-[#2B2926]">
                                        <FiShoppingBag size={19} />
                                    </div>

                                </div>
                            </div>

                            {/* VIEW STORE */}
                            <div
                                style={{ animationDelay: '0.3s' }}
                                className="dashboard-stat-card border border-[#DED5C8] bg-[#FDFBF7] p-5"
                            >

                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Store
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="dashboard-action-btn mt-4 flex w-full items-center justify-between border border-[#DED5C8] px-4 py-3 text-sm text-[#2B2926]"
                                >
                                    <span className="flex items-center gap-3">
                                        <FiHome size={17} />
                                        View Store
                                    </span>

                                    <span className="dashboard-action-arrow">
                                        →
                                    </span>
                                </button>

                            </div>

                            {/* VIEW ORDERS */}
                            <div
                                style={{ animationDelay: '0.4s' }}
                                className="dashboard-stat-card border border-[#DED5C8] bg-[#FDFBF7] p-5"
                            >

                                <p className="text-xs uppercase tracking-wider text-gray-400">
                                    Management
                                </p>

                                <button
                                    type="button"
                                    onClick={() => navigate('/order')}
                                    className="dashboard-action-btn mt-4 flex w-full items-center justify-between border border-[#DED5C8] px-4 py-3 text-sm text-[#2B2926]"
                                >
                                    <span className="flex items-center gap-3">
                                        <FiShoppingBag size={17} />
                                        View Orders
                                    </span>

                                    <span className="dashboard-action-arrow">
                                        →
                                    </span>
                                </button>

                            </div>

                        </div>

                        {/* MONTHLY GRAPH */}
                        <section className="dashboard-chart-section border border-[#DED5C8] bg-[#FDFBF7] p-5 sm:p-7">

                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <div className="flex items-center gap-2">

                                        <FiTrendingUp
                                            size={20}
                                            className="dashboard-chart-icon text-[#9A7958]"
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
                                    className="dashboard-period-select w-full border border-[#DED5C8] bg-white px-4 py-3 text-sm text-[#2B2926] outline-none sm:w-44"
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
                        <p className="dashboard-footer mt-6 text-center text-xs text-gray-400">
                            VELAURA Admin Dashboard · Store overview and monthly activity
                        </p>

                    </div>
                </div>

            </main>
        </div>
    )
}

export default AdminDashboard