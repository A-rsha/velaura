import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    FiGrid,
    FiPackage,
    FiPlusCircle,
    FiShoppingBag,
    FiHome,
    FiSettings,
    FiLogOut,
    FiX,
    FiChevronRight,
} from 'react-icons/fi'

function VendorSidebar({ sidebarOpen, setSidebarOpen, vendorName }) {

    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')
        localStorage.removeItem('userName')
        localStorage.removeItem('userId')

        navigate('/login')
    }

    const menuItems = [
        { name: 'Dashboard', icon: FiGrid, path: '/vendorDashboard' },
        { name: 'My Products', icon: FiPackage, path: '/vmanageProducts' },
        { name: 'Add Product', icon: FiPlusCircle, path: '/vaddProduct' },
        { name: 'My Orders', icon: FiShoppingBag, path: '/vendorOrders' },
    ]

    return (
        <>
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="sidebar-overlay fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`vendor-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#DED5C8] bg-[#FDFBF7] transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >

                {/* BRAND */}
                <div className="sidebar-brand flex items-center justify-between border-b border-[#DED5C8] px-7 py-7">

                    <Link
                        to="/"
                        onClick={() => setSidebarOpen(false)}
                        className="brand-link inline-flex flex-col"
                    >
                        <span className="font-serif text-3xl tracking-wide">
                            VELAURA
                        </span>

                        <span className="mt-1 text-[9px] tracking-[4px] text-gray-500">
                            SELLER PORTAL
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-close-btn lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <FiX size={21} />
                    </button>

                </div>

                {/* NAVIGATION */}
                <div className="flex-1 px-5 py-8">

                    <p className="sidebar-label mb-4 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
                        Workspace
                    </p>

                    <nav className="space-y-2">

                        {menuItems.map((item, index) => {
                            const Icon = item.icon
                            const active = item.name === 'Dashboard'

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    style={{
                                        '--menu-delay': `${index * 100}ms`
                                    }}
                                    className={`sidebar-menu-item group flex items-center gap-3 px-4 py-3 text-sm transition ${
                                        active
                                            ? 'active-menu bg-[#2B2926] text-white'
                                            : 'text-[#625D56] hover:bg-[#F0EAE0] hover:text-[#2B2926]'
                                    }`}
                                >
                                    <Icon
                                        className="menu-icon shrink-0"
                                        size={18}
                                    />

                                    <span>{item.name}</span>

                                    {active && (
                                        <FiChevronRight
                                            className="menu-chevron ml-auto"
                                            size={16}
                                        />
                                    )}
                                </Link>
                            )
                        })}

                    </nav>

                    <p className="sidebar-label mb-4 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-gray-400">
                        Account
                    </p>

                    <Link
                        to="/"
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-menu-item flex items-center gap-3 px-4 py-3 text-sm text-[#625D56] transition hover:bg-[#F0EAE0]"
                    >
                        <FiHome className="menu-icon" size={18} />
                        View Website
                    </Link>

                    <button
                        type="button"
                        className="sidebar-menu-item flex w-full items-center gap-3 px-4 py-3 text-sm text-[#625D56] transition hover:bg-[#F0EAE0]"
                    >
                        <FiSettings className="menu-icon" size={18} />
                        Settings
                    </button>

                </div>

                {/* SIDEBAR FOOTER */}
                <div className="sidebar-footer border-t border-[#DED5C8] p-5">

                    <div className="mb-4 flex items-center gap-3">

                        <div className="vendor-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9DFD0] font-serif text-lg">
                            {vendorName?.charAt(0)?.toUpperCase() || 'V'}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#2B2926]">
                                {vendorName || 'Vendor'}
                            </p>

                            <p className="text-xs text-gray-400">
                                Seller Account
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="logout-btn flex w-full items-center gap-3 px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                    >
                        <FiLogOut className="logout-icon" size={17} />
                        Logout
                    </button>

                </div>

            </aside>

            {/* ANIMATIONS */}
            <style>{`
                .vendor-sidebar {
                    animation: sidebarEntrance 0.5s ease both;
                }

                .sidebar-brand {
                    animation: fadeSlideRight 0.6s ease both;
                }

                .brand-link {
                    transition: transform 0.3s ease;
                }

                .brand-link:hover {
                    transform: translateX(4px);
                }

                .brand-link span:first-child {
                    transition: letter-spacing 0.3s ease, color 0.3s ease;
                }

                .brand-link:hover span:first-child {
                    letter-spacing: 3px;
                    color: #9A7958;
                }

                .sidebar-label {
                    animation: fadeSlideRight 0.6s ease both;
                }

                .sidebar-menu-item {
                    position: relative;
                    overflow: hidden;
                    border-radius: 3px;
                    animation: menuEntrance 0.5s ease both;
                    animation-delay: var(--menu-delay, 0ms);
                }

                .sidebar-menu-item:not(.active-menu)::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 3px;
                    height: 100%;
                    background: #9A7958;
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                }

                .sidebar-menu-item:not(.active-menu):hover::before {
                    transform: scaleY(1);
                }

                .menu-icon {
                    transition: transform 0.3s ease;
                }

                .sidebar-menu-item:hover .menu-icon {
                    transform: scale(1.15);
                }

                .active-menu {
                    box-shadow: 0 5px 14px rgba(43, 41, 38, 0.12);
                }

                .active-menu .menu-chevron {
                    animation: chevronMove 1.5s ease-in-out infinite;
                }

                .sidebar-close-btn {
                    transition: transform 0.3s ease, color 0.3s ease;
                }

                .sidebar-close-btn:hover {
                    transform: rotate(90deg);
                    color: #9A7958;
                }

                .sidebar-footer {
                    animation: fadeSlideUp 0.7s ease both;
                }

                .vendor-avatar {
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }

                .vendor-avatar:hover {
                    transform: scale(1.12) rotate(-8deg);
                    box-shadow: 0 5px 14px rgba(154, 121, 88, 0.25);
                }

                .logout-btn {
                    border-radius: 3px;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }

                .logout-btn:hover {
                    transform: translateX(4px);
                }

                .logout-icon {
                    transition: transform 0.3s ease;
                }

                .logout-btn:hover .logout-icon {
                    transform: translateX(3px);
                }

                .sidebar-overlay {
                    animation: overlayFade 0.3s ease both;
                    backdrop-filter: blur(2px);
                }

                @keyframes sidebarEntrance {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeSlideRight {
                    from {
                        opacity: 0;
                        transform: translateX(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes menuEntrance {
                    from {
                        opacity: 0;
                        transform: translateX(-15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes chevronMove {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    50% {
                        transform: translateX(4px);
                    }
                }

                @keyframes overlayFade {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .vendor-sidebar,
                    .sidebar-brand,
                    .sidebar-label,
                    .sidebar-menu-item,
                    .sidebar-footer,
                    .sidebar-overlay {
                        animation: none;
                    }

                    .vendor-sidebar *,
                    .vendor-sidebar *::before {
                        transition: none !important;
                    }

                    .active-menu .menu-chevron {
                        animation: none;
                    }
                }
            `}</style>
        </>
    )
}

export default VendorSidebar