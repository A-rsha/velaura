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
      console.log("Error fetching Events:", error.response?.data || error)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    try {
      await API.delete(`/product/deleteproduct/${id}`);
      fetchProducts();

    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await API.put(`/product/updateProduct/${editProduct._id}`, editProduct)
      alert("Product updated ")
      setEditProduct(null)
      fetchProducts()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 justify-center">
        <h1 className="text-3xl font-bold mb-8">Manage Products</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4 ">
            {product.map((item) => (
              <div key={item._id} className='bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row items-center gap-5'>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-28 object-cover rounded-xl"
                />

                <div className="flex-1 text-center pl-8 sm:text-left">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-lg font-semibold">{item.description}</p>
                  <p className="text-gray-600 mt-1">₹{item.price}</p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-md" onClick={() => setEditProduct(item)}>Edit</button>

                  <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          {editProduct && (
            <div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4'>
              <form onSubmit={handleUpdate} className='bg-white p-6 rounded-md shadow-md w-full max-w-md'>
                <h3 className='text-xl font-bold mb-3 text-gray-800'>Edit Product</h3>

                <input type="text" value={editProduct.title} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} placeholder='Enter Name' className='border p-2 w-full mb-2 rounded-md' />

                <textarea value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} placeholder='enter description' className='border p-2 w-full mb-2 rounded-md'>Description</textarea>
                <select value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category })} className="border p-2 w-full mb-2 rounded-md">
                  <option>Jewlery</option>
                  <option>watches</option>
                  <option>bags</option>
                  <option>Sunglasses</option>
                  <option>wallets</option>
                  <option>Hair Accessories</option>
                  <option>Beauty Accessories</option>
                </select>

                <input type="text" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} placeholder='price' className='border p-2 w-full mb-2 rounded-md' />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditEvent(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-500 text-white rounded-md"
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