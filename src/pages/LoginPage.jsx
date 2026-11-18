import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'
import ScrollReveal from '../components/ScrollReveal'
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

    const googleButtonRef = useRef(null)
    const [googleLoading, setGoogleLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleGoogleLogin = async (credential) => {
        try {
            setGoogleLoading(true)

            const response = await API.post('/auth/google', {
                credential
            })

            const data = response.data

            if (
                !data.success ||
                !data.token ||
                !data.refreshToken ||
                !data.user
            ) {
                toast.error(data.message || 'Google login failed')
                return
            }

            if (data.user.role !== 'user') {
                if (data.user.role === 'vendor') {
                    toast.error('Please use vendor login to access your account.')
                } else {
                    toast.error('please use admin login to access your account')
                }
                return
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('refreshToken', data.refreshToken)
            localStorage.setItem('role', data.user.role)
            localStorage.setItem('userName', data.user.name)
            localStorage.setItem('userId', data.user.id)

            toast.success('Google login successfull!')
            navigate('/')
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Google login failed. please try again'
            )
        } finally {
            setGoogleLoading(false)
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if (
                window.google &&
                window.google.accounts &&
                googleButtonRef.current
            ) {
                clearInterval(timer)

                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    callback: (response) => {
                        if (response.credential) {
                            handleGoogleLogin(response.credential)
                        }
                    },
                })

                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    {
                        theme: 'outline',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'rectangular',
                        width: 320,
                    }
                )
            }
        }, 200)

        return () => clearInterval(timer)

    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const res = await API.post('/auth/login', {
                email: formData.email.trim(),
                password: formData.password,
            })

            console.log('LOGIN RESPONSE:', res.data)

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

            if (res.data.user.role !== 'user') {
                if (res.data.user.role === 'vendor') {
                    toast.warning('Please use Vendor Login to access your account.')
                } else {
                    toast.warning('Please use Admin Login to access your account.')
                }

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
        <div className="login-page relative min-h-screen bg-[#F5F0E8] flex items-center justify-center px-4 py-10 sm:px-6 overflow-hidden">

            {/* Decorative SVG Background */}
            <div className="login-svg-decoration pointer-events-none absolute inset-0 overflow-hidden">

                <svg
                    className="login-svg login-svg-one absolute -top-20 -right-20 w-80 h-80 opacity-30"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="150" cy="150" r="110" stroke="#B8A48B" strokeWidth="1" />

                    <circle cx="150" cy="150" r="85" stroke="#B8A48B" strokeWidth="1" strokeDasharray="4 8" />

                    <circle cx="150" cy="150" r="55" stroke="#B8A48B" strokeWidth="1" />

                    <path
                        d="M150 35C170 90 210 130 265 150C210 170 170 210 150 265C130 210 90 170 35 150C90 130 130 90 150 35Z"
                        stroke="#B8A48B"
                        strokeWidth="1"
                    />
                </svg>

                <svg
                    className="login-svg login-svg-two absolute -bottom-24 -left-20 w-80 h-80 opacity-30"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M150 20L170 110L260 150L170 190L150 280L130 190L40 150L130 110L150 20Z"
                        stroke="#B8A48B"
                        strokeWidth="1.2"
                    />

                    <circle cx="150" cy="150" r="90" stroke="#B8A48B" strokeWidth="1" strokeDasharray="3 7" />

                    <circle cx="150" cy="150" r="55" stroke="#B8A48B" strokeWidth="1" />
                </svg>

                <div className="login-floating-dot absolute top-[22%] left-[12%]" />
                <div className="login-floating-dot login-floating-dot-two absolute bottom-[25%] right-[13%]" />

                <span className="login-sparkle absolute top-[18%] right-[25%]">✧</span>
                <span className="login-sparkle login-sparkle-two absolute bottom-[20%] left-[25%]">✦</span>

            </div>

            <div className="w-full max-w-md relative z-10">

                <ScrollReveal
                    direction="up"
                    duration={850}
                >

                    <div className="login-card bg-white border border-[#DED5C8] shadow-[0_12px_45px_rgba(43,41,38,0.07)] px-6 py-8 sm:px-10 sm:py-10">

                        {/* VELAURA Logo */}

                        <ScrollReveal
                            direction="down"
                            delay={100}
                            duration={700}
                        >

                            <div className="text-center mb-9 login-logo">

                                <Link
                                    to="/"
                                    className="inline-flex flex-col items-center"
                                >
                                    <span className="font-serif text-3xl sm:text-4xl font-medium tracking-[3px] text-[#2B2926] login-logo-text">
                                        VELAURA
                                    </span>

                                    <span className="mt-1 text-[9px] tracking-[5px] text-gray-500 login-logo-subtitle">
                                        ACCESSORIES
                                    </span>
                                </Link>

                            </div>

                        </ScrollReveal>


                        {!otpStep ? (

                            <div className="login-screen" key="login-screen">

                                {/* LOGIN SCREEN */}

                                <ScrollReveal
                                    direction="up"
                                    delay={150}
                                >

                                    <div className="text-center mb-8 login-heading">

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

                                </ScrollReveal>


                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 login-form"
                                >

                                    {/* Email */}

                                    <ScrollReveal
                                        direction="left"
                                        delay={200}
                                    >

                                        <div className="login-field">

                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"
                                            >
                                                Email Address
                                            </label>

                                            <div className="relative">

                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 login-input-icon" />

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
                                                    className="login-input w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm text-[#2B2926] outline-none transition focus:border-[#2B2926] focus:ring-1 focus:ring-[#2B2926]/10 disabled:bg-gray-50"
                                                />

                                            </div>

                                        </div>

                                    </ScrollReveal>


                                    {/* Password */}

                                    <ScrollReveal
                                        direction="right"
                                        delay={300}
                                    >

                                        <div className="login-field">

                                            <label
                                                htmlFor="password"
                                                className="block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"
                                            >
                                                Password
                                            </label>

                                            <div className="relative">

                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 login-input-icon" />

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
                                                    className="login-input w-full h-12 border border-[#DED5C8] bg-white pl-11 pr-4 text-sm text-[#2B2926] outline-none transition focus:border-[#2B2926] focus:ring-1 focus:ring-[#2B2926]/10 disabled:bg-gray-50"
                                                />

                                            </div>

                                        </div>

                                    </ScrollReveal>


                                    {/* Login Button */}

                                    <ScrollReveal
                                        direction="up"
                                        delay={400}
                                    >

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="login-main-button relative overflow-hidden w-full h-12 bg-[#2B2926] text-white text-sm font-medium tracking-wide transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <span className="relative z-10">
                                                {loading
                                                    ? 'Sending OTP...'
                                                    : 'Continue Securely'}
                                            </span>
                                        </button>

                                    </ScrollReveal>


                                    <ScrollReveal
                                        direction="fade"
                                        delay={450}
                                    >

                                        <div className="login-security flex items-center justify-center gap-2 pt-1 text-xs text-gray-500">
                                            <FiShield size={15} />
                                            <span>Email verification helps protect your account.</span>
                                        </div>

                                    </ScrollReveal>

                                </form>


                                {/* Google Login */}

                                <ScrollReveal
                                    direction="up"
                                    delay={200}
                                >

                                    <div className="mt-5 login-google">

                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                            <span className="text-sm text-gray-500">OR</span>
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                        </div>

                                        {googleLoading && (
                                            <p className="mb-2 text-center text-sm text-gray-500">
                                                Connecting to Google...
                                            </p>
                                        )}

                                        <div
                                            ref={googleButtonRef}
                                            className="flex justify-center login-google-button"
                                        ></div>

                                    </div>

                                </ScrollReveal>


                                {/* Register Link */}

                                <ScrollReveal
                                    direction="up"
                                    delay={250}
                                >

                                    <div className="mt-8 pt-6 border-t border-[#DED5C8] text-center login-register">

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

                                </ScrollReveal>

                            </div>

                        ) : (

                            <div className="otp-screen" key="otp-screen">

                                {/* OTP VERIFICATION SCREEN */}

                                <ScrollReveal
                                    direction="left"
                                    duration={700}
                                >

                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        disabled={loading}
                                        className="otp-back inline-flex items-center gap-2 text-sm text-gray-600 transition hover:text-black disabled:opacity-50"
                                    >
                                        <FiArrowLeft size={16} />
                                        Back to Login
                                    </button>

                                </ScrollReveal>


                                <ScrollReveal
                                    direction="up"
                                    delay={100}
                                >

                                    <div className="text-center mt-7 mb-8 otp-heading">

                                        <div className="otp-icon mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F0E8] text-[#2B2926]">
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

                                </ScrollReveal>


                                <form onSubmit={handleVerifyOTP}>

                                    <ScrollReveal
                                        direction="up"
                                        delay={200}
                                    >

                                        <label className="block mb-3 text-xs font-medium uppercase tracking-[1px] text-[#2B2926] text-center">
                                            Enter Verification Code
                                        </label>

                                        {/* OTP Inputs */}

                                        <div className="flex justify-center gap-2 sm:gap-3 mb-5 otp-inputs">

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
                                                    style={{
                                                        animationDelay: `${index * 0.08}s`
                                                    }}
                                                    className="otp-input h-12 w-10 sm:h-14 sm:w-12 border border-[#DED5C8] bg-[#FEFDFC] text-center text-lg font-semibold text-[#2B2926] outline-none transition focus:border-[#2B2926] focus:ring-2 focus:ring-[#2B2926]/10 disabled:bg-gray-100"
                                                />

                                            ))}

                                        </div>

                                        <p className="text-center text-xs leading-5 text-gray-500 mb-6">
                                            Your OTP expires in 5 minutes. Check your inbox and spam folder.
                                        </p>

                                    </ScrollReveal>


                                    <ScrollReveal
                                        direction="up"
                                        delay={300}
                                    >

                                        <button
                                            type="submit"
                                            disabled={
                                                loading ||
                                                otp.some((digit) => digit === '')
                                            }
                                            className="otp-verify-button flex w-full h-12 items-center justify-center gap-2 bg-[#2B2926] text-white text-sm font-medium tracking-wide transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
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

                                    </ScrollReveal>

                                </form>


                                {/* Resend OTP */}

                                <ScrollReveal
                                    direction="up"
                                    delay={350}
                                >

                                    <div className="mt-6 text-center otp-resend">

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

                                </ScrollReveal>


                                <ScrollReveal
                                    direction="fade"
                                    delay={400}
                                >

                                    <div className="mt-7 border-t border-[#DED5C8] pt-5 text-center otp-footer">

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

                                </ScrollReveal>

                            </div>

                        )}

                    </div>

                </ScrollReveal>


                <ScrollReveal
                    direction="fade"
                    delay={300}
                >

                    <p className="mt-5 text-center text-[10px] tracking-wide text-gray-500 login-copyright">
                        © {new Date().getFullYear()} VELAURA ACCESSORIES
                    </p>

                </ScrollReveal>

            </div>


            {/* Login Page Animations */}

            <style>{`

                /* Main Page */

                .login-page {
                    isolation: isolate;
                }

                .login-card {
                    transform-origin: center;
                    transition: box-shadow 0.4s ease;
                }

                .login-card:hover {
                    box-shadow: 0 22px 65px rgba(43,41,38,0.12);
                }


                /* Logo */

                .login-logo-text {
                    transition: letter-spacing 0.4s ease, transform 0.4s ease;
                }

                .login-logo:hover .login-logo-text {
                    letter-spacing: 5px;
                    transform: translateY(-3px);
                }

                .login-logo-subtitle {
                    transition: letter-spacing 0.4s ease;
                }

                .login-logo:hover .login-logo-subtitle {
                    letter-spacing: 7px;
                }


                /* Background SVG */

                .login-svg-one {
                    animation: rotateDecoration 35s linear infinite;
                    transform-origin: center;
                }

                .login-svg-two {
                    animation: rotateDecorationReverse 40s linear infinite;
                    transform-origin: center;
                }

                @keyframes rotateDecoration {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes rotateDecorationReverse {
                    from {
                        transform: rotate(360deg);
                    }
                    to {
                        transform: rotate(0deg);
                    }
                }

                .login-floating-dot {
                    width: 9px;
                    height: 9px;
                    border: 1px solid #B8A48B;
                    border-radius: 50%;
                    animation: floatingDot 4s ease-in-out infinite;
                }

                .login-floating-dot-two {
                    animation-delay: 1.5s;
                }

                @keyframes floatingDot {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translateY(-18px) scale(1.3);
                        opacity: 0.9;
                    }
                }

                .login-sparkle {
                    color: #B8A48B;
                    font-size: 25px;
                    animation: sparkle 3s ease-in-out infinite;
                }

                .login-sparkle-two {
                    animation-delay: 1s;
                }

                @keyframes sparkle {
                    0%, 100% {
                        opacity: 0.35;
                        transform: scale(0.8) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.3) rotate(45deg);
                    }
                }


                /* Input Effects */

                .login-input {
                    transition: border-color 0.3s ease,
                                box-shadow 0.3s ease,
                                transform 0.3s ease;
                }

                .login-input:focus {
                    border-color: #2B2926;
                    box-shadow: 0 0 0 3px rgba(43,41,38,0.08);
                    transform: translateY(-2px);
                }

                .login-input-icon {
                    transition: color 0.3s ease, transform 0.3s ease;
                }

                .login-field:focus-within .login-input-icon {
                    color: #2B2926;
                    transform: translateY(-50%) scale(1.15);
                }


                /* Main Button */

                .login-main-button,
                .otp-verify-button {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease,
                                box-shadow 0.3s ease,
                                background 0.3s ease;
                }

                .login-main-button::before,
                .otp-verify-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.22),
                        transparent
                    );
                    transform: skewX(-20deg);
                    transition: left 0.7s ease;
                }

                .login-main-button:hover::before,
                .otp-verify-button:hover::before {
                    left: 150%;
                }

                .login-main-button:hover,
                .otp-verify-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 9px 22px rgba(43,41,38,0.2);
                }

                .login-main-button:active,
                .otp-verify-button:active {
                    transform: translateY(-1px) scale(0.98);
                }


                /* Google Button */

                .login-google-button {
                    transition: transform 0.3s ease;
                }

                .login-google-button:hover {
                    transform: translateY(-2px);
                }


                /* Register Link */

                .login-register a {
                    transition: color 0.3s ease, border-color 0.3s ease;
                }

                .login-register a:hover {
                    color: #9B7957;
                    border-color: #9B7957;
                }


                /* OTP Screen */

                .otp-icon {
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                }

                .otp-icon:hover {
                    transform: rotate(-8deg) scale(1.1);
                    box-shadow: 0 8px 20px rgba(43,41,38,0.12);
                }

                .otp-back {
                    transition: transform 0.3s ease, color 0.3s ease;
                }

                .otp-back:hover {
                    transform: translateX(-5px);
                }


                /* OTP Inputs */

                .otp-input {
                    animation: otpBoxEntrance 0.5s both;
                    transition: border-color 0.25s ease,
                                box-shadow 0.25s ease,
                                transform 0.25s ease,
                                background 0.25s ease;
                }

                @keyframes otpBoxEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(15px) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .otp-input:focus {
                    transform: translateY(-4px) scale(1.06);
                    border-color: #2B2926;
                    background: #fff;
                    box-shadow: 0 5px 15px rgba(43,41,38,0.12);
                }

                .otp-input:not(:placeholder-shown) {
                    background: #F5F0E8;
                }


                /* OTP Resend */

                .otp-resend button {
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }

                .otp-resend button:hover {
                    transform: translateY(-2px);
                }


                /* Mobile */

                @media (max-width: 640px) {
                    .login-svg {
                        opacity: 0.15;
                    }

                    .login-card {
                        box-shadow: 0 10px 35px rgba(43,41,38,0.08);
                    }
                }


                /* Accessibility */

                @media (prefers-reduced-motion: reduce) {

                    .login-page *,
                    .login-page *::before,
                    .login-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }

                }

            `}</style>

        </div>
    )
}

export default LoginPage