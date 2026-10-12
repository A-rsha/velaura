
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/axios";

const trackingSteps = [
    { status: "placed", label: "Order Placed", icon: "📦" },
    { status: "confirmed", label: "Confirmed", icon: "✓" },
    { status: "shipped", label: "Shipped", icon: "🚚" },
    { status: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
    { status: "delivered", label: "Delivered", icon: "🎉" },
];

function MyOrder() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await API.get("/order/getMyOrders");
                setOrders(res.data.orders || []);
            } catch (error) {
                console.log(
                    "MY ORDERS ERROR:",
                    error.response?.data || error.message
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load your orders. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatStatus = (status) => {
        return (status || "placed")
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const getEstimatedDelivery = (order) => {
        if (order.estimatedDelivery) {
            return new Date(order.estimatedDelivery);
        }

        const createdAt = new Date(order.createdAt);

        if (Number.isNaN(createdAt.getTime())) {
            return null;
        }

        return new Date(
            createdAt.getTime() + 5 * 24 * 60 * 60 * 1000
        );
    };

    const getCompletedSteps = (order) => {
        const status = order.orderStatus || "placed";

        if (status === "cancelled") {
            return -1;
        }

        return trackingSteps.findIndex(
            (step) => step.status === status
        );
    };

    const getStatusDate = (order, status) => {
        const historyEntry = order.statusHistory?.find(
            (entry) => entry.status === status
        );

        if (historyEntry?.updatedAt) {
            return new Date(historyEntry.updatedAt).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                }
            );
        }

        if (status === "placed" && order.createdAt) {
            return new Date(order.createdAt).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                }
            );
        }

        if (status === "shipped" && order.shippedAt) {
            return new Date(order.shippedAt).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                }
            );
        }

        if (status === "delivered" && order.deliveredAt) {
            return new Date(order.deliveredAt).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                }
            );
        }

        return "";
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] px-4 py-10 sm:px-5">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl text-[#2B2926]">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View your orders and track your deliveries.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center text-gray-500">
                        Loading your orders...
                    </div>
                ) : error ? (
                    <div className="rounded-xl bg-white p-8 text-center">
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-lg bg-[#2B2926] px-5 py-2 text-sm text-white"
                        >
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="rounded-xl border border-[#DED7CC] bg-white p-8 text-center">
                        <p className="text-sm text-gray-500">
                            You haven't placed any orders yet.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-5 inline-block bg-[#2B2926] px-6 py-3 text-sm text-white transition hover:opacity-80"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const currentStep = getCompletedSteps(order);
                            const estimatedDelivery = getEstimatedDelivery(order);
                            const isCancelled =
                                order.orderStatus === "cancelled";

                            return (
                                <div
                                    key={order._id}
                                    className="overflow-hidden rounded-xl border border-[#DED7CC] bg-white"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col gap-3 border-b border-[#E5DED4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Order ID
                                            </p>

                                            <p className="mt-1 break-all text-sm font-medium text-[#2B2926]">
                                                {order._id}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-500">
                                                Order placed
                                            </p>

                                            <p className="mt-1 text-sm text-[#2B2926]">
                                                {order.createdAt
                                                    ? new Date(
                                                          order.createdAt
                                                      ).toLocaleDateString(
                                                          "en-IN"
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-xs text-gray-500">
                                                Total Amount
                                            </p>

                                            <p className="mt-1 text-xl font-semibold text-[#2B2926]">
                                                ₹{order.totalAmount}
                                            </p>

                                            <span
                                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                                    order.paymentStatus ===
                                                    "success"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.paymentStatus ===
                                                          "failed"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                Payment:{" "}
                                                {formatStatus(
                                                    order.paymentStatus
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Tracking */}
                                    <div className="border-b border-[#E5DED4] px-5 py-6 sm:px-6">
                                        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <h2 className="font-serif text-xl text-[#2B2926]">
                                                Order Tracking
                                            </h2>

                                            <span
                                                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                                                    isCancelled
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-[#F5F0E8] text-[#806347]"
                                                }`}
                                            >
                                                {formatStatus(
                                                    order.orderStatus
                                                )}
                                            </span>
                                        </div>

                                        {isCancelled ? (
                                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                                This order has been cancelled.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-5">
                                                {trackingSteps.map(
                                                    (step, index) => {
                                                        const completed =
                                                            currentStep >= index;

                                                        const date =
                                                            getStatusDate(
                                                                order,
                                                                step.status
                                                            );

                                                        return (
                                                            <div
                                                                key={step.status}
                                                                className="relative flex flex-col items-center text-center"
                                                            >
                                                                <div
                                                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                                                                        completed
                                                                            ? "bg-[#9A7958] text-white"
                                                                            : "bg-gray-100 text-gray-400"
                                                                    }`}
                                                                >
                                                                    {completed
                                                                        ? "✓"
                                                                        : step.icon}
                                                                </div>

                                                                <p
                                                                    className={`mt-2 text-xs font-medium ${
                                                                        completed
                                                                            ? "text-[#2B2926]"
                                                                            : "text-gray-400"
                                                                    }`}
                                                                >
                                                                    {step.label}
                                                                </p>

                                                                {date && (
                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        {date}
                                                                    </p>
                                                                )}

                                                                {index <
                                                                    trackingSteps.length -
                                                                        1 && (
                                                                    <div
                                                                        className={`absolute left-[calc(50%+24px)] top-5 hidden h-[2px] w-[calc(100%-28px)] sm:block ${
                                                                            currentStep >
                                                                            index
                                                                                ? "bg-[#9A7958]"
                                                                                : "bg-gray-200"
                                                                        }`}
                                                                    />
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        )}

                                        {order.trackingNumber && (
                                            <div className="mt-6 rounded-lg bg-[#FAF7F2] p-4">
                                                <p className="text-xs text-gray-500">
                                                    Tracking Number
                                                </p>

                                                <p className="mt-1 font-semibold text-[#2B2926]">
                                                    {order.trackingNumber}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-5 rounded-lg bg-[#FAF7F2] p-4">
                                            <p className="text-xs text-gray-500">
                                                Estimated Delivery
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-[#2B2926]">
                                                {estimatedDelivery
                                                    ? estimatedDelivery.toLocaleDateString(
                                                          "en-IN",
                                                          {
                                                              day: "numeric",
                                                              month: "short",
                                                              year: "numeric",
                                                          }
                                                      )
                                                    : "Not available yet"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Ordered Products */}
                                    <div className="divide-y divide-[#E5DED4]">
                                        {order.items?.map((item) => (
                                            <Link
                                                key={item._id}
                                                to={`/product/${item.productId?._id}`}
                                                className="flex gap-4 p-5 transition hover:bg-[#FAF7F2]"
                                            >
                                                <img
                                                    src={item.productId?.image}
                                                    alt={
                                                        item.productId?.title ||
                                                        "Product"
                                                    }
                                                    className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
                                                />

                                                <div className="flex flex-1 flex-col justify-center">
                                                    <h3 className="text-sm font-medium text-[#2B2926] sm:text-base">
                                                        {item.productId?.title ||
                                                            "Product"}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-600">
                                                        ₹{item.price}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Shipping and Payment */}
                                    <div className="grid gap-5 border-t border-[#E5DED4] px-5 py-5 sm:grid-cols-2">
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Shipping Address
                                            </p>

                                            <p className="mt-1 text-sm text-[#2B2926]">
                                                {order.shippingAddress}
                                            </p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-xs text-gray-500">
                                                Payment Method
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-[#2B2926]">
                                                {order.paymentMethod || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrder;

