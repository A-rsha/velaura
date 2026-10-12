
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
        <div className="min-h-screen bg-[#F5F0E8] p-4 md:p-8">
            <AdminSidebar />

            <div className="rounded-2xl bg-white p-4 shadow-lg md:p-8 lg:ml-64">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-[#2B2926] md:text-2xl">
                        All Orders
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View orders and manage their delivery status.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                {loading ? (
                    <div className="py-10 text-center text-gray-500">
                        Loading orders...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-[1200px] w-full text-left text-sm text-gray-600">
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
                                            className="font-medium text-gray-900 hover:bg-[#FAF8F4]"
                                        >
                                            <td className="px-5 py-4">
                                                {order.userId?.name || 'N/A'}
                                            </td>

                                            <td className="px-5 py-4">
                                                {order.userId?.email || 'N/A'}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="space-y-2">
                                                    {order.items?.map((item) => (
                                                        <div key={item._id}>
                                                            {item.productId?.title || 'Product'}
                                                            {' × '}
                                                            {item.quantity}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                ₹{order.totalAmount || 0}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-xs ${getStatusStyle(order.paymentStatus)}`}
                                                >
                                                    {formatStatus(order.paymentStatus)}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {order.paymentMethod || 'N/A'}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs ${getStatusStyle(order.orderStatus)}`}
                                                >
                                                    {formatStatus(order.orderStatus)}
                                                </span>

                                                {order.trackingNumber && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Tracking: {order.trackingNumber}
                                                    </p>
                                                )}
                                            </td>

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
                                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#9A7958] disabled:bg-gray-100"
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
                                                        className="rounded-lg bg-[#9A7958] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#806347] disabled:cursor-not-allowed disabled:opacity-50"
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

                                {orders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="px-5 py-10 text-center text-gray-500"
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

