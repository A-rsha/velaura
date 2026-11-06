import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'
import { FiUser, FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'

function VendorRegistration() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
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

        try {
            setLoading(true)

            const res = await API.post('/auth/vendor-register', {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            })

            if (res.data.success) {
                toast.success('Vendor account created successfully!')

                navigate('/vendorLogin', { replace: true })
            }

        } catch (error) {

            console.error(
                'VENDOR REGISTRATION ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to create vendor account.'
            )

        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-5 py-12">

            <div className="w-full max-w-md bg-white border border-[#DED5C8] px-6 py-8 sm:px-10 sm:py-10">

                {/* LOGO */}

                <div className="text-center mb-8">

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

                <div className="text-center mb-8">

                    <p className="text-[10px] uppercase tracking-[3px] text-gray-500 mb-2">
                        VENDOR PORTAL
                    </p>

                    <h1 className="font-serif text-2xl sm:text-3xl text-[#2B2926]">
                        Create Your Account
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Join VELAURA and start your seller journey.
                    </p>

                </div>

                {/* FORM */}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* NAME */}

                    <div>

                        <label className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]">
                            Full Name
                        </label>

                        <div className="relative">

                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                                className="w-full h-12 border border-[#DED5C8] pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                            />

                        </div>

                    </div>

                    {/* EMAIL */}

                    <div>

                        <label className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]">
                            Email Address
                        </label>

                        <div className="relative">

                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                                className="w-full h-12 border border-[#DED5C8] pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                            />

                        </div>

                    </div>

                    {/* PASSWORD */}

                    <div>

                        <label className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]">
                            Password
                        </label>

                        <div className="relative">

                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                placeholder="Create a password"
                                className="w-full h-12 border border-[#DED5C8] pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                            />

                        </div>

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                                className="w-full h-12 border border-[#DED5C8] pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                            />

                        </div>

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-[#2B2926] text-white text-sm font-medium hover:bg-black disabled:opacity-60"
                    >
                        {loading ? 'Creating Account...' : 'Create Vendor Account'}
                    </button>

                </form>

                {/* LOGIN LINK */}

                <div className="mt-7 pt-6 border-t border-[#DED5C8] text-center">

                    <p className="text-sm text-gray-500">

                        Already have an account?{' '}

                        <Link
                            to="/vendorLogin"
                            className="font-medium text-[#2B2926] border-b border-[#2B2926] pb-0.5"
                        >
                            Vendor Login
                        </Link>

                    </p>

                </div>

                <div className="mt-6 text-center">

                    <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#2B2926]">
                        <FiArrowLeft />
                        Back to Home
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default VendorRegistration