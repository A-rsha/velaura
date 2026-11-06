import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { sellerCreateStore, getMySellerStore } from '../services/api'
import { useNavigate } from 'react-router-dom'




function VendorForm() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        storeName: "",
        businessDescription: "",
        phone: '',
        address: "",
        city: '',
        state: "",
        pincode: ""

    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await sellerCreateStore(formData)
            console.log(response.data)
            navigate('/sellerTerms')
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        const checkSellerStore = async () => {
            try {
                const response = await getMySellerStore()
                if (response.data.success) {
                    const store = response.data.data

                    if (!store.termsAccepted) {
                        navigate('/sellerTerms')
                    } else {
                        navigate('/sellerPlans')
                    }
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    console.log('No existing seller store. Show registration form.')
                } else {
                    console.error('Failed to check seller store:', error)
                }

            }
        }
        checkSellerStore()
    }, [navigate])
    return (
        <div className='min-h-screen bg-[#F5F0E8] text-[#2B2926]'>
            <Navbar />
            <main>
                <section className='px-5 py-14 sm:px-8 md:py-20'>
                    <div className='mx-auto max-w-3xl text-center'>
                        <p className='mb-3 text-[10px] uppercase tracking-[3px] text-gray-500'>
                            VELAURA PARTNER PROGRAM
                        </p>

                        <h1 className='font-serif text-3xl font-medium sm:text-4xl'>
                            Create Your Store
                        </h1>

                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                            Share your store details and take the first step
                            towards growing your business with VELAURA.
                        </p>
                    </div>

                </section>
                <div className="mx-auto mt-8 max-w-3xl border border-[#DED7CC] bg-[#F9F6F0] p-6 sm:p-10">

                    <h2 className="font-serif text-xl">
                        Store Information
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                        Tell us a little about your business.
                    </p>

                    <form onSubmit={handleSubmit} className='mt-8 space-y-7'>
                        <div>
                            <label className='text-xs font-medium -tracking-wide'>
                                <input type="text"
                                    name='storeName'
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder='Enter your Store Name'
                                    className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]" />
                            </label>
                        </div>
                        <div>
                            <label className="text-xs font-medium tracking-wide">
                                BUSINESS DESCRIPTION
                            </label>

                            <textarea
                                name="businessDescription"
                                value={formData.businessDescription}
                                onChange={handleChange}
                                placeholder="Tell us about your store and products"
                                rows="3"
                                className="w-full resize-none border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium tracking-wide">
                                PHONE NUMBER *
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium tracking-wide">
                                ADDRESS *
                            </label>

                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter your business address"
                                rows="2"
                                className="w-full resize-none border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]"
                                required
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                            <div>
                                <label className="text-xs font-medium tracking-wide" >
                                    CITY *
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium tracking-wide">
                                    STATE *
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                    className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]"
                                    required
                                />
                            </div>

                        </div>

                        <div>
                            <label className="text-xs font-medium tracking-wide">
                                PINCODE *
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter 6-digit pincode"
                                maxLength="6"
                                className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-sm outline-none focus:border-[#2B2926]"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full bg-[#2B2926] px-6 py-4 text-xs font-medium uppercase tracking-[2px] text-white transition duration-300 hover:bg-[#49443F]"
                        >
                            Continue
                        </button>
                    </form>

                </div>

            </main>
            <Footer />

        </div>
    )
}

export default VendorForm