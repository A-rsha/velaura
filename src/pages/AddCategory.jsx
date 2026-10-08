import React from 'react'
import { FiEdit2, FiImage, FiPlus, FiX } from 'react-icons/fi'
import AdminSidebar from '../components/AdminSidebar'
import { useState, useEffect } from 'react'
import API from '../services/axios'

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


    // ---------------- GET CATEGORIES ----------------

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

            alert("Category and image are required")

            return
        }

        setLoading(true)

        try {

            const data = new FormData()

            data.append("name", formData.name)
            data.append("image", formData.image)


            const response = await API.post(
                '/category/create',
                data
            )

            console.log(response.data)


            // Refresh category list without page refresh
            await getCategories()


            setShowModal(false)


            setFormData({
                name: "",
                image: null
            })

            setPreview(null)


            alert("Category Created successfully")


        } catch (error) {

            console.log(
                "CATEGORY ERROR:",
                error
            )

            alert(
                error.response?.data?.message ||
                "Failed to create Category"
            )

        } finally {

            setLoading(false)

        }
    }


    const handleDelete = async (id) => {

        try {

            await API.delete(
                `/category/deleteCategory/${id}`
            )

            await getCategories()

        } catch (error) {

            console.log(
                "DELETE ERROR:",
                error
            )

        }
    }

    const handleUpdate = async (e) => {

        e.preventDefault()

        try {

            const data = new FormData()

            data.append(
                "name",
                editCategory.name
            )


            if (editCategory.image instanceof File) {

                data.append(
                    "image",
                    editCategory.image
                )

            }


            await API.put(
                `/category/updateCategory/${editCategory._id}`,
                data
            )


            alert("Category updated successfully")


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

        <div className="min-h-screen bg-[#F5F0E8]">

            <AdminSidebar />


            <main
                className="
                    min-h-screen
                    p-4
                    sm:p-6
                    lg:ml-64
                    lg:p-8
                "
            >

                <div className="mx-auto max-w-7xl">


                    <div
                        className="
                            mb-8
                            flex
                            flex-col
                            gap-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <div>

                            <p
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-[0.2em]
                                    text-gray-500
                                "
                            >
                                Store management
                            </p>


                            <h1
                                className="
                                    mt-2
                                    text-2xl
                                    font-semibold
                                    tracking-tight
                                    text-[#2B2926]
                                    sm:text-3xl
                                "
                            >
                                Categories
                            </h1>


                            <p
                                className="
                                    mt-2
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-gray-500
                                "
                            >
                                Manage the categories available in your
                                Velaura store.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="
                                flex
                                w-full
                                items-center
                                justify-center
                                gap-2
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

                            Add Category

                        </button>

                    </div>


                    <div className="space-y-4">

                        {categories.map((category) => (

                            <div
                                key={category._id}
                                className="
                                    flex
                                    w-full
                                    flex-col
                                    gap-4
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white
                                    p-4
                                    transition
                                    hover:border-gray-300
                                    sm:p-5
                                    md:flex-row
                                    md:items-center
                                "
                            >



                                <div
                                    className="
                                        h-48
                                        w-full
                                        shrink-0
                                        overflow-hidden
                                        rounded-xl
                                        bg-gray-100
                                        sm:h-52
                                        md:h-24
                                        md:w-32
                                    "
                                >

                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="
                                            h-full
                                            w-full
                                            object-cover
                                        "
                                    />

                                </div>



                                

                                <div className="min-w-0 flex-1">

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            uppercase
                                            tracking-wider
                                            text-gray-400
                                        "
                                    >
                                        Category
                                    </p>


                                    <h3
                                        className="
                                            mt-1
                                            truncate
                                            text-lg
                                            font-semibold
                                            text-[#2B2926]
                                            sm:text-xl
                                        "
                                    >
                                        {category.name}
                                    </h3>

                                </div>




                                <div
                                    className="
                                        flex
                                        w-full
                                        flex-col
                                        gap-2
                                        sm:flex-row
                                        md:w-auto
                                    "
                                >


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditCategory(category)
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-gray-300
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-[#2B2926]
                                            transition
                                            hover:bg-gray-100
                                            sm:w-auto
                                        "
                                    >

                                        <FiEdit2 size={16} />

                                        Edit

                                    </button>



                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(category._id)
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-lg
                                            bg-[#2B2926]
                                            px-4
                                            py-3
                                            text-sm
                                            font-medium
                                            text-white
                                            transition
                                            hover:bg-[#403D39]
                                            sm:w-auto
                                        "
                                    >

                                        Delete

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>



            
                {editCategory && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            overflow-y-auto
                            bg-black/30
                            p-4
                        "
                    >

                        <form
                            onSubmit={handleUpdate}
                            className="
                                my-8
                                w-full
                                max-w-md
                                rounded-2xl
                                bg-white
                                p-5
                                shadow-xl
                                sm:p-6
                            "
                        >



                            <div
                                className="
                                    mb-5
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <h3
                                    className="
                                        text-lg
                                        font-semibold
                                        text-[#2B2926]
                                        sm:text-xl
                                    "
                                >
                                    Edit Category
                                </h3>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditCategory(null)
                                    }
                                    className="
                                        rounded-full
                                        p-2
                                        text-gray-500
                                        transition
                                        hover:bg-gray-100
                                        hover:text-[#2B2926]
                                    "
                                >

                                    <FiX size={20} />

                                </button>

                            </div>




                            <div className="mb-5">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
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
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-[#2B2926]
                                    "
                                />

                            </div>




                            <div className="mb-6">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
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
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        p-2
                                        text-sm
                                    "
                                />

                            </div>



                            

                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditCategory(null)
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-[#2B2926]
                                        transition
                                        hover:bg-gray-100
                                        sm:w-auto
                                    "
                                >

                                    <FiX size={17} />

                                    Cancel

                                </button>



                                <button
                                    type="submit"
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#2B2926]
                                        px-4
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#403D39]
                                        sm:w-auto
                                    "
                                >

                                    <FiEdit2 size={17} />

                                    Update

                                </button>

                            </div>

                        </form>

                    </div>

                )}



                {showModal && (

                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            overflow-y-auto
                            bg-black/40
                            p-4
                        "
                    >

                        <div
                            className="
                                my-8
                                w-full
                                max-w-lg
                                rounded-2xl
                                bg-white
                                p-5
                                shadow-xl
                                sm:p-6
                            "
                        >


                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <h2
                                    className="
                                        text-lg
                                        font-semibold
                                        text-[#2B2926]
                                        sm:text-xl
                                    "
                                >
                                    Add Category
                                </h2>


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




                            <div className="mt-5">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-[#2B2926]
                                    "
                                >
                                    Category Name
                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter Category name"
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-4
                                        py-3
                                        text-sm
                                        outline-none
                                        focus:border-[#2B2926]
                                    "
                                />

                            </div>




                            <div className="mt-5">

                                <label
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Category Image
                                </label>


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        sm:grid-cols-2
                                    "
                                >



                                    <label
                                        className="
                                            flex
                                            min-h-[180px]
                                            cursor-pointer
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border-2
                                            border-dashed
                                            border-gray-300
                                            bg-gray-50
                                            px-5
                                            text-center
                                            transition
                                            hover:border-gray-500
                                            hover:bg-gray-100
                                        "
                                    >

                                        <FiImage
                                            size={30}
                                            className="text-gray-400"
                                        />


                                        <p
                                            className="
                                                mt-3
                                                text-sm
                                                font-medium
                                                text-[#2B2926]
                                            "
                                        >
                                            Click to upload image
                                        </p>


                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                text-gray-400
                                            "
                                        >
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




                                    <div
                                        className="
                                            flex
                                            min-h-[180px]
                                            items-center
                                            justify-center
                                            overflow-hidden
                                            rounded-xl
                                            border
                                            border-gray-200
                                            bg-gray-50
                                        "
                                    >

                                        {preview ? (

                                            <img
                                                src={preview}
                                                alt="preview"
                                                className="
                                                    h-full
                                                    max-h-[180px]
                                                    w-full
                                                    object-contain
                                                "
                                            />

                                        ) : (

                                            <div className="text-center">

                                                <FiImage
                                                    size={28}
                                                    className="
                                                        mx-auto
                                                        text-gray-300
                                                    "
                                                />


                                                <p
                                                    className="
                                                        mt-2
                                                        text-xs
                                                        text-gray-400
                                                    "
                                                >
                                                    Image preview
                                                </p>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>




                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-col-reverse
                                    gap-3
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

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
                                    className="
                                        w-full
                                        rounded-lg
                                        border
                                        border-gray-300
                                        px-5
                                        py-3
                                        text-sm
                                        font-medium
                                        text-[#2B2926]
                                        transition
                                        hover:bg-gray-100
                                        sm:w-auto
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    type="button"
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-lg
                                        bg-[#2B2926]
                                        px-5
                                        py-3
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-[#403D39]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                        sm:w-auto
                                    "
                                >

                                    {loading
                                        ? "Creating..."
                                        : "Create Category"
                                    }

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