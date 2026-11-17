import React, { useEffect, useState } from 'react'
import API from '../services/axios'
import AdminSidebar from '../components/AdminSidebar'

function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [selectedStatuses, setSelectedStatuses] = useState({})

    const orderStatuses = [
        'confirmed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled'
    ]

    const fetchOrders = async () => {
        try {
            setLoading(true)
            setError('')

            const res = await API.get('/order/getAllOrders')
            const fetchedOrders = res.data.orders || []

            setOrders(fetchedOrders)

            const statuses = {}

            fetchedOrders.forEach((order) => {
                statuses[order._id] = order.orderStatus || 'placed'
            })

            setSelectedStatuses(statuses)
        } catch (error) {
            console.log(
                'Order error:',
                error.response?.data || error.message
            )

            setError(
                error.response?.data?.message ||
                'Failed to load orders. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
            case 'delivered':
            case 'confirmed':
                return 'bg-green-100 text-green-700'

            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-700'

            case 'pending':
            case 'placed':
                return 'bg-yellow-100 text-yellow-700'

            case 'shipped':
                return 'bg-blue-100 text-blue-700'

            case 'out_for_delivery':
                return 'bg-purple-100 text-purple-700'

            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const formatStatus = (status) => {
        if (!status) return 'Pending'

        return status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const handleStatusChange = (orderId, status) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [orderId]: status
        }))
    }

    const updateOrderStatus = async (orderId) => {
        const newStatus = selectedStatuses[orderId]

        try {
            setUpdatingId(orderId)
            setError('')
            setSuccess('')

            await API.put(`/order/updateStatus/${orderId}`, {
                orderStatus: newStatus
            })

            setSuccess('Order status updated successfully!')

            await fetchOrders()
        } catch (error) {
            console.log(
                'Update status error:',
                error.response?.data || error.message
            )

            setError(
                error.response?.data?.message ||
                'Failed to update order status.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="orders-page min-h-screen bg-[#F5F0E8] p-4 md:p-8">

            <style>{`

                /* Page entrance */

                .orders-page {
                    animation: ordersPageEnter 0.7s ease-out both;
                }

                @keyframes ordersPageEnter {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* Main container */

                .orders-container {
                    animation: ordersContainerEnter 0.8s ease-out both;
                    transition: box-shadow 0.4s ease;
                }

                .orders-container:hover {
                    box-shadow: 0 18px 45px rgba(43, 41, 38, 0.10);
                }

                @keyframes ordersContainerEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Heading */

                .orders-heading {
                    animation: ordersFadeUp 0.7s ease-out both;
                    animation-delay: 0.2s;
                }

                .orders-heading h2 {
                    transition: letter-spacing 0.3s ease;
                }

                .orders-heading h2:hover {
                    letter-spacing: 0.5px;
                }

                @keyframes ordersFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Table wrapper */

                .orders-table-wrapper {
                    animation: ordersFadeUp 0.8s ease-out both;
                    animation-delay: 0.3s;
                }

                /* Table header */

                .orders-table thead th {
                    transition: background 0.3s ease;
                }

                .orders-table thead th:hover {
                    background: #403c37;
                }

                /* Table rows */

                .orders-table tbody tr {
                    animation: orderRowEnter 0.5s ease-out both;
                    transition:
                        background 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .orders-table tbody tr:nth-child(1) {
                    animation-delay: 0.1s;
                }

                .orders-table tbody tr:nth-child(2) {
                    animation-delay: 0.15s;
                }

                .orders-table tbody tr:nth-child(3) {
                    animation-delay: 0.2s;
                }

                .orders-table tbody tr:nth-child(4) {
                    animation-delay: 0.25s;
                }

                .orders-table tbody tr:nth-child(5) {
                    animation-delay: 0.3s;
                }

                .orders-table tbody tr:nth-child(n+6) {
                    animation-delay: 0.35s;
                }

                @keyframes orderRowEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .orders-table tbody tr:hover {
                    background: #FAF8F4;
                }

                .orders-table tbody td {
                    transition: color 0.3s ease;
                }

                /* Status badges */

                .order-status-badge {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .order-status-badge:hover {
                    transform: translateY(-2px) scale(1.04);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                }

                /* Product text */

                .order-product {
                    transition:
                        transform 0.3s ease,
                        color 0.3s ease;
                }

                .order-product:hover {
                    transform: translateX(4px);
                    color: #9A7958;
                }

                /* Tracking number */

                .order-tracking {
                    transition: color 0.3s ease;
                }

                .order-tracking:hover {
                    color: #9A7958;
                }

                /* Select */

                .order-select {
                    transition:
                        border-color 0.3s ease,
                        box-shadow 0.3s ease,
                        transform 0.3s ease;
                }

                .order-select:hover {
                    border-color: #9A7958;
                }

                .order-select:focus {
                    border-color: #9A7958;
                    box-shadow: 0 0 0 3px rgba(154, 121, 88, 0.15);
                    transform: translateY(-1px);
                }

                /* Update button */

                .order-update-btn {
                    position: relative;
                    overflow: hidden;
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        background 0.3s ease;
                }

                .order-update-btn::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.3),
                        transparent
                    );
                    transition: left 0.6s ease;
                }

                .order-update-btn:hover::before {
                    left: 140%;
                }

                .order-update-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 7px 16px rgba(154, 121, 88, 0.3);
                }

                .order-update-btn:active:not(:disabled) {
                    transform: scale(0.97);
                }

                /* Alerts */

                .orders-alert {
                    animation: ordersAlertEnter 0.4s ease-out both;
                }

                @keyframes ordersAlertEnter {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Loading */

                .orders-loader {
                    width: 32px;
                    height: 32px;
                    border: 3px solid #DED5C8;
                    border-top-color: #9A7958;
                    border-radius: 50%;
                    animation: ordersSpin 0.8s linear infinite;
                    margin: 0 auto 12px;
                }

                @keyframes ordersSpin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* Empty state */

                .orders-empty {
                    animation: ordersFadeUp 0.6s ease-out both;
                }

                /* Reduced motion */

                @media (prefers-reduced-motion: reduce) {
                    .orders-page *,
                    .orders-page *::before,
                    .orders-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }

            `}</style>

            <AdminSidebar />

            <div className="orders-container rounded-2xl bg-white p-4 shadow-lg md:p-8 lg:ml-64">

                {/* Heading */}

                <div className="orders-heading mb-6">

                    <h2 className="text-xl font-bold text-[#2B2926] md:text-2xl">
                        All Orders
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View orders and manage their delivery status.
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="orders-alert mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>

                )}


                {/* Success */}

                {success && (

                    <div className="orders-alert mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                        {success}
                    </div>

                )}


                {/* Loading / Orders */}

                {loading ? (

                    <div className="py-10 text-center text-gray-500">

                        <div className="orders-loader"></div>

                        <p className="text-sm">
                            Loading orders...
                        </p>

                    </div>

                ) : (

                    <div className="orders-table-wrapper overflow-x-auto">

                        <table className="orders-table min-w-[1200px] w-full text-left text-sm text-gray-600">

                            <thead className="bg-[#2B2926] text-xs uppercase text-white">

                                <tr>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Email</th>
                                    <th className="px-5 py-4">Products</th>
                                    <th className="px-5 py-4">Amount</th>
                                    <th className="px-5 py-4">Payment</th>
                                    <th className="px-5 py-4">Method</th>
                                    <th className="px-5 py-4">Order Date</th>
                                    <th className="px-5 py-4">Order Status</th>
                                    <th className="px-5 py-4">Update Status</th>
                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-200">

                                {orders.map((order) => {

                                    const isFinalStatus = [
                                        'delivered',
                                        'cancelled'
                                    ].includes(order.orderStatus)

                                    return (

                                        <tr
                                            key={order._id}
                                            className="font-medium text-gray-900"
                                        >

                                            {/* User */}

                                            <td className="px-5 py-4">
                                                {order.userId?.name || 'N/A'}
                                            </td>


                                            {/* Email */}

                                            <td className="px-5 py-4">
                                                {order.userId?.email || 'N/A'}
                                            </td>


                                            {/* Products */}

                                            <td className="px-5 py-4">

                                                <div className="space-y-2">

                                                    {order.items?.map((item) => (

                                                        <div
                                                            key={item._id}
                                                            className="order-product"
                                                        >
                                                            {item.productId?.title || 'Product'}
                                                            {' × '}
                                                            {item.quantity}
                                                        </div>

                                                    ))}

                                                </div>

                                            </td>


                                            {/* Amount */}

                                            <td className="whitespace-nowrap px-5 py-4">
                                                ₹{order.totalAmount || 0}
                                            </td>


                                            {/* Payment */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`
                                                        order-status-badge
                                                        inline-block
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        ${getStatusStyle(order.paymentStatus)}
                                                    `}
                                                >
                                                    {formatStatus(order.paymentStatus)}
                                                </span>

                                            </td>


                                            {/* Method */}

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {order.paymentMethod || 'N/A'}
                                            </td>


                                            {/* Order Date */}

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>


                                            {/* Order Status */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`
                                                        order-status-badge
                                                        inline-block
                                                        whitespace-nowrap
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        ${getStatusStyle(order.orderStatus)}
                                                    `}
                                                >
                                                    {formatStatus(order.orderStatus)}
                                                </span>

                                                {order.trackingNumber && (

                                                    <p className="order-tracking mt-2 text-xs text-gray-500">
                                                        Tracking: {order.trackingNumber}
                                                    </p>

                                                )}

                                            </td>


                                            {/* Update Status */}

                                            <td className="px-5 py-4">

                                                <div className="flex min-w-[190px] flex-col gap-2">

                                                    <select
                                                        value={
                                                            selectedStatuses[order._id] ||
                                                            order.orderStatus ||
                                                            'placed'
                                                        }
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                order._id,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={
                                                            isFinalStatus ||
                                                            updatingId === order._id
                                                        }
                                                        className="
                                                            order-select
                                                            rounded-lg
                                                            border
                                                            border-gray-300
                                                            bg-white
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            outline-none
                                                            disabled:bg-gray-100
                                                        "
                                                    >

                                                        {!orderStatuses.includes(
                                                            selectedStatuses[order._id]
                                                        ) && (

                                                            <option value={order.orderStatus}>
                                                                {formatStatus(order.orderStatus)}
                                                            </option>

                                                        )}

                                                        {orderStatuses.map((status) => (

                                                            <option
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {formatStatus(status)}
                                                            </option>

                                                        ))}

                                                    </select>


                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus(order._id)
                                                        }
                                                        disabled={
                                                            isFinalStatus ||
                                                            updatingId === order._id ||
                                                            selectedStatuses[order._id] ===
                                                                order.orderStatus
                                                        }
                                                        className="
                                                            order-update-btn
                                                            rounded-lg
                                                            bg-[#9A7958]
                                                            px-3
                                                            py-2
                                                            text-sm
                                                            font-semibold
                                                            text-white
                                                            hover:bg-[#806347]
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                    >

                                                        {updatingId === order._id
                                                            ? 'Updating...'
                                                            : 'Update Status'}

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )

                                })}


                                {/* Empty State */}

                                {orders.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="9"
                                            className="orders-empty px-5 py-10 text-center text-gray-500"
                                        >
                                            No orders found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    )
}

export default Orders