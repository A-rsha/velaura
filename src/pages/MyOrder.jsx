
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/axios";

function MyOrder() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const res = await API.get("/order/getMyOrders");

                console.log(
                    "MY ORDERS:",
                    JSON.stringify(res.data, null, 2)
                );

                setOrders(res.data.orders || []);

            } catch (error) {

                console.log(
                    "MY ORDERS ERROR:",
                    error.response?.data || error
                );

            }

        };

        fetchOrders();

    }, []);


    return (

        <div className="min-h-screen bg-[#F5F0E8] px-5 py-10">

            <div className="mx-auto max-w-5xl">


                <div className="mb-8">

                    <h1 className="font-serif text-3xl text-[#2B2926]">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View your recent orders and delivery details
                    </p>

                </div>


                

                {orders.length === 0 ? (

                    <div className="rounded-xl border border-[#DED7CC] bg-white p-8 text-center">

                        <p className="text-sm text-gray-500">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/shop"
                            className="
                                mt-5
                                inline-block
                                bg-[#2B2926]
                                px-6
                                py-3
                                text-sm
                                text-white
                                transition
                                hover:opacity-80
                            "
                        >
                            Start Shopping
                        </Link>

                    </div>

                ) : (


                    <div className="space-y-6">

                        {orders.map((order) => (

                            <div
                                key={order._id}
                                className="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-[#DED7CC]
                                    bg-white
                                "
                            >

                               

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                        border-b
                                        border-[#E5DED4]
                                        px-5
                                        py-4
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Order placed
                                        </p>

                                        <p className="mt-1 text-sm text-[#2B2926]">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </p>

                                    </div>


                                    <div className="text-left sm:text-right">

                                        <p className="text-xs text-gray-500">
                                            Total
                                        </p>

                                        <p className="mt-1 font-medium text-[#2B2926]">
                                            ₹{order.totalAmount}
                                        </p>

                                    </div>

                                </div>


                              

                                <div className="divide-y divide-[#E5DED4]">

                                    {order.items.map((item) => (

                                        <Link
                                            key={item._id}
                                            to={`/product/${item.productId?._id}`}
                                            className="
                                                flex
                                                gap-4
                                                p-5
                                                transition
                                                hover:bg-[#FAF7F2]
                                            "
                                        >

                                           

                                            <img
                                                src={item.productId?.image}
                                                alt={item.productId?.title}
                                                className="
                                                    h-24
                                                    w-24
                                                    shrink-0
                                                    rounded-lg
                                                    object-cover
                                                "
                                            />



                                            <div className="flex flex-1 flex-col justify-center">

                                                <h2 className="text-sm font-medium text-[#2B2926] sm:text-base">
                                                    {item.productId?.title}
                                                </h2>

                                                <p className="mt-1 text-sm text-gray-600">
                                                    ₹{item.price}
                                                </p>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>

                                            </div>

                                        </Link>

                                    ))}

                                </div>


                             

                                <div
                                    className="
                                        grid
                                        gap-4
                                        border-t
                                        border-[#E5DED4]
                                        px-5
                                        py-5
                                        sm:grid-cols-2
                                    "
                                >


                                    <div>

                                        <p className="text-xs text-gray-500">
                                            Estimated Delivery
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2B2926]">

                                            {new Date(
                                                new Date(order.createdAt).getTime() +
                                                5 * 24 * 60 * 60 * 1000
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}

                                        </p>

                                    </div>


                
                                    <div className="sm:text-right">

                                        <p className="text-xs text-gray-500">
                                            Payment
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-green-700">
                                            {order.paymentMethod} · Paid
                                        </p>

                                    </div>

                                </div>



                                <div className="border-t border-[#E5DED4] px-5 py-4">

                                    <p className="text-xs text-gray-500">
                                        Shipping Address
                                    </p>

                                    <p className="mt-1 text-sm text-[#2B2926]">
                                        {order.shippingAddress}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default MyOrder;

