import React from 'react'
import { FiTruck, FiShield, FiGift, FiRefreshCw } from 'react-icons/fi'
import ScrollReveal from './ScrollReveal'

function ShoppingBenefits() {
    const benefits = [
        {
            icon: <FiTruck />,
            title: 'Free Shipping',
            description: 'On eligible orders',
        },
        {
            icon: <FiShield />,
            title: 'Secure Checkout',
            description: 'Safe payment experience',
        },
        {
            icon: <FiGift />,
            title: 'Thoughtful Gifting',
            description: 'Gifts for every occasion',
        },
        {
            icon: <FiRefreshCw />,
            title: 'Easy Returns',
            description: 'Shop with confidence',
        },
    ]

    return (
        <section className="shopping-benefits border-y border-[#E8DFD3] bg-[#F5F0E8] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 md:gap-6">

                {benefits.map((benefit, index) => (

                     <ScrollReveal
        key={benefit._id}
        direction="up"
        delay={index * 150}
        duration={700}
        once={false}
    >
                    <div
                        key={index}
                        style={{ '--delay': `${index * 150}ms` }}
                        className="benefit-item group flex cursor-default items-center justify-center gap-3 rounded-xl text-center md:justify-start"
                    >
                        <div className="benefit-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D9C8B2] bg-white text-xl text-[#9A7958]">
                            {benefit.icon}
                        </div>

                        <div className="benefit-content text-left">
                            <h3 className="text-sm font-semibold text-[#2B2926] transition-colors duration-300 group-hover:text-[#9A7958] sm:text-base">
                                {benefit.title}
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-[#77716A] transition-colors duration-300 group-hover:text-[#51483F] sm:text-sm">
                                {benefit.description}
                            </p>
                        </div>
                    </div>

                     </ScrollReveal>
        
                ))}

            </div>

            <style>{`
                .benefit-item {
                    opacity: 0;
                    animation: benefitEntrance 0.7s ease forwards;
                    animation-delay: var(--delay);
                    transition: transform 0.35s ease;
                }

                .benefit-item:hover {
                    transform: translateY(-5px);
                }

                .benefit-icon {
                    transition:
                        transform 0.4s ease,
                        background-color 0.4s ease,
                        color 0.4s ease,
                        border-color 0.4s ease,
                        box-shadow 0.4s ease;
                }

                .benefit-item:hover .benefit-icon {
                    transform: scale(1.12) rotate(-8deg);
                    background-color: #9A7958;
                    color: #ffffff;
                    border-color: #9A7958;
                    box-shadow: 0 8px 18px rgba(154, 121, 88, 0.2);
                }

                .benefit-content {
                    transition: transform 0.35s ease;
                }

                .benefit-item:hover .benefit-content {
                    transform: translateX(3px);
                }

                @keyframes benefitEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .benefit-item {
                        opacity: 1;
                        animation: none;
                        transition: none;
                    }

                    .benefit-icon,
                    .benefit-content {
                        transition: none;
                    }
                }
            `}</style>
        </section>
    )
}

export default ShoppingBenefits