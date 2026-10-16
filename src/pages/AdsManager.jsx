import React, { useEffect, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import {
    FiUpload,
    FiImage,
    FiTrash2,
    FiEye,
    FiPlus,
    FiX,
    FiLoader,
    FiCheckCircle,
    FiAlertCircle
} from 'react-icons/fi'
import API from '../services/axios'


function AdsManager() {
    const [ads, setAds] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Fetch all ads
    const fetchAds = async () => {
        try {
            setLoading(true)

            const res = await API.get('/ads/getAds')

            const adsData =
                res.data.ads ||
                res.data.data ||
                res.data.message ||
                []

            setAds(Array.isArray(adsData) ? adsData : [])

        } catch (err) {
            console.error('Error fetching ads:', err)

            setError(
                err.response?.data?.message ||
                'Failed to load banners.'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAds()
    }, [])

    // Select image and show preview
    const handleImageChange = (e) => {
        const file = e.target.files?.[0]

        setMessage('')
        setError('')

        if (!file) return

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Please select a JPG, JPEG or PNG image.')
            e.target.value = ''
            return
        }

        if (ads.length >= 6) {
            setError(
                'Maximum 6 banners allowed. Delete an existing banner first.'
            )
            e.target.value = ''
            return
        }

        setSelectedImage(file)

        const imageUrl = URL.createObjectURL(file)
        setPreview(imageUrl)
    }

    // Clear selected image
    const clearSelectedImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview)
        }

        setSelectedImage(null)
        setPreview(null)

        const input = document.getElementById('ad-image-input')

        if (input) {
            input.value = ''
        }
    }

    // Upload image
    const handleUpload = async () => {
        if (!selectedImage) {
            setError('Please select an image first.')
            return
        }

        if (ads.length >= 6) {
            setError('Maximum 6 banners allowed.')
            return
        }

        try {
            setUploading(true)
            setError('')
            setMessage('')

            const formData = new FormData()

            formData.append('image', selectedImage)

            const res = await API.post(
                '/ads/addAds',
                formData
            )

            setMessage(
                res.data.message || 'Banner uploaded successfully!'
            )

            clearSelectedImage()

            await fetchAds()

        } catch (err) {
            console.error('Error uploading banner:', err)

            setError(
                err.response?.data?.message ||
                'Failed to upload banner. Please try again.'
            )
        } finally {
            setUploading(false)
        }
    }

    // Delete image
    const handleDelete = async (ad) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this banner?'
        )

        if (!confirmed) return

        try {
            setDeletingId(ad._id)
            setError('')
            setMessage('')

            await API.delete(`/ads/deleteAd/${ad._id}`)

            setMessage('Banner deleted successfully!')

            await fetchAds()

        } catch (err) {
            console.error('Error deleting banner:', err)

            setError(
                err.response?.data?.message ||
                'Failed to delete banner.'
            )
        } finally {
            setDeletingId(null)
        }
    }

    // Cleanup preview URL
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

    return (
        <div className="min-h-screen bg-[#F5F0E8]">

            <AdminSidebar />

            <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 lg:ml-64 lg:px-10">

                <div className="mx-auto max-w-7xl">

                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9A7958]">
                                Store Management
                            </p>

                            <h1 className="text-2xl font-semibold tracking-tight text-[#2B2926] sm:text-3xl">
                                Ads Manager
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#82796F]">
                                Manage your homepage promotional banners
                                and create a beautiful shopping experience.
                            </p>
                        </div>

                        {/* Banner Count */}
                        <div className="flex items-center gap-3 self-start border border-[#DED5C8] bg-white px-4 py-3 sm:self-auto">

                            <div className="flex h-10 w-10 items-center justify-center bg-[#F5F0E8] text-[#9A7958]">
                                <FiImage size={20} />
                            </div>

                            <div>
                                <p className="text-xl font-semibold text-[#2B2926]">
                                    {ads.length}
                                    <span className="text-sm font-normal text-[#A49A8E]">
                                        {' '}/ 6
                                    </span>
                                </p>

                                <p className="text-xs text-[#82796F]">
                                    Banners uploaded
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 flex items-center gap-3 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">

                            <FiCheckCircle size={19} />

                            <p>{message}</p>

                            <button
                                type="button"
                                onClick={() => setMessage('')}
                                className="ml-auto"
                                aria-label="Close success message"
                            >
                                <FiX size={18} />
                            </button>

                        </div>
                    )}


                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 flex items-center gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                            <FiAlertCircle size={19} />

                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={() => setError('')}
                                className="ml-auto"
                                aria-label="Close error message"
                            >
                                <FiX size={18} />
                            </button>

                        </div>
                    )}


                    {/* Upload Section */}
                    <section className="mb-10">

                        <div className="mb-4">
                            <h2 className="text-base font-semibold text-[#2B2926]">
                                Upload New Banner
                            </h2>

                            <p className="mt-1 text-sm text-[#82796F]">
                                Add promotional images to your homepage.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

                            {/* Image Selection */}
                            <div className="lg:col-span-3">

                                <label
                                    htmlFor="ad-image-input"
                                    className={`group flex min-h-[290px] flex-col items-center justify-center border border-dashed border-[#CFC3B4] bg-white px-6 py-10 text-center transition duration-300 ${
                                        ads.length >= 6
                                            ? 'cursor-not-allowed opacity-60'
                                            : 'cursor-pointer hover:border-[#9A7958] hover:bg-[#FCFAF6]'
                                    }`}
                                >

                                    <div className="flex h-16 w-16 items-center justify-center border border-[#E5D9CA] bg-[#F5F0E8] text-[#9A7958] transition group-hover:scale-105">

                                        <FiUpload size={26} />

                                    </div>

                                    <h3 className="mt-5 text-base font-medium text-[#2B2926]">
                                        Choose an image to upload
                                    </h3>

                                    <p className="mt-2 text-sm text-[#82796F]">
                                        Click here to browse your files
                                    </p>

                                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">

                                        {['JPG', 'PNG', 'JPEG'].map((format) => (
                                            <span
                                                key={format}
                                                className="border border-[#E5D9CA] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#82796F]"
                                            >
                                                {format}
                                            </span>
                                        ))}

                                    </div>

                                    <input
                                        id="ad-image-input"
                                        type="file"
                                        name="image"
                                        accept="image/png,image/jpeg"
                                        onChange={handleImageChange}
                                        disabled={ads.length >= 6 || uploading}
                                        className="hidden"
                                    />

                                </label>

                                <p className="mt-3 text-xs leading-5 text-[#9A9084]">
                                    Upload up to 6 banners. Delete an existing
                                    banner to make room for another.
                                </p>

                            </div>


                            {/* Preview */}
                            <div className="flex min-h-[290px] flex-col border border-[#DED5C8] bg-[#EEE8DE] lg:col-span-2">

                                <div className="flex items-center justify-between border-b border-[#DED5C8] bg-white px-5 py-4">

                                    <div>
                                        <h3 className="text-sm font-semibold text-[#2B2926]">
                                            Image Preview
                                        </h3>

                                        <p className="mt-1 text-xs text-[#9A9084]">
                                            Preview your selected banner
                                        </p>
                                    </div>

                                    <FiEye
                                        size={19}
                                        className="text-[#9A7958]"
                                    />

                                </div>

                                <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-8 text-center">

                                    {preview ? (
                                        <>
                                            <img
                                                src={preview}
                                                alt="Selected banner preview"
                                                className="max-h-[220px] w-full object-contain"
                                            />

                                            <button
                                                type="button"
                                                onClick={clearSelectedImage}
                                                disabled={uploading}
                                                className="mt-4 flex items-center gap-2 border border-[#DED5C8] bg-white px-4 py-2 text-xs text-[#5F574E] transition hover:border-red-300 hover:text-red-600"
                                            >
                                                <FiX size={15} />
                                                Remove selected image
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex h-14 w-14 items-center justify-center border border-[#D8CEC0] bg-white text-[#B6A794]">
                                                <FiImage size={25} />
                                            </div>

                                            <p className="mt-4 text-sm font-medium text-[#5F574E]">
                                                No image selected
                                            </p>

                                            <p className="mt-1 max-w-[220px] text-xs leading-5 text-[#94897D]">
                                                Your selected banner preview
                                                will appear here.
                                            </p>
                                        </>
                                    )}

                                </div>

                                <div className="border-t border-[#DED5C8] p-4">

                                    <button
                                        type="button"
                                        onClick={handleUpload}
                                        disabled={
                                            !selectedImage ||
                                            uploading ||
                                            ads.length >= 6
                                        }
                                        className="flex w-full items-center justify-center gap-2 bg-[#2B2926] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#49433D] disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {uploading ? (
                                            <>
                                                <FiLoader className="animate-spin" size={17} />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FiPlus size={17} />
                                                Upload Banner
                                            </>
                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* Uploaded Banners */}
                    <section>

                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9A7958]">
                                    Your Media Library
                                </p>

                                <h2 className="mt-2 text-xl font-semibold text-[#2B2926]">
                                    Uploaded Banners
                                </h2>

                                <p className="mt-1 text-sm text-[#82796F]">
                                    View and manage your homepage images.
                                </p>
                            </div>

                            <span className="self-start border border-[#DED5C8] bg-white px-3 py-2 text-xs text-[#82796F] sm:self-auto">
                                {ads.length} of 6 images
                            </span>

                        </div>


                        {/* Loading State */}
                        {loading ? (
                            <div className="flex min-h-[220px] items-center justify-center border border-[#DED5C8] bg-white">

                                <div className="flex flex-col items-center">

                                    <FiLoader
                                        size={28}
                                        className="animate-spin text-[#9A7958]"
                                    />

                                    <p className="mt-4 text-sm text-[#82796F]">
                                        Loading banners...
                                    </p>

                                </div>

                            </div>
                        ) : ads.length === 0 ? (

                            /* Empty State */
                            <div className="border border-[#DED5C8] bg-white px-5 py-14 sm:px-10 sm:py-16">

                                <div className="mx-auto flex max-w-md flex-col items-center text-center">

                                    <div className="flex h-20 w-20 items-center justify-center bg-[#F5F0E8] text-[#B6A794]">
                                        <FiImage size={34} />
                                    </div>

                                    <h3 className="mt-6 text-lg font-medium text-[#2B2926]">
                                        No banners uploaded yet
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#82796F]">
                                        Your media library is empty. Upload
                                        your first banner to showcase your
                                        latest collections on the homepage.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            /* Banner Grid */
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                                {ads.map((ad, index) => (

                                    <div
                                        key={ad._id}
                                        className="group overflow-hidden border border-[#DED5C8] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    >

                                        {/* Image */}
                                        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#EEE8DE]">

                                            <img
                                                src={ad.image}
                                                alt={`Banner ${index + 1}`}
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />

                                            <span className="absolute left-3 top-3 bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#2B2926]">
                                                Banner {String(index + 1).padStart(2, '0')}
                                            </span>

                                        </div>


                                        {/* Card Footer */}
                                        <div className="flex items-center justify-between gap-3 p-4">

                                            <div>
                                                <p className="text-sm font-medium text-[#2B2926]">
                                                    Homepage Banner
                                                </p>

                                                <p className="mt-1 text-xs text-[#94897D]">
                                                    Image {index + 1} of {ads.length}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(ad)}
                                                disabled={deletingId === ad._id}
                                                className="flex items-center gap-2 border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {deletingId === ad._id ? (
                                                    <FiLoader
                                                        size={15}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <FiTrash2 size={15} />
                                                )}

                                                {deletingId === ad._id
                                                    ? 'Deleting...'
                                                    : 'Delete'}

                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* Footer Note */}
                    <div className="mt-8 flex items-start gap-3 border border-[#DED5C8] bg-white/70 p-4 sm:items-center">

                        <div className="mt-0.5 text-[#9A7958] sm:mt-0">
                            <FiImage size={19} />
                        </div>

                        <p className="text-xs leading-5 text-[#82796F]">
                            <span className="font-semibold text-[#2B2926]">
                                Banner management tip:
                            </span>{' '}
                            Keep your promotional images visually consistent
                            with the Velaura brand for a premium shopping experience.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    )
}

export default AdsManager