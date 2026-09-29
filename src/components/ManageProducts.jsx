import React, { useEffect, useState } from 'react'
import API from '../services/axios'

function ManageProducts() {

  const [product, setProduct] = useState([])
  const [editProduct, setEditProduct] = useState(null)

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

  useEffect(() => {
    fetchProducts()
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
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8">
          Manage Products
        </h1>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2 space-y-4">

            {product.map((item) => (

              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-5"
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-28 object-cover rounded-xl"
                />


                <div className="flex-1 text-center sm:text-left">

                  <p className="text-lg font-semibold">
                    {item.title}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>

                  <p className="text-gray-600 mt-2">
                    ₹{item.price}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.category}
                  </p>

                </div>


                <div className="flex gap-2 mt-3">

                  <button
                    type="button"
                    className="px-3 py-1 bg-green-500 text-white rounded-md"
                    onClick={() => setEditProduct(item)}
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* EDIT PRODUCT MODAL */}

          {editProduct && (

            <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50">

              <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
              >

                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Edit Product
                </h3>


                {/* TITLE */}

                <input
                  type="text"
                  value={editProduct.title}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      title: e.target.value
                    })
                  }
                  placeholder="Enter Name"
                  className="border p-2 w-full mb-2 rounded-md"
                />


                {/* DESCRIPTION */}

                <textarea
                  value={editProduct.description}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      description: e.target.value
                    })
                  }
                  placeholder="Enter description"
                  className="border p-2 w-full mb-2 rounded-md"
                  rows="4"
                />


                {/* CATEGORY */}

                <select
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      category: e.target.value
                    })
                  }
                  className="border p-2 w-full mb-2 rounded-md"
                >

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


                {/* IMAGE */}

                <div className="mb-4">

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Change Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        image: e.target.files[0]
                      })
                    }
                    className="border p-2 w-full rounded-md"
                  />

                </div>


                {/* PRICE */}

                <input
                  type="number"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      price: e.target.value
                    })
                  }
                  placeholder="Price"
                  className="border p-2 w-full mb-4 rounded-md"
                />


                {/* BUTTONS */}

                <div className="flex justify-end gap-2">

                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-md"
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                  >
                    Update
                  </button>

                </div>

              </form>

            </div>

          )}

        </div>

      </div>

    </div>
  )
}

export default ManageProducts