import React, { useEffect, useState } from 'react'
import {

  FiPackage,
  FiShoppingBag,
  FiPlus,
  FiImage,
  FiHome
} from 'react-icons/fi'

import ManageProducts from '../components/ManageProducts'
import API from '../services/axios'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'


function AdminDashboard() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: null,
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/product/getProducts')
        console.log("PRODUCTS:", res.data)
        setTotalProducts(res.data.data.length)
      } catch (error) {
        console.log("Product error:", error)
      }
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get('/order/getAllOrders')
        console.log("ORDERS:", res.data)
        setTotalOrders(res.data.orders.length)
      } catch (error) {
        console.log('Order error:', error)
      }
    }
    fetchProducts()
    fetchOrders()
  }, [])


  const handleChange = (e) => {

    if (e.target.name === "image") {

      const file = e.target.files[0]

      setFormData({
        ...formData,
        image: file
      })

      if (file) {
        setPreview(URL.createObjectURL(file))
      }

    } else {

      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })

    }
  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    const data = new FormData()

    Object.keys(formData).forEach((key) => {

      if (formData[key]) {
        data.append(key, formData[key])
      }

    })


    try {

      setLoading(true)

      await API.post(
        '/product/postProduct',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      alert("Product created successfully")

      window.location.reload()

    } catch (error) {

      console.log(
        "FULL ERROR:",
        error.response?.data || error
      )

      alert("Error creating product")

    } finally {

      setLoading(false)

    }

  }


  return (
    <div>
      <AdminSidebar />

      <div className="min-h-screen bg-[#F7F7F5]">




        <main className="lg:ml-64">


          {/* Header */}

          <header
            className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-gray-200
            bg-white
            px-5
            sm:px-8
            lg:px-10
          "
          >

            <div>

              <p className="text-xs text-gray-400">
                Admin Panel
              </p>

              <h1
                className="
                mt-1
                text-xl
                font-semibold
                text-[#2B2926]
              "
              >
                Dashboard
              </h1>

            </div>


            <div
              className="
              flex
              items-center
              gap-3
            "
            >

              <div
                className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-[#2B2926]
                text-sm
                font-medium
                text-white
              "
              >
                A
              </div>

              <div className="hidden sm:block">

                <p className="text-sm font-medium">
                  Admin
                </p>

                <p className="text-xs text-gray-400">
                  Administrator
                </p>

              </div>

            </div>

          </header>


          {/* Content */}

          <div
            className="
            px-5
            py-7
            sm:px-8
            lg:px-10
          "
          >



            <div className="mb-8">

              <h2
                className="
                text-lg
                font-semibold
                text-[#2B2926]
              "
              >
                Overview
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your VELAURA store from here.
              </p>

            </div>


            {/* Stats */}

            <div
              className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-4
              mb-8
            "
            >

              {/* Products */}

              <div
                className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
              "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Total Products
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      {totalProducts}
                    </h3>

                  </div>

                  <div
                    className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-gray-100
                  "
                  >
                    <FiPackage size={19} />
                  </div>

                </div>

              </div>


              {/* Orders */}

              <div
                className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
              "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Total Orders
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      {totalOrders}
                    </h3>

                  </div>

                  <div
                    className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-gray-100
                  "
                  >
                    <FiShoppingBag size={19} />
                  </div>

                </div>

              </div>


              {/* Users */}

              <div
                className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
              "
              >

                <div className="flex items-center justify-between">

                  <button onClick={() => navigate('/')}
                    className="
              mt-1
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-sm
              text-gray-600
              transition
              hover:bg-gray-100
              hover:text-black
            "
                  >
                    <FiHome size={17} />
                    Home
                  </button>


                </div>

              </div>


              {/* Revenue */}

              <div
                className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
              "
              >

                <div className="flex items-center justify-between">


                  <button onClick={() => navigate('/order')}
                    className="
              mt-1
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-sm
              text-gray-600
              transition
              hover:bg-gray-100
              hover:text-black
            "
                  >
                    <FiShoppingBag size={17} />
                    Orders
                  </button>



                </div>

              </div>

            </div>


            {/* ================= CREATE PRODUCT ================= */}

            <div
              className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              sm:p-7
              lg:p-8
            "
            >

              {/* Heading */}

              <div
                className="
                mb-7
                flex
                items-start
                gap-3
              "
              >

                <div
                  className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#2B2926]
                  text-white
                "
                >

                  <FiPlus size={19} />

                </div>


                <div>

                  <h2
                    className="
                    text-lg
                    font-semibold
                    text-[#2B2926]
                  "
                  >
                    Create Product
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add a new accessory to your store.
                  </p>

                </div>

              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >


                {/* Title */}

                <div>

                  <label
                    className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                  >
                    Product Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter product title"
                    onChange={handleChange}
                    required
                    className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#2B2926]
                    focus:ring-1
                    focus:ring-[#2B2926]
                  "
                  />

                </div>


                {/* Description */}

                <div>

                  <label
                    className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                  >
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    onChange={handleChange}
                    rows="4"
                    className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#2B2926]
                    focus:ring-1
                    focus:ring-[#2B2926]
                  "
                  />

                </div>


                {/* Category + Price */}

                <div
                  className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-5
                "
                >

                  <div>

                    <label
                      className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                    >
                      Category
                    </label>

                    <select
                      name="category"
                      onChange={handleChange}
                      required
                      className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-[#2B2926]
                      focus:ring-1
                      focus:ring-[#2B2926]
                    "
                    >

                      <option value="">
                        Select Category
                      </option>

                      <option value="Jewelry">
                        Jewelry
                      </option>

                      <option value="Watches">
                        Watches
                      </option>

                      <option value="Bags">
                        Bags
                      </option>

                      <option value="Sunglasses">
                        Sunglasses
                      </option>

                      <option value="Wallets">
                        Wallets
                      </option>

                      <option value="Hair Accessories">
                        Hair Accessories
                      </option>

                      <option value="Beauty Accessories">
                        Beauty Accessories
                      </option>

                    </select>

                  </div>


                  <div>

                    <label
                      className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-700
                    "
                    >
                      Price
                    </label>

                    <div className="relative">

                      <span
                        className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-gray-500
                      "
                      >
                        ₹
                      </span>

                      <input
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        onChange={handleChange}
                        required
                        className="
                        w-full
                        rounded-lg
                        border
                        border-gray-300
                        py-3
                        pl-8
                        pr-4
                        text-sm
                        outline-none
                        focus:border-[#2B2926]
                        focus:ring-1
                        focus:ring-[#2B2926]
                      "
                      />

                    </div>

                  </div>

                </div>


                {/* Image */}

                <div>

                  <label
                    className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                  "
                  >
                    Product Image
                  </label>


                  <div
                    className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                  "
                  >

                    {/* Upload */}

                    <label
                      className="
                      flex
                      min-h-[180px]
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-lg
                      border-2
                      border-dashed
                      border-gray-300
                      bg-gray-50
                      px-5
                      text-center
                      transition
                      hover:border-gray-500
                      hover:bg-gray-100
                    "
                    >

                      <FiImage
                        size={30}
                        className="text-gray-400"
                      />

                      <p className="mt-3 text-sm font-medium">
                        Click to upload image
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        PNG, JPG or JPEG
                      </p>

                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                      />

                    </label>


                    {/* Preview */}

                    <div
                      className="
                      flex
                      min-h-[180px]
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-lg
                      border
                      border-gray-200
                      bg-gray-50
                    "
                    >

                      {preview ? (

                        <img
                          src={preview}
                          alt="preview"
                          className="
                          h-full
                          max-h-[180px]
                          w-full
                          object-contain
                        "
                        />

                      ) : (

                        <div className="text-center">

                          <FiImage
                            size={28}
                            className="
                            mx-auto
                            text-gray-300
                          "
                          />

                          <p className="mt-2 text-xs text-gray-400">
                            Image preview
                          </p>

                        </div>

                      )}

                    </div>

                  </div>

                </div>


                {/* Submit */}

                <div className="flex justify-end pt-2">

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-[#2B2926]
                    px-7
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-black
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:w-auto
                  "
                  >

                    <FiPlus size={17} />

                    {loading
                      ? "Creating..."
                      : "Create Product"
                    }

                  </button>

                </div>

              </form>

            </div>




            <div className="mt-8">

              <ManageProducts />

            </div>


          </div>

        </main>

      </div>
      </div>
      )
    
}


export default AdminDashboard