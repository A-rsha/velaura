
import React, { useEffect, useState } from 'react'

import Footer from '../components/Footer'
import { getWishlist, addWishlist, removeWishlist } from '../services/api'

import { FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'


function Wishlist() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {

        const fetchWishlist = async () => {

            try {

                const res = await getWishlist()

                console.log("WISHLIST RESPONSE:", res.data)

                setProducts(res.data.wishlist || [])

            } catch (error) {

                console.error(
                    "Wishlist Error:",
                    error.response?.data || error.message
                )

            } finally {

                setLoading(false)

            }

        }

        fetchWishlist()

    }, [])


    const handleWishlist = async (productId) => {

        try {

            const exists = products.some(
                (product) => product._id === productId
            )

            if (exists) {

                await removeWishlist(productId)

                setProducts((prev) =>
                    prev.filter(
                        (product) => product._id !== productId
                    )
                )

            } else {


                await addWishlist(productId)

            }

        } catch (error) {

            console.error(
                "Wishlist Error:",
                error.response?.data || error.message
            )

        }

    }


    return (
        <div>
<Navbar/>
            <div className='min-h-screen bg-white pt-28 pb-20 px-4 md:px-8'>

                <div className='max-w-7xl mx-auto'>


                    <div className="mb-10">

                        <h1 className="text-3xl md:text-4xl font-bold text-black">
                            My Wishlist
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Your favorite products saved in one place.
                        </p>

                    </div>



                    {loading && (

                        <div className="flex justify-center items-center py-20">

                            <p className="text-gray-500">
                                Loading wishlist...
                            </p>

                        </div>

                    )}


                    {!loading && products.length === 0 && (

                        <div className="text-center py-20">

                            <p className="text-gray-500 text-lg">
                                Your wishlist is empty.
                            </p>

                        </div>

                    )}



                    {!loading && products.length > 0 && (

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

                            {products.map((product) => (

                                <div
                                    key={product._id}
                                    className="
                                    group
                                    bg-white
                                    rounded-[28px]
                                    overflow-hidden
                                    border
                                    border-gray-200
                                    hover:border-black
                                    shadow-sm
                                    hover:shadow-xl
                                    transition-all
                                    duration-300
                                    flex
                                    flex-col
                                "
                                >


                                    <div className='relative overflow-hidden h-56'>

                                        {product.image ? (

                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="
                                                w-full
                                                h-full
                                                object-cover
                                                group-hover:scale-105
                                                transition
                                                duration-500
                                            "
                                            />

                                        ) : (

                                            <div className="
                                            w-full
                                            h-full
                                            bg-gray-200
                                            flex
                                            items-center
                                            justify-center
                                            text-gray-500
                                        ">
                                                No Image
                                            </div>

                                        )}


                                        <button
                                            onClick={() =>
                                                handleWishlist(product._id)
                                            }
                                            className="
                                            absolute
                                            top-3
                                            right-3
                                            bg-white
                                            rounded-full
                                            p-2
                                            shadow-md
                                            hover:scale-110
                                            transition
                                        "
                                        >

                                            <FiHeart
                                                size={22}
                                                className="
                                                text-red-500
                                                fill-red-500
                                            "
                                            />

                                        </button>

                                    </div>



                                    <div className='p-6 flex flex-col grow'>

                                        <h2 className="
                                        text-2xl
                                        font-bold
                                        text-black
                                        line-clamp-1
                                    ">
                                            {product.title}
                                        </h2>


                                        <p className="
                                        text-gray-500
                                        text-sm
                                        leading-relaxed
                                        mt-3
                                        line-clamp-2
                                    ">
                                            {product.description}
                                        </p>


                                        <p className="
                                        text-lg
                                        font-bold
                                        text-black
                                        mt-3
                                    ">
                                            ₹{product.price}
                                        </p>
                                        <button onClick={() => navigate(`/product/${product._id}`)} className="
                        flex
                        items-center
                        gap-2
                        bg-white
                        hover:bg-pink-200
                      
                        px-2
                        py-3
                        rounded-2xl
                        font-medium
                        transition
                        " >View</button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                <Footer />

            </div>
        </div>

    )
}


export default Wishlist
