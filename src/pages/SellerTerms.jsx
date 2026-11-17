import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { acceptSellerTerms } from '../services/api'

function SellerTerms() {
    const navigate = useNavigate()

    const [accepted, setAccepted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleContinue = async () => {
        if (!accepted || isLoading) return

        try {
            setIsLoading(true)

            const response = await acceptSellerTerms()

            if (response.data.success) {
                navigate('/sellerPlans')
            }
        } catch (error) {
            console.error('Terms acceptance failed:', error)
            alert(error.response?.data?.message || 'Failed to accept terms')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="seller-terms-page min-h-screen bg-[#F5F0E8] text-[#2B2926]">

            <style>{`
                .seller-terms-page {
                    animation: termsPageEnter 0.7s ease both;
                }

                @keyframes termsPageEnter {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .terms-header {
                    animation: termsFadeUp 0.8s ease both;
                }

                @keyframes termsFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .terms-label {
                    animation: termsLabelEnter 0.8s ease 0.15s both;
                }

                @keyframes termsLabelEnter {
                    from {
                        opacity: 0;
                        letter-spacing: 1px;
                    }
                    to {
                        opacity: 1;
                        letter-spacing: 3px;
                    }
                }

                .terms-card {
                    position: relative;
                    overflow: hidden;
                    animation: termsCardEnter 0.7s ease both;
                    transition:
                        transform 0.35s ease,
                        box-shadow 0.35s ease,
                        border-color 0.35s ease;
                }

                @keyframes termsCardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .terms-card:nth-of-type(2) { animation-delay: 0.08s; }
                .terms-card:nth-of-type(3) { animation-delay: 0.14s; }
                .terms-card:nth-of-type(4) { animation-delay: 0.20s; }
                .terms-card:nth-of-type(5) { animation-delay: 0.26s; }
                .terms-card:nth-of-type(6) { animation-delay: 0.32s; }
                .terms-card:nth-of-type(7) { animation-delay: 0.38s; }
                .terms-card:nth-of-type(8) { animation-delay: 0.44s; }
                .terms-card:nth-of-type(9) { animation-delay: 0.50s; }

                .terms-card:hover {
                    transform: translateY(-4px);
                    border-color: #BDA88E;
                    box-shadow: 0 12px 28px rgba(43,41,38,0.07);
                }

                .terms-card h2 {
                    transition: color 0.3s ease, transform 0.3s ease;
                }

                .terms-card:hover h2 {
                    color: #8B6F4E;
                    transform: translateX(3px);
                }

                .terms-card p,
                .terms-card li {
                    transition: color 0.3s ease;
                }

                .terms-accept-card {
                    animation: termsFadeUp 0.8s ease 0.3s both;
                }

                .terms-checkbox {
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .terms-checkbox:hover {
                    transform: scale(1.12);
                }

                .terms-continue-button {
                    position: relative;
                    overflow: hidden;
                    transition:
                        background 0.3s ease,
                        transform 0.3s ease,
                        box-shadow 0.3s ease;
                }

                .terms-continue-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        110deg,
                        transparent,
                        rgba(255,255,255,0.2),
                        transparent
                    );
                    transition: left 0.6s ease;
                }

                .terms-continue-button:hover:not(:disabled)::before {
                    left: 100%;
                }

                .terms-continue-button:hover:not(:disabled) {
                    transform: translateY(-3px);
                    background: #49443F;
                    box-shadow: 0 8px 18px rgba(43,41,38,0.16);
                }

                .terms-continue-button:active:not(:disabled) {
                    transform: scale(0.98);
                }

                .terms-continue-button:disabled {
                    cursor: not-allowed;
                }

                @media (prefers-reduced-motion: reduce) {
                    .seller-terms-page *,
                    .seller-terms-page *::before,
                    .seller-terms-page *::after {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <Navbar />

            <main>

                {/* HEADER */}
                <section className="terms-header px-5 py-14 sm:px-8 md:py-16">
                    <div className="mx-auto max-w-4xl text-center">

                        <p className="terms-label mb-3 text-[10px] uppercase tracking-[3px] text-gray-500">
                            VELAURA PARTNER PROGRAM
                        </p>

                        <h1 className="font-serif text-3xl font-medium sm:text-4xl">
                            Seller Terms & Conditions
                        </h1>

                        <p className="mt-4 text-sm leading-relaxed text-gray-500">
                            Please review our seller policies carefully before joining
                            the VELAURA marketplace.
                        </p>

                    </div>
                </section>

                {/* 1. COMMISSION POLICY */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            1. Commission Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            VELAURA charges a 10% commission on every successful product sale.
                            The remaining 90% will be the seller's share before applicable
                            shipping charges, payment gateway fees, taxes or other deductions.
                        </p>

                    </div>
                </section>

                {/* 2. SUBSCRIPTION POLICY */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            2. Subscription Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Sellers must maintain an active subscription to sell products
                            on VELAURA. The available subscription plans are:
                        </p>

                        <ul className="mt-4 space-y-3 text-sm text-gray-600">
                            <li>• Monthly Plan – ₹199 for 1 month.</li>
                            <li>• Yearly Plan – ₹499 for 12 months.</li>
                        </ul>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Once the subscription expires, sellers must renew their plan
                            to continue selling products. Existing account access and
                            historical store data will remain available.
                        </p>

                    </div>
                </section>

                {/* 3. SHIPPING & DELIVERY */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            3. Shipping & Delivery Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Sellers are responsible for packing products securely and
                            dispatching orders within the specified processing time.
                            Sellers must provide accurate shipping and tracking details
                            whenever available.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-600">
                            Sellers must ensure that products are delivered in good
                            condition and must cooperate with VELAURA in resolving
                            delivery-related issues.
                        </p>

                    </div>
                </section>

                {/* 4. RETURNS & REFUNDS */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            4. Returns & Refund Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Sellers must cooperate with VELAURA in handling return and
                            refund requests. Products that are damaged, defective or
                            incorrect must be reported and handled according to the
                            VELAURA return policy.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-600">
                            Sellers must provide accurate product information and
                            respond promptly to return-related requests.
                        </p>

                    </div>
                </section>

                {/* 5. PRODUCT LISTING */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            5. Product Listing & Quality Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Sellers must upload genuine product images and provide
                            accurate descriptions, prices and stock information.
                            Selling counterfeit, prohibited or misleading products
                            is not allowed on VELAURA.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-600">
                            VELAURA reserves the right to remove listings that violate
                            marketplace policies.
                        </p>

                    </div>
                </section>

                {/* 6. ORDER CANCELLATION */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            6. Order Cancellation Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Sellers must update order status promptly and notify
                            customers about any issues that may affect order fulfilment.
                            Sellers should not cancel confirmed orders without a valid reason.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-600">
                            Repeated or unjustified order cancellations may result in
                            restrictions on the seller account.
                        </p>

                    </div>
                </section>

                {/* 7. ACCOUNT SUSPENSION */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            7. Account Suspension Policy
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            VELAURA reserves the right to suspend or restrict seller
                            accounts involved in fraudulent activities, repeated
                            policy violations, misleading product listings or
                            unresolved customer complaints.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-600">
                            Sellers may be asked to provide additional information
                            to resolve policy-related issues.
                        </p>

                    </div>
                </section>

                {/* 8. SUBSCRIPTION EXPIRY */}
                <section className="px-5 pb-8 sm:px-8">
                    <div className="terms-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <h2 className="font-serif text-xl font-medium">
                            8. Subscription Expiry & Renewal
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600">
                            Sellers must renew their subscription before or after
                            expiry to continue selling products on VELAURA.
                            Once the subscription expires, adding or editing products
                            and other seller activities will be restricted.
                        </p>

                        <p className="mt-3 text-sm leading-7 text-gray-600">
                            Sellers can still access their accounts and view their
                            existing store information and historical records.
                        </p>

                    </div>
                </section>

                {/* ACCEPT TERMS */}
                <section className="px-5 pb-16 sm:px-8">
                    <div className="terms-accept-card mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

                        <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-600">

                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="terms-checkbox mt-1 h-4 w-4 accent-[#2B2926]"
                            />

                            <span>
                                I have read and agree to the VELAURA Seller Terms &
                                Conditions, including the 10% commission and subscription
                                charges.
                            </span>

                        </label>

                        <button
                            type="button"
                            disabled={!accepted || isLoading}
                            onClick={handleContinue}
                            className="terms-continue-button mt-6 w-full rounded-full bg-[#2B2926] py-3 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isLoading ? 'Please wait...' : 'Continue to Choose Plan'}
                        </button>

                    </div>
                </section>

            </main>

            <Footer />

        </div>
    )
}

export default SellerTerms