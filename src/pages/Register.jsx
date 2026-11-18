import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'
import ScrollReveal from '../components/ScrollReveal'

function Register() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            setLoading(true)

            await API.post('/auth/register', formData)

            toast.success("Registered successfully", {
                icon: <FiCheckCircle size={21} />
            })

            navigate("/login")

        } catch (error) {

            console.log("REGISTRATION ERROR:", error)
            console.log("ERROR RESPONSE:", error.response?.data)

            toast.error(
                error.response?.data?.message ||
                "Registration failed",
                {
                    icon: <FiXCircle size={21} />
                }
            )

        } finally {

            setLoading(false)

        }
    }

    return (

        <div className="
            register-page
            relative
            min-h-screen
            bg-[#F5F0E8]
            flex
            items-center
            justify-center
            px-5
            py-12
            overflow-hidden
        ">

            {/* Animated SVG Background */}

            <div className="register-decoration absolute inset-0 pointer-events-none overflow-hidden">

                <svg
                    className="register-svg register-svg-one absolute -top-24 -right-20 w-96 h-96 opacity-30"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <circle
                        cx="150"
                        cy="150"
                        r="120"
                        stroke="#B8A48B"
                        strokeWidth="1"
                    />

                    <circle
                        cx="150"
                        cy="150"
                        r="95"
                        stroke="#B8A48B"
                        strokeWidth="1"
                        strokeDasharray="5 8"
                    />

                    <circle
                        cx="150"
                        cy="150"
                        r="65"
                        stroke="#B8A48B"
                        strokeWidth="1"
                    />

                    <path
                        d="M150 20C175 85 215 125 280 150C215 175 175 215 150 280C125 215 85 175 20 150C85 125 125 85 150 20Z"
                        stroke="#B8A48B"
                        strokeWidth="1"
                    />

                </svg>

                <svg
                    className="register-svg register-svg-two absolute -bottom-28 -left-24 w-96 h-96 opacity-30"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >

                    <circle
                        cx="150"
                        cy="150"
                        r="110"
                        stroke="#B8A48B"
                        strokeWidth="1"
                    />

                    <path
                        d="M150 25L175 125L275 150L175 175L150 275L125 175L25 150L125 125L150 25Z"
                        stroke="#B8A48B"
                        strokeWidth="1"
                    />

                    <circle
                        cx="150"
                        cy="150"
                        r="60"
                        stroke="#B8A48B"
                        strokeWidth="1"
                        strokeDasharray="4 7"
                    />

                </svg>

                <span className="register-sparkle absolute top-[20%] left-[15%]">
                    ✧
                </span>

                <span className="register-sparkle register-sparkle-two absolute bottom-[20%] right-[15%]">
                    ✦
                </span>

                <div className="register-dot absolute top-[35%] right-[12%]" />

                <div className="register-dot register-dot-two absolute bottom-[30%] left-[12%]" />

            </div>


            {/* Register Card */}

            <ScrollReveal
                direction="zoom"
                duration={850}
                once={true}
            >

                <div className="
                    register-card
                    relative
                    z-10
                    w-full
                    max-w-md
                    border
                    border-[#DED5C8]
                    bg-white
                    px-6
                    py-8
                    sm:px-10
                    sm:py-10
                ">

                    {/* Logo */}

                    <ScrollReveal
                        direction="down"
                        delay={100}
                        duration={700}
                        once={true}
                    >

                        <div className="text-center mb-8 register-logo">

                            <Link
                                to="/"
                                className="inline-flex flex-col items-center"
                            >

                                <span className="
                                    font-serif
                                    text-3xl
                                    sm:text-4xl
                                    font-medium
                                    tracking-wide
                                    register-logo-text
                                ">
                                    VELAURA
                                </span>

                                <span className="
                                    mt-1
                                    text-[8px]
                                    sm:text-[9px]
                                    tracking-[4px]
                                    text-gray-500
                                    register-logo-subtitle
                                ">
                                    ACCESSORIES
                                </span>

                            </Link>

                        </div>

                    </ScrollReveal>


                    {/* Heading */}

                    <ScrollReveal
                        direction="up"
                        delay={150}
                        duration={750}
                        once={true}
                    >

                        <div className="text-center mb-8 register-heading">

                            <p className="
                                text-[10px]
                                uppercase
                                tracking-[3px]
                                text-gray-500
                                mb-2
                            ">
                                JOIN VELAURA
                            </p>

                            <h1 className="
                                font-serif
                                text-2xl
                                sm:text-3xl
                                font-medium
                                text-[#2B2926]
                            ">
                                Create Your Account
                            </h1>

                            <p className="
                                mt-2
                                text-sm
                                text-gray-500
                            ">
                                Create an account and start exploring our collection.
                            </p>

                        </div>

                    </ScrollReveal>


                    {/* Form */}

                    <ScrollReveal
                        direction="up"
                        delay={200}
                        duration={800}
                        once={true}
                    >

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 register-form"
                        >

                            {/* Name */}

                            <div className="register-field">

                                <label
                                    htmlFor="name"
                                    className="
                                        block
                                        mb-2
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[1px]
                                        text-[#2B2926]
                                    "
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your name"
                                    disabled={loading}
                                    className="
                                        register-input
                                        w-full
                                        h-12
                                        border
                                        border-[#DED5C8]
                                        bg-white
                                        px-4
                                        text-sm
                                        text-[#2B2926]
                                        outline-none
                                        transition
                                        duration-300
                                        placeholder:text-gray-400
                                        focus:border-[#2B2926]
                                        disabled:bg-gray-50
                                    "
                                />

                            </div>


                            {/* Email */}

                            <div className="register-field">

                                <label
                                    htmlFor="email"
                                    className="
                                        block
                                        mb-2
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[1px]
                                        text-[#2B2926]
                                    "
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email"
                                    disabled={loading}
                                    className="
                                        register-input
                                        w-full
                                        h-12
                                        border
                                        border-[#DED5C8]
                                        bg-white
                                        px-4
                                        text-sm
                                        text-[#2B2926]
                                        outline-none
                                        transition
                                        duration-300
                                        placeholder:text-gray-400
                                        focus:border-[#2B2926]
                                        disabled:bg-gray-50
                                    "
                                />

                            </div>


                            {/* Password */}

                            <div className="register-field">

                                <label
                                    htmlFor="password"
                                    className="
                                        block
                                        mb-2
                                        text-xs
                                        font-medium
                                        uppercase
                                        tracking-[1px]
                                        text-[#2B2926]
                                    "
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a password"
                                    disabled={loading}
                                    className="
                                        register-input
                                        w-full
                                        h-12
                                        border
                                        border-[#DED5C8]
                                        bg-white
                                        px-4
                                        text-sm
                                        text-[#2B2926]
                                        outline-none
                                        transition
                                        duration-300
                                        placeholder:text-gray-400
                                        focus:border-[#2B2926]
                                        disabled:bg-gray-50
                                    "
                                />

                            </div>


                            {/* Create Account Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    register-button
                                    relative
                                    overflow-hidden
                                    w-full
                                    h-12
                                    bg-[#2B2926]
                                    text-white
                                    text-sm
                                    font-medium
                                    transition
                                    duration-300
                                    hover:bg-black
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                <span className="relative z-10">

                                    {loading
                                        ? "Creating Account..."
                                        : "Create Account"
                                    }

                                </span>

                            </button>

                        </form>

                    </ScrollReveal>


                    {/* Login Link */}

                    <ScrollReveal
                        direction="fade"
                        delay={300}
                        duration={800}
                        once={true}
                    >

                        <div className="
                            register-login
                            mt-7
                            pt-6
                            border-t
                            border-[#DED5C8]
                            text-center
                        ">

                            <p className="text-sm text-gray-500">

                                Already have an account?{" "}

                                <Link
                                    to="/login"
                                    className="
                                        font-medium
                                        text-[#2B2926]
                                        border-b
                                        border-[#2B2926]
                                        pb-0.5
                                        transition
                                        hover:opacity-60
                                    "
                                >
                                    Login
                                </Link>

                            </p>

                        </div>

                    </ScrollReveal>

                </div>

            </ScrollReveal>


            {/* Animation CSS */}

            <style>{`

                /* Main Card */

                .register-card {
                    transform-origin: center;
                    transition: box-shadow 0.4s ease;
                }

                .register-card:hover {
                    box-shadow: 0 25px 65px rgba(43,41,38,0.12);
                }


                /* Logo Hover */

                .register-logo-text {
                    transition: letter-spacing 0.4s ease,
                                transform 0.4s ease;
                }

                .register-logo:hover .register-logo-text {
                    letter-spacing: 5px;
                    transform: translateY(-3px);
                }

                .register-logo-subtitle {
                    transition: letter-spacing 0.4s ease;
                }

                .register-logo:hover .register-logo-subtitle {
                    letter-spacing: 7px;
                }


                /* Input Hover and Focus */

                .register-input {
                    transition: border-color 0.3s ease,
                                box-shadow 0.3s ease,
                                transform 0.3s ease,
                                background 0.3s ease;
                }

                .register-input:hover {
                    border-color: #B8A48B;
                }

                .register-input:focus {
                    border-color: #2B2926;
                    box-shadow: 0 0 0 3px rgba(43,41,38,0.08);
                    transform: translateY(-2px);
                    background: #FEFDFC;
                }


                /* Button Shine Animation */

                .register-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -120%;
                    width: 70%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.25),
                        transparent
                    );
                    transform: skewX(-20deg);
                    transition: left 0.7s ease;
                }

                .register-button:hover::before {
                    left: 150%;
                }

                .register-button:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(43,41,38,0.22);
                    letter-spacing: 0.5px;
                }

                .register-button:active {
                    transform: translateY(-1px) scale(0.98);
                    box-shadow: 0 4px 12px rgba(43,41,38,0.15);
                }


                /* Login Link */

                .register-login a {
                    transition: color 0.3s ease,
                                border-color 0.3s ease,
                                letter-spacing 0.3s ease;
                }

                .register-login a:hover {
                    color: #A18462;
                    border-color: #A18462;
                    letter-spacing: 0.5px;
                }


                /* Background SVG */

                .register-svg-one {
                    transform-origin: center;
                    animation: registerRotate 40s linear infinite;
                }

                .register-svg-two {
                    transform-origin: center;
                    animation: registerRotateReverse 45s linear infinite;
                }

                @keyframes registerRotate {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes registerRotateReverse {
                    from {
                        transform: rotate(360deg);
                    }

                    to {
                        transform: rotate(0deg);
                    }
                }


                /* Sparkle Effects */

                .register-sparkle {
                    color: #B8A48B;
                    font-size: 27px;
                    animation: registerSparkle 3s ease-in-out infinite;
                }

                .register-sparkle-two {
                    animation-delay: 1.5s;
                }

                @keyframes registerSparkle {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(0.8) rotate(0deg);
                    }

                    50% {
                        opacity: 1;
                        transform: scale(1.3) rotate(45deg);
                    }
                }


                /* Floating Dots */

                .register-dot {
                    width: 9px;
                    height: 9px;
                    border: 1px solid #B8A48B;
                    border-radius: 50%;
                    animation: registerFloat 4s ease-in-out infinite;
                }

                .register-dot-two {
                    animation-delay: 1.5s;
                }

                @keyframes registerFloat {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                        opacity: 0.4;
                    }

                    50% {
                        transform: translateY(-20px) scale(1.3);
                        opacity: 0.9;
                    }
                }


                /* Mobile */

                @media (max-width: 640px) {

                    .register-svg {
                        opacity: 0.15;
                    }

                    .register-card {
                        box-shadow: 0 10px 35px rgba(43,41,38,0.08);
                    }

                }


                /* Accessibility */

                @media (prefers-reduced-motion: reduce) {

                    .register-page *,
                    .register-page *::before,
                    .register-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }

                }

            `}</style>

        </div>
    )
}

export default Register