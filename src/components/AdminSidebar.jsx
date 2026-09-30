import React from 'react'
import { FiGrid, FiPackage, FiShoppingBag } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function AdminSidebar() {
    const navigate=useNavigate()
  return (
    <div className='min-h-screen bg-[#F7F7F5]'>
        
              <aside
                className="
                  fixed
                  left-0
                  top-0
                  hidden
                  h-screen
                  w-64
                  border-r
                  border-gray-200
                  bg-white
                  lg:block
                "
              >
        
                {/* Logo */}
        
                <div
                  className="
                    flex
                    h-20
                    flex-col
                    justify-center
                    border-b
                    border-gray-200
                    px-7
                  "
                >
        
                  <h1
                    className="
                      font-serif
                      text-2xl
                      font-medium
                      tracking-[3px]
                      text-[#2B2926]
                    "
                  >
                    VELAURA
                  </h1>
        
                  <p
                    className="
                      mt-1
                      text-[8px]
                      tracking-[3px]
                      text-gray-500
                    "
                  >
                    ADMIN PANEL
                  </p>
        
                </div>
        
        
                {/* Navigation */}
        
                <div className="px-4 py-6">
        
        
                  <button onClick={()=> navigate('/adminDashboard')}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      bg-[#2B2926]
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-white
                    "
                  >
                    <FiGrid size={17} />
                    Dashboard
                  </button>
        
        
                  <button onClick={() => navigate('/manageProduct')}
                    className="
                      mt-1
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      transition
                      hover:bg-gray-100
                      hover:text-black
                    "
                  >
                    <FiPackage size={17} />
                    Products
                  </button>
        
        
                  <button onClick={() => navigate('/order')}
                    className="
                      mt-1
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      transition
                      hover:bg-gray-100
                      hover:text-black
                    "
                  >
                    <FiShoppingBag size={17} />
                    Orders
                  </button>
        
        
        
                </div>
        
        
                {/* Bottom */}
        
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    w-full
                    border-t
                    border-gray-200
                    p-4
                  "
                >
        
              
        
                </div>
        
              </aside>
    </div>
  )
}

export default AdminSidebar