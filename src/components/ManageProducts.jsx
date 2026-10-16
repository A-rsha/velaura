import React, { useEffect, useState } from 'react'
import API from '../services/axios'
import AdminSidebar from './AdminSidebar'
import { FiImage, FiPlus, FiTag, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'



function ManageProducts() {

  const [product, setProduct] = useState([])
  const [editProduct, setEditProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
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


  const fetchProducts = async () => {
    try {
      const res = await API.get('/product/getProducts')

      console.log('PRODUCT RESPONSE:', res.data)

      setProduct(res.data.data || [])

    } catch (error) {
      console.log(
        "Error fetching products:",
        error.response?.data || error
      )
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

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])


  const handleDelete = async (id) => {
    try {

      await API.delete(`/product/deleteProduct/${id}`)

      fetchProducts()

    } catch (error) {

      console.log(
        "Delete error:",
        error.response?.data || error
      )

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


      toast.success("Product created successfully")

      window.location.reload()


    } catch (error) {

      console.log(
        "FULL ERROR:",
        error.response?.data || error
      )

      toast.error("Error creating product")


    } finally {

      setLoading(false)

    }

  }

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

  const handleUpdate = async (e) => {

    e.preventDefault()

    try {

      const formData = new FormData()

      formData.append("title", editProduct.title)
      formData.append("description", editProduct.description)
      formData.append("category", editProduct.category)
      formData.append("price", editProduct.price)

      formData.append(
        "isOffer",
        editProduct.isOffer ? "true" : "false"
      )

      formData.append(
        "offerPercentage",
        editProduct.isOffer
          ? editProduct.offerPercentage
          : 0
      )

      formData.append(
        "offerPrice",
        editProduct.isOffer
          ? editProduct.offerPrice
          : 0
      )

      if (editProduct.image instanceof File) {
        formData.append("image", editProduct.image)
      }

      await API.put(
        `/product/updateProduct/${editProduct._id}`,
        formData
      )

      toast.success("Product updated successfully")

      setEditProduct(null)

      fetchProducts()

    } catch (error) {

      console.log(
        "Update error:",
        error.response?.data || error
      )

    }
  }


  return (
    <div className="min-h-screen bg-[#F5F0E8]">

      <AdminSidebar />

      <div className="lg:ml-64 px-4 sm:px-6 lg:px-10 py-8 sm:py-10">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Administration
            </p>

            <h1 className="mt-2 text-3xl sm:text-4xl font-serif text-[#2B2926]">
              Manage Products
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View, edit and manage your Velaura products.
            </p>



            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="
                                           flex
                                           w-full
                                           items-center
                                           justify-center
                                           gap-2
                                           mt-4
                                           rounded-lg
                                           bg-[#2B2926]
                                           px-5
                                           py-3
                                           text-sm
                                           font-medium
                                           text-white
                                           transition
                                           duration-200
                                           hover:bg-[#403D39]
                                           sm:w-auto
                                           sm:shrink-0
                                       "
            >

              <FiPlus size={18} />

              Add New Product

            </button>
          </div>


          {/* PRODUCT LIST */}

          <div className="space-y-4">

            {product.length === 0 ? (

              <div className="bg-white border border-[#DED5C8] p-12 text-center">

                <p className="text-lg font-medium text-[#2B2926]">
                  No products found
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Add a product to see it here.
                </p>

              </div>

            ) : (

              product.map((item) => (

                <div
                  key={item._id}
                  className="
                    bg-white
                    border
                    border-[#DED5C8]
                    p-4
                    sm:p-5
                    flex
                    flex-col
                    md:flex-row
                    gap-5
                    md:items-center
                  "
                >

                  {/* IMAGE */}

                  <div className="relative shrink-0">

                    <img
                      src={item.image}
                      alt={item.title}
                      className="
                        w-full
                        h-52
                        sm:w-32
                        sm:h-32
                        object-cover
                      "
                    />

                    {item.isOffer && (

                      <span
                        className="
                          absolute
                          left-2
                          top-2
                          bg-[#2B2926]
                          text-white
                          text-[10px]
                          font-medium
                          tracking-wide
                          px-2.5
                          py-1
                        "
                      >
                        {item.offerPercentage}% OFF
                      </span>

                    )}

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                      <div>

                        <h2 className="
                          text-lg
                          font-medium
                          text-[#2B2926]
                        ">
                          {item.title}
                        </h2>

                        <p className="
                          mt-1
                          text-xs
                          uppercase
                          tracking-wider
                          text-gray-400
                        ">
                          {item.category}
                        </p>

                      </div>

                    </div>


                    <p className="
                      mt-3
                      text-sm
                      leading-relaxed
                      text-gray-500
                      line-clamp-2
                    ">
                      {item.description}
                    </p>


                    {/* PRICE */}

                    <div className="mt-4 flex items-center gap-3">

                      {item.isOffer ? (

                        <>
                          <span className="
                            text-sm
                            text-gray-400
                            line-through
                          ">
                            ₹{item.price}
                          </span>

                          <span className="
                            text-lg
                            font-semibold
                            text-[#2B2926]
                          ">
                            ₹{item.offerPrice}
                          </span>

                        </>

                      ) : (

                        <span className="
                          text-lg
                          font-medium
                          text-[#2B2926]
                        ">
                          ₹{item.price}
                        </span>

                      )}

                    </div>

                  </div>


                  {/* ACTIONS */}

                  <div className="
                    flex
                    md:flex-col
                    gap-2
                    w-full
                    md:w-auto
                  ">

                    <button
                      type="button"
                      onClick={() => setEditProduct(item)}
                      className="
                        flex-1
                        md:flex-none
                        px-5
                        py-2.5
                        bg-[#2B2926]
                        text-white
                        text-sm
                        font-medium
                        transition
                        hover:opacity-80
                      "
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="
                        flex-1
                        md:flex-none
                        px-5
                        py-2.5
                        border
                        border-[#D8CEC0]
                        text-[#2B2926]
                        text-sm
                        font-medium
                        transition
                        hover:bg-[#F5F0E8]
                      "
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>


      {/* EDIT PRODUCT MODAL */}

      {editProduct && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/40
            flex
            items-center
            justify-center
            p-4
          "
        >

          <form
            onSubmit={handleUpdate}
            className="
              bg-[#FDFBF7]
              w-full
              max-w-lg
              max-h-[92vh]
              overflow-y-auto
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div className="
              px-6
              sm:px-8
              py-5
              border-b
              border-[#DED5C8]
              flex
              items-center
              justify-between
            ">

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
                  Edit Product
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="
                  h-9
                  w-9
                  flex
                  items-center
                  justify-center
                  text-xl
                  text-gray-500
                  hover:text-[#2B2926]
                "
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="px-6 sm:px-8 py-6 space-y-5">

              {/* TITLE */}

              <div>

                <label className="
                  block
                  text-xs
                  uppercase
                  tracking-wider
                  font-medium
                  text-gray-500
                  mb-2
                ">
                  Product Name
                </label>

                <input
                  type="text"
                  value={editProduct.title}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      title: e.target.value
                    })
                  }
                  className="
                    w-full
                    border
                    border-[#D8CEC0]
                    bg-white
                    px-3
                    py-3
                    text-sm
                    text-[#2B2926]
                    outline-none
                    focus:border-[#2B2926]
                  "
                />

              </div>


              {/* DESCRIPTION */}

              <div>

                <label className="
                  block
                  text-xs
                  uppercase
                  tracking-wider
                  font-medium
                  text-gray-500
                  mb-2
                ">
                  Description
                </label>

                <textarea
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value
                    })
                  }
                  rows="4"
                  className="
                    w-full
                    border
                    border-[#D8CEC0]
                    bg-white
                    px-3
                    py-3
                    text-sm
                    text-[#2B2926]
                    outline-none
                    resize-none
                    focus:border-[#2B2926]
                  "
                />

              </div>


              {/* CATEGORY + PRICE */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="
                    block
                    text-xs
                    uppercase
                    tracking-wider
                    font-medium
                    text-gray-500
                    mb-2
                  ">
                    Category
                  </label>

                  <select
                    value={editProduct.category}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        category: e.target.value
                      })
                    }
                    className="
                      w-full
                      border
                      border-[#D8CEC0]
                      bg-white
                      px-3
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


                <div>

                  <label className="
                    block
                    text-xs
                    uppercase
                    tracking-wider
                    font-medium
                    text-gray-500
                    mb-2
                  ">
                    Price
                  </label>

                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => {

                      const price = Number(e.target.value)

                      const offerPrice =
                        editProduct.isOffer
                          ? price -
                          (
                            price *
                            Number(
                              editProduct.offerPercentage || 0
                            )
                          ) /
                          100
                          : 0

                      setEditProduct({
                        ...editProduct,
                        price: e.target.value,
                        offerPrice: Number(
                          offerPrice.toFixed(2)
                        )
                      })

                    }}
                    className="
                      w-full
                      border
                      border-[#D8CEC0]
                      bg-white
                      px-3
                      py-3
                      text-sm
                      text-[#2B2926]
                      outline-none
                      focus:border-[#2B2926]
                    "
                  />

                </div>

              </div>


              {/* IMAGE */}

              <div>

                <label className="
                  block
                  text-xs
                  uppercase
                  tracking-wider
                  font-medium
                  text-gray-500
                  mb-2
                ">
                  Change Image
                </label>

                <div className="
                  border
                  border-dashed
                  border-[#CFC3B4]
                  bg-white
                  p-4
                ">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        image: e.target.files[0]
                      })
                    }
                    className="
                      w-full
                      text-sm
                      text-gray-500
                    "
                  />

                </div>

              </div>


              {/* OFFER SECTION */}

              <div className="
                border
                border-[#D8CEC0]
                bg-white
                p-5
              ">

                <div className="
                  flex
                  items-center
                  justify-between
                  gap-4
                ">

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
                      Apply a discount to this product
                    </p>

                  </div>


                  <label className="
                    relative
                    inline-flex
                    items-center
                    cursor-pointer
                  ">

                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={editProduct.isOffer || false}
                      onChange={(e) => {

                        const isOffer = e.target.checked

                        const percentage =
                          isOffer
                            ? Number(
                              editProduct.offerPercentage || 10
                            )
                            : 0

                        const offerPrice =
                          isOffer
                            ? Number(
                              (
                                Number(editProduct.price) -
                                (
                                  Number(editProduct.price) *
                                  percentage
                                ) /
                                100
                              ).toFixed(2)
                            )
                            : 0

                        setEditProduct({
                          ...editProduct,
                          isOffer,
                          offerPercentage: percentage,
                          offerPrice
                        })

                      }}
                    />

                    <div className="
                      w-11
                      h-6
                      bg-gray-300
                      peer-focus:outline-none
                      peer-focus:ring-2
                      peer-focus:ring-gray-300
                      rounded-full
                      peer
                      peer-checked:bg-[#2B2926]
                      after:content-['']
                      after:absolute
                      after:top-[2px]
                      after:left-[2px]
                      after:bg-white
                      after:border-gray-300
                      after:border
                      after:rounded-full
                      after:h-5
                      after:w-5
                      after:transition-all
                      peer-checked:after:translate-x-full
                    "></div>

                  </label>

                </div>


                {editProduct.isOffer && (

                  <div className="mt-5 pt-5 border-t border-[#E5DED4]">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* PERCENTAGE */}

                      <div>

                        <label className="
                          block
                          text-xs
                          uppercase
                          tracking-wider
                          font-medium
                          text-gray-500
                          mb-2
                        ">
                          Discount
                        </label>

                        <div className="relative">

                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={
                              editProduct.offerPercentage || ""
                            }
                            onChange={(e) => {

                              const percentage =
                                Number(e.target.value)

                              const offerPrice =
                                Number(editProduct.price) -
                                (
                                  Number(editProduct.price) *
                                  percentage
                                ) /
                                100

                              setEditProduct({
                                ...editProduct,
                                offerPercentage: percentage,
                                offerPrice: Number(
                                  offerPrice.toFixed(2)
                                )
                              })

                            }}
                            className="
                              w-full
                              border
                              border-[#D8CEC0]
                              bg-white
                              px-3
                              py-3
                              pr-10
                              text-sm
                              outline-none
                              focus:border-[#2B2926]
                            "
                          />

                          <span className="
                            absolute
                            right-3
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
                          block
                          text-xs
                          uppercase
                          tracking-wider
                          font-medium
                          text-gray-500
                          mb-2
                        ">
                          Offer Price
                        </label>

                        <div className="
                          border
                          border-[#D8CEC0]
                          bg-[#F5F0E8]
                          px-3
                          py-3
                          text-sm
                          font-semibold
                          text-[#2B2926]
                        ">
                          ₹{editProduct.offerPrice || 0}
                        </div>

                      </div>

                    </div>

                    <p className="
                      mt-3
                      text-xs
                      text-gray-400
                    ">
                      Original price ₹{editProduct.price} with{" "}
                      {editProduct.offerPercentage}% discount
                    </p>

                  </div>

                )}

              </div>

            </div>




            <div className="
              px-6
              sm:px-8
              py-5
              border-t
              border-[#DED5C8]
              flex
              flex-col-reverse
              sm:flex-row
              sm:justify-end
              gap-3
            ">

              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="
                  px-6
                  py-3
                  border
                  border-[#D8CEC0]
                  text-sm
                  font-medium
                  text-[#2B2926]
                  hover:bg-[#F5F0E8]
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  px-6
                  py-3
                  bg-[#2B2926]
                  text-white
                  text-sm
                  font-medium
                  hover:opacity-85
                  transition
                "
              >
                Save Changes
              </button>

            </div>

          </form>

        </div>

      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-6">
          <div className="my-4 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:my-6 sm:p-6">
            <div className='flex items-center justify-between'>

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

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="
                                                          rounded-full
                                                          p-2
                                                          text-gray-500
                                                          transition
                                                          hover:bg-gray-100
                                                      "
              >

                <FiX size={20} />

              </button>
            </div>

            <div className='px-5 py-7 sm:px-8 sm:py-8'>
              <form onSubmit={handleSubmit} className='space-y-7' >
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

                  <div className='space-y-5'>
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

                    <div className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-2
                      ">
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
                      <div>
                        <label className=' mb-2
                            block
                            text-sm
                            font-medium
                            text-[#2B2926]'>
                          Price</label>

                        <div className='relative'>
                          <span className='absolute
                              left-4
                              top-1/2
                              -translate-y-1/2
                              text-sm
                              text-gray-500
                              '>₹
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

                <div className="
                    border
                    border-[#DED5C8]
                    bg-[#F5F0E8]
                    p-5
                    sm:p-6">
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
                        <p className=' text-sm
                            font-medium
                            text-[#2B2926]'>
                          Product Offer</p>
                        <p className="
                            mt-1
                            text-xs
                            text-gray-500
                          ">
                          Add a discount to this product.
                        </p>
                      </div>
                    </div>

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

                          <div className='relative'>
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
          </div>
        </div>
      )}

    </div>
  )
}

export default ManageProducts