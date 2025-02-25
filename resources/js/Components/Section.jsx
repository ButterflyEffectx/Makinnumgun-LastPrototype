import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import food1 from './images/Group1.png'
import food2 from './images/Group2.png'
import food3 from './images/Group3.png'
import food4 from './images/Group4.png'
import food5 from './images/Group6.png'
import minifood1 from './images/minifood1.png'
import minifood2 from './images/minifood2.png'
import minifood3 from './images/minifood3.png'
import minifood4 from './images/minifood4.png'
import minifood5 from './images/minifood5.png'
import minifood6 from './images/minifood6.png'
import minifood7 from './images/minifood7.png'
import minifood8 from './images/minifood8.png'
import minifood9 from './images/minifood9.png'
import minifood10 from './images/minifood10.png'
import minifood11 from './images/minifood11.png'
import minifood12 from './images/minifood12.png'
import minifood13 from './images/minifood13.png'
import minifood14 from './images/minifood14.png'
import minifood15 from './images/minifood15.png'

function Section() {
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
    };

    const slideFromLeft = {
        hidden: { x: -100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.8 } }
    };

    const slideFromRight = {
        hidden: { x: 100, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.8 } }
    };

    const slideFromBottom = {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    };

    const scaleUp = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
    };



    const staggerChildren = {
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };
    return (
        <>
            <div className="bg-black">
                {/* GENERAL FOOD - Diagonal Layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full h-auto md:h-[733px]"
                    style={{
                        background: 'radial-gradient(circle, #FDF400 0%, #929C00 70%)'
                    }}
                >
                    <div className="container mx-auto w-full h-full px-4 py-8 md:py-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 md:gap-0">
                            <motion.div
                                variants={slideFromLeft}
                                className="flex flex-col justify-center items-center md:items-start order-2 md:order-1"
                            >
                                <motion.h1
                                    variants={fadeIn}
                                    className="text-5xl md:text-[96px] font-inter italic font-bold text-white text-center md:text-left"
                                >
                                    GENERAL <br /> FOOD
                                </motion.h1>
                                <motion.p
                                    variants={fadeIn}
                                    className="text-lg md:text-[20px] font-inter italic font-bold text-white text-center md:text-left mt-4 md:mt-0"
                                >
                                    General food refers to meals that are commonly consumed in daily life...
                                </motion.p>
                                <motion.div
                                    className="py-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button className="bg-btncolor text-[20px] text-white font-inter font-bold italic flex items-center gap-x-1 py-2 px-4 rounded-lg">
                                        View menu
                                        <div className="relative w-[32px] h-[27px]">
                                            <ArrowRightIcon className="absolute w-[32px] h-[27px] text-white" />
                                        </div>
                                    </button>
                                </motion.div>
                                <motion.div
                                    variants={slideFromBottom}
                                    className="w-full mt-8"
                                >
                                    <h2 className="text-xl md:text-[24px] font-inter font-bold italic text-center text-white mb-6">
                                        Recommended menu
                                    </h2>
                                    <div className="flex flex-col md:flex-row justify-evenly items-center gap-6 md:gap-4">
                                        {[minifood1, minifood2, minifood3].map((food, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex flex-col items-center w-full md:w-auto"
                                                whileHover={{
                                                    y: -10,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <div className="bg-white/10 rounded-lg p-4 w-full md:w-[200px] h-[160px] flex items-center justify-center">
                                                    <img
                                                        src={food}
                                                        alt="general-item"
                                                        className="w-auto h-auto max-w-[150px] max-h-[130px]"
                                                    />
                                                </div>
                                                <p className="text-xl md:text-[24px] font-bold italic font-inter text-white mt-2">
                                                    name
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                variants={slideFromRight}
                                className="flex justify-center items-center order-1 md:order-2"
                            >
                                <motion.img
                                    src={food1}
                                    alt="general-food"
                                    className=" w-full md:w-[644px] md:h-[609px] drop-shadow-xl"
                                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* DESSERT FOOD - Circular Layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full h-auto md:h-[733px]"
                    style={{
                        background: 'radial-gradient(circle, #F200DA 0%, #8C007E 70%)'
                    }}
                >
                    <div className="container mx-auto w-full h-full px-4 py-8 md:py-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 md:gap-0">
                            <motion.div
                                variants={slideFromLeft}
                                className="flex justify-center items-center order-2 md:order-1"
                            >
                                <motion.img
                                    src={food2}
                                    alt="dessert-food"
                                    className="w-full md:w-[644px] md:h-[609px] drop-shadow-xl"
                                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                />
                            </motion.div>
                            <motion.div
                                variants={slideFromRight}
                                className="flex flex-col justify-center items-center md:items-end order-1 md:order-2"
                            >
                                <motion.h1
                                    variants={fadeIn}
                                    className="text-5xl md:text-[96px] font-inter italic font-bold text-white text-center md:text-end"
                                >
                                    DESSERT <br /> FOOD
                                </motion.h1>
                                <motion.p
                                    variants={fadeIn}
                                    className="text-lg md:text-[20px] font-inter italic font-bold text-white text-center md:text-end mt-4 md:mt-0"
                                >
                                    Sweet delights and treats that bring joy to every meal...
                                </motion.p>
                                <motion.div
                                    className="py-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button className="bg-btncolor text-[20px] text-white font-inter font-bold italic flex items-center gap-x-1 py-2 px-4 rounded-lg">
                                        <div className="relative w-[32px] h-[27px]">
                                            <ArrowLeftIcon className="absolute w-[32px] h-[27px] text-white" />
                                        </div>
                                        View menu
                                    </button>
                                </motion.div>
                                <motion.div
                                    variants={slideFromBottom}
                                    className="w-full mt-8"
                                >
                                    <h2 className="text-xl md:text-[24px] font-inter font-bold italic text-center text-white mb-6">
                                        Recommended menu
                                    </h2>
                                    <div className="flex flex-col md:flex-row justify-evenly items-center gap-6 md:gap-4">
                                        {[minifood4, minifood5, minifood6].map((food, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex flex-col items-center w-full md:w-auto"
                                                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                            >
                                                <div className="bg-white/10 rounded-lg p-4 w-full md:w-[200px] h-[160px] flex items-center justify-center">
                                                    <img
                                                        src={food}
                                                        alt="dessert-item"
                                                        className="w-auto h-auto max-w-[150px] max-h-[130px]"
                                                    />
                                                </div>
                                                <p className="text-xl md:text-[24px] font-bold italic font-inter text-white mt-2">
                                                    name
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* HEALTHY FOOD - Grid Layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full h-auto md:h-[733px]"
                    style={{
                        background: 'radial-gradient(circle, #2EDF4E 0%, #19792A 70%)'
                    }}
                >
                    <div className="container mx-auto w-full h-full px-4 py-8 md:py-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 md:gap-0">
                            <motion.div
                                variants={slideFromLeft}
                                className="flex flex-col justify-center items-center md:items-start order-2 md:order-1"
                            >
                                <motion.h1
                                    variants={fadeIn}
                                    className="text-5xl md:text-[96px] font-inter italic font-bold text-white text-center md:text-left"
                                >
                                    HEALTHY <br /> FOOD
                                </motion.h1>
                                <motion.p
                                    variants={fadeIn}
                                    className="text-lg md:text-[20px] font-inter italic font-bold text-white text-center md:text-left mt-4 md:mt-0"
                                >
                                    Nutritious and delicious meals for a balanced lifestyle...
                                </motion.p>
                                <motion.div
                                    className="py-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button className="bg-btncolor text-[20px] text-white font-inter font-bold italic flex items-center gap-x-1 py-2 px-4 rounded-lg">
                                        View menu
                                        <div className="relative w-[32px] h-[27px]">
                                            <ArrowRightIcon className="absolute w-[32px] h-[27px] text-white" />
                                        </div>
                                    </button>
                                </motion.div>
                                <motion.div
                                    variants={slideFromBottom}
                                    className="w-full mt-8"
                                >
                                    <h2 className="text-xl md:text-[24px] font-inter font-bold italic text-center text-white mb-6">
                                        Recommended menu
                                    </h2>
                                    <div className="flex flex-col md:flex-row justify-evenly items-center gap-6 md:gap-4">
                                        {[minifood7, minifood8, minifood9].map((food, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex flex-col items-center w-full md:w-auto"
                                                whileHover={{
                                                    scale: 1.05,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <div className="bg-white/10 rounded-lg p-4 w-full md:w-[200px] h-[160px] flex items-center justify-center">
                                                    <img
                                                        src={food}
                                                        alt="healthy-item"
                                                        className="w-auto h-auto max-w-[150px] max-h-[130px]"
                                                    />
                                                </div>
                                                <p className="text-xl md:text-[24px] font-bold italic font-inter text-white mt-2">
                                                    name
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                variants={slideFromRight}
                                className="flex justify-center items-center order-1 md:order-2"
                            >
                                <motion.img
                                    src={food3}
                                    alt="healthy-food"
                                    className="w-full md:w-[623px] md:h-[655px] drop-shadow-xl"
                                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* FAST FOOD */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full h-auto md:h-[733px]"
                    style={{
                        background: 'radial-gradient(circle, #FF4D00 0%, #992E00 70%)'
                    }}
                >
                    <div className="container mx-auto w-full h-full px-4 py-8 md:py-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 md:gap-0">
                            <motion.div
                                variants={slideFromLeft}
                                className="flex justify-center items-center order-2 md:order-1"
                            >
                                <motion.img
                                    src={food4}
                                    alt="fast-food"
                                    className="w-full md:w-[616px] md:h-[484px] drop-shadow-xl"
                                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                />
                            </motion.div>
                            <motion.div
                                variants={slideFromRight}
                                className="flex flex-col justify-center items-center md:items-end order-1 md:order-2"
                            >
                                <motion.h1
                                    variants={fadeIn}
                                    className="text-5xl md:text-[96px] font-inter italic font-bold text-white text-center md:text-end"
                                >
                                    <span className="tracking-wider">F A S T</span> <br /> FOOD
                                </motion.h1>
                                <motion.p
                                    variants={fadeIn}
                                    className="text-lg md:text-[20px] font-inter italic font-bold text-white text-center md:text-end mt-4 md:mt-0"
                                >
                                    Quick, satisfying meals for people on the go...
                                </motion.p>
                                <motion.div
                                    className="py-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button className="bg-btncolor text-[20px] text-white font-inter font-bold italic flex items-center gap-x-1 py-2 px-4 rounded-lg">
                                        <div className="relative w-[32px] h-[27px]">
                                            <ArrowLeftIcon className="absolute w-[32px] h-[27px] text-white" />
                                        </div>
                                        View menu
                                    </button>
                                </motion.div>
                                <motion.div
                                    variants={slideFromBottom}
                                    className="w-full mt-8"
                                >
                                    <h2 className="text-xl md:text-[24px] font-inter font-bold italic text-center text-white mb-6">
                                        Recommended menu
                                    </h2>
                                    <div className="flex flex-col md:flex-row justify-evenly items-center gap-6 md:gap-4">
                                        {[minifood10, minifood11, minifood12].map((food, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex flex-col items-center w-full md:w-auto"
                                                whileHover={{
                                                    y: -10,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <div className="bg-white/10 rounded-lg p-4 w-full md:w-[200px] h-[160px] flex items-center justify-center">
                                                    <img
                                                        src={food}
                                                        alt="fast-food-item"
                                                        className="w-auto h-auto max-w-[150px] max-h-[130px]"
                                                    />
                                                </div>
                                                <p className="text-xl md:text-[24px] font-bold italic font-inter text-white mt-2">
                                                    name
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* BEVERAGES */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full h-auto md:h-[733px]"
                    style={{
                        background: 'radial-gradient(circle, #34BED7 0%, #175661 70%)'
                    }}
                >
                    <div className="container mx-auto w-full h-full px-4 py-8 md:py-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 md:gap-0">
                            <motion.div
                                variants={slideFromLeft}
                                className="flex flex-col justify-center items-center md:items-start order-2 md:order-1"
                            >
                                <motion.h1
                                    variants={fadeIn}
                                    className="text-5xl md:text-[96px] font-inter italic font-bold text-white text-center md:text-left"
                                >
                                    BEVERAGES <br />
                                </motion.h1>
                                <motion.p
                                    variants={fadeIn}
                                    className="text-lg md:text-[20px] font-inter italic font-bold text-white text-center md:text-left mt-4 md:mt-0 pt-12"
                                >
                                    Refreshing drinks and beverages to complement your meals...
                                </motion.p>
                                <motion.div
                                    className="py-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <button className="bg-btncolor text-[20px] text-white font-inter font-bold italic flex items-center gap-x-1 py-2 px-4 rounded-lg">
                                        View menu
                                        <div className="relative w-[32px] h-[27px]">
                                            <ArrowRightIcon className="absolute w-[32px] h-[27px] text-white" />
                                        </div>
                                    </button>
                                </motion.div>
                                <motion.div
                                    variants={slideFromBottom}
                                    className="w-full mt-8"
                                >
                                    <h2 className="text-xl md:text-[24px] font-inter font-bold italic text-center text-white mb-6">
                                        Recommended menu
                                    </h2>
                                    <div className="flex flex-col md:flex-row justify-evenly items-center gap-6 md:gap-4">
                                        {[minifood13, minifood14, minifood15].map((food, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex flex-col items-center w-full md:w-auto"
                                                whileHover={{
                                                    y: -10,
                                                    transition: { duration: 0.2 }
                                                }}
                                            >
                                                <div className="bg-white/10 rounded-lg p-4 w-full md:w-[200px] h-[160px] flex items-center justify-center">
                                                    <img
                                                        src={food}
                                                        alt="beverage-item"
                                                        className="w-auto h-auto max-w-[150px] max-h-[130px]"
                                                    />
                                                </div>
                                                <p className="text-xl md:text-[24px] font-bold italic font-inter text-white mt-2">
                                                    name
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                variants={slideFromRight}
                                className="flex justify-center items-center order-1 md:order-2"
                            >
                                <motion.img
                                    src={food5}
                                    alt="beverages"
                                    className="w-full md:w-[584px] md:h-[620px] drop-shadow-xl"
                                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                                />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

export default Section
