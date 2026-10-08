import React, { useEffect, useState } from 'react'
import API from '../services/axios'
import AdminSidebar from './AdminSidebar'

function ManageProducts() {

  const [product, setProduct] = useState([])
  const [editProduct, setEditProduct] = useState(null)
  const [categories, setCategories] = useState([])

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

      alert("Product updated successfully")

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


            {/* MODAL FOOTER */}

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

    </div>
  )
}

export default ManageProducts