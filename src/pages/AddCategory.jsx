import React, { useState, useEffect } from 'react'
import {
    FiAlertTriangle,
    FiCheckCircle,
    FiEdit2,
    FiImage,
    FiPlus,
    FiX,
} from 'react-icons/fi'
import AdminSidebar from '../components/AdminSidebar'
import API from '../services/axios'
import { toast } from 'react-toastify'

function AddCategory() {
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [preview, setPreview] = useState(null)
    const [editCategory, setEditCategory] = useState(null)

    const [formData, setFormData] = useState({
        name: "",
        image: null
    })

    const getCategories = async () => {
        try {
            const response = await API.get('/category/getCategories')
            setCategories(response.data.data)
        } catch (error) {
            console.log("GET CATEGORY ERROR:", error)
        }
    }

    useEffect(() => {
        getCategories()
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

    const handleSubmit = async () => {
        if (!formData.name || !formData.image) {
            toast.warn("Category and image are required", {
                icon: <FiAlertTriangle size={21} />
            })
            return
        }

        setLoading(true)

        try {
            const data = new FormData()

            data.append("name", formData.name)
            data.append("image", formData.image)

            const response = await API.post('/category/create', data)

            console.log(response.data)

            await getCategories()

            setShowModal(false)

            setFormData({
                name: "",
                image: null
            })

            setPreview(null)

            toast.success("Category Created successfully", {
                icon: <FiCheckCircle size={21} />
            })

        } catch (error) {
            console.log("CATEGORY ERROR:", error)

            toast.error(
                error.response?.data?.message ||
                "Failed to create Category",
                {
                    icon: <FiAlertTriangle size={21} />
                }
            )

        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await API.delete(`/category/deleteCategory/${id}`)
            await getCategories()
        } catch (error) {
            console.log("DELETE ERROR:", error)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()

            data.append("name", editCategory.name)

            if (editCategory.image instanceof File) {
                data.append("image", editCategory.image)
            }

            await API.put(
                `/category/updateCategory/${editCategory._id}`,
                data
            )

            toast.success("Category updated successfully")

            setEditCategory(null)

            await getCategories()

        } catch (error) {
            console.log(
                "UPDATE ERROR:",
                error.response?.data || error
            )
        }
    }

    return (
        <div className="add-category-page min-h-screen bg-[#F5F0E8]">

            <AdminSidebar />

            <style>{`
                /* PAGE ENTRANCE */
                .add-category-page {
                    animation: categoryPageEnter 0.6s ease both;
                }

                @keyframes categoryPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* HEADING */
                .category-heading {
                    animation: categoryHeadingEnter 0.7s ease both;
                }

                @keyframes categoryHeadingEnter {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* ADD BUTTON */
                .category-add-btn {
                    position: relative;
                    overflow: hidden;
                    transition:
                        transform 0.3s ease,
                        background 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .category-add-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.2),
                        transparent
                    );
                    transition: left 0.6s ease;
                }

                .category-add-btn:hover::before {
                    left: 140%;
                }

                .category-add-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(43,41,38,0.2);
                }

                .category-add-btn:active {
                    transform: scale(0.97);
                }

                .category-add-btn svg {
                    transition: transform 0.3s ease;
                }

                .category-add-btn:hover svg {
                    transform: rotate(90deg);
                }

                /* CATEGORY CARDS */
                .category-card {
                    animation: categoryCardEnter 0.65s ease both;
                    transition:
                        transform 0.35s ease,
                        box-shadow 0.35s ease,
                        border-color 0.35s ease;
                }

                @keyframes categoryCardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .category-card:hover {
                    transform: translateY(-5px);
                    border-color: #C9BBA8;
                    box-shadow: 0 12px 28px rgba(43,41,38,0.09);
                }

                /* CATEGORY IMAGE */
                .category-image-wrapper {
                    overflow: hidden;
                }

                .category-image {
                    transition:
                        transform 0.6s cubic-bezier(0.2,0.8,0.2,1),
                        filter 0.4s ease;
                }

                .category-card:hover .category-image {
                    transform: scale(1.08);
                    filter: brightness(1.04);
                }

                /* CATEGORY NAME */
                .category-name {
                    transition:
                        color 0.3s ease,
                        transform 0.3s ease;
                }

                .category-card:hover .category-name {
                    color: #8A7660;
                    transform: translateX(3px);
                }

                /* ACTION BUTTONS */
                .category-action-btn {
                    transition:
                        transform 0.3s ease,
                        background 0.3s ease,
                        color 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .category-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 12px rgba(43,41,38,0.1);
                }

                .category-action-btn svg {
                    transition: transform 0.3s ease;
                }

                .category-edit-btn:hover svg {
                    transform: rotate(-12deg) scale(1.15);
                }

                .category-delete-btn:hover svg {
                    transform: scale(1.15);
                }

                /* MODAL BACKDROP */
                .category-modal-backdrop {
                    animation: backdropEnter 0.25s ease both;
                    backdrop-filter: blur(4px);
                }

                @keyframes backdropEnter {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                /* MODAL */
                .category-modal {
                    animation: modalEnter 0.35s cubic-bezier(0.2,0.8,0.2,1) both;
                }

                @keyframes modalEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px) scale(0.94);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* CLOSE BUTTON */
                .category-close-btn {
                    transition:
                        transform 0.3s ease,
                        background 0.3s ease,
                        color 0.3s ease;
                }

                .category-close-btn:hover {
                    transform: rotate(90deg);
                    background: #F5F0E8;
                    color: #2B2926;
                }

                /* INPUTS */
                .category-input {
                    transition:
                        border-color 0.3s ease,
                        box-shadow 0.3s ease,
                        transform 0.3s ease;
                }

                .category-input:focus {
                    border-color: #8A7660;
                    box-shadow: 0 0 0 3px rgba(138,118,96,0.12);
                    transform: translateY(-1px);
                }

                /* IMAGE UPLOAD */
                .category-upload-box {
                    transition:
                        border-color 0.3s ease,
                        background 0.3s ease,
                        transform 0.3s ease;
                }

                .category-upload-box:hover {
                    border-color: #8A7660;
                    background: #F5F0E8;
                    transform: translateY(-3px);
                }

                .category-upload-box svg {
                    transition: transform 0.35s ease;
                }

                .category-upload-box:hover svg {
                    transform: translateY(-5px) scale(1.12);
                }

                /* PREVIEW */
                .category-preview-image {
                    animation: previewEnter 0.4s ease both;
                }

                @keyframes previewEnter {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* MODAL BUTTONS */
                .category-modal-btn {
                    transition:
                        transform 0.3s ease,
                        box-shadow 0.3s ease,
                        background 0.3s ease;
                }

                .category-modal-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(43,41,38,0.12);
                }

                .category-modal-btn:active {
                    transform: scale(0.97);
                }

                .category-modal-btn:disabled {
                    transform: none;
                    box-shadow: none;
                }

                @media (prefers-reduced-motion: reduce) {
                    .add-category-page *,
                    .add-category-page *::before,
                    .add-category-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">

                <div className="mx-auto max-w-7xl">

                    {/* HEADING */}
                    <div className="category-heading mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                                Store management
                            </p>

                            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#2B2926] sm:text-3xl">
                                Categories
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                                Manage the categories available in your
                                Velaura store.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="category-add-btn flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#403D39] sm:w-auto sm:shrink-0"
                        >
                            <FiPlus size={18} />
                            Add Category
                        </button>

                    </div>

                    {/* CATEGORY LIST */}
                    <div className="space-y-4">

                        {categories.map((category, index) => (

                            <div
                                key={category._id}
                                style={{
                                    animationDelay: `${index * 0.09}s`
                                }}
                                className="category-card flex w-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:flex-row md:items-center"
                            >

                                <div className="category-image-wrapper h-48 w-full shrink-0 rounded-xl bg-gray-100 sm:h-52 md:h-24 md:w-32">

                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="category-image h-full w-full object-cover"
                                    />

                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                        Category
                                    </p>

                                    <h3 className="category-name mt-1 truncate text-lg font-semibold text-[#2B2926] sm:text-xl">
                                        {category.name}
                                    </h3>

                                </div>

                                <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">

                                    <button
                                        type="button"
                                        onClick={() => setEditCategory(category)}
                                        className="category-action-btn category-edit-btn flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-[#2B2926] transition hover:bg-gray-100 sm:w-auto"
                                    >
                                        <FiEdit2 size={16} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(category._id)}
                                        className="category-action-btn category-delete-btn flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#403D39] sm:w-auto"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* EDIT CATEGORY MODAL */}
                {editCategory && (

                    <div className="category-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/30 p-4">

                        <form
                            onSubmit={handleUpdate}
                            className="category-modal my-8 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
                        >

                            <div className="mb-5 flex items-center justify-between">

                                <h3 className="text-lg font-semibold text-[#2B2926] sm:text-xl">
                                    Edit Category
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => setEditCategory(null)}
                                    className="category-close-btn rounded-full p-2 text-gray-500"
                                >
                                    <FiX size={20} />
                                </button>

                            </div>

                            <div className="mb-5">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    value={editCategory.name}
                                    onChange={(e) =>
                                        setEditCategory({
                                            ...editCategory,
                                            name: e.target.value
                                        })
                                    }
                                    placeholder="Enter Category Name"
                                    className="category-input w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                                />

                            </div>

                            <div className="mb-6">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Change Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setEditCategory({
                                            ...editCategory,
                                            image: e.target.files[0]
                                        })
                                    }
                                    className="category-input w-full rounded-lg border border-gray-300 p-2 text-sm"
                                />

                            </div>

                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() => setEditCategory(null)}
                                    className="category-modal-btn flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-[#2B2926] transition hover:bg-gray-100 sm:w-auto"
                                >
                                    <FiX size={17} />
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="category-modal-btn flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#403D39] sm:w-auto"
                                >
                                    <FiEdit2 size={17} />
                                    Update
                                </button>

                            </div>

                        </form>

                    </div>

                )}

                {/* ADD CATEGORY MODAL */}
                {showModal && (

                    <div className="category-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">

                        <div className="category-modal my-8 w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl sm:p-6">

                            <div className="flex items-center justify-between">

                                <h2 className="text-lg font-semibold text-[#2B2926] sm:text-xl">
                                    Add Category
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="category-close-btn rounded-full p-2 text-gray-500"
                                >
                                    <FiX size={20} />
                                </button>

                            </div>

                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-medium text-[#2B2926]">
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter Category name"
                                    className="category-input w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none"
                                />

                            </div>

                            <div className="mt-5">

                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category Image
                                </label>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <label className="category-upload-box flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 text-center">

                                        <FiImage size={30} className="text-gray-400" />

                                        <p className="mt-3 text-sm font-medium text-[#2B2926]">
                                            Click to upload image
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
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

                                    <div className="flex min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">

                                        {preview ? (

                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="category-preview-image h-full max-h-[180px] w-full object-contain"
                                            />

                                        ) : (

                                            <div className="text-center">

                                                <FiImage size={28} className="mx-auto text-gray-300" />

                                                <p className="mt-2 text-xs text-gray-400">
                                                    Image preview
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setFormData({
                                            name: "",
                                            image: null
                                        })
                                        setPreview(null)
                                    }}
                                    className="category-modal-btn w-full rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-[#2B2926] transition hover:bg-gray-100 sm:w-auto"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    type="button"
                                    className="category-modal-btn flex w-full items-center justify-center gap-2 rounded-lg bg-[#2B2926] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#403D39] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {loading ? "Creating..." : "Create Category"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </main>

        </div>
    )
}

export default AddCategory