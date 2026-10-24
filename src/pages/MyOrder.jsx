
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/axios";
import { toast } from "react-toastify";
import { FiArrowRight, FiRotateCcw } from "react-icons/fi";

const trackingSteps = [
    { status: "placed", label: "Order Placed", icon: "📦" },
    { status: "confirmed", label: "Confirmed", icon: "✓" },
    { status: "shipped", label: "Shipped", icon: "🚚" },
    { status: "out_for_delivery", label: "Out for Delivery", icon: "🛵" },
    { status: "delivered", label: "Delivered", icon: "🎉" },
];

function MyOrder() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [myReturns, setMyReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedReturnItems, setSelectedReturnItems] = useState([]);
    const [returnReason, setReturnReason] = useState("");
    const [returnComments, setReturnComments] = useState("");
    const [selectedReturnOrder, setSelectedReturnOrder] = useState(null);
    const [returnSubmitting, setReturnSubmitting] = useState(false);

    // Fetch user's return requests
    const fetchMyReturns = async () => {
        try {
            const res = await API.get("/return/getMyReturns");

            if (res.data.success) {
                setMyReturns(res.data.returns || []);
            }
        } catch (error) {
            console.error("Unable to load return requests:", error);
        }
    };

    // Fetch orders and return requests
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await API.get("/order/getMyOrders");
            setOrders(res.data.orders || []);

            await fetchMyReturns();
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please login to view your Orders.");
            } else {
                setError("Unable to load your orders. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const canReturnOrder = (order) => {
        if (order.orderStatus !== "delivered" || !order.deliveredAt) {
            return false
        }

        const deliveredTime = new Date(order.deliveredAt).getTime();
        const returnDeadline = deliveredTime + 48 * 60 * 60 * 1000

        return Date.now() <= returnDeadline
    }

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

    // Find the return request for a specific order item, regardless of status.
    const getItemReturnRequest = (order, item) => {
        return myReturns.find((returnRequest) => {
            const returnOrderId =
                returnRequest.orderId?._id || returnRequest.orderId;

            const sameOrder = String(returnOrderId) === String(order._id);

            const sameItem = returnRequest.items?.some((returnItem) => {
                const returnItemId =
                    returnItem.orderItemId?._id || returnItem.orderItemId;

                return String(returnItemId) === String(item._id);
            });

            return sameOrder && sameItem
        });


    };

    const getReturnBadgeClass = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-yellow-100 text-yellow-800";
        }
    };

    const openReturnModal = (order) => {
        setSelectedReturnOrder(order);
        setSelectedReturnItems([]);
        setReturnReason("");
        setReturnComments("");
        setShowReturnModal(true);
    };

    const toggleReturnItem = (itemId) => {
        setSelectedReturnItems((previousItems) =>
            previousItems.includes(itemId)
                ? previousItems.filter((id) => id !== itemId)
                : [...previousItems, itemId]
        );
    };

    // Submit return request
    const handleReturnSubmit = async (e) => {
        e.preventDefault();

        if (!selectedReturnOrder) {
            toast.error("Please select a valid order.");
            return;
        }

        if (selectedReturnItems.length === 0) {
            toast.warning("Please select at least one item to return.");
            return;
        }

        if (!returnReason) {
            toast.warning("Please select a return reason.");
            return;
        }

        try {
            setReturnSubmitting(true);

            const payload = {
                orderId: selectedReturnOrder._id,

                items: selectedReturnOrder.items
                    .filter((item) =>
                        selectedReturnItems.includes(item._id)
                    )
                    .map((item) => ({
                        orderItemId: item._id,
                        quantity: item.quantity,
                    })),

                reason: returnReason,
                comments: returnComments.trim(),
            };

            const response = await API.post(
                "/return/requestReturn",
                payload
            );

            if (response.data.success) {
                toast.success(
                    response.data.message ||
                    "Return request submitted successfully."
                );

                setShowReturnModal(false);
                setSelectedReturnItems([]);
                setReturnReason("");
                setReturnComments("");
                setSelectedReturnOrder(null);

                // Refresh orders and return requests after submission.
                await fetchOrders();
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to submit return request. Please try again."
            );
        } finally {
            setReturnSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8] px-4 py-10 sm:px-5">
            <div className="mx-auto max-w-5xl">

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="font-serif text-3xl text-[#2B2926]">
                        My Orders
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View your orders and track your deliveries.
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="rounded-xl bg-white p-10 text-center text-gray-500">
                        Loading your orders...
                    </div>
                ) : error ? (
                    <div className="rounded-xl bg-white p-8 text-center">
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            onClick={fetchOrders}
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
                            const estimatedDelivery =
                                getEstimatedDelivery(order);

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
                                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${order.paymentStatus === "success"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.paymentStatus === "failed"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                Payment:{" "}
                                                {formatStatus(order.paymentStatus)}
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
                                                className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${isCancelled
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-[#F5F0E8] text-[#806347]"
                                                    }`}
                                            >
                                                {formatStatus(order.orderStatus)}
                                            </span>
                                        </div>

                                        {isCancelled ? (
                                            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                                                This order has been cancelled.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-5">
                                                {trackingSteps.map((step, index) => {
                                                    const completed =
                                                        currentStep >= index;

                                                    const date = getStatusDate(
                                                        order,
                                                        step.status
                                                    );

                                                    return (
                                                        <div
                                                            key={step.status}
                                                            className="relative flex flex-col items-center text-center"
                                                        >
                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${completed
                                                                    ? "bg-[#9A7958] text-white"
                                                                    : "bg-gray-100 text-gray-400"
                                                                    }`}
                                                            >
                                                                {completed
                                                                    ? "✓"
                                                                    : step.icon}
                                                            </div>

                                                            <p
                                                                className={`mt-2 text-xs font-medium ${completed
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
                                                                trackingSteps.length - 1 && (
                                                                    <div
                                                                        className={`absolute left-[calc(50%+24px)] top-5 hidden h-[2px] w-[calc(100%-28px)] sm:block ${currentStep > index
                                                                            ? "bg-[#9A7958]"
                                                                            : "bg-gray-200"
                                                                            }`}
                                                                    />
                                                                )}
                                                        </div>
                                                    );
                                                })}
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
                                        {order.items?.map((item) => {
                                            const returnRequest =
                                                getItemReturnRequest(order, item);

                                            return (
                                                <div
                                                    key={item._id}
                                                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                                                >
                                                    <Link
                                                        to={`/product/${item.productId?._id}`}
                                                        className="flex min-w-0 flex-1 gap-4 transition hover:bg-[#FAF7F2]"
                                                    >
                                                        <img
                                                            src={item.productId?.image}
                                                            alt={
                                                                item.productId?.title ||
                                                                "Product"
                                                            }
                                                            className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
                                                        />

                                                        <div className="flex flex-col justify-center">
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

                                                    {/* Returned item actions */}
                                                    {returnRequest && (
                                                        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                                                            <span
                                                                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getReturnBadgeClass(
                                                                    returnRequest.status
                                                                )}`}
                                                            >
                                                                Return: {formatStatus(returnRequest.status)}
                                                            </span>
                                                            {returnRequest.status === "approved" &&
                                                                returnRequest.pickupEstimatedDate && (
                                                                    <p className="text-xs text-[#806347]">
                                                                        Estimated Pickup:{" "}
                                                                        {new Date(
                                                                            returnRequest.pickupEstimatedDate
                                                                        ).toLocaleDateString("en-IN", {
                                                                            day: "numeric",
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        })}
                                                                    </p>
                                                                )
                                                            }

                                                            {returnRequest.status === "approved" && (
                                                                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                                                                    <p className="text-xs font-semibold text-amber-800">
                                                                        Refund Information
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-amber-700">
                                                                        Refund is expected to be credited within 2 hours after product pickup.
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/product/${item.productId?._id}`
                                                                    )
                                                                }
                                                                className="rounded-lg bg-[#2B2926] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#51473D]"
                                                            >
                                                                Buy Again
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Return Items */}
                                    {canReturnOrder(order) &&
                                        order.items?.some(
                                            (item) =>
                                                !getItemReturnRequest(order, item)
                                        ) && (
                                            <div className="border-t border-[#E5DED4] bg-[#F5E8D2] px-5 py-5">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <h3 className="text-base font-semibold text-[#2B2926]">
                                                            Need to return an item?
                                                        </h3>

                                                        <p className="mt-1 text-sm text-[#71665A]">
                                                            Request a return for items in this order.
                                                        </p>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toast.info(
                                                                    "Return policy will be available soon."
                                                                )
                                                            }
                                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#806347] underline underline-offset-4 transition hover:text-[#51473D]"
                                                        >
                                                            View Return Policy
                                                            <FiArrowRight size={16} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openReturnModal({
                                                                ...order,
                                                                items: order.items.filter(
                                                                    (item) =>
                                                                        !getItemReturnRequest(
                                                                            order,
                                                                            item
                                                                        )
                                                                ),
                                                            })
                                                        }
                                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#806347] px-5 py-3 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-[#51473D] active:scale-[0.98]"
                                                    >
                                                        <FiRotateCcw size={17} />
                                                        Return Items
                                                    </button>
                                                </div>
                                            </div>
                                        )}

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

            {/* Return Request Modal */}
            {showReturnModal && selectedReturnOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                        <h2 className="font-serif text-2xl text-[#2B2926]">
                            Request a Return
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Select the items you want to return.
                        </p>

                        <form onSubmit={handleReturnSubmit}>
                            {/* Select items */}
                            <div className="mt-5 space-y-3">
                                {selectedReturnOrder.items?.map((item) => (
                                    <label
                                        key={item._id}
                                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#DED7CC] p-3 transition hover:bg-[#FAF7F2]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedReturnItems.includes(
                                                item._id
                                            )}
                                            onChange={() =>
                                                toggleReturnItem(item._id)
                                            }
                                            className="h-4 w-4 accent-[#806347]"
                                        />

                                        <img
                                            src={item.productId?.image}
                                            alt={
                                                item.productId?.title ||
                                                "Product"
                                            }
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />

                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[#2B2926]">
                                                {item.productId?.title ||
                                                    "Product"}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Return reason */}
                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-[#2B2926]">
                                    Reason for return
                                </label>

                                <select
                                    value={returnReason}
                                    onChange={(e) =>
                                        setReturnReason(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-[#DED7CC] bg-white px-3 py-3 text-sm outline-none focus:border-[#806347]"
                                    required
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Damaged item">
                                        Damaged item
                                    </option>
                                    <option value="Wrong item received">
                                        Wrong item received
                                    </option>
                                    <option value="Item not as described">
                                        Item not as described
                                    </option>
                                    <option value="Quality issue">
                                        Quality issue
                                    </option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Optional comments */}
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-[#2B2926]">
                                    Additional comments (optional)
                                </label>

                                <textarea
                                    value={returnComments}
                                    onChange={(e) =>
                                        setReturnComments(e.target.value)
                                    }
                                    placeholder="Tell us more about the issue..."
                                    maxLength={1000}
                                    rows={3}
                                    className="w-full resize-none rounded-lg border border-[#DED7CC] px-3 py-3 text-sm outline-none focus:border-[#806347]"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowReturnModal(false)
                                    }
                                    disabled={returnSubmitting}
                                    className="flex-1 rounded-lg border border-[#DED7CC] px-4 py-3 text-sm font-medium text-[#2B2926] transition hover:bg-[#F5F0E8] disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={returnSubmitting}
                                    className="flex-1 rounded-lg bg-[#806347] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#51473D] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {returnSubmitting
                                        ? "Submitting..."
                                        : "Submit Return"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrder;
