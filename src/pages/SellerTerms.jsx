import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import { acceptSellerTerms } from '../services/api'



function SellerTerms() {
    const navigate=useNavigate()

    const [accepted,setAccepted]=useState(false)

    const handleContinue = async () => {
    if (!accepted) return

    try {
        const response = await acceptSellerTerms()

        if (response.data.success) {
            navigate('/sellerPlans')
        }
    } catch (error) {
        console.error('Terms acceptance failed:', error)
        alert(error.response?.data?.message || 'Failed to accept terms')
    }
}
  return (
    <div>
        <Navbar/>
        <main>
            <section className="px-5 py-14 sm:px-8 md:py-16">
    <div className="mx-auto max-w-4xl text-center">

        <p className="mb-3 text-[10px] uppercase tracking-[3px] text-gray-500">
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
<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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
<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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

<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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

<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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

<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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

<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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

<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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

<section className="px-5 pb-8 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

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
<section className="px-5 pb-16 sm:px-8">
    <div className="mx-auto max-w-4xl rounded-2xl border border-[#D8CFC2] bg-white p-6 sm:p-8">

        <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
            <input
                type="checkbox"
                checked={accepted}
                onChange={(e)=>setAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#2B2926]"
            />

            <span>
                I have read and agree to the VELAURA Seller Terms &
                Conditions, including the 10% commission and subscription
                charges.
            </span>
        </label>

        <button
    type="button"
    disabled={!accepted}
    onClick={handleContinue}
    className="mt-6 w-full rounded-full bg-[#2B2926] py-3 text-sm text-white transition hover:bg-[#49443F] disabled:cursor-not-allowed disabled:opacity-40"
>
    Continue to Choose Plan
</button>

    </div>
</section>
        </main>
        <Footer/>

    </div>
  )
}

export default SellerTerms