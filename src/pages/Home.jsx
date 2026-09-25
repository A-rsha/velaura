import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Category from '../components/Category'
import Footer from '../components/Footer'
import ImageCarousal from '../components/ImageCarousal'


function Home() {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Category/>
        <ImageCarousal/>
        <Footer/>
    </div>
  )
}

export default Home