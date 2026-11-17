import React from 'react'
import Navbar from '../components/Navbar'
import accesorImg from '../assets/bannere.jpeg'
import Footer from '../components/Footer'

function About() {
    return (
        <div className="bg-[#F5F0E8] animate-about-page">

            <Navbar />

            {/* About Us Section */}
            <div className="bg-orange-50 max-w-2xl mx-auto mt-10 p-8 border rounded-2xl shadow-md animate-about-card">

                <h1 className="text-6xl font-extrabold text-red-300 text-center mb-4 animate-about-title">
                    About Us
                </h1>

                <p className="font-extralight animate-about-text">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias quisquam necessitatibus iste omnis eius? Sequi magnam ab sapiente sed asperiores velit voluptate. Rerum voluptatibus aperiam minus? Alias fugit ratione quasi.
                </p>

            </div>

            {/* VELAURA Section */}
            <div className="lg:grid grid-cols-2 bg-orange-50 p-10 mt-10">

                {/* Image */}
                <div className="about-image-wrapper mt-10 overflow-hidden rounded-lg">

                    <img
                        src={accesorImg}
                        alt=""
                        className="max-h-70w-full w-full object-fill rounded-lg animate-about-image"
                    />

                </div>

                {/* Content */}
                <div className="ml-4 mb-10 animate-about-content">

                    <h1 className="text-center text-3xl font-extralight mt-10 mb-10 animate-velaura-title">
                        VELAURA.
                    </h1>

                    <p className="animate-velaura-text">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis, incidunt officia officiis vitae neque facer
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste obcaecati aut neque similique inventore unde necessitatibus recusandae fugit dignissimos asperiores explicabo nesciunt quaerat, temporibus porro alias. Quibusdam exercitationem labore corrupti.
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem assumenda sapiente accusamus vero libero consequuntur aliquam asperiores! Sed voluptatum mollitia enim perspiciatis eos. Itaque eos quasi corrupti totam provident esse.
                    </p>

                </div>

            </div>

            <Footer />

            {/* About Page Animations */}
            <style>{`

                @keyframes aboutPageEntrance {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes aboutCardEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes aboutTitleEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes aboutImageEntrance {
                    from {
                        opacity: 0;
                        transform: scale(1.06);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes aboutContentEntrance {
                    from {
                        opacity: 0;
                        transform: translateX(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes aboutTextEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-about-page {
                    animation: aboutPageEntrance 0.7s ease-out both;
                }

                .animate-about-card {
                    animation: aboutCardEntrance 0.8s ease-out both;
                }

                .animate-about-title {
                    animation: aboutTitleEntrance 0.7s ease-out both;
                    animation-delay: 0.15s;
                }

                .animate-about-text {
                    animation: aboutTextEntrance 0.8s ease-out both;
                    animation-delay: 0.3s;
                }

                .about-image-wrapper {
                    animation: aboutCardEntrance 0.9s ease-out both;
                    animation-delay: 0.2s;
                }

                .animate-about-image {
                    animation: aboutImageEntrance 1.2s ease-out both;
                    transition: transform 0.8s ease;
                }

                .about-image-wrapper:hover .animate-about-image {
                    transform: scale(1.04);
                }

                .animate-about-content {
                    animation: aboutContentEntrance 0.9s ease-out both;
                    animation-delay: 0.3s;
                }

                .animate-velaura-title {
                    animation: aboutTitleEntrance 0.7s ease-out both;
                    animation-delay: 0.45s;
                }

                .animate-velaura-text {
                    animation: aboutTextEntrance 0.9s ease-out both;
                    animation-delay: 0.55s;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-about-page,
                    .animate-about-card,
                    .animate-about-title,
                    .animate-about-text,
                    .about-image-wrapper,
                    .animate-about-image,
                    .animate-about-content,
                    .animate-velaura-title,
                    .animate-velaura-text {
                        animation: none !important;
                        transition: none !important;
                    }
                }

            `}</style>

        </div>
    )
}

export default About