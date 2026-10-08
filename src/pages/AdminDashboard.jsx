
import React, { useEffect, useState } from 'react'
import {
  FiPackage,
  FiShoppingBag,
  FiPlus,
  FiImage,
  FiHome,
  FiTag
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
    image: null
  })

  const [preview, setPreview] = useState(null)
  const [isOffer, setIsOffer] = useState(false)
  const [offerPercentage, setOfferPercentage] = useState("")
  const [loading, setLoading] = useState(false)

  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [categories, setCategories] = useState([])


  const offerPrice =
    isOffer && offerPercentage && formData.price
      ? Number(
          (
            Number(formData.price) -
            (
              Number(formData.price) *
              Number(offerPercentage)
            ) /
            100
          ).toFixed(2)
        )
      : formData.price


  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const res = await API.get('/product/getProducts')

        console.log("PRODUCTS:", res.data)

        setTotalProducts(res.data.data?.length || 0)

      } catch (error) {

        console.log("Product error:", error)

      }

    }


    const fetchOrders = async () => {

      try {

        const res = await API.get('/order/getAllOrders')

        console.log("ORDERS:", res.data)

        setTotalOrders(res.data.orders?.length || 0)

      } catch (error) {

        console.log("Order error:", error)

      }

    }


    const fetchCategories = async () => {

      try {

        const res = await API.get('/category/getCategories')

        setCategories(res.data.data || [])

      } catch (error) {

        console.log("CATEGORY ERROR:", error)

      }

    }


    fetchProducts()
    fetchOrders()
    fetchCategories()

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


    data.append("isOffer", isOffer)

    data.append(
      "offerPercentage",
      isOffer ? offerPercentage : 0
    )

    data.append(
      "offerPrice",
      isOffer ? offerPrice : formData.price
    )


    console.log("isOffer:", isOffer)
    console.log("offerPercentage:", offerPercentage)
    console.log("offerPrice:", offerPrice)


    try {

      setLoading(true)

      await API.post(
        '/product/postProduct',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
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

    <div className="min-h-screen bg-[#F5F0E8]">

      <AdminSidebar />


      <main className="lg:ml-64">

        {/* ================= HEADER ================= */}

        <header className="
          sticky
          top-0
          z-30
          border-b
          border-[#DED5C8]
          bg-[#FDFBF7]/95
          backdrop-blur
        ">

          <div className="
            flex
            min-h-[76px]
            items-center
            justify-between
            px-5
            sm:px-8
            lg:px-10
          ">

            <div>

              <p className="
                text-[10px]
                uppercase
                tracking-[0.28em]
                text-gray-400
              ">
                VELAURA ADMIN
              </p>

              <h1 className="
                mt-1
                text-2xl
                font-serif
                text-[#2B2926]
                sm:text-3xl
              ">
                Dashboard
              </h1>

            </div>


            <div className="flex items-center gap-3">

              <div className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#2B2926]
                text-sm
                font-medium
                text-white
              ">
                A
              </div>


              <div className="hidden sm:block">

                <p className="
                  text-sm
                  font-medium
                  text-[#2B2926]
                ">
                  Admin
                </p>

                <p className="
                  text-xs
                  text-gray-400
                ">
                  Administrator
                </p>

              </div>

            </div>

          </div>

        </header>


        {/* ================= CONTENT ================= */}

        <div className="
          px-5
          py-8
          sm:px-8
          lg:px-10
        ">

          <div className="mx-auto max-w-7xl">


            {/* ================= INTRO ================= */}

            <div className="mb-8">

              <p className="
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-400
              ">
                Store overview
              </p>

              <h2 className="
                mt-2
                text-2xl
                font-serif
                text-[#2B2926]
                sm:text-3xl
              ">
                Welcome back, Admin
              </h2>

              <p className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-gray-500
              ">
                Manage your products, orders and VELAURA
                accessories from one place.
              </p>

            </div>


            {/* ================= STATS ================= */}

            <div className="
              mb-10
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            ">


              {/* PRODUCTS */}

              <div className="
                border
                border-[#DED5C8]
                bg-[#FDFBF7]
                p-5
                transition
                hover:-translate-y-0.5
              ">

                <div className="
                  flex
                  items-start
                  justify-between
                ">

                  <div>

                    <p className="
                      text-xs
                      uppercase
                      tracking-wider
                      text-gray-400
                    ">
                      Products
                    </p>

                    <p className="
                      mt-3
                      text-3xl
                      font-serif
                      text-[#2B2926]
                    ">
                      {totalProducts}
                    </p>

                    <p className="
                      mt-1
                      text-xs
                      text-gray-400
                    ">
                      Total products
                    </p>

                  </div>


                  <div className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    border
                    border-[#DED5C8]
                    bg-[#F5F0E8]
                    text-[#2B2926]
                  ">

                    <FiPackage size={19} />

                  </div>

                </div>

              </div>


              {/* ORDERS */}

              <div className="
                border
                border-[#DED5C8]
                bg-[#FDFBF7]
                p-5
                transition
                hover:-translate-y-0.5
              ">

                <div className="
                  flex
                  items-start
                  justify-between
                ">

                  <div>

                    <p className="
                      text-xs
                      uppercase
                      tracking-wider
                      text-gray-400
                    ">
                      Orders
                    </p>

                    <p className="
                      mt-3
                      text-3xl
                      font-serif
                      text-[#2B2926]
                    ">
                      {totalOrders}
                    </p>

                    <p className="
                      mt-1
                      text-xs
                      text-gray-400
                    ">
                      Total orders
                    </p>

                  </div>


                  <div className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    border
                    border-[#DED5C8]
                    bg-[#F5F0E8]
                    text-[#2B2926]
                  ">

                    <FiShoppingBag size={19} />

                  </div>

                </div>

              </div>


              {/* HOME */}

              <div className="
                border
                border-[#DED5C8]
                bg-[#FDFBF7]
                p-5
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-400
                ">
                  Store
                </p>

                <button
                  onClick={() => navigate('/')}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-between
                    border
                    border-[#DED5C8]
                    px-4
                    py-3
                    text-sm
                    text-[#2B2926]
                    transition
                    hover:bg-[#F5F0E8]
                  "
                >

                  <span className="flex items-center gap-3">

                    <FiHome size={17} />

                    View Store

                  </span>

                  <span>→</span>

                </button>

              </div>


              {/* ORDERS */}

              <div className="
                border
                border-[#DED5C8]
                bg-[#FDFBF7]
                p-5
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-400
                ">
                  Management
                </p>

                <button
                  onClick={() => navigate('/order')}
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-between
                    border
                    border-[#DED5C8]
                    px-4
                    py-3
                    text-sm
                    text-[#2B2926]
                    transition
                    hover:bg-[#F5F0E8]
                  "
                >

                  <span className="flex items-center gap-3">

                    <FiShoppingBag size={17} />

                    View Orders

                  </span>

                  <span>→</span>

                </button>

              </div>

            </div>


            {/* ================= CREATE PRODUCT ================= */}

            <section className="
              border
              border-[#DED5C8]
              bg-[#FDFBF7]
            ">


              {/* SECTION HEADER */}

              <div className="
                border-b
                border-[#DED5C8]
                px-5
                py-6
                sm:px-8
              ">

                <div className="
                  flex
                  items-start
                  gap-4
                ">

                  <div className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    bg-[#2B2926]
                    text-white
                  ">

                    <FiPlus size={19} />

                  </div>


                  <div>

                    <p className="
                      text-[10px]
                      uppercase
                      tracking-[0.25em]
                      text-gray-400
                    ">
                      Product Management
                    </p>

                    <h2 className="
                      mt-1
                      text-2xl
                      font-serif
                      text-[#2B2926]
                    ">
                      Create Product
                    </h2>

                    <p className="
                      mt-1
                      text-sm
                      text-gray-500
                    ">
                      Add a new accessory to your VELAURA store.
                    </p>

                  </div>

                </div>

              </div>


              {/* FORM */}

              <div className="
                px-5
                py-7
                sm:px-8
                sm:py-8
              ">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-7"
                >


                  {/* PRODUCT INFORMATION */}

                  <div>

                    <div className="mb-5">

                      <p className="
                        text-xs
                        uppercase
                        tracking-[0.18em]
                        text-gray-400
                      ">
                        Product Information
                      </p>

                    </div>


                    <div className="space-y-5">


                      {/* TITLE */}

                      <div>

                        <label className="
                          mb-2
                          block
                          text-sm
                          font-medium
                          text-[#2B2926]
                        ">
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
                            border
                            border-[#D8CEC0]
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-[#2B2926]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#2B2926]
                          "
                        />

                      </div>


                      {/* DESCRIPTION */}

                      <div>

                        <label className="
                          mb-2
                          block
                          text-sm
                          font-medium
                          text-[#2B2926]
                        ">
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
                            border
                            border-[#D8CEC0]
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-[#2B2926]
                            outline-none
                            transition
                            placeholder:text-gray-400
                            focus:border-[#2B2926]
                          "
                        />

                      </div>


                      {/* CATEGORY + PRICE */}

                      <div className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                      ">


                        {/* CATEGORY */}

                        <div>

                          <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-[#2B2926]
                          ">
                            Category
                          </label>

                          <select
                            name="category"
                            onChange={handleChange}
                            required
                            className="
                              w-full
                              border
                              border-[#D8CEC0]
                              bg-white
                              px-4
                              py-3
                              text-sm
                              text-[#2B2926]
                              outline-none
                              focus:border-[#2B2926]
                            "
                          >

                            <option value="">
                              Select Category
                            </option>

                            {categories.map((category) => (

                              <option
                                key={category._id}
                                value={category.name}
                              >
                                {category.name}
                              </option>

                            ))}

                          </select>

                        </div>


                        {/* PRICE */}

                        <div>

                          <label className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-[#2B2926]
                          ">
                            Price
                          </label>

                          <div className="relative">

                            <span className="
                              absolute
                              left-4
                              top-1/2
                              -translate-y-1/2
                              text-sm
                              text-gray-500
                            ">
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
                                border
                                border-[#D8CEC0]
                                bg-white
                                py-3
                                pl-8
                                pr-4
                                text-sm
                                text-[#2B2926]
                                outline-none
                                placeholder:text-gray-400
                                focus:border-[#2B2926]
                              "
                            />

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* ================= OFFER ================= */}

                  <div className="
                    border
                    border-[#DED5C8]
                    bg-[#F5F0E8]
                    p-5
                    sm:p-6
                  ">

                    <div className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    ">

                      <div className="flex items-start gap-3">

                        <div className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          bg-[#2B2926]
                          text-white
                        ">

                          <FiTag size={17} />

                        </div>


                        <div>

                          <p className="
                            text-sm
                            font-medium
                            text-[#2B2926]
                          ">
                            Product Offer
                          </p>

                          <p className="
                            mt-1
                            text-xs
                            text-gray-500
                          ">
                            Add a discount to this product.
                          </p>

                        </div>

                      </div>


                      {/* TOGGLE */}

                      <label className="
                        relative
                        inline-flex
                        cursor-pointer
                        items-center
                      ">

                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={isOffer}
                          onChange={(e) =>
                            setIsOffer(e.target.checked)
                          }
                        />

                        <div className="
                          h-6
                          w-11
                          rounded-full
                          bg-gray-300
                          transition
                          peer-checked:bg-[#2B2926]
                        " />

                        <div className="
                          absolute
                          left-[2px]
                          top-[2px]
                          h-5
                          w-5
                          rounded-full
                          border
                          border-gray-300
                          bg-white
                          transition
                          peer-checked:translate-x-5
                        " />

                      </label>

                    </div>


                    {isOffer && (

                      <div className="
                        mt-6
                        border-t
                        border-[#DED5C8]
                        pt-5
                      ">

                        <div className="
                          grid
                          grid-cols-1
                          gap-4
                          sm:grid-cols-2
                        ">


                          {/* OFFER PERCENTAGE */}

                          <div>

                            <label className="
                              mb-2
                              block
                              text-sm
                              font-medium
                              text-[#2B2926]
                            ">
                              Offer Percentage
                            </label>

                            <div className="relative">

                              <input
                                type="number"
                                min="1"
                                max="100"
                                value={offerPercentage}
                                onChange={(e) =>
                                  setOfferPercentage(
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. 20"
                                className="
                                  w-full
                                  border
                                  border-[#D8CEC0]
                                  bg-white
                                  px-4
                                  py-3
                                  pr-10
                                  text-sm
                                  outline-none
                                  placeholder:text-gray-400
                                  focus:border-[#2B2926]
                                "
                              />

                              <span className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-sm
                                text-gray-400
                              ">
                                %
                              </span>

                            </div>

                          </div>


                          {/* OFFER PRICE */}

                          <div>

                            <label className="
                              mb-2
                              block
                              text-sm
                              font-medium
                              text-[#2B2926]
                            ">
                              Final Offer Price
                            </label>

                            <div className="
                              flex
                              min-h-[46px]
                              items-center
                              border
                              border-[#D8CEC0]
                              bg-white
                              px-4
                            ">

                              {offerPercentage && formData.price ? (

                                <span className="
                                  text-lg
                                  font-semibold
                                  text-[#2B2926]
                                ">
                                  ₹{offerPrice}
                                </span>

                              ) : (

                                <span className="
                                  text-sm
                                  text-gray-400
                                ">
                                  Enter price and discount
                                </span>

                              )}

                            </div>

                          </div>

                        </div>


                        {offerPercentage && formData.price && (

                          <div className="
                            mt-4
                            flex
                            items-center
                            justify-between
                            border
                            border-[#DED5C8]
                            bg-white
                            px-4
                            py-3
                          ">

                            <span className="
                              text-xs
                              text-gray-500
                            ">
                              Original Price
                            </span>

                            <span className="
                              text-sm
                              text-gray-400
                              line-through
                            ">
                              ₹{formData.price}
                            </span>

                          </div>

                        )}

                      </div>

                    )}

                  </div>


                  {/* ================= IMAGE ================= */}

                  <div>

                    <div className="mb-5">

                      <p className="
                        text-xs
                        uppercase
                        tracking-[0.18em]
                        text-gray-400
                      ">
                        Product Image
                      </p>

                    </div>


                    <div className="
                      grid
                      grid-cols-1
                      gap-5
                      md:grid-cols-2
                    ">


                      {/* UPLOAD */}

                      <label className="
                        flex
                        min-h-[220px]
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        border
                        border-dashed
                        border-[#CFC3B4]
                        bg-[#F5F0E8]
                        px-5
                        text-center
                        transition
                        hover:border-[#2B2926]
                        hover:bg-[#EEE8DE]
                      ">

                        <div className="
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          border
                          border-[#D8CEC0]
                          bg-white
                          text-[#2B2926]
                        ">

                          <FiImage size={22} />

                        </div>


                        <p className="
                          mt-4
                          text-sm
                          font-medium
                          text-[#2B2926]
                        ">
                          Click to upload image
                        </p>


                        <p className="
                          mt-1
                          text-xs
                          text-gray-400
                        ">
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


                      {/* PREVIEW */}

                      <div className="
                        flex
                        min-h-[220px]
                        items-center
                        justify-center
                        overflow-hidden
                        border
                        border-[#DED5C8]
                        bg-white
                      ">

                        {preview ? (

                          <img
                            src={preview}
                            alt="preview"
                            className="
                              h-full
                              max-h-[220px]
                              w-full
                              object-contain
                            "
                          />

                        ) : (

                          <div className="text-center">

                            <FiImage
                              size={30}
                              className="
                                mx-auto
                                text-[#D8CEC0]
                              "
                            />

                            <p className="
                              mt-3
                              text-xs
                              text-gray-400
                            ">
                              Image preview
                            </p>

                          </div>

                        )}

                      </div>

                    </div>

                  </div>


                  {/* ================= SUBMIT ================= */}

                  <div className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-[#DED5C8]
                    pt-6
                    sm:flex-row
                    sm:justify-end
                  ">

                    <button
                      type="button"
                      onClick={() => {

                        setFormData({
                          title: "",
                          description: "",
                          category: "",
                          price: "",
                          image: null
                        })

                        setPreview(null)
                        setIsOffer(false)
                        setOfferPercentage("")

                      }}
                      className="
                        w-full
                        border
                        border-[#D8CEC0]
                        px-7
                        py-3
                        text-sm
                        font-medium
                        text-[#2B2926]
                        transition
                        hover:bg-[#F5F0E8]
                        sm:w-auto
                      "
                    >
                      Clear
                    </button>


                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
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

            </section>


            {/* ================= MANAGE PRODUCTS ================= */}

            <section className="mt-10">

              <ManageProducts />

            </section>


          </div>

        </div>

      </main>

    </div>

  )
}


export default AdminDashboard

