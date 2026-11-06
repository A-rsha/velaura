import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/axios'
import VendorSidebar from '../components/VendorSidebar'

import {
  FiPackage,
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiX,
  FiUploadCloud,
  FiMenu,
} from 'react-icons/fi'

import { toast } from 'react-toastify'

function VendorManagement() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [editProduct, setEditProduct] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [updating, setUpdating] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const vendorName = localStorage.getItem('userName') || 'Vendor'

  // FETCH VENDOR PRODUCTS
  const fetchMyProducts = async () => {
    try {
      const response = await API.get('/product/myProducts')

      const data = response.data

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || data.data || []
      )
    } catch (error) {
      console.error('Error fetching vendor products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  useEffect(() => {
    fetchMyProducts()
  }, [])

  // OPEN EDIT MODAL
  const handleEditClick = (product) => {
    setEditProduct({
      ...product,
      isOffer: Boolean(product.isOffer),
      offerPercentage: product.offerPercentage || 0,
    })

    setSelectedImages([])
  }

  // HANDLE INPUT CHANGE
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target

    setEditProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // HANDLE IMAGE SELECTION
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length > 6) {
      toast.warning('You can select maximum 6 images')
      e.target.value = ''
      return
    }

    setSelectedImages(files)
  }

  // UPDATE PRODUCT
  const handleUpdateProduct = async (e) => {
    e.preventDefault()

    if (!editProduct.title?.trim()) {
      toast.warning('Please enter product name')
      return
    }

    if (!editProduct.description?.trim()) {
      toast.warning('Please enter product description')
      return
    }

    if (!editProduct.category?.trim()) {
      toast.warning('Please select product category')
      return
    }

    if (!editProduct.price || Number(editProduct.price) <= 0) {
      toast.warning('Please enter a valid price')
      return
    }

    const percentage = Number(editProduct.offerPercentage || 0)

    if (editProduct.isOffer && (percentage <= 0 || percentage > 30)) {
      toast.warning('Offer percentage must be between 1% and 30%')
      return
    }

    try {
      setUpdating(true)

      const formData = new FormData()

      formData.append('title', editProduct.title.trim())
      formData.append('description', editProduct.description.trim())
      formData.append('category', editProduct.category.trim())
      formData.append('price', Number(editProduct.price))

      formData.append('isOffer', String(editProduct.isOffer))

      formData.append(
        'offerPercentage',
        editProduct.isOffer ? percentage : 0
      )

      const offerPrice = editProduct.isOffer
        ? Number(
            (
              Number(editProduct.price) -
              (Number(editProduct.price) * percentage) / 100
            ).toFixed(2)
          )
        : 0

      formData.append('offerPrice', offerPrice)

      // Add newly selected images
      selectedImages.forEach((image) => {
        formData.append('images', image)
      })

      const response = await API.put(
        `/product/updateProduct/${editProduct._id}`,
        formData
      )

      toast.success(
        response.data?.message || 'Product updated successfully!'
      )

      setEditProduct(null)
      setSelectedImages([])

      await fetchMyProducts()

    } catch (error) {
      console.error('Update product error:', error)

      toast.error(
        error.response?.data?.message || 'Failed to update product'
      )
    } finally {
      setUpdating(false)
    }
  }

  // DELETE PRODUCT
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product?'
    )

    if (!confirmDelete) return

    try {
      setDeletingId(productId)

      const response = await API.delete(
        `/product/deleteProduct/${productId}`
      )

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      )

      toast.success(
        response.data?.message || 'Product deleted successfully!'
      )

    } catch (error) {
      console.error('Delete product error:', error)

      toast.error(
        error.response?.data?.message || 'Failed to delete product'
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">

      {/* SIDEBAR */}
      <VendorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        vendorName={vendorName}
      />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-72 lg:px-8">

        <div className="mx-auto max-w-7xl">

          {/* PAGE HEADING */}
          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-[#9A7958]">
                Vendor Dashboard
              </p>

              <h2 className="mt-2 font-serif text-3xl">
                My Products
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Manage the products added to your store.
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded border border-[#DED5C8] bg-[#FDFBF7] p-3 lg:hidden"
            >
              <FiMenu size={21} />
            </button>

          </div>

          {/* MY PRODUCTS */}
          <section className="mb-9">

            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <p className="text-[10px] uppercase tracking-[2px] text-gray-400">
                  Your Inventory
                </p>

                <h3 className="mt-1 font-serif text-2xl">
                  My Products
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Products added to your store.
                </p>
              </div>

              <Link
                to="/vaddProduct"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#9A7958] hover:text-[#2B2926]"
              >
                <FiPlusCircle size={17} />
                Add New Product
              </Link>

            </div>

            {/* LOADING */}
            {loadingProducts ? (

              <div className="border border-[#DED5C8] bg-[#FDFBF7] p-10 text-center text-sm text-gray-500">
                Loading products...
              </div>

            ) : products.length === 0 ? (

              /* EMPTY PRODUCTS */
              <div className="border border-dashed border-[#D8C8B3] bg-[#FDFBF7] p-10 text-center">

                <FiPackage
                  size={35}
                  className="mx-auto text-[#B58A5A]"
                />

                <h4 className="mt-4 font-serif text-xl">
                  No Products Yet
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Start adding products to your store.
                </p>

                <Link
                  to="/vaddProduct"
                  className="mt-5 inline-flex items-center gap-2 bg-[#2B2926] px-5 py-3 text-sm text-white hover:bg-[#51483E]"
                >
                  <FiPlusCircle size={16} />
                  Add Product
                </Link>

              </div>

            ) : (

              /* PRODUCT CARDS */
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {products.map((product) => (

                  <div
                    key={product._id}
                    className="overflow-hidden border border-[#DED5C8] bg-[#FDFBF7] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                  >

                    {/* PRODUCT IMAGE */}
                    <div className="relative h-52 bg-[#F0EAE0]">

                      <img
                        src={
                          product.images?.[0] ||
                          product.image ||
                          '/placeholder.png'
                        }
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />

                      {product.isOffer && (
                        <span className="absolute left-3 top-3 bg-[#2B2926] px-3 py-1 text-xs text-white">
                          {product.offerPercentage}% OFF
                        </span>
                      )}

                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="p-4">

                      <p className="text-[10px] uppercase tracking-wider text-[#9A7958]">
                        {product.category}
                      </p>

                      <h4 className="mt-2 truncate font-serif text-lg">
                        {product.title}
                      </h4>

                      <div className="mt-3 flex items-center gap-2">

                        <span className="font-semibold text-[#2B2926]">
                          ₹{
                            product.isOffer && product.offerPrice > 0
                              ? product.offerPrice
                              : product.price
                          }
                        </span>

                        {product.isOffer && product.offerPrice > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                        )}

                      </div>

                      {/* EDIT AND DELETE */}
                      <div className="mt-4 flex gap-2">

                        <button
                          onClick={() => handleEditClick(product)}
                          className="flex flex-1 items-center justify-center gap-2 border border-[#B58A5A] py-2.5 text-xs font-semibold text-[#9A7958] transition hover:bg-[#F0EAE0]"
                        >
                          <FiEdit2 size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deletingId === product._id}
                          className="flex flex-1 items-center justify-center gap-2 border border-red-200 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <FiTrash2 size={14} />

                          {deletingId === product._id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        </div>

      </main>

      {/* ================= EDIT PRODUCT MODAL ================= */}

      {editProduct && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-6"
          onClick={() => {
            if (!updating) {
              setEditProduct(null)
              setSelectedImages([])
            }
          }}
        >

          <div
            className="my-auto w-full max-w-2xl bg-[#FDFBF7] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-[#DED5C8] px-5 py-4 sm:px-7">

              <div>
                <p className="text-[10px] uppercase tracking-[2px] text-[#9A7958]">
                  Product Management
                </p>

                <h3 className="mt-1 font-serif text-2xl">
                  Edit Product
                </h3>
              </div>

              <button
                type="button"
                disabled={updating}
                onClick={() => {
                  setEditProduct(null)
                  setSelectedImages([])
                }}
                className="rounded-full p-2 transition hover:bg-[#F0EAE0]"
              >
                <FiX size={22} />
              </button>

            </div>

            {/* EDIT FORM */}
            <form
              onSubmit={handleUpdateProduct}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-7"
            >

              {/* PRODUCT NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="title"
                  value={editProduct.title || ''}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-[#DED5C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#9A7958]"
                  placeholder="Enter product name"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={editProduct.description || ''}
                  onChange={handleEditChange}
                  required
                  rows={4}
                  className="w-full resize-none border border-[#DED5C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#9A7958]"
                  placeholder="Enter product description"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category *
                </label>

                <select
                  name="category"
                  value={editProduct.category || ''}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-[#DED5C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#9A7958]"
                >
                  <option value="">Select Category</option>
                  <option value="belts">Belts</option>
                  <option value="beauty accessories">Beauty Accessories</option>
                  <option value="hair accessories">Hair Accessories</option>
                  <option value="wallets">Wallets</option>
                  <option value="watches">Watches</option>
                  <option value="bags">Bags</option>
                  <option value="jwelery">Jewellery</option>
                </select>
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product Price (₹) *
                </label>

                <input
                  type="number"
                  name="price"
                  min="1"
                  value={editProduct.price || ''}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-[#DED5C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#9A7958]"
                  placeholder="Enter price"
                />
              </div>

              {/* OFFER CHECKBOX */}
              <div className="border border-[#DED5C8] bg-[#F5F0E8] p-4">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="isOffer"
                    checked={Boolean(editProduct.isOffer)}
                    onChange={handleEditChange}
                    className="h-4 w-4 accent-[#9A7958]"
                  />

                  <span className="text-sm font-semibold">
                    Apply Offer
                  </span>

                </label>

                {/* OFFER PERCENTAGE */}
                {editProduct.isOffer && (

                  <div className="mt-4">

                    <label className="mb-2 block text-sm font-semibold">
                      Offer Percentage (Maximum 30%)
                    </label>

                    <input
                      type="number"
                      name="offerPercentage"
                      min="1"
                      max="30"
                      value={editProduct.offerPercentage || ''}
                      onChange={handleEditChange}
                      required
                      className="w-full border border-[#DED5C8] bg-white px-4 py-3 text-sm outline-none focus:border-[#9A7958]"
                      placeholder="Enter offer percentage"
                    />

                    <div className="mt-3 flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Original Price
                      </span>

                      <span className="font-semibold">
                        ₹{Number(editProduct.price || 0).toFixed(2)}
                      </span>

                    </div>

                    <div className="mt-2 flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Offer Price
                      </span>

                      <span className="font-semibold text-green-700">
                        ₹{
                          (
                            Number(editProduct.price || 0) -
                            (Number(editProduct.price || 0) *
                              Number(editProduct.offerPercentage || 0)) / 100
                          ).toFixed(2)
                        }
                      </span>

                    </div>

                  </div>

                )}

              </div>

              {/* EXISTING IMAGES */}
              <div>

                <label className="mb-3 block text-sm font-semibold">
                  Current Product Images
                </label>

                <div className="flex flex-wrap gap-3">

                  {(editProduct.images?.length
                    ? editProduct.images
                    : editProduct.image
                      ? [editProduct.image]
                      : []
                  ).map((image, index) => (

                    <div
                      key={index}
                      className="h-20 w-20 overflow-hidden border border-[#DED5C8] bg-white"
                    >
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                  ))}

                </div>

              </div>

              {/* NEW IMAGE UPLOAD */}
              <div>

                <label className="mb-2 block text-sm font-semibold">
                  Change Product Images
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-[#D8C8B3] bg-[#F5F0E8] px-4 py-7 text-center transition hover:bg-[#F0EAE0]">

                  <FiUploadCloud
                    size={28}
                    className="mb-2 text-[#9A7958]"
                  />

                  <span className="text-sm font-semibold">
                    Choose New Images
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    Maximum 6 images
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>

                {selectedImages.length > 0 && (

                  <div className="mt-3 space-y-1">

                    <p className="text-xs font-semibold text-green-700">
                      {selectedImages.length} new image(s) selected
                    </p>

                    {selectedImages.map((image, index) => (
                      <p
                        key={index}
                        className="truncate text-xs text-gray-500"
                      >
                        {image.name}
                      </p>
                    ))}

                    <p className="text-xs text-gray-500">
                      Selecting new images will replace the existing images.
                    </p>

                  </div>

                )}

              </div>

              {/* MODAL BUTTONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#DED5C8] pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  disabled={updating}
                  onClick={() => {
                    setEditProduct(null)
                    setSelectedImages([])
                  }}
                  className="border border-[#DED5C8] px-6 py-3 text-sm font-semibold transition hover:bg-[#F0EAE0] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="bg-[#2B2926] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#51483E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updating ? 'Updating...' : 'Update Product'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default VendorManagement