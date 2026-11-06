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
import AdminSidebar from './components/AdminSidebar'
import AddCategory from './pages/AddCategory'
import ReviewManagement from './pages/ReviewManagement'
import VendorRegistration from './pages/VendorRegistration'
import AdsManager from './pages/AdsManager'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ReturnManager from './pages/ReturnManager'
import SellerPlans from './pages/SellerPlans'
import SellerTerms from './pages/SellerTerms'
import VendorDashboard from './pages/VendorDashboard'
import VendorLogin from './pages/VendorLogin'
import { Navigate } from 'react-router-dom'
import VendorOrders from './pages/VendorOrders'
import VendorAddProducts from './pages/VendorAddProducts'
import VendorForm from './pages/VendorForm'
import VendorSidebar from './components/VendorSidebar'
import VendorManagement from './pages/VendorManagement'






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
      <Route path='/adminSidebar' element={<AdminSidebar/>}/>
      <Route path='/manageProduct' element={<ManageProducts/>}/>
      <Route path='/payment' element={<Payments/>}/>
<Route path='/wishlist' element={<Wishlist/>}/>
<Route path='/featuredProduct' element={<FeaturedProducts/>}/>
<Route path='/order' element={<Orders/>}/>
<Route path='/myOrder' element={<MyOrder/>}/>
<Route path='/addCategory' element={<AddCategory/>}/>
<Route path='/reviews' element={<ReviewManagement/>}/>
<Route path='/ads' element={<AdsManager/>}/>
<Route path='/returnManager' element={<ReturnManager/>}/>
<Route path='/sellerPlans' element={<SellerPlans/>}/>
<Route path='/vendorRegistration' element={<VendorRegistration/>}/>
<Route path='/vendorForm' element={<VendorForm/>}/>
<Route path='/sellerTerms' element={<SellerTerms/>}/>
<Route path='/vaddProduct' element={<VendorAddProducts/>}/>
<Route path='/vendorLogin' element={<VendorLogin/>}/>
<Route path='/vendorSidebar' element={<VendorSidebar/>}/>
<Route
    path="/vendorOrders"
    element={
        localStorage.getItem('token') &&
        localStorage.getItem('role') === 'vendor'
            ? <VendorOrders />
            : <Navigate to="/vendorLogin" replace />
    }
/>
<Route path='/vmanageProducts' element={<VendorManagement/>}/>
<Route
    path="/vendorDashboard"
    element={
        (() => {
            const token = localStorage.getItem('token')
            const role = localStorage.getItem('role')

            console.log("VENDOR DASHBOARD ROUTE CHECK:", {
                tokenExists: !!token,
                role
            })

            return token && role === 'vendor'
                ? <VendorDashboard />
                : <Navigate to="/vendorLogin" replace />
        })()
    }
/>
    </Routes>
  <ToastContainer position="top-center" autoClose={3000} hideProgressBar closeOnClick pauseOnHover draggable theme="light" toastClassName="velaura-toast" bodyClassName="velaura-toast-body" />
   
   </BrowserRouter>
  )
}

export default App