import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'

import {
    FiUser,
    FiMail,
    FiLock,
    FiArrowLeft,
    FiShoppingBag,
    FiPhone,
    FiMapPin,
    FiFileText
} from 'react-icons/fi'

function VendorRegistration() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        // Account details
        name: '',
        email: '',
        password: '',
        confirmPassword: '',

        // Store details
        storeName: '',
        businessDescription: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    })

    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (formData.password.length < 8) {
            toast.warning('Password must contain at least 8 characters.')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.')
            return
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.warning('Please enter a valid 10-digit phone number.')
            return
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            toast.warning('Please enter a valid 6-digit pincode.')
            return
        }

        try {

            setLoading(true)

            const registrationData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,

                storeName: formData.storeName.trim(),
                businessDescription: formData.businessDescription.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim()
            }

            const res = await API.post(
                '/auth/vendor-register',
                registrationData
            )

            if (res.data.success) {

                toast.success(
                    'Vendor registration completed successfully!'
                )

                navigate('/vendorLogin', { replace: true })
            }

        } catch (error) {

            console.error(
                'VENDOR REGISTRATION ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to complete vendor registration.'
            )

        } finally {

            setLoading(false)

        }
    }

    const inputClass =
        "w-full h-12 border border-[#DED5C8] bg-transparent pl-11 pr-4 text-sm outline-none transition focus:border-[#2B2926]"

    const labelClass =
        "block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"

    return (

        <div className="min-h-screen bg-[#F5F0E8] py-10 px-4 sm:px-6">

            <div className="mx-auto max-w-3xl">

                {/* LOGO */}

                <div className="mb-10 text-center">

                    <Link to="/" className="inline-flex flex-col items-center">

                        <span className="font-serif text-3xl sm:text-4xl font-medium tracking-wide">
                            VELAURA
                        </span>

                        <span className="mt-1 text-[9px] tracking-[4px] text-gray-500">
                            ACCESSORIES
                        </span>

                    </Link>

                </div>


                {/* HEADING */}

                <div className="mb-10 text-center">

                    <p className="mb-3 text-[10px] uppercase tracking-[3px] text-gray-500">
                        VELAURA PARTNER PROGRAM
                    </p>

                    <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2926]">
                        Register as a Vendor
                    </h1>

                    <p className="mt-3 text-sm text-gray-500">
                        Create your account and set up your store with VELAURA.
                    </p>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="border border-[#DED5C8] bg-[#F9F6F0] p-6 sm:p-10"
                >

                    {/* ACCOUNT DETAILS */}

                    <div className="mb-10">

                        <div className="mb-7 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center bg-[#2B2926] text-white">
                                <FiUser size={18} />
                            </div>

                            <div>
                                <h2 className="font-serif text-xl text-[#2B2926]">
                                    Account Details
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Create your vendor account.
                                </p>
                            </div>

                        </div>


                        {/* FULL NAME */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Full Name *
                            </label>

                            <div className="relative">

                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={inputClass}
                                    required
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Email Address *
                            </label>

                            <div className="relative">

                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={inputClass}
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Password *
                            </label>

                            <div className="relative">

                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    minLength={8}
                                    className={inputClass}
                                    required
                                />

                            </div>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div>

                            <label className={labelClass}>
                                Confirm Password *
                            </label>

                            <div className="relative">

                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={inputClass}
                                    required
                                />

                            </div>

                        </div>

                    </div>


                    {/* STORE DETAILS */}

                    <div>

                        <div className="mb-7 flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center bg-[#2B2926] text-white">
                                <FiShoppingBag size={18} />
                            </div>

                            <div>
                                <h2 className="font-serif text-xl text-[#2B2926]">
                                    Store Information
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Tell us about your business.
                                </p>
                            </div>

                        </div>


                        {/* STORE NAME */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Store Name *
                            </label>

                            <div className="relative">

                                <FiShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="text"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    placeholder="Enter your store name"
                                    className={inputClass}
                                    required
                                />

                            </div>

                        </div>


                        {/* BUSINESS DESCRIPTION */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Business Description *
                            </label>

                            <div className="relative">

                                <FiFileText className="absolute left-4 top-4 text-gray-400" />

                                <textarea
                                    name="businessDescription"
                                    value={formData.businessDescription}
                                    onChange={handleChange}
                                    placeholder="Tell us about your store and products"
                                    rows={4}
                                    className="w-full resize-none border border-[#DED5C8] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                                    required
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Phone Number *
                            </label>

                            <div className="relative">

                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit phone number"
                                    maxLength={10}
                                    className={inputClass}
                                    required
                                />

                            </div>

                        </div>


                        {/* ADDRESS */}

                        <div className="mb-5">

                            <label className={labelClass}>
                                Business Address *
                            </label>

                            <div className="relative">

                                <FiMapPin className="absolute left-4 top-4 text-gray-400" />

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your business address"
                                    rows={2}
                                    className="w-full resize-none border border-[#DED5C8] bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                                    required
                                />

                            </div>

                        </div>


                        {/* CITY AND STATE */}

                        <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>

                                <label className={labelClass}>
                                    City *
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="Enter city"
                                    className="h-12 w-full border border-[#DED5C8] bg-transparent px-4 text-sm outline-none focus:border-[#2B2926]"
                                    required
                                />

                            </div>


                            <div>

                                <label className={labelClass}>
                                    State *
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="Enter state"
                                    className="h-12 w-full border border-[#DED5C8] bg-transparent px-4 text-sm outline-none focus:border-[#2B2926]"
                                    required
                                />

                            </div>

                        </div>


                        {/* PINCODE */}

                        <div>

                            <label className={labelClass}>
                                Pincode *
                            </label>

                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter 6-digit pincode"
                                maxLength={6}
                                className="h-12 w-full border border-[#DED5C8] bg-transparent px-4 text-sm outline-none focus:border-[#2B2926]"
                                required
                            />

                        </div>

                    </div>


                    {/* SUBMIT */}

                    <div className="mt-10">

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-14 w-full bg-[#2B2926] px-6 text-xs font-medium uppercase tracking-[2px] text-white transition hover:bg-[#49443F] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? 'Creating Your Account...'
                                : 'Complete Vendor Registration'
                            }
                        </button>

                        <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
                            By registering, you agree to continue with the VELAURA seller onboarding process.
                        </p>

                    </div>

                </form>


                {/* LOGIN LINK */}

                <div className="mt-7 text-center">

                    <p className="text-sm text-gray-500">

                        Already have an account?{' '}

                        <Link
                            to="/vendorLogin"
                            className="font-medium text-[#2B2926] underline underline-offset-4"
                        >
                            Vendor Login
                        </Link>

                    </p>

                </div>


                {/* BACK HOME */}

                <div className="mt-6 text-center">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#2B2926]"
                    >
                        <FiArrowLeft />
                        Back to Home
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default VendorRegistration