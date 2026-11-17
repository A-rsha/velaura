import React, { useEffect, useRef, useState } from 'react'
import API from '../services/axios'
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
import VendorSidebar from '../components/VendorSidebar'

const MAX_IMAGES = 6
const MIN_IMAGES = 3

const inputClass =
  'vendor-input w-full rounded-lg border border-[#D9D0C3] bg-white px-4 py-3 text-sm text-[#2B2926] outline-none transition focus:border-[#8A7660] focus:ring-2 focus:ring-[#8A7660]/10'

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

function VendorAddProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const addImageInputRef = useRef(null)
  const editImageInputRef = useRef(null)

  const [formData, setFormData] = useState(emptyForm())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const vendorName = localStorage.getItem('userName') || 'Vendor'

  const [editData, setEditData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    isOffer: false,
    offerPercentage: '',
    existingImages: [],
    newImages: [],
  })

  const fetchProducts = async () => {
    try {
      setFetching(true)

      const res = await API.get('/product/myProducts')

      if (res.data.success) {
        setProducts(res.data.data || [])
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Fetch vendor products error:', error)
      toast.error(
        error.response?.data?.message || 'Failed to load your products'
      )
    } finally {
      setFetching(false)
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

  // ADD IMAGES
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

  // ADD PRODUCT
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

  // OPEN EDIT FORM
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
          ? product.category?._id || product.category?.name || ''
          : product.category || '',
      price: product.price ?? '',
      isOffer: Boolean(product.isOffer),
      offerPercentage: product.offerPercentage || '',
      existingImages: images,
      newImages: [],
    })
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target

    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ADD NEW IMAGES WHILE EDITING
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

      const total = prev.existingImages.length + unique.length

      if (total > MAX_IMAGES) {
        toast.error(`You can have a maximum of ${MAX_IMAGES} images.`)
        return prev
      }

      return { ...prev, newImages: unique }
    })
  }

  const removeExistingImage = (imageUrl) => {
    setEditData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter(
        (image) => image !== imageUrl
      ),
    }))
  }

  const removeNewEditImage = (indexToRemove) => {
    setEditData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }))
  }

  // UPDATE PRODUCT
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

      data.append(
        'existingImages',
        JSON.stringify(editData.existingImages)
      )

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

  // DELETE PRODUCT
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

    const found = categories.find(
      (item) => item.name === category || item._id === category
    )

    return found?.name || found?.title || category || 'Category'
  }

  const getPreviewUrl = (file) => URL.createObjectURL(file)

  const renderImageCard = ({
    src,
    alt,
    main = false,
    onRemove,
    imageKey,
  }) => (
    <div key={imageKey} className="vendor-preview-card relative">
      <div
        className={`overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] ${
          main ? 'h-56 sm:h-64' : 'aspect-square'
        }`}
      >
        <img
          src={src}
          alt={alt}
          className={`vendor-preview-image h-full w-full ${
            main ? 'object-contain' : 'object-cover'
          }`}
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
        className="vendor-remove-image absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow"
      >
        <FiX size={14} />
      </button>
    </div>
  )

  return (
    <div className="vendor-products-page min-h-screen bg-[#F5F0E8] text-[#2B2926]">

      <style>{`
        .vendor-products-page {
          animation: vendorPageEnter 0.65s ease both;
        }

        @keyframes vendorPageEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .vendor-products-header {
          animation: vendorFadeUp 0.7s ease both;
        }

        @keyframes vendorFadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vendor-stat-card {
          animation: vendorFadeUp 0.65s ease both;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .vendor-stat-card:nth-child(2) {
          animation-delay: 0.12s;
        }

        .vendor-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 25px rgba(43,41,38,0.08);
        }

        .vendor-stat-icon {
          transition: transform 0.35s ease, background 0.35s ease;
        }

        .vendor-stat-card:hover .vendor-stat-icon {
          transform: scale(1.1) rotate(-6deg);
          background: #EDE3D5;
        }

        .vendor-add-button,
        .vendor-action-button,
        .vendor-modal-button {
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .vendor-add-button:hover,
        .vendor-modal-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 18px rgba(43,41,38,0.15);
        }

        .vendor-add-button:active,
        .vendor-modal-button:active:not(:disabled) {
          transform: scale(0.97);
        }

        .vendor-add-button svg {
          transition: transform 0.3s ease;
        }

        .vendor-add-button:hover svg {
          transform: rotate(90deg);
        }

        .vendor-list-section {
          animation: vendorFadeUp 0.8s ease 0.15s both;
        }

        .vendor-table-row {
          animation: vendorRowEnter 0.45s ease both;
          transition: background 0.25s ease;
        }

        @keyframes vendorRowEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .vendor-table-row:hover {
          background: #FCFAF7;
        }

        .vendor-product-image {
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .vendor-table-row:hover .vendor-product-image {
          transform: scale(1.07);
          box-shadow: 0 5px 12px rgba(43,41,38,0.12);
        }

        .vendor-action-button:hover {
          transform: translateY(-2px);
        }

        .vendor-action-button svg {
          transition: transform 0.25s ease;
        }

        .vendor-edit-button:hover svg {
          transform: rotate(-8deg) scale(1.1);
        }

        .vendor-delete-button:hover svg {
          transform: scale(1.12);
        }

        .vendor-input {
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .vendor-input:hover {
          border-color: #B7A58E;
        }

        .vendor-input:focus {
          border-color: #8A7660;
          box-shadow: 0 0 0 3px rgba(138,118,96,0.12);
        }

        .vendor-modal-backdrop {
          animation: vendorBackdropIn 0.25s ease both;
          backdrop-filter: blur(4px);
        }

        @keyframes vendorBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .vendor-modal-content {
          animation: vendorModalIn 0.35s cubic-bezier(.2,.8,.2,1) both;
        }

        @keyframes vendorModalIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .vendor-preview-card {
          animation: vendorPreviewIn 0.35s ease both;
        }

        @keyframes vendorPreviewIn {
          from {
            opacity: 0;
            transform: scale(0.94);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .vendor-preview-image {
          transition: transform 0.4s ease;
        }

        .vendor-preview-card:hover .vendor-preview-image {
          transform: scale(1.06);
        }

        .vendor-remove-image {
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .vendor-remove-image:hover {
          transform: rotate(90deg) scale(1.08);
          background: #FEE2E2;
        }

        .vendor-upload-button {
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }

        .vendor-upload-button:hover:not(:disabled) {
          transform: translateY(-2px);
          border-color: #8A7660;
          background: #F5F0E8;
        }

        .vendor-upload-button svg {
          transition: transform 0.3s ease;
        }

        .vendor-upload-button:hover:not(:disabled) svg {
          transform: translateY(-3px);
        }

        .vendor-empty-state {
          animation: vendorFadeUp 0.6s ease both;
        }

        .vendor-offer-box {
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .vendor-offer-box:hover {
          border-color: #C8B69F;
          box-shadow: 0 5px 15px rgba(43,41,38,0.04);
        }

        @media (prefers-reduced-motion: reduce) {
          .vendor-products-page *,
          .vendor-products-page *::before,
          .vendor-products-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <VendorSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        vendorName={vendorName}
      />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* PAGE HEADER */}
          <div className="vendor-products-header mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#8A7660]">
                Velaura Seller Panel
              </p>

              <h1 className="text-2xl font-semibold sm:text-3xl">
                My Products
              </h1>

              <p className="mt-2 text-sm text-[#777067]">
                Add, edit and manage the products you have listed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetAddForm()
                setShowModal(true)
              }}
              className="vendor-add-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-5 py-3 text-sm font-medium text-white hover:bg-[#49443D]"
            >
              <FiPlus size={18} />
              Add Product
            </button>
          </div>

          {/* PRODUCT STATS */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="vendor-stat-card flex items-center gap-4 rounded-xl border border-[#E5DDD1] bg-white p-5">
              <div className="vendor-stat-icon rounded-lg bg-[#F5F0E8] p-3">
                <FiPackage size={22} />
              </div>

              <div>
                <p className="text-sm text-[#777067]">My Products</p>
                <p className="mt-1 text-2xl font-semibold">
                  {products.length}
                </p>
              </div>
            </div>

            <div className="vendor-stat-card flex items-center gap-4 rounded-xl border border-[#E5DDD1] bg-white p-5">
              <div className="vendor-stat-icon rounded-lg bg-[#F5F0E8] p-3">
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

          {/* PRODUCT TABLE */}
          <div className="vendor-list-section overflow-hidden rounded-xl border border-[#E5DDD1] bg-white">
            <div className="border-b border-[#EAE3D9] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">My Product List</h2>
              <p className="mt-1 text-xs text-[#777067]">
                Products added by your seller account
              </p>
            </div>

            {fetching ? (
              <div className="vendor-empty-state px-6 py-16 text-center text-sm text-[#777067]">
                Loading your products...
              </div>
            ) : products.length === 0 ? (
              <div className="vendor-empty-state px-6 py-16 text-center">
                <FiPackage
                  size={36}
                  className="mx-auto mb-3 text-[#B5AA9B]"
                />

                <p className="font-medium">No products found</p>

                <p className="mt-1 text-sm text-[#777067]">
                  You haven't added any products yet.
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
                    {products.map((item, index) => (
                      <tr
                        key={item._id}
                        style={{ animationDelay: `${index * 0.06}s` }}
                        className="vendor-table-row"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image || item.images?.[0]}
                              alt={item.title}
                              className="vendor-product-image h-14 w-14 rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] object-cover"
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
                            <span className="font-medium">
                              ₹{item.price}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          {item.isOffer ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F1E7D8] px-3 py-1 text-xs font-medium text-[#735D43] transition hover:scale-105">
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
                              className="vendor-action-button vendor-edit-button rounded-lg border border-[#E5DDD1] p-2 hover:bg-[#F5F0E8]"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              title="Delete product"
                              className="vendor-action-button vendor-delete-button rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
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
        <div className="vendor-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="vendor-modal-content my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FAF8F4] shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5DDD1] bg-[#FAF8F4] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  Add New Product
                </h2>

                <p className="mt-1 text-xs text-[#777067]">
                  Add your product details and images.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  resetAddForm()
                }}
                className="rounded-full p-2 transition hover:rotate-90 hover:bg-[#EDE5D9]"
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
                      <option
                        key={category._id}
                        value={category.name || category.title}
                      >
                        {category.name || category.title}
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

              {/* PRODUCT IMAGES */}
              <div className="vendor-offer-box rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
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
                      imageKey: 'add-main',
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
                            imageKey: `${file.name}-${index}`,
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
                  className="vendor-upload-button mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7A58E] bg-[#FAF8F4] px-4 py-4 text-sm font-medium hover:bg-[#F5F0E8] disabled:opacity-50"
                >
                  <FiUploadCloud size={19} />
                  {formData.images.length
                    ? 'Add More Images'
                    : 'Choose Product Images'}
                </button>
              </div>

              {/* OFFER */}
              <div className="vendor-offer-box rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
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
                      <label className={labelClass}>
                        Final Offer Price
                      </label>

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
                    resetAddForm()
                  }}
                  className="vendor-modal-button rounded-lg border border-[#D9D0C3] px-5 py-3 text-sm font-medium hover:bg-[#F0E9DE]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="vendor-modal-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-6 py-3 text-sm font-medium text-white hover:bg-[#49443D] disabled:opacity-60"
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
        <div className="vendor-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="vendor-modal-content my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FAF8F4] shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5DDD1] bg-[#FAF8F4] px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold sm:text-xl">
                  Edit Product
                </h2>

                <p className="mt-1 text-xs text-[#777067]">
                  Update your product details and images.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="rounded-full p-2 transition hover:rotate-90 hover:bg-[#EDE5D9]"
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

                    {categories.map((category) => {
                      const categoryValue =
                        category.name || category.title

                      return (
                        <option
                          key={category._id}
                          value={categoryValue}
                        >
                          {categoryValue}
                        </option>
                      )
                    })}
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
              <div className="vendor-offer-box rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
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
                    {editData.existingImages.length +
                      editData.newImages.length}
                    /{MAX_IMAGES}
                  </span>
                </div>

                {editData.existingImages.length > 0 && (
                  <>
                    <p className="mb-2 text-sm font-medium">
                      Existing Images
                    </p>

                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {editData.existingImages.map((url, index) => (
                        <div key={url} className="vendor-preview-card relative">
                          <div className="aspect-square overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8]">
                            <img
                              src={url}
                              alt={`Existing product image ${index + 1}`}
                              className="vendor-preview-image h-full w-full object-cover"
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
                            className="vendor-remove-image absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"
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
                        <div
                          key={`${file.name}-${file.lastModified}-${index}`}
                          className="vendor-preview-card relative"
                        >
                          <div className="aspect-square overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8]">
                            <img
                              src={getPreviewUrl(file)}
                              alt={`New image ${index + 1}`}
                              className="vendor-preview-image h-full w-full object-cover"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeNewEditImage(index)}
                            className="vendor-remove-image absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"
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
                    editData.existingImages.length +
                      editData.newImages.length >=
                    MAX_IMAGES
                  }
                  onClick={() => editImageInputRef.current?.click()}
                  className="vendor-upload-button mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7A58E] bg-[#FAF8F4] px-4 py-4 text-sm font-medium hover:bg-[#F5F0E8] disabled:opacity-50"
                >
                  <FiUploadCloud size={18} />
                  Add More Images
                </button>

                <p className="mt-2 text-xs text-[#777067]">
                  Keep between 3 and 6 images before saving.
                </p>
              </div>

              {/* OFFER */}
              <div className="vendor-offer-box rounded-xl border border-[#E5DDD1] bg-white p-4">
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
                      <label className={labelClass}>
                        Final Offer Price
                      </label>

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
                  className="vendor-modal-button rounded-lg border border-[#D9D0C3] px-5 py-3 text-sm font-medium hover:bg-[#F0E9DE]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="vendor-modal-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-6 py-3 text-sm font-medium text-white hover:bg-[#49443D] disabled:opacity-60"
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

export default VendorAddProducts