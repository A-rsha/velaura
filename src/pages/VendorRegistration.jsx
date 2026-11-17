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
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        "w-full h-12 border border-[#DED5C8] bg-transparent pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#2B2926] focus:bg-white/60 focus:shadow-[0_0_0_3px_rgba(43,41,38,0.06)] hover:border-[#A99B87]"

    const labelClass =
        "block mb-2 text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"

    return (

        <div className="vendor-register-page min-h-screen bg-[#F5F0E8] py-10 px-4 sm:px-6">

            <style>{`

                .vendor-register-page {
                    animation: registerPageEnter 0.7s ease both;
                }

                @keyframes registerPageEnter {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .register-logo {
                    animation: registerLogo 0.8s ease both;
                }

                @keyframes registerLogo {
                    from {
                        opacity: 0;
                        transform: translateY(-18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .register-heading {
                    animation: registerHeading 0.8s ease both;
                    animation-delay: 0.15s;
                }

                @keyframes registerHeading {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .register-form {
                    animation: registerForm 0.85s ease both;
                    animation-delay: 0.25s;
                    transition: box-shadow 0.35s ease;
                }

                .register-form:hover {
                    box-shadow: 0 18px 45px rgba(43, 41, 38, 0.07);
                }

                @keyframes registerForm {
                    from {
                        opacity: 0;
                        transform: translateY(28px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .register-section {
                    animation: registerSection 0.7s ease both;
                }

                .register-section:nth-of-type(2) {
                    animation-delay: 0.15s;
                }

                @keyframes registerSection {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .register-section-icon {
                    transition: transform 0.35s ease,
                                background 0.35s ease,
                                box-shadow 0.35s ease;
                }

                .register-section-heading:hover .register-section-icon {
                    transform: rotate(-5deg) scale(1.08);
                    box-shadow: 0 6px 15px rgba(43, 41, 38, 0.18);
                }

                .register-field {
                    animation: registerField 0.55s ease both;
                }

                @keyframes registerField {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .register-input-icon {
                    transition: color 0.3s ease,
                                transform 0.3s ease;
                }

                .register-input-wrapper:focus-within .register-input-icon {
                    color: #2B2926;
                    transform: scale(1.12);
                }

                .register-submit {
                    position: relative;
                    overflow: hidden;
                    transition: background 0.3s ease,
                                transform 0.3s ease,
                                box-shadow 0.3s ease;
                }

                .register-submit::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.18),
                        transparent
                    );
                    transform: skewX(-20deg);
                    transition: left 0.6s ease;
                }

                .register-submit:hover::before {
                    left: 140%;
                }

                .register-submit:hover:not(:disabled) {
                    transform: translateY(-3px);
                    background: #49443F;
                    box-shadow: 0 9px 22px rgba(43, 41, 38, 0.2);
                }

                .register-submit:active:not(:disabled) {
                    transform: translateY(-1px) scale(0.99);
                }

                .register-link {
                    transition: color 0.3s ease;
                }

                .register-link:hover {
                    color: #9A7950;
                }

                .register-back {
                    transition: color 0.3s ease,
                                transform 0.3s ease;
                }

                .register-back:hover {
                    transform: translateX(-4px);
                    color: #2B2926;
                }

                .register-logo-link {
                    transition: transform 0.3s ease;
                }

                .register-logo-link:hover {
                    transform: scale(1.04);
                }

                .register-logo-text {
                    transition: letter-spacing 0.35s ease;
                }

                .register-logo-link:hover .register-logo-text {
                    letter-spacing: 3px;
                }

                @media (prefers-reduced-motion: reduce) {
                    .vendor-register-page *,
                    .vendor-register-page *::before,
                    .vendor-register-page *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                }

            `}</style>

            <div className="mx-auto max-w-3xl">

                {/* LOGO */}

                <div className="register-logo mb-10 text-center">

                    <Link
                        to="/"
                        className="register-logo-link inline-flex flex-col items-center"
                    >

                        <span className="register-logo-text font-serif text-3xl sm:text-4xl font-medium tracking-wide">
                            VELAURA
                        </span>

                        <span className="mt-1 text-[9px] tracking-[4px] text-gray-500">
                            ACCESSORIES
                        </span>

                    </Link>

                </div>


                {/* HEADING */}

                <div className="register-heading mb-10 text-center">

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
                    className="register-form border border-[#DED5C8] bg-[#F9F6F0] p-6 sm:p-10"
                >

                    {/* ACCOUNT DETAILS */}

                    <div className="register-section mb-10">

                        <div className="register-section-heading mb-7 flex items-center gap-3">

                            <div className="register-section-icon flex h-10 w-10 items-center justify-center bg-[#2B2926] text-white">
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

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Full Name *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiUser className="register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Email Address *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiMail className="register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Password *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiLock className="register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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

                        <div className="register-field">

                            <label className={labelClass}>
                                Confirm Password *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiLock className="register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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

                    <div className="register-section">

                        <div className="register-section-heading mb-7 flex items-center gap-3">

                            <div className="register-section-icon flex h-10 w-10 items-center justify-center bg-[#2B2926] text-white">
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

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Store Name *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiShoppingBag className="register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Business Description *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiFileText className="register-input-icon absolute left-4 top-4 text-gray-400" />

                                <textarea
                                    name="businessDescription"
                                    value={formData.businessDescription}
                                    onChange={handleChange}
                                    placeholder="Tell us about your store and products"
                                    rows={4}
                                    className="w-full resize-none border border-[#DED5C8] bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 hover:border-[#A99B87] focus:border-[#2B2926] focus:bg-white/60 focus:shadow-[0_0_0_3px_rgba(43,41,38,0.06)]"
                                    required
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Phone Number *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiPhone className="register-input-icon absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

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

                        <div className="register-field mb-5">

                            <label className={labelClass}>
                                Business Address *
                            </label>

                            <div className="register-input-wrapper relative">

                                <FiMapPin className="register-input-icon absolute left-4 top-4 text-gray-400" />

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your business address"
                                    rows={2}
                                    className="w-full resize-none border border-[#DED5C8] bg-transparent py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 hover:border-[#A99B87] focus:border-[#2B2926] focus:bg-white/60 focus:shadow-[0_0_0_3px_rgba(43,41,38,0.06)]"
                                    required
                                />

                            </div>

                        </div>


                        {/* CITY AND STATE */}

                        <div className="register-field mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

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
                                    className="h-12 w-full border border-[#DED5C8] bg-transparent px-4 text-sm outline-none transition-all duration-300 hover:border-[#A99B87] focus:border-[#2B2926] focus:bg-white/60 focus:shadow-[0_0_0_3px_rgba(43,41,38,0.06)]"
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
                                    className="h-12 w-full border border-[#DED5C8] bg-transparent px-4 text-sm outline-none transition-all duration-300 hover:border-[#A99B87] focus:border-[#2B2926] focus:bg-white/60 focus:shadow-[0_0_0_3px_rgba(43,41,38,0.06)]"
                                    required
                                />

                            </div>

                        </div>


                        {/* PINCODE */}

                        <div className="register-field">

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
                                className="h-12 w-full border border-[#DED5C8] bg-transparent px-4 text-sm outline-none transition-all duration-300 hover:border-[#A99B87] focus:border-[#2B2926] focus:bg-white/60 focus:shadow-[0_0_0_3px_rgba(43,41,38,0.06)]"
                                required
                            />

                        </div>

                    </div>


                    {/* SUBMIT */}

                    <div className="mt-10">

                        <button
                            type="submit"
                            disabled={loading}
                            className="register-submit h-14 w-full bg-[#2B2926] px-6 text-xs font-medium uppercase tracking-[2px] text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span className="relative z-10">
                                {loading
                                    ? 'Creating Your Account...'
                                    : 'Complete Vendor Registration'
                                }
                            </span>
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
                            className="register-link font-medium text-[#2B2926] underline underline-offset-4"
                        >
                            Vendor Login
                        </Link>

                    </p>

                </div>


                {/* BACK HOME */}

                <div className="mt-6 text-center">

                    <Link
                        to="/"
                        className="register-back inline-flex items-center gap-2 text-xs text-gray-500"
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