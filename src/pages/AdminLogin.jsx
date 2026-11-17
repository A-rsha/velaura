import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'
import { toast } from 'react-toastify'

function AdminLogin() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
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

            const res = await API.post("/auth/login", formData)

            console.log("ADMIN LOGIN RESPONSE:", res.data)

            if (res.data.requiresOTP) {
                toast.error("Please use the normal user login page.")
                return
            }

            if (res.data.user?.role !== "admin") {
                toast.error("You are not authorized as an admin.")
                return
            }

            // Clear previous login session
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("role")
            localStorage.removeItem("userName")

            // Save admin login details
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("refreshToken", res.data.refreshToken)
            localStorage.setItem("role", res.data.user.role)
            localStorage.setItem("userName", res.data.user.name)

            navigate("/adminDashboard")

        } catch (error) {
            console.log(
                "ADMIN LOGIN ERROR:",
                error.response?.data || error
            )

            toast.error(
                error.response?.data?.message ||
                "Invalid admin email or password"
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login-page flex min-h-screen items-center justify-center bg-[#F5F0E8] px-5 py-12">

            <style>{`
                /* BACKGROUND ENTRANCE */
                .admin-login-page {
                    animation: adminBackgroundEnter 0.7s ease both;
                }

                @keyframes adminBackgroundEnter {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                /* LOGIN CARD */
                .admin-login-card {
                    animation: adminCardEnter 0.8s cubic-bezier(0.2,0.8,0.2,1) both;
                    transition: box-shadow 0.4s ease;
                }

                @keyframes adminCardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(35px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .admin-login-card:hover {
                    box-shadow: 0 18px 45px rgba(43,41,38,0.09);
                }

                /* LOGO */
                .admin-login-logo {
                    animation: logoEnter 0.8s ease 0.2s both;
                    transition: transform 0.35s ease;
                }

                @keyframes logoEnter {
                    from {
                        opacity: 0;
                        transform: translateY(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .admin-login-logo:hover {
                    transform: scale(1.04);
                }

                .admin-login-logo span:first-child {
                    transition: letter-spacing 0.4s ease, color 0.3s ease;
                }

                .admin-login-logo:hover span:first-child {
                    letter-spacing: 5px;
                    color: #8A7660;
                }

                /* HEADING */
                .admin-login-heading {
                    animation: headingEnter 0.7s ease 0.3s both;
                }

                @keyframes headingEnter {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* FORM FIELDS */
                .admin-login-field {
                    animation: fieldEnter 0.6s ease both;
                }

                @keyframes fieldEnter {
                    from {
                        opacity: 0;
                        transform: translateX(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .admin-login-input {
                    transition:
                        border-color 0.3s ease,
                        box-shadow 0.3s ease,
                        transform 0.3s ease;
                }

                .admin-login-input:hover {
                    border-color: #BBA88F;
                }

                .admin-login-input:focus {
                    border-color: #8A7660;
                    box-shadow: 0 0 0 3px rgba(138,118,96,0.12);
                    transform: translateY(-1px);
                }

                /* LOGIN BUTTON */
                .admin-login-button {
                    position: relative;
                    overflow: hidden;
                    transition:
                        background 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .admin-login-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.2),
                        transparent
                    );
                    transition: left 0.6s ease;
                }

                .admin-login-button:hover::before {
                    left: 140%;
                }

                .admin-login-button:hover:not(:disabled) {
                    background: #403D39;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 18px rgba(43,41,38,0.2);
                }

                .admin-login-button:active:not(:disabled) {
                    transform: scale(0.98);
                }

                /* FOOTER */
                .admin-login-footer {
                    animation: footerEnter 0.7s ease 0.7s both;
                }

                @keyframes footerEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .admin-login-link {
                    transition:
                        color 0.3s ease,
                        border-color 0.3s ease;
                }

                .admin-login-link:hover {
                    color: #9A7958;
                    border-color: #9A7958;
                }

                @media (prefers-reduced-motion: reduce) {
                    .admin-login-page *,
                    .admin-login-page *::before,
                    .admin-login-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <div className="admin-login-card w-full max-w-md border border-[#DED5C8] bg-white px-6 py-8 sm:px-10 sm:py-10">

                {/* LOGO */}
                <div className="admin-login-logo mb-8 text-center">

                    <Link
                        to="/"
                        className="inline-flex flex-col items-center"
                    >

                        <span className="font-serif text-3xl font-medium tracking-wide sm:text-4xl">
                            VELAURA
                        </span>

                        <span className="mt-1 text-[8px] tracking-[4px] text-gray-500 sm:text-[9px]">
                            ACCESSORIES
                        </span>

                    </Link>

                </div>

                {/* HEADING */}
                <div className="admin-login-heading mb-8 text-center">

                    <p className="mb-2 text-[10px] uppercase tracking-[3px] text-gray-500">
                        ADMIN PORTAL
                    </p>

                    <h1 className="font-serif text-2xl font-medium text-[#2B2926] sm:text-3xl">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Sign in to access the VELAURA admin dashboard.
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* EMAIL */}
                    <div
                        className="admin-login-field"
                        style={{ animationDelay: '0.4s' }}
                    >

                        <label
                            htmlFor="email"
                            className="mb-2 block text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"
                        >
                            Admin Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter admin email"
                            className="admin-login-input h-12 w-full border border-[#DED5C8] bg-white px-4 text-sm text-[#2B2926] outline-none placeholder:text-gray-400"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div
                        className="admin-login-field"
                        style={{ animationDelay: '0.5s' }}
                    >

                        <label
                            htmlFor="password"
                            className="mb-2 block text-xs font-medium uppercase tracking-[1px] text-[#2B2926]"
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
                            placeholder="Enter admin password"
                            className="admin-login-input h-12 w-full border border-[#DED5C8] bg-white px-4 text-sm text-[#2B2926] outline-none placeholder:text-gray-400"
                        />

                    </div>

                    {/* LOGIN BUTTON */}
                    <div
                        className="admin-login-field"
                        style={{ animationDelay: '0.6s' }}
                    >

                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-login-button h-12 w-full bg-[#2B2926] text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Admin Login"}
                        </button>

                    </div>

                </form>

                {/* BACK TO USER LOGIN */}
                <div className="admin-login-footer mt-7 border-t border-[#DED5C8] pt-6 text-center">

                    <p className="text-sm text-gray-500">

                        User login?{" "}

                        <Link
                            to="/login"
                            className="admin-login-link border-b border-[#2B2926] pb-0.5 font-medium text-[#2B2926]"
                        >
                            Login here
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    )
}

export default AdminLogin