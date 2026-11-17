import React, { useEffect, useState } from 'react'
import {
    FiUser,
    FiUsers,
    FiRefreshCw,
    FiArrowUpRight
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import AdminSidebar from '../components/AdminSidebar'
import { getAllVendors } from '../services/api'

function VendorList() {
    const [vendors, setVendors] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const fetchVendors = async () => {
        try {
            setLoading(true)

            const response = await getAllVendors()

            if (response.data.success) {
                setVendors(response.data.vendors || [])
            }

        } catch (error) {
            console.error('Vendor fetch error:', error)
            toast.error(
                error.response?.data?.message || 'Failed to load vendors'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVendors()
    }, [])

    const getStatus = (vendor) => {
        const status = vendor.subscription?.status || 'inactive'

        if (status === 'active') return 'Active'
        if (status === 'expired') return 'Expired'

        return 'Pending'
    }

    const filteredVendors = vendors.filter(vendor => {
        if (filter === 'all') return true

        return getStatus(vendor).toLowerCase() === filter
    })

    const statusStyle = (status) => {
        if (status === 'Active') {
            return 'bg-green-100 text-green-700'
        }

        if (status === 'Expired') {
            return 'bg-red-100 text-red-700'
        }

        return 'bg-yellow-100 text-yellow-700'
    }

    return (
        <div className="vendor-list-page min-h-screen bg-[#F5F0E8]">

            <style>{`
                @keyframes vendorListFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes vendorListFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes vendorListPop {
                    0% {
                        opacity: 0;
                        transform: scale(.92);
                    }
                    70% {
                        transform: scale(1.03);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes vendorListShine {
                    from { left: -120%; }
                    to { left: 130%; }
                }

                .vendor-list-main {
                    animation: vendorListFadeUp .6s ease both;
                }

                .vendor-list-header {
                    animation: vendorListFade .6s ease both;
                }

                .vendor-list-heading {
                    animation: vendorListFadeUp .6s .1s both;
                }

                .vendor-list-stat {
                    animation: vendorListFadeUp .6s ease both;
                    transition:
                        transform .3s ease,
                        box-shadow .3s ease,
                        border-color .3s ease;
                }

                .vendor-list-stat:nth-child(2) {
                    animation-delay: .14s;
                }

                .vendor-list-stat:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 14px 28px rgba(43,41,38,.08);
                    border-color: #BBA88F;
                }

                .vendor-list-stat-icon {
                    transition: transform .35s ease, color .3s ease;
                }

                .vendor-list-stat:hover .vendor-list-stat-icon {
                    transform: rotate(-8deg) scale(1.12);
                    color: #6F5235;
                }

                .vendor-list-section {
                    animation: vendorListFadeUp .7s .18s both;
                    transition: box-shadow .3s ease;
                }

                .vendor-list-section:hover {
                    box-shadow: 0 12px 28px rgba(43,41,38,.045);
                }

                .vendor-list-refresh {
                    transition:
                        transform .3s ease,
                        background .25s ease,
                        border-color .25s ease;
                }

                .vendor-list-refresh:hover {
                    transform: translateY(-2px);
                    background: #F5F0E8;
                    border-color: #BBA88F;
                }

                .vendor-list-select {
                    transition:
                        border-color .25s ease,
                        box-shadow .25s ease;
                }

                .vendor-list-select:hover {
                    border-color: #BBA88F;
                }

                .vendor-list-select:focus {
                    border-color: #9A7958;
                    box-shadow: 0 0 0 3px rgba(154,121,88,.12);
                }

                .vendor-list-row {
                    animation: vendorListFadeUp .45s ease both;
                    transition: background .25s ease;
                }

                .vendor-list-row:hover {
                    background: #FAF7F1;
                }

                .vendor-list-row:nth-child(1) { animation-delay: .04s; }
                .vendor-list-row:nth-child(2) { animation-delay: .09s; }
                .vendor-list-row:nth-child(3) { animation-delay: .14s; }
                .vendor-list-row:nth-child(4) { animation-delay: .19s; }
                .vendor-list-row:nth-child(5) { animation-delay: .24s; }
                .vendor-list-row:nth-child(6) { animation-delay: .29s; }
                .vendor-list-row:nth-child(7) { animation-delay: .34s; }
                .vendor-list-row:nth-child(8) { animation-delay: .39s; }

                .vendor-list-name {
                    transition: color .25s ease;
                }

                .vendor-list-row:hover .vendor-list-name {
                    color: #9A7958;
                }

                .vendor-list-badge {
                    transition: transform .25s ease, box-shadow .25s ease;
                }

                .vendor-list-row:hover .vendor-list-badge {
                    transform: scale(1.06);
                    box-shadow: 0 3px 8px rgba(43,41,38,.06);
                }

                .vendor-list-empty {
                    animation: vendorListFadeUp .5s ease both;
                }

                .vendor-list-empty-icon {
                    animation: vendorListPop .6s ease both;
                }

                .vendor-list-arrow {
                    transition: transform .25s ease;
                }

                .vendor-list-stat:hover .vendor-list-arrow {
                    transform: translate(3px, -3px);
                }

                @media (prefers-reduced-motion: reduce) {
                    .vendor-list-page *,
                    .vendor-list-page *::before,
                    .vendor-list-page *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            <AdminSidebar />

            <main className="vendor-list-main min-h-screen lg:ml-64">

                {/* HEADER */}
                <header className="vendor-list-header border-b border-[#DED5C8] bg-[#FDFBF7]">
                    <div className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-10">

                        <div className="vendor-list-heading">
                            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400">
                                VELAURA ADMIN
                            </p>

                            <h1 className="mt-1 font-serif text-2xl text-[#2B2926] sm:text-3xl">
                                Vendor Management
                            </h1>
                        </div>

                        <button
                            onClick={fetchVendors}
                            disabled={loading}
                            className="vendor-list-refresh flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white text-[#2B2926] disabled:opacity-50"
                            title="Refresh vendors"
                        >
                            <FiRefreshCw
                                className={loading ? 'animate-spin' : ''}
                            />
                        </button>

                    </div>
                </header>

                {/* PAGE CONTENT */}
                <div className="px-5 py-8 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-7xl">

                        {/* STATISTICS */}
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* TOTAL VENDORS */}
                            <div className="vendor-list-stat border border-[#DED5C8] bg-[#FDFBF7] p-5">
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Total Vendors
                                        </p>

                                        <h2 className="mt-3 font-serif text-3xl text-[#2B2926]">
                                            {vendors.length}
                                        </h2>
                                    </div>

                                    <FiUser
                                        size={25}
                                        className="vendor-list-stat-icon text-[#9A7958]"
                                    />

                                </div>
                            </div>

                            {/* ACTIVE VENDORS */}
                            <div className="vendor-list-stat border border-[#DED5C8] bg-[#FDFBF7] p-5">
                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Active Vendors
                                        </p>

                                        <h2 className="mt-3 font-serif text-3xl text-[#2B2926]">
                                            {vendors.filter(v => getStatus(v) === 'Active').length}
                                        </h2>
                                    </div>

                                    <div className="vendor-list-stat-icon flex h-10 w-10 items-center justify-center bg-[#F0EAE0] text-[#9A7958]">
                                        <FiUsers size={23} />
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* VENDOR TABLE */}
                        <section className="vendor-list-section border border-[#DED5C8] bg-[#FDFBF7]">

                            <div className="flex flex-col justify-between gap-4 border-b border-[#DED5C8] p-5 sm:flex-row sm:items-center">

                                <div>
                                    <h2 className="font-serif text-xl text-[#2B2926]">
                                        All Vendors
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Manage registered VELAURA sellers
                                    </p>
                                </div>

                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="vendor-list-select border border-[#DED5C8] bg-white px-4 py-2 text-sm outline-none"
                                >
                                    <option value="all">All Vendors</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="expired">Expired</option>
                                </select>

                            </div>

                            {/* LOADING */}
                            {loading ? (

                                <div className="vendor-list-empty py-16 text-center text-sm text-gray-500">
                                    <FiRefreshCw
                                        className="mx-auto mb-3 animate-spin"
                                        size={24}
                                    />
                                    Loading vendors...
                                </div>

                            ) : filteredVendors.length === 0 ? (

                                /* EMPTY STATE */
                                <div className="vendor-list-empty py-16 text-center">

                                    <FiUsers
                                        className="vendor-list-empty-icon mx-auto mb-3 text-gray-300"
                                        size={35}
                                    />

                                    <p className="text-sm text-gray-500">
                                        No vendors found
                                    </p>

                                </div>

                            ) : (

                                /* TABLE */
                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[850px] text-left">

                                        <thead className="bg-[#F5F0E8] text-xs uppercase tracking-wider text-gray-500">
                                            <tr>
                                                <th className="px-5 py-4">Vendor</th>
                                                <th className="px-5 py-4">Store</th>
                                                <th className="px-5 py-4">Contact</th>
                                                <th className="px-5 py-4">Plan</th>
                                                <th className="px-5 py-4">Status</th>
                                                <th className="px-5 py-4">Joined Date</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-[#DED5C8]">

                                            {filteredVendors.map(vendor => {

                                                const status = getStatus(vendor)

                                                return (
                                                    <tr
                                                        key={vendor._id}
                                                        className="vendor-list-row"
                                                    >

                                                        {/* VENDOR */}
                                                        <td className="px-5 py-4">
                                                            <p className="vendor-list-name text-sm font-medium text-[#2B2926]">
                                                                {vendor.name}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {vendor.email}
                                                            </p>
                                                        </td>

                                                        {/* STORE */}
                                                        <td className="px-5 py-4">
                                                            <p className="text-sm text-[#2B2926]">
                                                                {vendor.store?.storeName || 'Not registered'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {vendor.store?.city || '-'}
                                                            </p>
                                                        </td>

                                                        {/* CONTACT */}
                                                        <td className="px-5 py-4 text-sm text-gray-600">
                                                            {vendor.store?.phone || '-'}
                                                        </td>

                                                        {/* PLAN */}
                                                        <td className="px-5 py-4 text-sm capitalize text-[#2B2926]">
                                                            {vendor.subscription?.plan || '-'}
                                                        </td>

                                                        {/* STATUS */}
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`vendor-list-badge inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyle(status)}`}
                                                            >
                                                                {status}
                                                            </span>
                                                        </td>

                                                        {/* JOINED DATE */}
                                                        <td className="px-5 py-4 text-sm text-gray-500">
                                                            {vendor.createdAt
                                                                ? new Date(vendor.createdAt).toLocaleDateString('en-IN')
                                                                : '-'}
                                                        </td>

                                                    </tr>
                                                )
                                            })}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </section>

                    </div>
                </div>

            </main>
        </div>
    )
}

export default VendorList