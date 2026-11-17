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

            if (res.data.user?.role !== 'vendor') {
                toast.error('This account is not registered as a vendor.')
                return
            }

            saveVendorSession(res.data)

            navigate('/vendorDashboard')

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
                navigate('/vendorDashboard', { replace: true })
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

        <div className="vendor-login-page min-h-screen bg-[#F5F0E8] flex items-center justify-center px-5 py-12 relative overflow-hidden">

            {/* BACKGROUND DECORATION */}

            <div className="vendor-orb vendor-orb-one"></div>
            <div className="vendor-orb vendor-orb-two"></div>

            <div className="vendor-login-card relative z-10 w-full max-w-md border border-[#DED5C8] bg-white px-6 py-8 sm:px-10 sm:py-10">

                {/* LOGO */}

                <div className="text-center mb-8 vendor-logo">

                    <Link to="/" className="inline-flex flex-col items-center">

                        <span className="font-serif text-3xl sm:text-4xl font-medium tracking-wide transition-transform duration-300 hover:scale-105">
                            VELAURA
                        </span>

                        <span className="mt-1 text-[9px] tracking-[4px] text-gray-500">
                            ACCESSORIES
                        </span>

                    </Link>

                </div>

                {/* HEADING */}

                <div className="text-center mb-8 vendor-heading">

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

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 vendor-form"
                        key="login-form"
                    >

                        <div className="vendor-field">

                            <label className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]">
                                Email Address
                            </label>

                            <div className="relative">

                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300" />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter vendor email"
                                    className="vendor-input w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm outline-none"
                                />

                            </div>

                        </div>

                        <div className="vendor-field">

                            <label className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]">
                                Password
                            </label>

                            <div className="relative">

                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300" />

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="vendor-input w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm outline-none"
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="vendor-primary-btn relative overflow-hidden w-full h-12 bg-[#2B2926] text-white text-sm font-medium disabled:opacity-60"
                        >
                            <span className="relative z-10">
                                {loading ? 'Please wait...' : 'Vendor Login'}
                            </span>
                        </button>

                    </form>

                ) : (

                    /* OTP FORM */

                    <form
                        onSubmit={handleVerifyOTP}
                        className="space-y-6 vendor-form"
                        key="otp-form"
                    >

                        <div className="flex justify-center vendor-shield">

                            <div className="w-14 h-14 rounded-full bg-[#F5F0E8] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-md">
                                <FiShield className="text-2xl text-[#2B2926]" />
                            </div>

                        </div>

                        <p className="text-center text-sm text-gray-500 vendor-otp-text">
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
                                    style={{ animationDelay: `${index * 70}ms` }}
                                    className="vendor-otp-input w-11 h-12 border border-[#DED5C8] text-center text-lg font-medium text-[#2B2926] outline-none"
                                />

                            ))}

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="vendor-primary-btn relative overflow-hidden w-full h-12 bg-[#2B2926] text-white text-sm font-medium disabled:opacity-60"
                        >
                            <span className="relative z-10">
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </span>
                        </button>

                        <div className="text-center">

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={resending}
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#2B2926] hover:opacity-60 disabled:opacity-50 transition-all duration-300 hover:gap-3"
                            >
                                <FiRefreshCw className={resending ? 'animate-spin' : ''} />
                                {resending ? 'Sending...' : 'Resend OTP'}
                            </button>

                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setOtpStep(false)
                                setOtp(['', '', '', '', '', ''])
                            }}
                            className="w-full text-sm text-gray-500 hover:text-[#2B2926] transition-colors duration-300"
                        >
                            Change email or password
                        </button>

                    </form>

                )}

                {/* REGISTRATION LINK */}

                {!otpStep && (

                    <div className="mt-7 pt-6 border-t border-[#DED5C8] text-center vendor-register">

                        <p className="text-sm text-gray-500">
                            Don't have a vendor account?{' '}
                            <Link
                                to="/vendorRegistration"
                                className="font-medium text-[#2B2926] border-b border-[#2B2926] pb-0.5 transition-all duration-300 hover:text-[#9A7955] hover:border-[#9A7955]"
                            >
                                Create Account
                            </Link>
                        </p>

                    </div>

                )}

                {/* BACK TO HOME */}

                <div className="mt-6 text-center vendor-back">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-[#2B2926] transition-all duration-300 hover:gap-3"
                    >
                        <FiArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />
                        Back to Home
                    </Link>

                </div>

            </div>

            {/* ANIMATION STYLES */}

            <style>{`

                .vendor-login-page {
                    isolation: isolate;
                }

                .vendor-orb {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(194, 171, 139, 0.13);
                    filter: blur(2px);
                    pointer-events: none;
                    z-index: -1;
                }

                .vendor-orb-one {
                    width: 260px;
                    height: 260px;
                    top: -100px;
                    left: -80px;
                    animation: vendorFloat 8s ease-in-out infinite;
                }

                .vendor-orb-two {
                    width: 320px;
                    height: 320px;
                    bottom: -150px;
                    right: -100px;
                    animation: vendorFloat 10s ease-in-out infinite reverse;
                }

                .vendor-login-card {
                    animation: vendorCardEnter 0.75s ease both;
                    box-shadow: 0 10px 35px rgba(43, 41, 38, 0.04);
                    transition: box-shadow 0.4s ease, transform 0.4s ease;
                }

                .vendor-login-card:hover {
                    box-shadow: 0 20px 55px rgba(43, 41, 38, 0.10);
                }

                .vendor-logo {
                    animation: vendorFadeUp 0.6s ease both;
                    animation-delay: 0.15s;
                }

                .vendor-heading {
                    animation: vendorFadeUp 0.6s ease both;
                    animation-delay: 0.25s;
                }

                .vendor-form {
                    animation: vendorFadeUp 0.5s ease both;
                }

                .vendor-field {
                    animation: vendorFadeUp 0.5s ease both;
                }

                .vendor-field:nth-child(2) {
                    animation-delay: 0.1s;
                }

                .vendor-input {
                    transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
                }

                .vendor-input:focus {
                    border-color: #2B2926;
                    box-shadow: 0 0 0 3px rgba(43, 41, 38, 0.08);
                    transform: translateY(-1px);
                }

                .vendor-input:focus + svg {
                    color: #2B2926;
                }

                .vendor-primary-btn {
                    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
                }

                .vendor-primary-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.18),
                        transparent
                    );
                    transition: left 0.6s ease;
                }

                .vendor-primary-btn:hover::before {
                    left: 150%;
                }

                .vendor-primary-btn:hover:not(:disabled) {
                    background: #171615;
                    transform: translateY(-2px);
                    box-shadow: 0 7px 18px rgba(43, 41, 38, 0.18);
                }

                .vendor-primary-btn:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .vendor-shield {
                    animation: vendorPop 0.5s ease both;
                }

                .vendor-otp-text {
                    animation: vendorFadeUp 0.5s ease both;
                    animation-delay: 0.1s;
                }

                .vendor-otp-input {
                    animation: vendorPop 0.4s ease both;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
                }

                .vendor-otp-input:focus {
                    border-color: #2B2926;
                    box-shadow: 0 0 0 3px rgba(43, 41, 38, 0.09);
                    transform: translateY(-3px);
                }

                .vendor-register {
                    animation: vendorFadeUp 0.5s ease both;
                    animation-delay: 0.2s;
                }

                .vendor-back {
                    animation: vendorFadeUp 0.5s ease both;
                    animation-delay: 0.3s;
                }

                @keyframes vendorCardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes vendorFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes vendorPop {
                    from {
                        opacity: 0;
                        transform: scale(0.85);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes vendorFloat {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    50% {
                        transform: translate(25px, -20px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .vendor-login-page *,
                    .vendor-login-page *::before,
                    .vendor-login-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }

            `}</style>

        </div>
    )
}

export default VendorLogin