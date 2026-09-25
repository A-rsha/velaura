
import React, { useEffect, useState } from "react";
import PaymentButton from "../components/paymentButton";
import {
    FiArrowLeft,
    FiCheck,
    FiCreditCard,
    FiSmartphone,
    FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import API from "../services/axios";

function Payments() {

    const  [cart,setCart]=useState(null)
    const [totalAmount,setTotalAmount]=useState(0)
    const navigate =useNavigate()

    const [selectedMethod, setSelectedMethod] = useState("UPI");

    const paymentMethods = [
        {
            name: "UPI",
            icon: <FiSmartphone />,
            desc: "Google Pay, PhonePe",
        },
        {
            name: "Card",
            icon: <FiCreditCard />,
            desc: "Visa & MasterCard",
        },
        {
            name: "NetBanking",
            icon: <FiShield />,
            desc: "All Indian Banks",
        },
    ];

 useEffect(()=>{
    const fetchCart=async()=>{
        try {
            const res =await API.get('/cart/getCart')
            console.log("CAT RESPONSE:",res.data)
            const cartData =res.data.cart

            setCart(cartData)
            const total =cartData.items.reduce(
                (total,item)=>total + item.price * item.quantity,0
            )
            setTotalAmount(total)
        } catch (error) {
        console.log("CART ERROR:",error)      
        }
    }
    fetchCart()
 },[])

    return (
        <div className="min-h-screen bg-red-50 py-16 px-4">

            <div className="max-w-4xl mx-auto">

                
                <button className="flex items-center gap-2 mb-5 text-gray-600 hover:text-black"
                onClick={()=> navigate(-1)}>
                    <FiArrowLeft />
                    Back
                </button>

                <div className="bg-white rounded-md border overflow-hidden grid lg:grid-cols-[1fr_350px]">

                    <div className="p-6 md:p-8">

                        <div className="mb-7">
                            <p className="text-sm font-bold mb-2 text-gray-500">
                                Payment
                            </p>

                            <h1 className="text-2xl font-bold text-black">
                                Complete Your Payment
                            </h1>

                            <p className="text-gray-500 text-sm mt-2">
                                Select your preferred payment method.
                            </p>
                        </div>

                       
                        <div className="space-y-3">

                            {paymentMethods.map((method) => (

                                <button
                                    key={method.name}
                                    onClick={() => setSelectedMethod(method.name)}
                                    className={`w-full flex items-center gap-4 p-4 border rounded-lg text-left transition ${
                                        selectedMethod === method.name
                                            ? "border-black bg-gray-50"
                                            : "border-gray-200 hover:border-gray-400"
                                    }`}
                                >

                                   
                                    <div className="text-xl">
                                        {method.icon}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {method.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {method.desc}
                                        </p>
                                    </div>

                                    {selectedMethod === method.name && (
                                        <FiCheck className="text-green-600 text-xl" />
                                    )}

                                </button>

                            ))}


                        </div>

                        

             
                       <PaymentButton/>

                    </div>

                 
                    <div className="bg-gray-50 p-6 md:p-8 border-l">

                        <h2 className="font-bold text-lg mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span>
                                    ₹{totalAmount}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Shipping
                                </span>

                                <span>
                                    Free
                                </span>
                            </div>

                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>

                                <span>
                                     ₹{totalAmount}
                                </span>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Payments;

