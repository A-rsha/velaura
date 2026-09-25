import React from 'react'
import Navbar from '../components/Navbar'
import accesorImg from '../assets/bannere.jpeg'
import Footer from '../components/Footer'


function About() {
    return (
        <div>
            <Navbar />
            <div className='bg-orange-50 max-w-2xl mx-auto mt-10 p-8 border rounded-2xl  shadow-md '>
                <h1 className='text-6xl font-extrabold text-red-300 text-center mb-4 '>About Us</h1>
                <p className='font-extralight'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias quisquam necessitatibus iste omnis eius? Sequi magnam ab sapiente sed asperiores velit voluptate. Rerum voluptatibus aperiam minus? Alias fugit ratione quasi.
                </p>
            </div>
            <div className= ' lg:grid grid-cols-2 bg-orange-50 p-10 mt-10 '>
                <img src={accesorImg} alt="" className='max-h-70w-full object-fill mt-10 rounded-lg '/>

                <div className='ml-4 mb-10'>
                    <h1 className='text-center text-3xl font-extralight mt-10 mb-10'>VELAURA.</h1>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Reiciendis, incidunt officia officiis vitae neque facer
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste obcaecati aut neque similique inventore unde necessitatibus recusandae fugit dignissimos asperiores explicabo nesciunt quaerat, temporibus porro alias. Quibusdam exercitationem labore corrupti.
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem assumenda sapiente accusamus vero libero consequuntur aliquam asperiores! Sed voluptatum mollitia enim perspiciatis eos. Itaque eos quasi corrupti totam provident esse.

                    </p>
                </div>

            </div>
            <Footer/>

        </div>
    )
}

export default About