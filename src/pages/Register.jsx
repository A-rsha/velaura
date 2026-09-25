import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/axios'

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
    e.preventDefault();
    try {
      setLoading(true)

      await API.post('/auth/register', formData)
      alert("Registered successfully")
      navigate("/login")
    } catch (error) {
      console.log("REGISTRATION ERROR:", error)
      console.log("ERROR RESPONSE:", error.response?.data)

      alert(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-orange-100 flex justify-center items-center'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col w-full max-w-md bg-white shadow-lg p-8 rounded-2xl'>
          <h1 className='text-2xl mb-6 text-center '>Let's create Account</h1>

          <label htmlFor="" className='mb-4'>Name</label>
          <input type="text" name='name' onChange={handleChange} required className='mb-4 border bg-white shadow-lg h-10 ' placeholder='Enter name' />

          <label htmlFor="" className='mb-4'>Email</label>
          <input type="email" name='email' onChange={handleChange} required className='mb-4 border bg-white shadow-lg h-10 ' placeholder='Enter Email' />

          <label htmlFor="" className='mb-4'>Password</label>
          <input type="password" name='password' onChange={handleChange} required className='mb-4 border bg-white shadow-lg h-10 ' placeholder='Enter Password' />

          <button type='submit' disabled={loading} className='w-full h-14 rounded-2xl bg-red-300 font-semibold hover:bg-gray-800 transition duration-300'>
            {loading ? "Creating ACcount..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-gray-500 mt-8">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-black font-semibold no-underline hover:underline"
            >
              Login
            </Link>

          </p>
        </div>

      </form>
    </div>
  )
}

export default Register