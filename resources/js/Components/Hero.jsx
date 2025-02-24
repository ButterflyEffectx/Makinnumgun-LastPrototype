import React from 'react'
import bg from './images/bg.jpg'
import { motion } from 'framer-motion'

function Hero() {
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(${bg})`,
                    minHeight: '100vh'
                }}
                className='bg-cover bg-center w-full h-[300px] md:h-[600px] lg:h-[978px]'
            >
                <div className="w-full h-full md:h-full flex flex-col justify-center items-center p-4 md:p-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col justify-center items-center">
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-white text-3xl md:text-5xl lg:text-6xl font-inter font-bold italic text-center"
                            >
                                <h1>WELCOME TO <br /> WEBSITE MAKINNUMGUN</h1>
                            </motion.div>

                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "50%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="w-full flex justify-center items-center my-4"
                            >
                                <hr className='w-full border-t-4 border-gray-500' />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 1 }}
                                className="text-white text-base md:text-xl lg:text-2xl font-inter font-bold italic text-center w-full md:w-3/4 lg:w-1/2"
                            >
                                <h3>Welcome to a website that lets you freely choose delicious meals with an automatic calorie calculator, helping you track your intake, plan your meals.</h3>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        className="pt-8 md:pt-12 flex flex-col md:flex-row gap-4 md:gap-x-16 text-lg md:text-2xl text-white"
                    >
                        <button className="bg-amber-500 py-2 px-6 rounded-3xl w-[180px] h-[60px] text-center font-semibold transition-colors duration-300 hover:bg-black hover:text-amber-500">
                            JOIN US
                        </button>
                        <button className="bg-amber-500 py-2 px-6 rounded-3xl w-[180px] h-[60px] text-center font-semibold transition-colors duration-300 hover:bg-black hover:text-amber-500">
                            TDEE CAL
                        </button>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default Hero
