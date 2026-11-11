import React, { useEffect, useState } from 'react'
import { FiUser, FiRefreshCw, FiMail, FiPhone } from 'react-icons/fi'
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
    <div className='min-h-screen bg-[#F5F0E8]'>
        <AdminSidebar/>

        <main className="min-h-screen lg:ml-64">
            <header className="border-b border-[#DED5C8] bg-[#FDFBF7]">
                    <div className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-10">

                        <div>
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
                            className="flex h-10 w-10 items-center justify-center border border-[#DED5C8] bg-white text-[#2B2926] hover:bg-[#F5F0E8]"
                        >
                            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
                        </button>

                    </div>
                </header>

                <div className="px-5 py-8 sm:px-8 lg:px-10">
                     <div className="mx-auto max-w-7xl">
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="border border-[#DED5C8] bg-[#FDFBF7] p-5">
                                    <div className="flex items-center justify-between">
                                                                            <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Total Vendors
                                        </p>

                                        <h2 className="mt-3 font-serif text-3xl text-[#2B2926]">
                                            {vendors.length}
                                        </h2>
                                    </div>
                                    <FiUser size={25} className="text-[#9A7958]"/>

                                    </div>
                              </div>

                               <div className="border border-[#DED5C8] bg-[#FDFBF7] p-5">
                                 <div className="flex items-center justify-between">

                                     <div>
                                        <p className="text-xs uppercase tracking-wider text-gray-400">
                                            Active Vendors
                                        </p>

                                        <h2 className="mt-3 font-serif text-3xl text-[#2B2926]">
                                            {vendors.filter(v => getStatus(v) === 'Active').length}
                                        </h2>
                                    </div>
                     
                                 </div>
                               </div>
                        </div>
                                                <section className="border border-[#DED5C8] bg-[#FDFBF7]">

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
                                    className="border border-[#DED5C8] bg-white px-4 py-2 text-sm outline-none"
                                >
                                    <option value="all">All Vendors</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="expired">Expired</option>
                                </select>

                            </div>

                            {loading ? (

                                <div className="py-16 text-center text-sm text-gray-500">
                                    <FiRefreshCw className="mx-auto mb-3 animate-spin" size={24} />
                                    Loading vendors...
                                </div>

                            ) : filteredVendors.length === 0 ? (

                                <div className="py-16 text-center">
                                    <FiUsers className="mx-auto mb-3 text-gray-300" size={35} />

                                    <p className="text-sm text-gray-500">
                                        No vendors found
                                    </p>
                                </div>

                            ) : (

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
                                                    <tr key={vendor._id} className="hover:bg-[#FAF7F1]">

                                                        <td className="px-5 py-4">
                                                            <p className="text-sm font-medium text-[#2B2926]">
                                                                {vendor.name}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {vendor.email}
                                                            </p>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <p className="text-sm text-[#2B2926]">
                                                                {vendor.store?.storeName || 'Not registered'}
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                {vendor.store?.city || '-'}
                                                            </p>
                                                        </td>

                                                        <td className="px-5 py-4 text-sm text-gray-600">
                                                            {vendor.store?.phone || '-'}
                                                        </td>

                                                        <td className="px-5 py-4 text-sm capitalize text-[#2B2926]">
                                                            {vendor.subscription?.plan || '-'}
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(status)}`}>
                                                                {status}
                                                            </span>
                                                        </td>

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