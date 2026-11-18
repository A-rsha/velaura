import React from 'react'
import Navbar from '../components/Navbar'
import Banner from '../components/Banner'
import Category from '../components/Category'
import Footer from '../components/Footer'
import FeaturedProducts from '../components/FeaturedProducts'
import AddBanner from '../components/AddBanner'
import ReviewSection from '../components/ReviewSection'
import ShoppingBenefits from '../components/ShoppingBenefits'
import SpecialOffer from '../components/SpecialOffer'
import NewArrivals from '../components/NewArrivals'
import ScrollReveal from '../components/ScrollReveal'


function Home() {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <Category/>
        <FeaturedProducts/>
        <SpecialOffer/>
        <NewArrivals/>
        <ScrollReveal direction='up' duration={800}>
          <AddBanner/>
        </ScrollReveal>
        
        <ReviewSection/>
        <ShoppingBenefits/>
        
        <Footer/>
    </div>
  )
}

export default Home