import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Category from '../components/Category'
import Footer from '../components/Footer'
import FeaturedProducts from '../components/FeaturedProducts'



function Home() {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Category/>
        <FeaturedProducts/>
        
        <Footer/>
    </div>
  )
}

export default Home