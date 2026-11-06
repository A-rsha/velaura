
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { sellerSubscription, sellerverifySub } from '../services/api'
import { toast } from 'react-toastify'

function SellerPlans() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubscribe = async (plan) => {
        try {
            setIsLoading(true)

            // Create subscription order
            const response = await sellerSubscription({ plan })

            console.log('Subscription order:', response.data)

            const { order, subscriptionId } = response.data

            // Check Razorpay script
            if (!window.Razorpay) {
                alert('Razorpay is not loaded. Please refresh the page.')
                setIsLoading(false)
                return
            }

            // Razorpay checkout options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'VELAURA',
                description: `${plan} Seller Subscription`,
                order_id: order.id,

                handler: async function (paymentResponse) {
                    try {
                        // Verify payment with backend
                        const verifyResponse = await sellerverifySub({
                            ...paymentResponse,
                            subscriptionId
                        })

                        if (verifyResponse.data.success) {
                            toast.success('Subscription activated successfully!')
                            navigate('/vendorDashboard')
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error)
                        alert(
                            error.response?.data?.message ||
                            'Payment verification failed'
                        )
                    } finally {
                        setIsLoading(false)
                    }
                },

                modal: {
                    ondismiss: () => {
                        setIsLoading(false)
                    }
                },

                theme: {
                    color: '#2B2926'
                }
            }

            const paymentObject = new window.Razorpay(options)

            paymentObject.on('payment.failed', (paymentError) => {
                console.error('Payment failed:', paymentError)
                alert('Payment failed. Please try again.')
                setIsLoading(false)
            })

            paymentObject.open()

        } catch (error) {
            console.error('Subscription error:', error)
            alert(
                error.response?.data?.message ||
                'Unable to create subscription order'
            )
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F0E8] text-[#2B2926]">
            <Navbar />

            <main>
                <section className="px-5 py-14 sm:px-8 md:py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="mb-3 text-[10px] uppercase tracking-[3px] text-gray-500">
                            VELAURA PARTNER PROGRAM
                        </p>

                        <h1 className="font-serif text-3xl font-medium sm:text-4xl">
                            Choose Your Subscription
                        </h1>

                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                            Select a plan that works for your business and start
                            growing your store with VELAURA.
                        </p>
                    </div>
                </section>

                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 px-5 pb-16 sm:px-8 md:grid-cols-2">

                    {/* Monthly Plan */}
                    <div className="rounded-2xl border border-[#D8CFC2] bg-white p-8">
                        <p className="text-xs uppercase tracking-[2px] text-gray-500">
                            Monthly Plan
                        </p>

                        <h2 className="mt-4 font-serif text-4xl font-medium">
                            ₹199
                            <span className="ml-1 text-sm text-gray-500">
                                / month
                            </span>
                        </h2>

                        <p className="mt-3 text-sm text-gray-500">
                            Perfect for starting your online business.
                        </p>

                        <button
                            onClick={() => handleSubscribe('monthly')}
                            disabled={isLoading}
                            type="button"
                            className="mt-8 w-full rounded-full bg-[#2B2926] py-3 text-sm text-white transition hover:bg-[#49443F] disabled:opacity-50"
                        >
                            {isLoading ? 'Please wait...' : 'Choose Monthly Plan'}
                        </button>
                    </div>

                    {/* Yearly Plan */}
                    <div className="rounded-2xl border border-[#D8CFC2] bg-white p-8">
                        <p className="text-xs uppercase tracking-[2px] text-gray-500">
                            Yearly Plan
                        </p>

                        <h2 className="mt-4 font-serif text-4xl font-medium">
                            ₹499
                            <span className="ml-1 text-sm text-gray-500">
                                / year
                            </span>
                        </h2>

                        <p className="mt-3 text-sm text-gray-500">
                            A convenient plan for growing your business.
                        </p>

                        <button
                            onClick={() => handleSubscribe('yearly')}
                            disabled={isLoading}
                            type="button"
                            className="mt-8 w-full rounded-full bg-[#2B2926] py-3 text-sm text-white transition hover:bg-[#49443F] disabled:opacity-50"
                        >
                            {isLoading ? 'Please wait...' : 'Choose Yearly Plan'}
                        </button>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default SellerPlans

