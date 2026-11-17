import React from 'react'
import {
    FiGrid,
    FiLogOut,
    FiMonitor,
    FiPackage,
    FiPlus,
    FiRotateCcw,
    FiShoppingBag,
    FiStar,
    FiUser,
} from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'

function AdminSidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')
        localStorage.removeItem('userName')
        navigate('/adminLogin')
        window.location.reload()
    }

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/adminDashboard',
            icon: <FiGrid size={17} />,
        },
        {
            name: 'Products',
            path: '/manageProduct',
            icon: <FiPackage size={17} />,
        },
        {
            name: 'Orders',
            path: '/order',
            icon: <FiShoppingBag size={17} />,
        },
        {
            name: 'Category',
            path: '/addCategory',
            icon: <FiPlus size={17} />,
        },
        {
            name: 'Review Management',
            path: '/reviews',
            icon: <FiStar size={17} />,
        },
        {
            name: 'Ads Manager',
            path: '/ads',
            icon: <FiMonitor size={17} />,
        },
        {
            name: 'Return Manager',
            path: '/returnManager',
            icon: <FiRotateCcw size={17} />,
        },
        {
            name: 'Vendor Management',
            path: '/vendorList',
            icon: <FiUser size={17} />,
        },
    ]

    return (
        <aside className="admin-sidebar fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">

            <style>{`
                /* SIDEBAR ENTRANCE */
                .admin-sidebar {
                    animation: sidebarEnter 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) both;
                }

                @keyframes sidebarEnter {
                    from {
                        opacity: 0;
                        transform: translateX(-35px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                /* LOGO */
                .admin-logo {
                    animation: logoEnter 0.7s ease 0.15s both;
                }

                @keyframes logoEnter {
                    from {
                        opacity: 0;
                        transform: translateY(-12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .admin-logo h1 {
                    transition: letter-spacing 0.4s ease, color 0.3s ease;
                }

                .admin-logo:hover h1 {
                    letter-spacing: 5px;
                    color: #8A7660;
                }

                .admin-logo p {
                    transition: letter-spacing 0.4s ease;
                }

                .admin-logo:hover p {
                    letter-spacing: 4px;
                }

                /* MENU ITEMS */
                .admin-menu-item {
                    position: relative;
                    overflow: hidden;
                    animation: menuEnter 0.5s ease both;
                    transition:
                        background-color 0.3s ease,
                        color 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                @keyframes menuEnter {
                    from {
                        opacity: 0;
                        transform: translateX(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .admin-menu-item::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 3px;
                    height: 0;
                    border-radius: 0 5px 5px 0;
                    background: #8A7660;
                    transform: translateY(-50%);
                    transition: height 0.3s ease;
                }

                .admin-menu-item:not(.admin-menu-active):hover {
                    transform: translateX(5px);
                    background-color: #F5F0E8;
                    color: #2B2926;
                }

                .admin-menu-item:not(.admin-menu-active):hover::before {
                    height: 55%;
                }

                .admin-menu-item svg {
                    flex-shrink: 0;
                    transition:
                        transform 0.3s ease,
                        color 0.3s ease;
                }

                .admin-menu-item:hover svg {
                    transform: scale(1.15);
                }

                /* ACTIVE ITEM */
                .admin-menu-active {
                    background: #2B2926;
                    color: white;
                    box-shadow: 0 5px 14px rgba(43, 41, 38, 0.13);
                }

                .admin-menu-active::after {
                    content: '';
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #D9C6A8;
                    transform: translateY(-50%);
                    box-shadow: 0 0 8px rgba(217, 198, 168, 0.6);
                }

                .admin-menu-active svg {
                    color: #E4D3BB;
                }

                .admin-menu-active:hover {
                    background: #403A33;
                    transform: translateX(3px);
                }

                /* LOGOUT */
                .admin-logout {
                    transition:
                        background-color 0.3s ease,
                        color 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .admin-logout:hover {
                    transform: translateY(-3px);
                    background: #2B2926;
                    color: white;
                    box-shadow: 0 7px 16px rgba(43, 41, 38, 0.18);
                }

                .admin-logout svg {
                    transition: transform 0.3s ease;
                }

                .admin-logout:hover svg {
                    transform: translateX(4px);
                }

                /* BOTTOM LINE */
                .admin-sidebar-bottom {
                    animation: bottomEnter 0.8s ease 0.5s both;
                }

                @keyframes bottomEnter {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .admin-sidebar,
                    .admin-sidebar *,
                    .admin-sidebar *::before,
                    .admin-sidebar *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            {/* LOGO */}
            <div className="admin-logo flex h-20 flex-col justify-center border-b border-gray-200 px-7">
                <h1 className="font-serif text-2xl font-medium tracking-[3px] text-[#2B2926]">
                    VELAURA
                </h1>

                <p className="mt-1 text-[8px] tracking-[3px] text-gray-500">
                    ADMIN PANEL
                </p>
            </div>

            {/* NAVIGATION */}
            <div className="flex h-[calc(100vh-90px)] flex-col px-4 py-6">

                <div className="space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path

                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                style={{
                                    animationDelay: `${0.12 + index * 0.07}s`,
                                }}
                                className={`
                                    admin-menu-item
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    ${isActive
                                        ? 'admin-menu-active'
                                        : 'text-gray-600'
                                    }
                                `}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        )
                    })}
                </div>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    className="admin-logout mt-auto flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600"
                >
                    <FiLogOut size={17} />
                    <span>Logout</span>
                </button>
            </div>

            {/* BOTTOM */}
            <div className="admin-sidebar-bottom absolute bottom-0 left-0 w-full border-t border-gray-200 p-4">
            </div>

        </aside>
    )
}

export default AdminSidebar