import React, { useEffect, useState } from 'react'
import { FiMenu, FiPackage, FiShoppingBag } from 'react-icons/fi'
import { toast } from 'react-toastify'

import VendorSidebar from '../components/VendorSidebar'
import API from '../services/axios'

const VendorOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const vendorName = localStorage.getItem('userName') || 'Vendor'

    // Fetch vendor orders
    const fetchOrders = async () => {
        try {
            setLoading(true)

            const response = await API.get('/order/getVendorOrders')

            setOrders(response.data.orders || [])

        } catch (error) {
            console.log('Vendor orders error:', error)

            toast.error(
                error.response?.data?.message || 'Failed to load orders'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    // Status colors
    const getStatusStyle = (status) => {
        const styles = {
            placed: 'bg-blue-100 text-blue-700',
            confirmed: 'bg-indigo-100 text-indigo-700',
            shipped: 'bg-purple-100 text-purple-700',
            out_for_delivery: 'bg-orange-100 text-orange-700',
            delivered: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        }

        return styles[status] || 'bg-gray-100 text-gray-700'
    }

    return (
        <div className="vendor-orders-page min-h-screen bg-[#F8F6F2]">

            {/* Sidebar */}
            <VendorSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                vendorName={vendorName}
            />

            {/* Main Content */}
            <main className="lg:ml-64 min-h-screen">

                {/* Header */}
                <div className="vendor-orders-header bg-white border-b border-gray-200 px-5 md:px-8 py-5 flex items-center gap-4">

                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="vendor-menu-btn lg:hidden text-2xl text-[#2B2926]"
                    >
                        <FiMenu />
                    </button>

                    <div>
                        <p className="text-[10px] uppercase tracking-[2px] text-[#9A7958] mb-1">
                            Vendor Dashboard
                        </p>

                        <h1 className="text-xl md:text-2xl font-semibold text-[#2B2926]">
                            My Orders
                        </h1>

                        <p className="text-sm text-gray-500 mt-1">
                            Manage orders for your products
                        </p>
                    </div>

                </div>

                {/* Content */}
                <div className="p-5 md:p-8">

                    {/* Order Count */}
                    <div className="vendor-order-count bg-white rounded-xl border border-gray-200 p-5 mb-6 flex items-center gap-4">

                        <div className="vendor-count-icon w-12 h-12 rounded-xl bg-[#F5F0E8] flex items-center justify-center text-[#2B2926] text-2xl">
                            <FiShoppingBag />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <h2 className="text-2xl font-bold text-[#2B2926]">
                                {orders.length}
                            </h2>
                        </div>

                    </div>

                    {/* Loading */}
                    {loading ? (

                        <div className="vendor-orders-state text-center py-20 text-gray-500">

                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#9A7958]"></div>

                            Loading orders...

                        </div>

                    ) : orders.length === 0 ? (

                        /* Empty Orders */
                        <div className="vendor-empty-orders bg-white rounded-xl border border-gray-200 py-20 text-center">

                            <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />

                            <h2 className="text-lg font-semibold text-[#2B2926]">
                                No Orders Yet
                            </h2>

                            <p className="text-sm text-gray-500 mt-2">
                                Orders for your products will appear here.
                            </p>

                        </div>

                    ) : (

                        /* Orders List */
                        <div className="space-y-6">

                            {orders.map((order, orderIndex) => (

                                <div
                                    key={order._id}
                                    style={{
                                        animationDelay: `${orderIndex * 100}ms`
                                    }}
                                    className="vendor-order-card bg-white rounded-xl border border-gray-200 overflow-hidden"
                                >

                                    {/* Order Header */}
                                    <div className="p-5 border-b border-gray-200 flex flex-wrap justify-between gap-4">

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Order ID
                                            </p>

                                            <p className="font-semibold text-[#2B2926] text-sm mt-1">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Order Date
                                            </p>

                                            <p className="text-sm font-medium mt-1 text-[#2B2926]">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment Method
                                            </p>

                                            <p className="text-sm font-medium mt-1 text-[#2B2926]">
                                                {order.paymentMethod}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Payment Status
                                            </p>

                                            <p className="text-sm font-medium mt-1 capitalize">
                                                {order.paymentStatus || 'Pending'}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Customer Details */}
                                    <div className="vendor-order-section p-5 border-b border-gray-200">

                                        <h3 className="font-semibold text-[#2B2926] mb-3">
                                            Customer Details
                                        </h3>

                                        <p className="text-sm text-gray-600">
                                            Name: {order.userId?.name || 'Customer'}
                                        </p>

                                        <p className="text-sm text-gray-600 mt-1">
                                            Email: {order.userId?.email || 'N/A'}
                                        </p>

                                    </div>

                                    {/* Products */}
                                    <div className="p-5">

                                        <h3 className="font-semibold text-[#2B2926] mb-4">
                                            Ordered Products
                                        </h3>

                                        <div className="space-y-4">

                                            {order.items.map((item, index) => {

                                                const product = item.productId

                                                const image =
                                                    product?.images?.[0] ||
                                                    product?.image

                                                return (

                                                    <div
                                                        key={item._id || index}
                                                        style={{
                                                            animationDelay: `${index * 80}ms`
                                                        }}
                                                        className="vendor-ordered-product flex flex-wrap items-center gap-4 border-b border-gray-100 pb-4 last:border-0"
                                                    >

                                                        {/* Product Image */}
                                                        <div className="vendor-ordered-image w-20 h-20 bg-[#F5F0E8] rounded-lg overflow-hidden flex-shrink-0">

                                                            {image ? (

                                                                <img
                                                                    src={image}
                                                                    alt={product?.title}
                                                                    className="w-full h-full object-cover"
                                                                />

                                                            ) : (

                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <FiPackage className="text-2xl text-gray-400" />
                                                                </div>

                                                            )}

                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="flex-1 min-w-[150px]">

                                                            <h4 className="font-semibold text-[#2B2926]">
                                                                {product?.title || 'Product'}
                                                            </h4>

                                                            <p className="text-sm text-gray-500 mt-1">
                                                                Quantity: {item.quantity}
                                                            </p>

                                                            <p className="text-sm font-medium text-[#2B2926] mt-1">
                                                                ₹{item.price}
                                                            </p>

                                                        </div>

                                                        {/* Item Status */}
                                                        <div>

                                                            <span className={`vendor-item-status px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusStyle(item.itemStatus)}`}>
                                                                {item.itemStatus?.replaceAll('_', ' ') || 'Placed'}
                                                            </span>

                                                        </div>

                                                    </div>

                                                )

                                            })}

                                        </div>

                                    </div>

                                    {/* Shipping Address */}
                                    <div className="vendor-shipping-section p-5 bg-[#FAF9F6] border-t border-gray-200">

                                        <h3 className="font-semibold text-[#2B2926] mb-2">
                                            Shipping Address
                                        </h3>

                                        {typeof order.shippingAddress === 'object' ? (

                                            <div className="text-sm text-gray-600 space-y-1">

                                                <p>
                                                    {order.shippingAddress.name}
                                                </p>

                                                <p>
                                                    {order.shippingAddress.address}
                                                </p>

                                                <p>
                                                    {order.shippingAddress.city},
                                                    {' '}{order.shippingAddress.state}
                                                </p>

                                                <p>
                                                    {order.shippingAddress.pincode}
                                                </p>

                                                <p>
                                                    Phone: {order.shippingAddress.phone}
                                                </p>

                                            </div>

                                        ) : (

                                            <p className="text-sm text-gray-600">
                                                {order.shippingAddress || 'Address not available'}
                                            </p>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

            {/* ANIMATION STYLES */}
            <style>{`

                .vendor-orders-header {
                    animation: vendorFadeUp 0.6s ease both;
                }

                .vendor-menu-btn {
                    transition: all 0.3s ease;
                }

                .vendor-menu-btn:hover {
                    transform: rotate(5deg);
                    color: #9A7958;
                }

                .vendor-order-count {
                    animation: vendorFadeUp 0.6s ease both;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .vendor-order-count:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(43, 41, 38, 0.07);
                }

                .vendor-count-icon {
                    transition: transform 0.35s ease, background 0.35s ease;
                }

                .vendor-order-count:hover .vendor-count-icon {
                    transform: scale(1.1) rotate(-6deg);
                    background: #EDE3D5;
                }

                .vendor-order-card {
                    opacity: 0;
                    animation: vendorOrderEnter 0.6s ease forwards;
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }

                .vendor-order-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(43, 41, 38, 0.07);
                }

                .vendor-order-section h3,
                .vendor-shipping-section h3 {
                    transition: color 0.3s ease;
                }

                .vendor-order-card:hover .vendor-order-section h3,
                .vendor-order-card:hover .vendor-shipping-section h3 {
                    color: #9A7958;
                }

                .vendor-ordered-product {
                    opacity: 0;
                    animation: vendorFadeUp 0.5s ease forwards;
                }

                .vendor-ordered-image {
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }

                .vendor-ordered-image img {
                    transition: transform 0.5s ease;
                }

                .vendor-ordered-product:hover .vendor-ordered-image {
                    transform: scale(1.04);
                    box-shadow: 0 5px 15px rgba(43, 41, 38, 0.12);
                }

                .vendor-ordered-product:hover .vendor-ordered-image img {
                    transform: scale(1.08);
                }

                .vendor-item-status {
                    display: inline-block;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .vendor-item-status:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 10px rgba(43, 41, 38, 0.08);
                }

                .vendor-shipping-section {
                    transition: background 0.3s ease;
                }

                .vendor-order-card:hover .vendor-shipping-section {
                    background: #F7F4EE;
                }

                .vendor-empty-orders {
                    animation: vendorFadeUp 0.6s ease both;
                }

                .vendor-empty-orders svg {
                    animation: vendorPackageFloat 3s ease-in-out infinite;
                }

                .vendor-orders-state {
                    animation: vendorFadeUp 0.5s ease both;
                }

                @keyframes vendorFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes vendorOrderEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes vendorPackageFloat {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-7px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .vendor-orders-page *,
                    .vendor-orders-page *::before,
                    .vendor-orders-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }

            `}</style>

        </div>
    )
}

export default VendorOrders