import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import Navbar from '../components/Navbar'
import ShopBanner from '../components/ShopBanner'
import Footer from '../components/Footer'
import Products from '../components/Products'
import API from '../services/axios'

function Shop() {

    const [searchParams, setSearchParams] = useSearchParams()
    const [categories, setCategories] = useState([])

    const selectedCategory = searchParams.get("category") || "All"

    const handleCategoryChange = (category) => {
        if (category === "All") {
            setSearchParams({})
        } else {
            setSearchParams({ category })
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await API.get('/category/getCategories')

            setCategories([
                "All",
                ...res.data.data.map((category) => category.name)
            ])

        } catch (error) {
            console.log("CATEGORY ERROR:", error)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (
        <div className="bg-[#F5F0E8] text-[#2B2926] animate-shop-page">

            <Navbar />

            <ShopBanner />


            {/* Category Tabs */}
            <section className="mt-8 sm:mt-10 animate-shop-categories">

                <div
                    className="
                        flex
                        gap-6
                        sm:gap-8
                        lg:gap-10
                        overflow-x-auto
                        px-5
                        sm:px-8
                        lg:justify-center
                        lg:overflow-visible
                        scrollbar-hide
                    "
                >

                    {categories.map((category, index) => (

                        <button
                            key={category}
                            onClick={() => handleCategoryChange(category)}
                            style={{
                                animationDelay: `${index * 70}ms`
                            }}
                            className={`
                                category-tab
                                shrink-0
                                pb-2
                                text-xs
                                sm:text-sm
                                tracking-wide
                                font-medium
                                transition-all
                                duration-300
                                ${selectedCategory === category
                                    ? "border-b border-black text-black"
                                    : "border-b border-transparent text-gray-500 hover:text-black"
                                }
                            `}
                        >
                            {category}
                        </button>

                    ))}

                </div>

            </section>


            {/* Collection Heading */}
            <section
                className="
                    mt-12
                    sm:mt-14
                    md:mt-16
                    px-5
                    sm:px-8
                    md:px-12
                    lg:px-16
                    animate-collection-heading
                "
            >

                <div className="max-w-2xl">

                    <p
                        className="
                            text-[10px]
                            sm:text-xs
                            uppercase
                            tracking-[3px]
                            text-gray-500
                            mb-2
                        "
                    >
                        VELAURA COLLECTION
                    </p>

                    <h2
                        key={selectedCategory}
                        className="
                            text-2xl
                            sm:text-3xl
                            md:text-4xl
                            font-serif
                            font-medium
                            tracking-tight
                            animate-category-heading
                        "
                    >
                        {selectedCategory === "All"
                            ? "All Collection"
                            : `${selectedCategory} Collection`
                        }
                    </h2>

                    <p
                        className="
                            mt-3
                            max-w-lg
                            text-sm
                            sm:text-base
                            leading-relaxed
                            text-gray-500
                        "
                    >
                        Discover carefully selected pieces designed
                        to add a refined touch to your everyday style.
                    </p>

                </div>

            </section>


            {/* Products */}
            <section
                className="
                    mt-8
                    sm:mt-10
                    px-5
                    sm:px-8
                    md:px-12
                    lg:px-16
                    pb-14
                    animate-shop-products
                "
            >

                <Products selectedCategory={selectedCategory} />

            </section>


            <Footer />


            {/* Shop Page Animations */}
            <style>{`

                @keyframes shopPageEntrance {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes shopCategoryEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes collectionHeadingEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes categoryHeadingEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shopProductsEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-shop-page {
                    animation: shopPageEntrance 0.7s ease-out both;
                }

                .category-tab {
                    animation: shopCategoryEntrance 0.5s ease-out both;
                }

                .category-tab:hover {
                    transform: translateY(-3px);
                }

                .animate-collection-heading {
                    animation: collectionHeadingEntrance 0.7s ease-out both;
                    animation-delay: 0.15s;
                }

                .animate-category-heading {
                    animation: categoryHeadingEntrance 0.4s ease-out both;
                }

                .animate-shop-products {
                    animation: shopProductsEntrance 0.8s ease-out both;
                    animation-delay: 0.2s;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-shop-page,
                    .category-tab,
                    .animate-collection-heading,
                    .animate-category-heading,
                    .animate-shop-products {
                        animation: none !important;
                        transition: none !important;
                    }
                }

            `}</style>

        </div>
    )
}

export default Shop