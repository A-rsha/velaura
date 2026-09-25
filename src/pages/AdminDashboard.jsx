import React, { useState } from 'react'
import ManageProducts from '../components/ManageProducts'
import API from '../services/axios';


function AdminDashboard() {
  const [formData,setFormData]=useState({
    title:"",
    description:"",
    category:"",
    price:"",
    image:null,
  })
  const [preview, setPreview]=useState(null);
  const handleChange =(e)=>{
    if(e.target.name === "image"){
      const file = e.target.files[0];
      setFormData({...formData, image:file})
      if(file) setPreview(URL.createObjectURL(file))
    }else{
  setFormData({...formData, [e.target.name]: e.target.value});
}
  }

  const handleSubmit =async (e)=>{
    e.preventDefault()
    const data =new FormData()
    Object.keys(formData).forEach((key)=>{
      if(formData[key]) data.append(key,formData[key]);
    })

      try {
        await API.post('/product/postProduct',data,{
    headers:{
        'Content-Type':'multipart/form-data',
    },
})
        alert("product created successfully")
        window.location.reload()
        
      } catch (error) {
        console.log("FULL ERROR:", error.response?.data ||error)
        alert("Error creating product")
      }
  }
  return (
    <div className='bg-ornage-100  min-h-screen py-6 px-4 md:px-8 '>
      <div className='max-w-3xl mx-auto rounded-md p-6 md:p-8' >

        <div className='border max-w-xl bg-transparent shadow-sm rounded-lg '>
          <h2 className='text-2xl font-extrabold text-center'>Create a Product</h2>

          <form onSubmit={handleSubmit} className='space-y-4'>

            <input type="text" name='title'placeholder='enter title' className='w-full p-3 border rounded-md focus:ring-1 focus:ring-orange-200' onChange={handleChange} required/>
            <textarea name="description" placeholder='Enter description' className='w-full p-3 border rounded-md focus:ring-1 focus:ring-orange-200' onChange={handleChange}/>

            <select name="category"  className='w-full p-3 border rounded-md focus:ring-1 focus:ring-orange-200' onChange={handleChange} required>
              <option value=''>Select Category</option>
              <option value="Jewlery">Jewlery</option>
              <option value="Watches">Watches</option>
              <option value="Bags">Bags</option>
              <option value="Sunglasses">Sunglasses</option>
              <option value="Wallets">Wallets</option>
              <option value="Hair Accessories">Hair Accessories</option>
              <option value="Beauty Accessories">Beauty Accessories</option>
            </select>
           <input type="number" name='price' placeholder='price' onChange={handleChange} required className='w-full p-3 border rounded-md focus:ring-1 focus:ring-orange-200' />

           <div >
            <label className='block mb-3 text-gray-900 '>Upload an Image</label>
            <input type="file" name='image' className='w-full mb-3'  onChange={handleChange} />
            {preview && <img src={preview} alt="preview"/>}
      

            <button type='submit' className='w-full bg-orange-100 text-black py-2 rounded-md hover:bg-red-200 transition-colors font-medium'>
              Create Product</button>
           </div>
          </form>
        </div>
        </div>
        <ManageProducts/>
    </div>

    
  )
}

export default AdminDashboard