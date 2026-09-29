import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'

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

            if (res.data.user.role !== "admin") {
                alert("You are not authorized as an admin")
                return
            }

            localStorage.setItem("token", res.data.token)
            localStorage.setItem("role", res.data.user.role)
            localStorage.setItem("userName", res.data.user.name)

            navigate("/adminDashboard")

        } catch (error) {

            console.log(
                "ADMIN LOGIN ERROR:",
                error.response?.data || error
            )

            alert(
                error.response?.data?.message ||
                "Invalid admin email or password"
            )

        } finally {

            setLoading(false)

        }

    }

    return (

        <div
            className="
                min-h-screen
                bg-[#F5F0E8]
                flex
                items-center
                justify-center
                px-5
                py-12
            "
        >

            <div
                className="
                    w-full
                    max-w-md
                    border
                    border-[#DED5C8]
                    bg-white
                    px-6
                    py-8
                    sm:px-10
                    sm:py-10
                "
            >

                {/* Logo */}

                <div className="text-center mb-8">

                    <Link
                        to="/"
                        className="inline-flex flex-col items-center"
                    >

                        <span
                            className="
                                font-serif
                                text-3xl
                                sm:text-4xl
                                font-medium
                                tracking-wide
                            "
                        >
                            VELAURA
                        </span>

                        <span
                            className="
                                mt-1
                                text-[8px]
                                sm:text-[9px]
                                tracking-[4px]
                                text-gray-500
                            "
                        >
                            ACCESSORIES
                        </span>

                    </Link>

                </div>


                {/* Heading */}

                <div className="text-center mb-8">

                    <p
                        className="
                            text-[10px]
                            uppercase
                            tracking-[3px]
                            text-gray-500
                            mb-2
                        "
                    >
                        ADMIN PORTAL
                    </p>

                    <h1
                        className="
                            font-serif
                            text-2xl
                            sm:text-3xl
                            font-medium
                            text-[#2B2926]
                        "
                    >
                        Admin Login
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-gray-500
                        "
                    >
                        Sign in to access the VELAURA admin dashboard.
                    </p>

                </div>


                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Email */}

                    <div>

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
                            className="
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
                            "
                        />

                    </div>


                    {/* Password */}

                    <div>

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
                            placeholder="Enter admin password"
                            className="
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
                            "
                        />

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
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
                        {loading ? "Logging in..." : "Admin Login"}
                    </button>

                </form>


                {/* Back to User Login */}

                <div
                    className="
                        mt-7
                        pt-6
                        border-t
                        border-[#DED5C8]
                        text-center
                    "
                >

                    <p className="text-sm text-gray-500">

                        User login?{" "}

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
                            Login here
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    )
}

export default AdminLogin