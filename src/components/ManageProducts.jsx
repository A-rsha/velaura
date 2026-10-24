
import React, { useEffect, useRef, useState } from 'react'
import API from '../services/axios'
import AdminSidebar from './AdminSidebar'
import {
  FiCheckCircle,
  FiImage,
  FiPlus,
  FiTag,
  FiX,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiUploadCloud,
} from 'react-icons/fi'
import { toast } from 'react-toastify'

const MAX_IMAGES = 6
const MIN_IMAGES = 3

const inputClass =
  'w-full rounded-lg border border-[#D9D0C3] bg-white px-4 py-3 text-sm text-[#2B2926] outline-none transition focus:border-[#8A7660] focus:ring-2 focus:ring-[#8A7660]/10'

const labelClass = 'mb-2 block text-sm font-medium text-[#403A33]'

const emptyForm = () => ({
  title: '',
  description: '',
  category: '',
  price: '',
  images: [],
  isOffer: false,
  offerPercentage: '',
})

const calculateOfferPrice = (price, percentage) => {
  const originalPrice = Number(price)
  const discount = Number(percentage)

  if (
    !Number.isFinite(originalPrice) ||
    !Number.isFinite(discount) ||
    originalPrice <= 0 ||
    discount <= 0 ||
    discount > 100
  ) {
    return 0
  }

  return Number(
    (originalPrice - (originalPrice * discount) / 100).toFixed(2)
  )
}

function ManageProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const [loading, setLoading] = useState(false)

  const addImageInputRef = useRef(null)
  const editImageInputRef = useRef(null)

  const [formData, setFormData] = useState(emptyForm())

  // Edit form keeps existing image URLs and newly selected File objects.
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    isOffer: false,
    offerPercentage: '',
    existingImages: [],
    newImages: [],
    removedImages: [],
  })

  const fetchProducts = async () => {
    try {
      const res = await API.get('/product/getProducts')

      if (res.data.success) {
        setProducts(res.data.data || [])
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Fetch products error:', error)
      toast.error('Failed to load products')
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await API.get('/category/getCategories')

      if (res.data.success) {
        setCategories(res.data.data || [])
      }
    } catch (error) {
      console.error('Fetch categories error:', error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ADD PRODUCT: select multiple images or add more later.
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    e.target.value = ''

    if (!selectedFiles.length) return

    setFormData((prev) => {
      const combined = [...prev.images, ...selectedFiles]

      const unique = combined.filter(
        (file, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified
          )
      )

      if (unique.length > MAX_IMAGES) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`)
        return prev
      }

      return { ...prev, images: unique }
    })
  }

  const removeAddImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }))
  }

  const resetAddForm = () => {
    setFormData(emptyForm())

    if (addImageInputRef.current) {
      addImageInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Please enter product title')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Please enter product description')
      return
    }

    if (!formData.category) {
      toast.error('Please select a category')
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    if (
      formData.images.length < MIN_IMAGES ||
      formData.images.length > MAX_IMAGES
    ) {
      toast.error('Please select 3 to 6 images')
      return
    }

    if (formData.isOffer) {
      const percentage = Number(formData.offerPercentage)

      if (percentage < 1 || percentage > 100) {
        toast.error('Offer percentage must be between 1 and 100')
        return
      }
    }

    try {
      setLoading(true)

      const data = new FormData()

      data.append('title', formData.title.trim())
      data.append('description', formData.description.trim())
      data.append('category', formData.category)
      data.append('price', String(Number(formData.price)))
      data.append('isOffer', String(formData.isOffer))

      const percentage = formData.isOffer
        ? Number(formData.offerPercentage)
        : 0

      data.append('offerPercentage', String(percentage))
      data.append(
        'offerPrice',
        String(
          formData.isOffer
            ? calculateOfferPrice(formData.price, percentage)
            : 0
        )
      )

      formData.images.forEach((file) => {
        data.append('images', file)
      })

      const res = await API.post('/product/postProduct', data)

      if (!res.data.success) {
        toast.error(res.data.message || 'Failed to add product')
        return
      }

      toast.success('Product added successfully')
      resetAddForm()
      setShowModal(false)
      await fetchProducts()
    } catch (error) {
      console.error('Add product error:', error)
      toast.error(
        error.response?.data?.message || 'Failed to add product'
      )
    } finally {
      setLoading(false)
    }
  }

  // Open edit form and load existing images.
  const handleEdit = (product) => {
    const images =
      Array.isArray(product.images) && product.images.length
        ? product.images
        : product.image
          ? [product.image]
          : []

    setEditProduct(product)

    setEditData({
      title: product.title || '',
      description: product.description || '',
      category:
        typeof product.category === 'object'
          ? product.category?._id || ''
          : product.category || '',
      price: product.price ?? '',
      isOffer: Boolean(product.isOffer),
      offerPercentage: product.offerPercentage || '',
      existingImages: images,
      newImages: [],
      removedImages: [],
    })
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target

    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Add new images to the edit form.
  const handleEditImagesChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    e.target.value = ''

    if (!selectedFiles.length) return

    setEditData((prev) => {
      const combined = [...prev.newImages, ...selectedFiles]

      const unique = combined.filter(
        (file, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified
          )
      )

      const total =
        prev.existingImages.length + unique.length

      if (total > MAX_IMAGES) {
        toast.error(`You can have a maximum of ${MAX_IMAGES} images.`)
        return prev
      }

      return { ...prev, newImages: unique }
    })
  }

  const removeExistingImage = (imageUrl) => {
    setEditData((prev) => {
      const updatedImages = prev.existingImages.filter(
        (image) => image !== imageUrl
      )

      return {
        ...prev,
        existingImages: updatedImages,
        removedImages: prev.removedImages.includes(imageUrl)
          ? prev.removedImages
          : [...prev.removedImages, imageUrl],
      }
    })
  }

  const removeNewEditImage = (indexToRemove) => {
    setEditData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    if (!editProduct?._id) {
      toast.error('Product not found')
      return
    }

    if (!editData.title.trim()) {
      toast.error('Please enter product title')
      return
    }

    if (!editData.description.trim()) {
      toast.error('Please enter product description')
      return
    }

    if (!editData.category) {
      toast.error('Please select a category')
      return
    }

    if (!editData.price || Number(editData.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    const totalImages =
      editData.existingImages.length + editData.newImages.length

    if (totalImages < MIN_IMAGES || totalImages > MAX_IMAGES) {
      toast.error('The product must have 3 to 6 images')
      return
    }

    if (editData.isOffer) {
      const percentage = Number(editData.offerPercentage)

      if (percentage < 1 || percentage > 100) {
        toast.error('Offer percentage must be between 1 and 100')
        return
      }
    }

    try {
      setLoading(true)

      const data = new FormData()

      data.append('title', editData.title.trim())
      data.append('description', editData.description.trim())
      data.append('category', editData.category)
      data.append('price', String(Number(editData.price)))
      data.append('isOffer', String(editData.isOffer))

      const percentage = editData.isOffer
        ? Number(editData.offerPercentage)
        : 0

      data.append('offerPercentage', String(percentage))
      data.append(
        'offerPrice',
        String(
          editData.isOffer
            ? calculateOfferPrice(editData.price, percentage)
            : 0
        )
      )

      // Existing URLs retained by the user.
      data.append(
        'existingImages',
        JSON.stringify(editData.existingImages)
      )

      // Images removed by the user.
      data.append(
        'removedImages',
        JSON.stringify(editData.removedImages)
      )

      // Newly uploaded images.
      editData.newImages.forEach((file) => {
        data.append('images', file)
      })

      const res = await API.put(
        `/product/updateProduct/${editProduct._id}`,
        data
      )

      if (!res.data.success) {
        toast.error(res.data.message || 'Failed to update product')
        return
      }

      toast.success('Product updated successfully')
      setEditProduct(null)
      await fetchProducts()
    } catch (error) {
      console.error('Update product error:', error)
      toast.error(
        error.response?.data?.message || 'Failed to update product'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const res = await API.delete(`/product/deleteProduct/${id}`)

      if (res.data.success) {
        toast.success('Product deleted successfully')
        await fetchProducts()
      } else {
        toast.error(res.data.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Delete product error:', error)
      toast.error(
        error.response?.data?.message || 'Failed to delete product'
      )
    }
  }

  const getCategoryName = (category) => {
    if (typeof category === 'object' && category !== null) {
      return category.name || category.title || 'Category'
    }

    const found = categories.find((item) => item._id === category)

    return found?.name || found?.title || category || 'Category'
  }

  const getPreviewUrl = (file) => URL.createObjectURL(file)

  const renderImageCard = ({
    src,
    alt,
    main = false,
    onRemove,
    key,
  }) => (
    <div key={key} className="relative">
      <div
        className={`overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] ${main ? 'h-56 sm:h-64' : 'aspect-square'
          }`}
      >
        <img
          src={src}
          alt={alt}
          className={`h-full w-full ${main ? 'object-contain' : 'object-cover'}`}
        />
      </div>

      {main && (
        <span className="absolute left-2 top-2 rounded-full bg-[#2B2926] px-3 py-1 text-xs text-white">
          Main Image
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        title="Remove image"
        className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-50"
      >
        <FiX size={14} />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">
      <AdminSidebar />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8A7660]">
                Velaura Admin
              </p>

              <h1 className="text-2xl font-semibold sm:text-3xl">
                Manage Products
              </h1>

              <p className="mt-2 text-sm text-[#777067]">
                Add, edit and manage your store products.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setFormData(emptyForm())
                setShowModal(true)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-5 py-3 text-sm font-medium text-white hover:bg-[#49443D]"
            >
              <FiPlus size={18} />
              Add Product
            </button>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-[#E5DDD1] bg-white p-5">
              <div className="rounded-lg bg-[#F5F0E8] p-3">
                <FiPackage size={22} />
              </div>

              <div>
                <p className="text-sm text-[#777067]">Total Products</p>
                <p className="mt-1 text-2xl font-semibold">
                  {products.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-[#E5DDD1] bg-white p-5">
              <div className="rounded-lg bg-[#F5F0E8] p-3">
                <FiTag size={22} />
              </div>

              <div>
                <p className="text-sm text-[#777067]">Offer Products</p>
                <p className="mt-1 text-2xl font-semibold">
                  {products.filter((item) => item.isOffer).length}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5DDD1] bg-white">
            <div className="border-b border-[#EAE3D9] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Product List</h2>
              <p className="mt-1 text-xs text-[#777067]">
                All products available in your store
              </p>
            </div>

            {products.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <FiPackage
                  size={36}
                  className="mx-auto mb-3 text-[#B5AA9B]"
                />
                <p className="font-medium">No products found</p>
                <p className="mt-1 text-sm text-[#777067]">
                  Add your first product to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left">
                  <thead className="bg-[#FAF8F4] text-xs uppercase tracking-wider text-[#777067]">
                    <tr>
                      <th className="px-5 py-4">Product</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Price</th>
                      <th className="px-5 py-4">Offer</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEE7DD]">
                    {products.map((item) => (
                      <tr key={item._id} className="hover:bg-[#FCFAF7]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-14 w-14 rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] object-cover"
                            />

                            <div className="max-w-[220px]">
                              <p className="font-medium">{item.title}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-[#777067]">
                                {item.description}
                              </p>

                              {item.images?.length > 0 && (
                                <p className="mt-1 text-xs text-[#8A7660]">
                                  {item.images.length} images
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {getCategoryName(item.category)}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {item.isOffer ? (
                            <>
                              <p className="font-semibold">
                                ₹{item.offerPrice}
                              </p>
                              <p className="text-xs text-[#999084] line-through">
                                ₹{item.price}
                              </p>
                            </>
                          ) : (
                            <span className="font-medium">₹{item.price}</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {item.isOffer ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F1E7D8] px-3 py-1 text-xs font-medium text-[#735D43]">
                              <FiTag size={12} />
                              {item.offerPercentage}% OFF
                            </span>
                          ) : (
                            <span className="text-xs text-[#999084]">
                              No offer
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              title="Edit product"
                              className="rounded-lg border border-[#E5DDD1] p-2 hover:bg-[#F5F0E8]"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              title="Delete product"
                              className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FAF8F4] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5DDD1] bg-[#FAF8F4] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  Add New Product
                </h2>
                <p className="mt-1 text-xs text-[#777067]">
                  Add product details and images.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setFormData(emptyForm())
                }}
                className="rounded-full p-2 hover:bg-[#EDE5D9]"
              >
                <FiX size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
              <div>
                <label className={labelClass}>Product Title *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your product"
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category *</label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                </div>

                <div>
                  <label className={labelClass}>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* ADD IMAGES */}
              <div className="rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <FiImage size={18} />
                      Product Images *
                    </h3>
                    <p className="mt-1 text-xs text-[#777067]">
                      Select 3–6 images. The first image is the main image.
                    </p>
                  </div>

                  <span className="rounded-full bg-[#F5F0E8] px-3 py-1 text-xs font-medium">
                    {formData.images.length}/{MAX_IMAGES}
                  </span>
                </div>

                {formData.images.length > 0 && (
                  <>
                    <p className="mb-2 text-sm font-medium">Main Image</p>
                    {renderImageCard({
                      src: getPreviewUrl(formData.images[0]),
                      alt: 'Main product preview',
                      main: true,
                      onRemove: () => removeAddImage(0),
                      key: 'add-main',
                    })}
                  </>
                )}

                {formData.images.length > 1 && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-medium">
                      Related Images
                    </p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {formData.images.slice(1).map((file, index) => (
                        <div key={`${file.name}-${file.lastModified}-${index}`}>
                          {renderImageCard({
                            src: getPreviewUrl(file),
                            alt: `Related image ${index + 1}`,
                            onRemove: () => removeAddImage(index + 1),
                            key: `${file.name}-${index}`,
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  ref={addImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={formData.images.length >= MAX_IMAGES}
                  onClick={() => addImageInputRef.current?.click()}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7A58E] bg-[#FAF8F4] px-4 py-4 text-sm font-medium hover:bg-[#F5F0E8] disabled:opacity-50"
                >
                  <FiUploadCloud size={19} />
                  {formData.images.length ? 'Add More Images' : 'Choose Product Images'}
                </button>
              </div>

              {/* OFFER */}
              <div className="rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isOffer"
                    checked={formData.isOffer}
                    onChange={handleChange}
                    className="h-4 w-4 accent-[#2B2926]"
                  />
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FiTag size={17} />
                    Enable Special Offer
                  </span>
                </label>

                {formData.isOffer && (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Offer Percentage (%)
                      </label>
                      <input
                        type="number"
                        name="offerPercentage"
                        min="1"
                        max="100"
                        value={formData.offerPercentage}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Final Offer Price</label>
                      <div className={inputClass}>
                        ₹
                        {calculateOfferPrice(
                          formData.price,
                          formData.offerPercentage
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E5DDD1] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData(emptyForm())
                  }}
                  className="rounded-lg border border-[#D9D0C3] px-5 py-3 text-sm font-medium hover:bg-[#F0E9DE]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-6 py-3 text-sm font-medium text-white hover:bg-[#49443D] disabled:opacity-60"
                >
                  <FiPlus size={17} />
                  {loading ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FAF8F4] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5DDD1] bg-[#FAF8F4] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  Edit Product
                </h2>
                <p className="mt-1 text-xs text-[#777067]">
                  Update product details and manage images.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="rounded-full p-2 hover:bg-[#EDE5D9]"
              >
                <FiX size={21} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6 p-5 sm:p-7">
              <div>
                <label className={labelClass}>Product Title *</label>
                <input
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows="3"
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    name="category"
                    value={editData.category}
                    onChange={handleEditChange}
                    className={inputClass}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name ||
                          category.title ||
                          category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={editData.price}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* EXISTING IMAGES */}
              <div className="rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold">
                      <FiImage size={18} />
                      Product Images
                    </h3>
                    <p className="mt-1 text-xs text-[#777067]">
                      Remove unwanted images or add new ones.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F5F0E8] px-3 py-1 text-xs">
                    {editData.existingImages.length + editData.newImages.length}/{MAX_IMAGES}
                  </span>
                </div>

                {editData.existingImages.length > 0 && (
                  <>
                    <p className="mb-2 text-sm font-medium">
                      Existing Images
                    </p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {editData.existingImages.map((url, index) => (
                        <div key={url} className="relative">
                          <div
                            className={`overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] ${index === 0 ? 'aspect-square sm:col-span-1' : 'aspect-square'
                              }`}
                          >
                            <img
                              src={url}
                              alt={`Existing product image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 rounded bg-[#2B2926] px-2 py-1 text-[10px] text-white">
                              Main
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            title="Remove image"
                            className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"
                          >
                            <FiX size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {editData.newImages.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-sm font-medium">
                      Newly Added Images
                    </p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {editData.newImages.map((file, index) => (
                        <div key={`${file.name}-${file.lastModified}-${index}`} className="relative">
                          <div className="aspect-square overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8]">
                            <img
                              src={getPreviewUrl(file)}
                              alt={`New image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewEditImage(index)}
                            className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"
                          >
                            <FiX size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  ref={editImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleEditImagesChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={
                    editData.existingImages.length + editData.newImages.length >= MAX_IMAGES
                  }
                  onClick={() => editImageInputRef.current?.click()}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7A58E] bg-[#FAF8F4] px-4 py-4 text-sm font-medium hover:bg-[#F5F0E8] disabled:opacity-50"
                >
                  <FiUploadCloud size={18} />
                  Add More Images
                </button>

                <p className="mt-2 text-xs text-[#777067]">
                  Keep between 3 and 6 images before saving.
                </p>
              </div>

              {/* OFFER */}
              <div className="rounded-xl border border-[#E5DDD1] bg-white p-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="isOffer"
                    checked={editData.isOffer}
                    onChange={handleEditChange}
                    className="h-4 w-4 accent-[#2B2926]"
                  />
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <FiTag size={17} />
                    Enable Special Offer
                  </span>
                </label>

                {editData.isOffer && (
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Offer Percentage (%)
                      </label>
                      <input
                        type="number"
                        name="offerPercentage"
                        min="1"
                        max="100"
                        value={editData.offerPercentage}
                        onChange={handleEditChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Final Offer Price</label>
                      <div className={inputClass}>
                        ₹
                        {calculateOfferPrice(
                          editData.price,
                          editData.offerPercentage
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E5DDD1] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="rounded-lg border border-[#D9D0C3] px-5 py-3 text-sm font-medium hover:bg-[#F0E9DE]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-6 py-3 text-sm font-medium text-white hover:bg-[#49443D] disabled:opacity-60"
                >
                  <FiCheckCircle size={17} />
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageProducts
