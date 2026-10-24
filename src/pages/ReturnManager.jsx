
import React, { useEffect, useState } from "react";
import { FiRotateCcw, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import AdminSidebar from "../components/AdminSidebar";
import API from "../services/axios";
import { toast } from "react-toastify";

function ReturnManager() {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchReturns = async () => {
        try {
            setLoading(true);


            const response = await API.get('/return/getAllReturns');

            setReturns(response.data.returns || []);
        } catch (error) {
            console.error("Fetch returns error:", error);
            toast.error(
                error.response?.data?.message || "Unable to fetch return requests"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturns();
    }, []);

    const handleStatusUpdate = async (returnId, status) => {
        try {
            setUpdatingId(returnId);

            await API.put(`/return/updateReturnStatus/${returnId}`, {
                status
            });

            toast.success(
                status === "approved"
                    ? "Return request approved"
                    : "Return request rejected"
            );

            await fetchReturns();
        } catch (error) {
            console.error("Update return status error:", error);
            toast.error(
                error.response?.data?.message ||
                "Unable to update return request"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-amber-100 text-amber-700";
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F0E8]">
            <AdminSidebar />

            <main className="min-h-screen px-4 py-8 sm:px-8 lg:ml-64 lg:px-10">
                <div className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-gray-500">
                                Velaura Admin
                            </p>

                            <h1 className="font-serif text-3xl text-[#2B2926] sm:text-4xl">
                                Return Management
                            </h1>

                            <p className="mt-2 text-sm text-gray-600">
                                Review and manage customer return requests.
                            </p>
                        </div>

                        <button
                            onClick={fetchReturns}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-lg border border-[#2B2926] px-4 py-3 text-sm text-[#2B2926] transition hover:bg-[#2B2926] hover:text-white disabled:opacity-50"
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            <p className="text-sm text-gray-500">Total Requests</p>
                            <h2 className="mt-2 text-3xl font-semibold text-[#2B2926]">
                                {returns.length}
                            </h2>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            <p className="text-sm text-gray-500">Pending Requests</p>
                            <h2 className="mt-2 text-3xl font-semibold text-amber-600">
                                {returns.filter(item => item.status === "requested").length}
                            </h2>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-5">
                            <p className="text-sm text-gray-500">Approved Requests</p>
                            <h2 className="mt-2 text-3xl font-semibold text-green-700">
                                {returns.filter(item => item.status === "approved").length}
                            </h2>
                        </div>
                    </div>

                    {/* Return requests */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
                            <FiRotateCcw size={20} className="text-[#2B2926]" />
                            <h2 className="font-serif text-xl text-[#2B2926]">
                                Customer Return Requests
                            </h2>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-gray-500">
                                Loading return requests...
                            </div>
                        ) : returns.length === 0 ? (
                            <div className="p-12 text-center">
                                <FiRotateCcw className="mx-auto mb-3 text-3xl text-gray-400" />
                                <p className="font-medium text-[#2B2926]">
                                    No return requests found
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Customer return requests will appear here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {returns.map((item) => (
                                    <div key={item._id} className="p-5 sm:p-6">

                                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-gray-500">
                                                    Return Request
                                                </p>

                                                <h3 className="mt-1 break-all font-medium text-[#2B2926]">
                                                    #{item._id}
                                                </h3>

                                                <p className="mt-2 text-sm text-gray-500">
                                                    Requested on:{" "}
                                                    {item.createdAt
                                                        ? new Date(item.createdAt).toLocaleDateString()
                                                        : "N/A"}
                                                </p>
                                            </div>

                                            <span
                                                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(item.status)}`}
                                            >
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

                                            <div>
                                                <p className="mb-2 text-sm font-semibold text-[#2B2926]">
                                                    Customer & Order
                                                </p>

                                                <p className="break-all text-sm text-gray-600">
                                                    Customer ID: {item.userId?._id || item.userId || "N/A"}
                                                </p>

                                                <p className="mt-1 break-all text-sm text-gray-600">
                                                    Order ID: {item.orderId?._id || item.orderId || "N/A"}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-2 text-sm font-semibold text-[#2B2926]">
                                                    Return Reason
                                                </p>

                                                <p className="text-sm text-gray-700">
                                                    {item.reason}
                                                </p>

                                                {item.comments && (
                                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm text-gray-500">
                                                        {item.comments}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <p className="mb-3 text-sm font-semibold text-[#2B2926]">
                                                Returned Products
                                            </p>

                                            <div className="space-y-3">
                                                {item.items?.map((returnItem, index) => (
                                                    <div
                                                        key={returnItem._id || index}
                                                        className="flex items-center gap-3 rounded-lg bg-[#F5F0E8] p-3"
                                                    >
                                                        {returnItem.productId?.images?.[0] && (
                                                            <img
                                                                src={returnItem.productId.images[0]}
                                                                alt={returnItem.productId.title || "Product"}
                                                                className="h-16 w-16 rounded-md bg-white object-cover"
                                                            />
                                                        )}

                                                        <div className="min-w-0 flex-1">
                                                            <p className="break-words text-sm font-medium text-[#2B2926]">
                                                                {returnItem.productId?.title || "Product"}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-600">
                                                                Quantity: {returnItem.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ReturnManager;

