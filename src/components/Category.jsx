import React from 'react'

import jewelryImg from '../assets/jwel.jpeg'
import watchImg from '../assets/watch.jpeg'
import bagImg from '../assets/bag.jpeg'
import sunglassImg from '../assets/sunglass.jpeg'
import walletImg from '../assets/walet.jpeg'
import hairimg from '../assets/pearl hair.jpeg'
import beautyImg from '../assets/beauty.jpeg'

import { FiArrowUpRight } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'


function Category() {

    const navigate = useNavigate()


    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${category}`)
    }


    const categories = [
        {
            name: "Jewelry",
            image: jewelryImg
        },
        {
            name: "Watches",
            image: watchImg
        },
        {
            name: "Bags",
            image: bagImg
        },
        {
            name: "Sunglasses",
            image: sunglassImg
        },
        {
            name: "Wallets",
            image: walletImg
        },
        {
            name: "Hair Accessories",
            image: hairimg
        },
        {
            name: "Beauty Accessories",
            image: beautyImg
        }
    ]


    return (

        <section className="bg-white">

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
                            "
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
                            transition
                            duration-300
                            hover:opacity-60
                        "
                    >
                        View All
                        <FiArrowUpRight size={14} />
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

                    {categories.map((category) => (

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
                            "
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
                                "
                            >

                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="
                                        h-full
                                        w-full
                                        object-cover
                                        transition
                                        duration-500
                                        group-hover:scale-105
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
                                    transition
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
                        "
                    >
                        View All
                        <FiArrowUpRight size={14} />
                    </button>

                </div>

            </div>

        </section>
    )
}

export default Category