import React, { useState, useEffect } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import API from '../services/axios'

function Category() {

    const navigate = useNavigate()

    const [categories, setCategories] = useState([])

    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${category}`)
    }

    const fetchCategories = async () => {
        try {
            const response = await API.get('/category/getCategories')
            setCategories(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return (

        <section className="bg-white">

            <style>{`
                @keyframes categoryFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes categoryFadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .category-heading-animation {
                    animation: categoryFadeUp 0.7s ease-out both;
                }

                .category-card-animation {
                    animation: categoryFadeUp 0.65s ease-out both;
                }

                .category-section-animation {
                    animation: categoryFadeIn 0.8s ease-out both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .category-heading-animation,
                    .category-card-animation,
                    .category-section-animation {
                        animation: none;
                    }
                }
            `}</style>

            <div
                className="
                    max-w-6xl
                    mx-auto
                    px-5
                    sm:px-8
                    md:px-10
                    lg:px-0
                    py-12
                    sm:py-14
                    md:py-16
                    category-section-animation
                "
            >

                {/* Heading */}

                <div
                    className="
                        flex
                        items-end
                        justify-between
                        mb-8
                    "
                >

                    <div>

                        <p
                            className="
                                mb-2
                                text-[10px]
                                sm:text-xs
                                uppercase
                                tracking-[3px]
                                text-gray-500
                                category-heading-animation
                            "
                        >
                            SHOP BY CATEGORY
                        </p>

                        <h2
                            className="
                                font-serif
                                text-2xl
                                sm:text-3xl
                                md:text-4xl
                                font-medium
                                text-[#2B2926]
                                category-heading-animation
                            "
                            style={{ animationDelay: '0.15s' }}
                        >
                            Find Your Perfect Match
                        </h2>

                    </div>

                    {/* View All */}

                    <button
                        onClick={() => navigate('/shop')}
                        className="
                            hidden
                            sm:flex
                            items-center
                            gap-1
                            text-xs
                            sm:text-sm
                            text-[#2B2926]
                            border-b
                            border-[#2B2926]
                            pb-1
                            transition-all
                            duration-300
                            hover:opacity-60
                            hover:translate-x-1
                            active:scale-95
                            group
                        "
                    >
                        View All

                        <FiArrowUpRight
                            size={14}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                                group-hover:-translate-y-1
                            "
                        />

                    </button>

                </div>

                {/* Categories */}

                <div
                    className="
                        grid
                        grid-cols-3
                        sm:grid-cols-4
                        md:grid-cols-4
                        lg:flex
                        lg:justify-between
                        gap-x-4
                        gap-y-8
                    "
                >

                    {categories.map((category, index) => (

                        <div
                            key={category.name}
                            onClick={() =>
                                handleCategoryClick(category.name)
                            }
                            className="
                                group
                                flex
                                cursor-pointer
                                flex-col
                                items-center
                                text-center
                                lg:w-[120px]
                                transition-all
                                duration-300
                                ease-out
                                hover:-translate-y-2
                                active:scale-95
                                category-card-animation
                            "
                            style={{
                                animationDelay: `${0.2 + index * 0.12}s`
                            }}
                        >

                            {/* Image */}

                            <div
                                className="
                                    w-[88px]
                                    h-[88px]
                                    sm:w-[100px]
                                    sm:h-[100px]
                                    md:w-[105px]
                                    md:h-[105px]
                                    lg:w-[110px]
                                    lg:h-[110px]
                                    overflow-hidden
                                    rounded-full
                                    bg-[#F5F0E8]
                                    transition-all
                                    duration-500
                                    ease-out
                                    group-hover:shadow-md
                                "
                            >

                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition-transform
                                        duration-700
                                        ease-out
                                        group-hover:scale-110
                                    "
                                />

                            </div>

                            {/* Category Name */}

                            <p
                                className="
                                    mt-3
                                    text-xs
                                    sm:text-sm
                                    font-medium
                                    text-[#2B2926]
                                    transition-all
                                    duration-300
                                    group-hover:opacity-60
                                "
                            >
                                {category.name}
                            </p>

                        </div>

                    ))}

                </div>

                {/* Mobile View All */}

                <div className="flex justify-center mt-8 sm:hidden">

                    <button
                        onClick={() => navigate('/shop')}
                        className="
                            flex
                            items-center
                            gap-1
                            border-b
                            border-[#2B2926]
                            pb-1
                            text-sm
                            font-medium
                            text-[#2B2926]
                            transition-all
                            duration-300
                            hover:opacity-60
                            active:scale-95
                            group
                        "
                    >
                        View All

                        <FiArrowUpRight
                            size={14}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                                group-hover:-translate-y-1
                            "
                        />

                    </button>

                </div>

            </div>

        </section>
    )
}

export default Category