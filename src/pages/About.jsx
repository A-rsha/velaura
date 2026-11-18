import React from 'react'
import Navbar from '../components/Navbar'
import accesorImg from '../assets/bannere.jpeg'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'

function About() {
    return (
        <div className="bg-[#F5F0E8]">

            <Navbar />

            {/* About Us Section */}

            <ScrollReveal
                direction="up"
                duration={850}
                once={false}
            >

                <div className="bg-orange-50 max-w-2xl mx-auto mt-10 p-8 border rounded-2xl shadow-md about-card">

                    <ScrollReveal
                        direction="down"
                        delay={150}
                        duration={750}
                        once={false}
                    >

                        <h1 className="text-6xl font-extrabold text-red-300 text-center mb-4 about-title">
                            About Us
                        </h1>

                    </ScrollReveal>

                    <ScrollReveal
                        direction="up"
                        delay={300}
                        duration={850}
                        once={false}
                    >

                        <p className="font-extralight about-text">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias quisquam necessitatibus iste omnis eius? Sequi magnam ab sapiente sed asperiores velit voluptate. Rerum voluptatibus aperiam minus? Alias fugit ratione quasi.
                        </p>

                    </ScrollReveal>

                </div>

            </ScrollReveal>


            {/* VELAURA Section */}

            <div className="lg:grid grid-cols-2 bg-orange-50 p-10 mt-10">

                {/* Image - Zoom Reveal */}

                <ScrollReveal
                    direction="left"
                    duration={1000}
                    once={false}
                >

                    <div className="about-image-wrapper mt-10 overflow-hidden rounded-lg">

                        <img
                            src={accesorImg}
                            alt="Velaura Accessories"
                            className="
                                w-full
                                object-fill
                                rounded-lg
                                about-image
                            "
                        />

                    </div>

                </ScrollReveal>


                {/* Content */}

                <div className="ml-4 mb-10">

                    {/* VELAURA Heading */}

                    <ScrollReveal
                        direction="right"
                        delay={150}
                        duration={850}
                        once={false}
                    >

                        <h1 className="text-center text-3xl font-extralight mt-10 mb-10 about-velaura-title">
                            VELAURA.
                        </h1>

                    </ScrollReveal>


                    {/* Description */}

                    <ScrollReveal
                        direction="up"
                        delay={300}
                        duration={900}
                        once={false}
                    >

                        <p className="about-velaura-text">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis, incidunt officia officiis vitae neque facer
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste obcaecati aut neque similique inventore unde necessitatibus recusandae fugit dignissimos asperiores explicabo nesciunt quaerat, temporibus porro alias. Quibusdam exercitationem labore corrupti.
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem assumenda sapiente accusamus vero libero consequuntur aliquam asperiores! Sed voluptatum mollitia enim perspiciatis eos. Itaque eos quasi corrupti totam provident esse.
                        </p>

                    </ScrollReveal>

                </div>

            </div>


            <Footer />


            {/* About Page Hover Animations */}

            <style>{`

                .about-image {
                    transition: transform 1s ease;
                }

                .about-image-wrapper:hover .about-image {
                    transform: scale(1.05);
                }

                .about-card {
                    transition: box-shadow 0.4s ease;
                }

                .about-card:hover {
                    box-shadow: 0 15px 35px rgba(43, 41, 38, 0.10);
                }

                .about-title,
                .about-velaura-title {
                    transition: color 0.4s ease;
                }

                .about-title:hover {
                    color: #9A7958;
                }

                @media (prefers-reduced-motion: reduce) {

                    .about-image,
                    .about-card,
                    .about-title,
                    .about-velaura-title {
                        transition: none !important;
                    }

                }

            `}</style>

        </div>
    )
}

export default About