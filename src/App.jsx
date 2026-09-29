import React, { useState } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import Register from './pages/Register'
import Shop from './pages/Shop'
import About from './pages/About'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'
import AdminDashboard from './pages/AdminDashboard'
import Payments from './pages/Payments'
import Wishlist from './pages/Wishlist'
import FeaturedProducts from './components/FeaturedProducts'
import Orders from './pages/Orders'
import MyOrder from './pages/MyOrder'
import ManageProducts from './components/ManageProducts'
import AdminLogin from './pages/AdminLogin'
import AdminProtectedRoute from './components/AdminProtectedRoute'



function App() {
 const [cartCount,setCartCount]=useState(0)
 const [cartItems,setCartItems]=useState([])
  return (
   <BrowserRouter>
  
    <Routes>
      <Route path = '/' element={<Home/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/shop' element={<Shop/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/product/:id' element={<ProductDetails 
      cartCount={cartCount}
      setCartCount={setCartCount}
      cartItems={cartItems}
      setCartItems={setCartItems}/>}/>
      <Route path='/cart' element={<CartPage cartItems={cartItems}
      setCartItems={setCartItems}/>}/>
      <Route path='/adminLogin' element={<AdminLogin/>}/>
      <Route path='/adminDashboard' element={<AdminProtectedRoute><AdminDashboard/></AdminProtectedRoute>}/>
      <Route path='/manageProduct' element={<ManageProducts/>}/>
      <Route path='/payment' element={<Payments/>}/>
<Route path='/wishlist' element={<Wishlist/>}/>
<Route path='/featuredProduct' element={<FeaturedProducts/>}/>
<Route path='/order' element={<Orders/>}/>
<Route path='/myOrder' element={<MyOrder/>}/>
    </Routes>
   
   </BrowserRouter>
  )
}

export default App