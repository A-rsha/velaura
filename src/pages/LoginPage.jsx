
import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'
import {
    FiMail,
    FiLock,
    FiShield,
    FiArrowLeft,
    FiCheckCircle,
    FiRefreshCw,
    FiXCircle,
} from 'react-icons/fi'

function LoginPage() {
    const navigate = useNavigate()
    const otpRefs = useRef([])

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpStep, setOtpStep] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    // Handle email and password input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    // STEP 1: Validate credentials and send OTP
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const res = await API.post('/auth/login', {
                email: formData.email.trim(),
                password: formData.password,
            })

            console.log('LOGIN RESPONSE:', res.data)

            // IMPORTANT: OTP response does not need a user object.
            if (res.data.requiresOTP === true) {
                setOtpStep(true)
                setOtp(['', '', '', '', '', ''])

                toast.success(
                    res.data.message ||
                    'OTP sent successfully! Please check your email.'
                )

                setTimeout(() => {
                    otpRefs.current[0]?.focus()
                }, 100)

                return
            }

            // Do not assume login succeeded if OTP is not required.
            toast.error(
                res.data.message ||
                'OTP was not sent. Please try again.'
            )
        } catch (error) {
            console.error(
                'LOGIN ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'Unable to log in. Please check your email and password.',
                {
                    icon: <FiXCircle size={20} />,
                }
            )
        } finally {
            setLoading(false)
        }
    }

    // Handle individual OTP digits
    const handleOtpChange = (index, value) => {
        const digit = value.replace(/\D/g, '').slice(-1)

        const updatedOtp = [...otp]
        updatedOtp[index] = digit
        setOtp(updatedOtp)

        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    // Backspace and arrow-key navigation
    const handleOtpKeyDown = (index, e) => {
        if (
            e.key === 'Backspace' &&
            !otp[index] &&
            index > 0
        ) {
            otpRefs.current[index - 1]?.focus()
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }

        if (e.key === 'ArrowRight' && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    // Support pasting a complete 6-digit OTP
    const handleOtpPaste = (e) => {
        e.preventDefault()

        const pastedOtp = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6)

        if (!pastedOtp) return

        const updatedOtp = ['', '', '', '', '', '']

        pastedOtp.split('').forEach((digit, index) => {
            updatedOtp[index] = digit
        })

        setOtp(updatedOtp)

        const focusIndex = Math.min(pastedOtp.length, 5)
        otpRefs.current[focusIndex]?.focus()
    }

    // STEP 2: Verify OTP before completing login
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
                email: formData.email.trim(),
                otp: enteredOtp,
            })

            console.log('OTP VERIFICATION RESPONSE:', res.data)

            if (
                res.data.success !== true ||
                !res.data.user ||
                !res.data.token ||
                !res.data.refreshToken
            ) {
                toast.error(
                    res.data.message ||
                    'OTP verification failed. Please try again.'
                )
                return
            }

            // Admins must use the admin login page.
            if (res.data.user.role !== 'user') {
                toast.warning('Please use the Admin Login page.')

                setOtpStep(false)
                setOtp(['', '', '', '', '', ''])
                return
            }

            // Store tokens only after successful OTP verification.
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('role')
            localStorage.removeItem('userName')
            localStorage.removeItem('userId')

            localStorage.setItem('token', res.data.token)
            localStorage.setItem('refreshToken', res.data.refreshToken)
            localStorage.setItem('role', res.data.user.role)
            localStorage.setItem('userName', res.data.user.name)
            localStorage.setItem('userId', res.data.user.id)

            toast.success('Email verified! Login successful.')

            navigate('/')

            console.log({
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    userName: localStorage.getItem('userName'),
    role: localStorage.getItem('role'),
    userId: localStorage.getItem('userId')
})
        } catch (error) {
            console.error(
                'OTP VERIFICATION ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'Invalid or expired OTP. Please try again.',
                {
                    icon: <FiXCircle size={20} />,
                }
            )
        } finally {
            setLoading(false)
        }
    }

    // Resend OTP by validating credentials again
    const handleResendOTP = async () => {
        try {
            setResending(true)

            const res = await API.post('/auth/login', {
                email: formData.email.trim(),
                password: formData.password,
            })

            console.log('RESEND OTP RESPONSE:', res.data)

            if (res.data.requiresOTP === true) {
                setOtp(['', '', '', '', '', ''])

                toast.success(
                    res.data.message ||
                    'A new OTP has been sent to your email.'
                )

                setTimeout(() => {
                    otpRefs.current[0]?.focus()
                }, 100)
            } else {
                toast.error('Unable to resend OTP. Please try again.')
            }
        } catch (error) {
            console.error(
                'RESEND OTP ERROR:',
                error.response?.data || error.message
            )

            toast.error(
                error.response?.data?.message ||
                'Could not resend OTP. Please try again.'
            )
        } finally {
            setResending(false)
        }
    }

    // Return to the login form
    const handleBackToLogin = () => {
        setOtpStep(false)
        setOtp(['', '', '', '', '', ''])
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-10 sm:px-6">

            <div className="w-full max-w-md">

                <div className="bg-white border border-[#DED5C8] shadow-[0_12px_45px_rgba(43,41,38,0.07)] px-6 py-8 sm:px-10 sm:py-10">

                    {/* VELAURA Logo */}
                    <div className="text-center mb-9">
                        <Link
                            to="/"
                            className="inline-flex flex-col items-center"
                        >
                            <span className="font-serif text-3xl sm:text-4xl font-medium tracking-[3px] text-[#2B2926]">
                                VELAURA
                            </span>

                            <span className="mt-1 text-[9px] tracking-[5px] text-gray-500">
                                ACCESSORIES
                            </span>
                        </Link>
                    </div>

                    {!otpStep ? (
                        <>
                            {/* LOGIN SCREEN */}
                            <div className="text-center mb-8">
                                <p className="text-[10px] uppercase tracking-[3px] text-gray-500 mb-3">
                                    WELCOME BACK
                                </p>

                                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2926]">
                                    Login to your Account
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Sign in securely to continue shopping with VELAURA.
                                </p>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >
                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            autoComplete="email"
                                            placeholder="Enter your email"
                                            disabled={loading}
                                            className="w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm text-[#2B2926] outline-none transition focus:border-[#2B2926] focus:ring-1 focus:ring-[#2B2926]/10 disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            autoComplete="current-password"
                                            placeholder="Enter your password"
                                            disabled={loading}
                                            className="w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm text-[#2B2926] outline-none transition focus:border-[#2B2926] focus:ring-1 focus:ring-[#2B2926]/10 disabled:bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-[#2B2926] text-white text-sm font-medium tracking-wide transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading
                                        ? 'Sending OTP...'
                                        : 'Continue Securely'}
                                </button>

                                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-gray-500">
                                    <FiShield size={15} />
                                    <span>Email verification helps protect your account.</span>
                                </div>
                            </form>

                            {/* Register Link */}
                            <div className="mt-8 pt-6 border-t border-[#DED5C8] text-center">
                                <p className="text-sm text-gray-500">
                                    Don't have an account?{' '}
                                    <Link
                                        to="/register"
                                        className="font-medium text-[#2B2926] border-b border-[#2B2926] pb-0.5 transition hover:opacity-60"
                                    >
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* OTP VERIFICATION SCREEN */}
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                disabled={loading}
                                className="inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-black disabled:opacity-50"
                            >
                                <FiArrowLeft size={16} />
                                Back to Login
                            </button>

                            <div className="text-center mt-7 mb-8">
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8] text-[#2B2926]">
                                    <FiMail size={28} strokeWidth={1.5} />
                                </div>

                                <p className="text-[10px] uppercase tracking-[3px] text-gray-500 mb-3">
                                    EMAIL VERIFICATION
                                </p>

                                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#2B2926]">
                                    Verify Your Email
                                </h1>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    We've sent a 6-digit verification code to
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#2B2926] break-all">
                                    {formData.email.trim()}
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOTP}>
                                <label className="block mb-3 text-xs font-medium uppercase tracking-[1px] text-[#2B2926] text-center">
                                    Enter Verification Code
                                </label>

                                {/* OTP Inputs */}
                                <div className="flex justify-center gap-2 sm:gap-3 mb-5">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(element) => {
                                                otpRefs.current[index] = element
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete={
                                                index === 0
                                                    ? 'one-time-code'
                                                    : 'off'
                                            }
                                            aria-label={`OTP digit ${index + 1}`}
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleOtpChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleOtpKeyDown(index, e)
                                            }
                                            onPaste={handleOtpPaste}
                                            disabled={loading}
                                            className="h-12 w-10 sm:h-14 sm:w-12 border border-[#DED5C8] bg-[#FEFDFC] text-center text-lg font-semibold text-[#2B2926] outline-none transition focus:border-[#2B2926] focus:ring-2 focus:ring-[#2B2926]/10 disabled:bg-gray-100"
                                        />
                                    ))}
                                </div>

                                <p className="text-center text-xs leading-5 text-gray-500 mb-6">
                                    Your OTP expires in 5 minutes. Check your inbox and spam folder.
                                </p>

                                <button
                                    type="submit"
                                    disabled={
                                        loading ||
                                        otp.some((digit) => digit === '')
                                    }
                                    className="flex w-full h-12 items-center justify-center gap-2 bg-[#2B2926] text-white text-sm font-medium tracking-wide transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Verifying OTP...
                                        </>
                                    ) : (
                                        <>
                                            <FiCheckCircle size={17} />
                                            Verify OTP & Login
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Resend OTP */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-500">
                                    Didn't receive the code?
                                </p>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resending || loading}
                                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#2B2926] underline underline-offset-4 transition hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiRefreshCw
                                        size={14}
                                        className={
                                            resending ? 'animate-spin' : ''
                                        }
                                    />

                                    {resending
                                        ? 'Sending new OTP...'
                                        : 'Resend OTP'}
                                </button>
                            </div>

                            <div className="mt-7 border-t border-[#DED5C8] pt-5 text-center">
                                <p className="text-xs leading-5 text-gray-500">
                                    Make sure you're using the email registered with your VELAURA account.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleBackToLogin}
                                    disabled={loading}
                                    className="mt-3 text-xs font-medium text-[#2B2926] underline underline-offset-4 hover:opacity-60"
                                >
                                    Change email or password
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <p className="mt-5 text-center text-[10px] tracking-wide text-gray-500">
                    © {new Date().getFullYear()} VELAURA ACCESSORIES
                </p>
            </div>
        </div>
    )
}

export default LoginPage

