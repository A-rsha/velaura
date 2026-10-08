import API from './axios'

export const register =(data)=>API.post('/auth/register',data)
export const login =(data)=>API.post('/auth/login',data)
export const profile=()=>API.get('/auth/profile')

export const postProduct =(data)=> API.post('/product/postProduct',data,{
    headers:{
        'Content-Type':'multipart/form-data',
    },
})

export const getProducts=()=>API.get('/product/getProducts')
export const getProduct=(id)=>API.get(`/product/getProduct/${id}`)
export const updateProduct=(id,data)=>API.put(`/product/updateProduct/${id}`,data)
export const deleteProduct=(id)=>API.delete(`/product/deleteproduct/${id}`)

export const add=(data)=>API.post('/cart/add',data)
export const getCart=(data)=>API.get('/cart/getCart',data)
export const updateCart=(data)=>API.put('/cart/updateCart',data)
export const deleteCart=(productId)=>API.delete('/cart/removeFromCart',{
    data:{productId}
})

export const create=(data)=>API.post('/order/create',data)
export const getMyOrders=()=>API.get('/order/getMyOrders')
export const getAllOrders=()=>API.get('/order/getAllOrders')

export const addWishlist =(productId)=>API.post(`/wishlist/add/${productId}`)
export const getWishlist=()=>API.get('/wishlist/get')
export const removeWishlist=(productId)=>API.delete(`/wishlist/remove/${productId}`)

export const createCategory=(data)=>API.post('/category/create',data)
export const getCategory=()=>API.get('/category/getCategories')
export const getOneCategory=(id)=>API.get(`/category/getOneCategory/${id}`)
export const updateCategory=(id,data)=>API.put(`/category/updateCategory/${id}`,data)
export const deleteCategory=(id)=>API.delete(`/category/deleteCategory/${id}`)

export const razorpay =()=>API.post('/payment/createOrder')
export const verify=(paymentResponse)=>API.post('/payment/verify',paymentResponse)
