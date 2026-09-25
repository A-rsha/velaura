
import React from 'react'

import jewelryImg from '../assets/jewelry.jpeg'
import watchImg from '../assets/Watches.jpeg'
import bagImg from '../assets/bags.jpeg'
import sunglassImg from '../assets/Sunglasess.jpeg'
import walletImg from '../assets/wallets.jpeg'
import hairimg from '../assets/Hair Accessories.jpeg'
import beautyImg from '../assets/beauty access.jpeg'

import { useNavigate } from 'react-router-dom'


function Category() {

    const navigate = useNavigate()

    const handleCategoryClick = (category) => {
        navigate(`/shop?category=${category}`)
    }


    return (

        <div>

            <h1 className='text-center text-2xl mt-4 mb-4 font-bold'>
                Shop by Categories
            </h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6'>

                <div
                    onClick={() => handleCategoryClick("Jewelry")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={jewelryImg}
                        alt="jewelry"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Jewelry
                    </p>
                </div>


                <div
                    onClick={() => handleCategoryClick("Watches")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={watchImg}
                        alt="watches"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Watches
                    </p>
                </div>


                <div
                    onClick={() => handleCategoryClick("Bags")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={bagImg}
                        alt="bags"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Bags
                    </p>
                </div>


                <div
                    onClick={() => handleCategoryClick("Sunglasses")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={sunglassImg}
                        alt="sunglasses"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Sunglasses
                    </p>
                </div>


              
                <div
                    onClick={() => handleCategoryClick("Wallets")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={walletImg}
                        alt="wallets"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Wallets
                    </p>
                </div>


                <div
                    onClick={() => handleCategoryClick("Hair Accessories")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={hairimg}
                        alt="hair accessories"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Hair Accessories
                    </p>
                </div>


             
                <div
                    onClick={() => handleCategoryClick("Beauty Accessories")}
                    className='text-center cursor-pointer'
                >
                    <img
                        src={beautyImg}
                        alt="beauty accessories"
                        className="mt-4 w-40 h-40 rounded-full object-cover mx-auto"
                    />

                    <p className='text-xl font-bold mt-4'>
                        Beauty Accessories
                    </p>
                </div>

            </div>

        </div>
    )
}

export default Category

