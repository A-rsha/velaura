import React, { useEffect, useState } from 'react'
import API from '../services/axios'

function Orders() {

    const [orders, setOrders] = useState([])

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const res = await API.get('/order/getAllOrders')

                console.log("ORDERS:", res.data.orders)

                setOrders(res.data.orders || [])

            } catch (error) {

                console.log(
                    "Order error:",
                    error.response?.data || error.message
                )

            }

        }

        fetchOrders()

    }, [])


    const getStatusStyle = (status) => {

        switch (status?.toLowerCase()) {

            case "success":
                return "bg-green-100 text-green-700"

            case "failed":
                return "bg-red-100 text-red-700"

            case "pending":
                return "bg-yellow-100 text-yellow-700"

            default:
                return "bg-gray-100 text-gray-600"

        }

    }


    return (

        <div className="p-4 md:p-8 bg-[#F5F0E8] min-h-screen">

            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">

                <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-600">
                    All Orders
                </h2>


                <div className="overflow-x-auto">

                    <table className="min-w-full text-sm text-left text-gray-600">

                        <thead className="bg-black text-white uppercase text-xs">

                            <tr>

                                <th className="px-6 py-3">
                                    User
                                </th>

                                <th className="px-6 py-3">
                                    Email
                                </th>

                                <th className="px-6 py-3">
                                    Products
                                </th>

                                <th className="px-6 py-3">
                                    Amount
                                </th>

                                <th className="px-6 py-3">
                                    Payment Status
                                </th>

                                <th className="px-6 py-3">
                                    Payment Method
                                </th>

                                <th className="px-6 py-3">
                                    Date
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-gray-200">

                            {orders.map((order) => (

                                <tr
                                    key={order._id}
                                    className="hover:bg-gray-50 font-medium text-gray-900"
                                >

                                    {/* User */}

                                    <td className="px-6 py-4">
                                        {order.userId?.name || "N/A"}
                                    </td>


                                    {/* Email */}

                                    <td className="px-6 py-4">
                                        {order.userId?.email || "N/A"}
                                    </td>


                                    {/* Products */}

                                    <td className="px-6 py-4">

                                        <div className="space-y-1">

                                            {order.items?.map((item) => (

                                                <div key={item._id}>

                                                    {item.productId?.title || "Product"}{" "}
                                                    × {item.quantity}

                                                </div>

                                            ))}

                                        </div>

                                    </td>


                                    {/* Amount */}

                                    <td className="px-6 py-4">
                                        ₹{order.totalAmount || 0}
                                    </td>


                                    {/* Payment Status */}

                                    <td className="px-6 py-4">

                                        <span
                                            className={`
                                                inline-block
                                                rounded-full
                                                px-3
                                                py-1
                                                text-xs
                                                font-medium
                                                ${getStatusStyle(order.paymentStatus)}
                                            `}
                                        >
                                            {order.paymentStatus || "Pending"}
                                        </span>

                                    </td>


                                    {/* Payment Method */}

                                    <td className="px-6 py-4">
                                        {order.paymentMethod || "N/A"}
                                    </td>


                                    {/* Date */}

                                    <td className="px-6 py-4">

                                        {order.createdAt
                                            ? new Date(order.createdAt).toLocaleDateString()
                                            : "N/A"
                                        }

                                    </td>

                                </tr>

                            ))}


                            {/* No Orders */}

                            {orders.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        No orders found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    )

}

export default Orders