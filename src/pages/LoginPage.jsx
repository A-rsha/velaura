import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'

function LoginPage() {
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
                console.log("LOGIN RESPONSE:", res.data)
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("role", res.data.user.role)

                if (res.data.user.role === "admin") {
                    navigate("/adminDashboard")
                } else {
                    navigate("/")
                }
            }catch(error){
                alert("Invalid email and passowrd")

            }finally{
                setLoading(false)
            }

        }
    
    return (
        <div className='min-h-screen bg-orange-100 flex justify-center items-center '>

            <form onSubmit={handleSubmit}  className='space-y-5' >

                <div className='flex flex-col w-full max-w-md bg-white shadow-lg p-8 rounded-2xl'>
                    <h1 className='text-2xl mb-6 text-center'>Login to your Account</h1>

                    <label htmlFor="" className='mb-4'>Email</label> 
                    <input type="text" name='email' onChange={handleChange} required className='mb-4 border bg-white shadow-lg h-10 ' placeholder='Enter your email' />
                     
                    <label htmlFor="" className='mb-4'>Password</label>
                    <input type="password" name='password' onChange={handleChange} required placeholder='Enter password' className='mb-4 border bg-white shadow-lg h-10 ' />
                    <button type='submit' disabled={loading} className='w-full h-14 rounded-2xl bg-red-300 font-semibold hover:bg-gray-800 transition duration-300 '>{loading ? "Logged in...": "Login"}</button>

                    <p className='text-center'>Don't have an account?{" "}<span className='text-orange-800'><Link to='/register'>register</Link></span></p>
                </div>

            </form>

        </div>
    )
}

export default LoginPage