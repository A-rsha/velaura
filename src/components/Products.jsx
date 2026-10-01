import React, { useEffect, useState } from 'react'
import API from '../services/axios'
import { useNavigate } from 'react-router-dom'
import { FiHeart, FiArrowUpRight } from 'react-icons/fi'
import { addWishlist, getWishlist, removeWishlist } from '../services/api'

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


  // Fetch Wishlist
  useEffect(() => {

    const fetchWishlist = async () => {

      try {

        const res = await getWishlist()

        console.log("WISHLIST RESPONSE:", res.data)

        const wishlistProducts = res.data?.wishlist || res.wishlist || []

        const wishlistIds = wishlistProducts.map((item) => {

        return item.productId?._id || item.productId || item._id

      })

        setWishlist(wishlistIds)

      } catch (error) {

        console.error(
          "wishlist error:",
          error.response?.data || error.message
        )

      }

    }

    fetchWishlist()

  }, [])


  // Filter Products

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      )


  // Wishlist
const handleWishlist = async (productId) => {

    const isWishlisted = wishlist.includes(productId)

    if (isWishlisted) {

        setWishlist((prev) =>
            prev.filter((id) => id !== productId)
        )

    } else {

        setWishlist((prev) => [
            ...prev,
            productId
        ])

    }

    try {

        // Backend update in background
        if (isWishlisted) {

            await removeWishlist(productId)

        } else {

            await addWishlist(productId)

        }

    } catch (error) {

        console.error(
            "wishlist error:",
            error.response?.data || error.message
        )

        // Rollback if API fails
        if (isWishlisted) {

            setWishlist((prev) => [
                ...prev,
                productId
            ])

        } else {

            setWishlist((prev) =>
                prev.filter((id) => id !== productId)
            )

        }

    }
}


  return (

    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-x-4
        sm:gap-x-5
        md:gap-x-6
        gap-y-10
        sm:gap-y-12 
      "
    >

      {filteredProducts.map((product) => (

        <div
          key={product._id}
          className="
            group
            flex
            flex-col
          "
        >

          {/* Product Image */}

          <div
            className="
  relative
  overflow-hidden
  bg-[#F5F0E8]
  aspect-[4/5]
  
"
          >

            {product.image ? (

              <img
                src={product.image}
                alt={product.title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition
                  duration-500
                  group-hover:scale-105
                "
              />

            ) : (

              <div
                className="
                  flex
                  h-full
                  items-center
                  justify-center
                  text-sm
                  text-gray-400
                "
              >
                No Image
              </div>

            )}


            {/* Wishlist */}

            <button
              onClick={() => handleWishlist(product._id)}
              className="
                absolute
                right-3
                top-3
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white/90
                transition
                duration-300
                hover:bg-white
                hover:scale-105
              "
            >

              <FiHeart
                size={18}
                strokeWidth={1.5}
                className={
                  wishlist.includes(product._id)
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }
              />

            </button>

          </div>


          {/* Product Details */}

          <div className="  border-x
                                            border-b
                                            border-[#DED5C8]
                                         border-t-0 p-4 sm:p-5">

            <div className="flex items-start justify-between gap-2 ">

              <h2
                className="
                  line-clamp-1
                  text-sm
                  sm:text-base
                  font-medium
                  text-[#2B2926]
                "
              >
                {product.title}
              </h2>

            </div>


            <p
              className="
                mt-1.5
                line-clamp-2
                text-xs
                sm:text-sm
                leading-relaxed
                text-gray-500
              "
            >
              {product.description}
            </p>


            {/* Price + View */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                gap-2
              "
            >

              <p
                className="
                  text-sm
                  sm:text-base
                  font-medium
                  text-[#2B2926]
                "
              >
                ₹{product.price}
              </p>


              <button
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
                className="
                  flex
                  items-center
                  gap-1
                  border-b
                  border-[#2B2926]
                  pb-0.5
                  text-xs
                  sm:text-sm
                  font-medium
                  text-[#2B2926]
                  transition
                  duration-300
                  hover:opacity-60
                "
              >
                View
                <FiArrowUpRight size={14} />

              </button>

            </div>

          </div>

        </div>

      ))}


      {/* No Products */}

      {filteredProducts.length === 0 && (

        <div
          className="
            col-span-full
            py-16
            text-center
          "
        >

          <p
            className="
              font-serif
              text-xl
              text-[#2B2926]
            "
          >
            No products found
          </p>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Try selecting another category.
          </p>

        </div>

      )}

    </div>

  )
}

export default Products