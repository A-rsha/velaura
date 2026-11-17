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
  'w-full rounded-lg border border-[#D9D0C3] bg-white px-4 py-3 text-sm text-[#2B2926] outline-none transition duration-300 focus:border-[#8A7660] focus:ring-2 focus:ring-[#8A7660]/10 hover:border-[#B7A58E]'

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

      data.append(
        'existingImages',
        JSON.stringify(editData.existingImages)
      )

      data.append(
        'removedImages',
        JSON.stringify(editData.removedImages)
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
    <div key={key} className="image-preview-card relative">
      <div
        className={`image-preview-frame overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] ${
          main ? 'h-56 sm:h-64' : 'aspect-square'
        }`}
      >
        <img
          src={src}
          alt={alt}
          className={`h-full w-full transition duration-500 ${
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
        className="image-remove-button absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow"
      >
        <FiX size={14} />
      </button>
    </div>
  )

  return (
    <div className="manage-products-page min-h-screen bg-[#F5F0E8] text-[#2B2926]">
      <style>{`
        /* PAGE ANIMATION */
        .manage-products-page main > div {
          animation: managePageEnter 0.7s ease both;
        }

        @keyframes managePageEnter {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* HEADER */
        .manage-products-page main > div > div:first-child {
          animation: manageHeaderEnter 0.8s ease both;
        }

        @keyframes manageHeaderEnter {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* BUTTON EFFECTS */
        .manage-products-page button {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease,
            background-color 0.3s ease,
            border-color 0.3s ease;
        }

        .manage-products-page button:not(:disabled):active {
          transform: scale(0.96);
        }

        .manage-products-page button:disabled {
          cursor: not-allowed;
        }

        .manage-add-button,
        .manage-submit-button {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .manage-add-button::before,
        .manage-submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          transform: skewX(-25deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.22),
            transparent
          );
          transition: left 0.65s ease;
          z-index: -1;
        }

        .manage-add-button:hover::before,
        .manage-submit-button:hover::before {
          left: 150%;
        }

        .manage-add-button:hover,
        .manage-submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(43,41,38,0.18);
        }

        /* STAT CARDS */
        .manage-stat-card {
          animation: statCardEnter 0.65s ease both;
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .manage-stat-card:nth-child(1) {
          animation-delay: 0.12s;
        }

        .manage-stat-card:nth-child(2) {
          animation-delay: 0.22s;
        }

        .manage-stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 14px 30px rgba(43,41,38,0.09);
          border-color: #C9B9A5;
        }

        .manage-stat-card .manage-stat-icon {
          transition:
            transform 0.4s ease,
            background-color 0.3s ease;
        }

        .manage-stat-card:hover .manage-stat-icon {
          transform: rotate(-8deg) scale(1.1);
          background-color: #EDE5D9;
        }

        @keyframes statCardEnter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* PRODUCT TABLE */
        .manage-product-table {
          animation: tableEnter 0.7s ease 0.2s both;
        }

        @keyframes tableEnter {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .manage-product-row {
          animation: rowEnter 0.45s ease both;
          transition: background-color 0.3s ease;
        }

        .manage-product-row:hover {
          background-color: #FCFAF7;
        }

        @keyframes rowEnter {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .manage-product-image {
          transition:
            transform 0.45s ease,
            box-shadow 0.45s ease;
        }

        .manage-product-row:hover .manage-product-image {
          transform: scale(1.08);
          box-shadow: 0 6px 15px rgba(43,41,38,0.14);
        }

        /* ACTION BUTTONS */
        .manage-edit-button:hover {
          transform: translateY(-3px) rotate(-5deg);
          background-color: #F5F0E8;
          box-shadow: 0 5px 12px rgba(43,41,38,0.1);
        }

        .manage-delete-button:hover {
          transform: translateY(-3px) rotate(5deg);
          background-color: #FEF2F2;
          box-shadow: 0 5px 12px rgba(220,38,38,0.1);
        }

        /* MODAL BACKDROP AND PANEL */
        .manage-modal-backdrop {
          animation: backdropEnter 0.3s ease both;
          backdrop-filter: blur(5px);
        }

        .manage-modal-panel {
          animation: modalEnter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
          transform-origin: center;
        }

        @keyframes backdropEnter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* MODAL CLOSE BUTTON */
        .manage-close-button:hover {
          transform: rotate(90deg);
          background-color: #EDE5D9;
        }

        /* FORM FIELDS */
        .manage-products-page input:not([type="checkbox"]),
        .manage-products-page textarea,
        .manage-products-page select {
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.3s ease;
        }

        .manage-products-page input:not([type="checkbox"]):focus,
        .manage-products-page textarea:focus,
        .manage-products-page select:focus {
          transform: translateY(-1px);
          box-shadow: 0 0 0 3px rgba(138,118,96,0.12);
        }

        /* IMAGE PREVIEWS */
        .image-preview-card {
          animation: previewEnter 0.4s ease both;
        }

        @keyframes previewEnter {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .image-preview-frame img {
          transition: transform 0.5s ease;
        }

        .image-preview-card:hover .image-preview-frame img {
          transform: scale(1.06);
        }

        .image-remove-button {
          transition:
            transform 0.3s ease,
            background-color 0.3s ease;
        }

        .image-remove-button:hover {
          transform: rotate(90deg) scale(1.1);
          background-color: #FEF2F2;
        }

        /* IMAGE UPLOAD BUTTON */
        .manage-upload-button:hover {
          transform: translateY(-3px);
          border-color: #8A7660;
          background-color: #F5F0E8;
          box-shadow: 0 6px 15px rgba(43,41,38,0.06);
        }

        .manage-upload-button:hover svg {
          animation: uploadBounce 0.7s ease infinite alternate;
        }

        @keyframes uploadBounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-4px);
          }
        }

        /* OFFER SECTION */
        .manage-offer-section {
          transition:
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }

        .manage-offer-section:hover {
          border-color: #C9B9A5;
          box-shadow: 0 5px 16px rgba(43,41,38,0.04);
        }

        /* EMPTY STATE */
        .manage-empty-state {
          animation: emptyEnter 0.6s ease both;
        }

        @keyframes emptyEnter {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .manage-products-page *,
          .manage-products-page *::before,
          .manage-products-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <AdminSidebar />

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
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
              className="manage-add-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-5 py-3 text-sm font-medium text-white hover:bg-[#49443D]"
            >
              <FiPlus size={18} />
              Add Product
            </button>
          </div>

          {/* STATISTICS */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="manage-stat-card flex items-center gap-4 rounded-xl border border-[#E5DDD1] bg-white p-5">
              <div className="manage-stat-icon rounded-lg bg-[#F5F0E8] p-3">
                <FiPackage size={22} />
              </div>

              <div>
                <p className="text-sm text-[#777067]">Total Products</p>
                <p className="mt-1 text-2xl font-semibold">
                  {products.length}
                </p>
              </div>
            </div>

            <div className="manage-stat-card flex items-center gap-4 rounded-xl border border-[#E5DDD1] bg-white p-5">
              <div className="manage-stat-icon rounded-lg bg-[#F5F0E8] p-3">
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

          {/* PRODUCT LIST */}
          <div className="manage-product-table overflow-hidden rounded-xl border border-[#E5DDD1] bg-white">
            <div className="border-b border-[#EAE3D9] px-5 py-4 sm:px-6">
              <h2 className="font-semibold">Product List</h2>
              <p className="mt-1 text-xs text-[#777067]">
                All products available in your store
              </p>
            </div>

            {products.length === 0 ? (
              <div className="manage-empty-state px-6 py-16 text-center">
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
                    {products.map((item, index) => (
                      <tr
                        key={item._id}
                        style={{ animationDelay: `${index * 0.06}s` }}
                        className="manage-product-row"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="manage-product-image h-14 w-14 rounded-lg border border-[#E5DDD1] bg-[#F5F0E8] object-cover"
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
                              className="manage-edit-button rounded-lg border border-[#E5DDD1] p-2"
                            >
                              <FiEdit2 size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              title="Delete product"
                              className="manage-delete-button rounded-lg border border-red-100 p-2 text-red-600"
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
        <div className="manage-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="manage-modal-panel my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FAF8F4] shadow-2xl">
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
                className="manage-close-button rounded-full p-2"
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
                  className="manage-upload-button mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7A58E] bg-[#FAF8F4] px-4 py-4 text-sm font-medium disabled:opacity-50"
                >
                  <FiUploadCloud size={19} />
                  {formData.images.length ? 'Add More Images' : 'Choose Product Images'}
                </button>
              </div>

              {/* OFFER */}
              <div className="manage-offer-section rounded-xl border border-[#E5DDD1] bg-white p-4 sm:p-5">
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
                  className="manage-submit-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-6 py-3 text-sm font-medium text-white hover:bg-[#49443D] disabled:opacity-60"
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
        <div className="manage-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-5">
          <div className="manage-modal-panel my-auto max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#FAF8F4] shadow-2xl">
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
                className="manage-close-button rounded-full p-2"
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
                        <div key={url} className="image-preview-card relative">
                          <div className="image-preview-frame aspect-square overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8]">
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
                            className="image-remove-button absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"
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
                          className="image-preview-card relative"
                        >
                          <div className="image-preview-frame aspect-square overflow-hidden rounded-lg border border-[#E5DDD1] bg-[#F5F0E8]">
                            <img
                              src={getPreviewUrl(file)}
                              alt={`New image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeNewEditImage(index)}
                            className="image-remove-button absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow"
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
                  className="manage-upload-button mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#B7A58E] bg-[#FAF8F4] px-4 py-4 text-sm font-medium disabled:opacity-50"
                >
                  <FiUploadCloud size={18} />
                  Add More Images
                </button>

                <p className="mt-2 text-xs text-[#777067]">
                  Keep between 3 and 6 images before saving.
                </p>
              </div>

              {/* OFFER */}
              <div className="manage-offer-section rounded-xl border border-[#E5DDD1] bg-white p-4">
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
                  className="manage-submit-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-6 py-3 text-sm font-medium text-white hover:bg-[#49443D] disabled:opacity-60"
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