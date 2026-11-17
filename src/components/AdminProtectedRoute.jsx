import React from 'react'
import { Navigate } from 'react-router-dom'

function AdminProtectedRoute({ children }) {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'admin') {
        return <Navigate to="/adminLogin" replace />
    }

    return (
        <div className="admin-protected-page">
            <style>{`
                .admin-protected-page {
                    animation: adminPageEnter 0.5s ease both;
                }

                @keyframes adminPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .admin-protected-page {
                        animation: none;
                    }
                }
            `}</style>

            {children}
        </div>
    )
}

export default AdminProtectedRoute