
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import ShopBanner from '../components/ShopBanner'
import Footer from '../components/Footer'
import Products from '../components/Products'

function Shop() {

    const [searchParams, setSearchParams] = useSearchParams()

    const selectedCategory = searchParams.get("category") || "All"

    const handleCategoryChange = (category) => {
        if (category === "All") {
            setSearchParams({})
        } else {
            setSearchParams({ category })
        }
    }

    return (
        <div>

            <Navbar />

            <ShopBanner />


            {/* Category Tabs */}
            <div className="
                grid
                grid-cols-4
                sm:grid-cols-4
                md:grid-cols-4
                lg:grid-cols-8
                gap-2
                sm:gap-3
                md:gap-4
                mt-6
                px-3
                sm:px-5
                md:px-7
                lg:px-10
                text-center
                text-sm
                sm:text-base
                font-extrabold
                font-serif
                
            ">

                <button
                    onClick={() => handleCategoryChange("All")}
                    className={
                        selectedCategory === "All"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    All
                </button>


                <button
                    onClick={() => handleCategoryChange("Jewelry")}
                    className={
                        selectedCategory === "Jewelry"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Jewelry
                </button>


                <button
                    onClick={() => handleCategoryChange("Watches")}
                    className={
                        selectedCategory === "Watches"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Watches
                </button>


                <button
                    onClick={() => handleCategoryChange("Bags")}
                    className={
                        selectedCategory === "Bags"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Bags
                </button>


                <button
                    onClick={() => handleCategoryChange("Sunglasses")}
                    className={
                        selectedCategory === "Sunglasses"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Sunglasses
                </button>


                <button
                    onClick={() => handleCategoryChange("Wallets")}
                    className={
                        selectedCategory === "Wallets"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Wallets
                </button>


                <button
                    onClick={() => handleCategoryChange("Hair Accessories")}
                    className={
                        selectedCategory === "Hair Accessories"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Hair Accessories
                </button>


                <button
                    onClick={() => handleCategoryChange("Beauty Accessories")}
                    className={
                        selectedCategory === "Beauty Accessories"
                            ? "border-b-2 border-black pb-2"
                            : "pb-2"
                    }
                >
                    Beauty Accessories
                </button>

            </div>


            {/* Collection Title */}
            <div className="
                mt-8
                sm:mt-10
                px-4
                sm:px-6
                md:px-8
                lg:px-10
            ">

                <h2 className="
                    text-xl
                    sm:text-2xl
                    md:text-3xl
                    font-bold
                    font-serif
                ">
                    {selectedCategory === "All"
                        ? "All Collection"
                        : `${selectedCategory} Collection`
                    }
                </h2>

            </div>


            {/* Products */}
            <Products selectedCategory={selectedCategory} />


            <Footer />

        </div>
    )
}

export default Shop

