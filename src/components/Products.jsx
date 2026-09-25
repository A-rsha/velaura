import React, { useEffect, useState } from 'react'
import API from '../services/axios'
import { useNavigate } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { addWishlist,getWishlist, removeWishlist } from '../services/api'

function Products({ selectedCategory }) {
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/product/getProducts')

        console.log("PRODUCT RESPONSE:", res.data)

        setProducts(res.data.data || [])

      } catch (error) {
        console.error(
          "Error fetching Products:",
          error.response?.data || error
        )
      }
    }

    fetchProducts()
  }, [])
 

  useEffect(()=>{
    const fetchWishlist =async()=>{
      try { const res = await getWishlist()
         console.log("WISHLIST RESPONSE:", res.data)
         
         const wishlistProducts = res.wishlist || [] 
         const wishlistIds = wishlistProducts.map(
           (product) =>  product._id )
          setWishlist(wishlistIds)
      } catch (error) {
        console.error(
          "wishlist error:",
          error.response?.data || error.message
        )
      }
    }
    fetchWishlist()
  },[])

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      )

  const handleWishlist = async(productId) => {
    try {
      if(wishlist.includes(productId)){
      await removeWishlist(productId)
      setWishlist((prev)=>prev.filter((id)=> id !== productId))
        
      }else{
        await addWishlist(productId)
        setWishlist((prev)=>[
          ...prev,
          productId
        ])
      }
    } catch (error) {
      console.error(
        "wishlist error:",
        error.response?.data || error.message
      )
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">

      {filteredProducts.map((product) => (

        <div
          key={product._id}
          className="bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm flex flex-col"
        >


          <div className="relative overflow-hidden ">

            {product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[350px] object-cover hover:scale-105 transition duration-500"

              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}

            <button onClick={() => handleWishlist(product._id)} className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition">
              <FiHeart size={20} className={wishlist.includes(product._id) ? "text-red-500 fill-red-500" : "text-gray-500"} />
            </button>

          </div>


          <div className="p-5 flex flex-col grow">

            <h2 className="text-xl font-bold text-black line-clamp-1">
              {product.title}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed mt-2 line-clamp-2">
              {product.description}
            </p>
            <div className='flex flex-col'>

              <p className="text-xl font-bold text-black mt-3">
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

        </div>

      ))}


      {filteredProducts.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      )}

    </div>
  )
}

export default Products