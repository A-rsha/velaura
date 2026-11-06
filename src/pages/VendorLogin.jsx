import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'
import {
    FiArrowLeft,
    FiMail,
    FiLock,
    FiShield,
    FiRefreshCw
} from 'react-icons/fi'

function VendorLogin() {

    const navigate = useNavigate()
    const otpRefs = useRef([])

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpStep, setOtpStep] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // SEND LOGIN REQUEST
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const res = await API.post('/auth/login', {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            })

            if (res.data.requiresOTP) {
                setOtpStep(true)
                toast.success('OTP sent to your registered email.')
                return
            }

            // Admin account is not allowed here
            if (res.data.user?.role !== 'vendor') {
                toast.error('This account is not registered as a vendor.')
                return
            }

            // Save vendor session
            saveVendorSession(res.data)

            navigate('/vendorDashboard', { replace: true })

        } catch (error) {

            console.error(
                'VENDOR LOGIN ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to login. Please check your details.'
            )

        } finally {
            setLoading(false)
        }
    }

    // SAVE VENDOR SESSION
    const saveVendorSession = (data) => {

        if (!data.token || !data.refreshToken || data.user?.role !== 'vendor') {
            throw new Error('Invalid vendor login response')
        }

        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')
        localStorage.removeItem('userName')
        localStorage.removeItem('userId')

        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)
        localStorage.setItem('role', data.user.role)
        localStorage.setItem('userName', data.user.name)
        localStorage.setItem('userId', data.user.id)
    }

    // OTP INPUT
    const handleOtpChange = (value, index) => {

        if (!/^\d?$/.test(value)) return

        const updatedOtp = [...otp]
        updatedOtp[index] = value

        setOtp(updatedOtp)

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    // OTP BACKSPACE
    const handleOtpKeyDown = (e, index) => {

        if (
            e.key === 'Backspace' &&
            !otp[index] &&
            index > 0
        ) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    // OTP PASTE
    const handleOtpPaste = (e) => {

        e.preventDefault()

        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6)

        if (!pasted) return

        const updatedOtp = ['', '', '', '', '', '']

        pasted.split('').forEach((digit, index) => {
            updatedOtp[index] = digit
        })

        setOtp(updatedOtp)

        otpRefs.current[Math.min(pasted.length, 5)]?.focus()
    }
 
    // VERIFY OTP
    const handleVerifyOTP = async (e) => {

        e.preventDefault()

        const enteredOtp = otp.join('')

        if (enteredOtp.length !== 6) {
            toast.warning('Please enter the complete 6-digit OTP.')
            return
        }

        try {

            setLoading(true)

            const res = await API.post('/auth/verify-login-otp', {
                email: formData.email.trim().toLowerCase(),
                otp: enteredOtp
            })

            if (!res.data.success) {
                toast.error(res.data.message || 'OTP verification failed.')
                return
            }

            if (res.data.user?.role !== 'vendor') {
                toast.error('This account is not registered as a vendor.')
                return
            }

            saveVendorSession(res.data)

            console.log("OTP RESPONSE:", res.data)

            console.log("SAVED SESSION:", {
                token: localStorage.getItem('token'),
                refreshToken: localStorage.getItem('refreshToken'),
                role: localStorage.getItem('role'),
                userId: localStorage.getItem('userId')
            })
            toast.success('Vendor login successful!')

            const subscription = res.data.user?.subscription

            if (
                subscription?.status === 'active' &&
                subscription?.endDate &&
                new Date(subscription.endDate) > new Date()
            ) {
                navigate('/vendorDashboard', { replace: true })
            }
            else if (
                subscription?.status === 'expired' ||
                (
                    subscription?.endDate &&
                    new Date(subscription.endDate) <= new Date()
                )
            ) {
                navigate('/sellerPlans', { replace: true })
            }
            else {
                navigate('/vendorForm', { replace: true })
            }

        } catch (error) {

            console.error(
                'VENDOR OTP ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'OTP verification failed.'
            )

        } finally {
            setLoading(false)
        }
    }

    // RESEND OTP
    const handleResendOTP = async () => {

        try {

            setResending(true)

            const res = await API.post('/auth/login', {
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            })

            if (res.data.requiresOTP) {
                setOtp(['', '', '', '', '', ''])
                toast.success('A new OTP has been sent.')
                otpRefs.current[0]?.focus()
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Unable to resend OTP.'
            )

        } finally {
            setResending(false)
        }
    }

    return (

        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-5 py-12">

            <div className="w-full max-w-md border border-[#DED5C8] bg-white px-6 py-8 sm:px-10 sm:py-10">

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

                    <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2926]">
                        {otpStep ? 'Verify Your Email' : 'Vendor Login'}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        {otpStep
                            ? 'Enter the verification code sent to your email.'
                            : 'Sign in to manage your VELAURA vendor account.'
                        }
                    </p>

                </div>

                {!otpStep ? (

                    /* LOGIN FORM */

                    <form onSubmit={handleSubmit} className="space-y-5">

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
                                    placeholder="Enter vendor email"
                                    className="w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                                />

                            </div>

                        </div>

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
                                    placeholder="Enter your password"
                                    className="w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#2B2926]"
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#2B2926] text-white text-sm font-medium transition hover:bg-black disabled:opacity-60"
                        >
                            {loading ? 'Please wait...' : 'Vendor Login'}
                        </button>

                    </form>

                ) : (

                    /* OTP FORM */

                    <form onSubmit={handleVerifyOTP} className="space-y-6">

                        <div className="flex justify-center">

                            <div className="w-14 h-14 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                                <FiShield className="text-2xl text-[#2B2926]" />
                            </div>

                        </div>

                        <p className="text-center text-sm text-gray-500">
                            Verification code sent to
                            <br />
                            <span className="font-medium text-[#2B2926]">
                                {formData.email}
                            </span>
                        </p>

                        <div className="flex justify-center gap-2">

                            {otp.map((digit, index) => (

                                <input
                                    key={index}
                                    ref={(el) => otpRefs.current[index] = el}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    onPaste={handleOtpPaste}
                                    className="w-11 h-12 border border-[#DED5C8] text-center text-lg font-medium text-[#2B2926] outline-none focus:border-[#2B2926]"
                                />

                            ))}

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#2B2926] text-white text-sm font-medium hover:bg-black disabled:opacity-60"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>

                        <div className="text-center">

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resending}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#2B2926] hover:opacity-60 disabled:opacity-50"
                            >
                                <FiRefreshCw />
                                {resending ? 'Sending...' : 'Resend OTP'}
                            </button>

                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setOtpStep(false)
                                setOtp(['', '', '', '', '', ''])
                            }}
                            className="w-full text-sm text-gray-500 hover:text-[#2B2926]"
                        >
                            Change email or password
                        </button>

                    </form>

                )}

                {/* REGISTRATION LINK */}

                {!otpStep && (

                    <div className="mt-7 pt-6 border-t border-[#DED5C8] text-center">

                        <p className="text-sm text-gray-500">
                            Don't have a vendor account?{' '}
                            <Link
                                to="/vendorRegistration"
                                className="font-medium text-[#2B2926] border-b border-[#2B2926] pb-0.5"
                            >
                                Create Account
                            </Link>
                        </p>

                    </div>

                )}

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

export default VendorLogin