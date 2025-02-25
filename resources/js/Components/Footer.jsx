import React from 'react'
import { FaFacebook, FaLine, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className="w-full bg-footercolor py-6 px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Logo */}
        <div className="lg:col-span-2 flex justify-center">
          <h1 className='text-white text-2xl md:text-3xl font-bold font-inter italic cursor-pointer'>
            Makinnumgun
          </h1>
        </div>

        {/* Help Center */}
        <div className="space-y-4">
          <h1 className='text-white text-xl md:text-2xl font-bold font-inter italic cursor-pointer'>
            Help Center
          </h1>
          <ul className='text-gray-600 text-lg md:text-xl font-bold font-inter italic space-y-2'>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Facebook</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Line</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Instagram</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>X</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Github</li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-4">
          <h1 className='text-white text-xl md:text-2xl font-bold font-inter italic cursor-pointer'>
            LEGAL
          </h1>
          <ul className='text-gray-600 text-lg md:text-xl font-bold font-inter italic space-y-2'>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Privacy Policy</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Licensing</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Terms & Conditions</li>
          </ul>
        </div>

        {/* Category */}
        <div className="space-y-4">
          <h1 className='text-white text-xl md:text-2xl font-bold font-inter italic cursor-pointer'>
            Category
          </h1>
          <ul className='text-gray-600 text-lg md:text-xl font-bold font-inter italic space-y-2'>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>General Food</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Dessert Food</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Healthy Food</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Fast Food</li>
            <li className='cursor-pointer hover:text-amber-500 w-fit'>Beverages</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full flex justify-center items-center mt-8">
        <div className="w-full">
          <hr className='border-t-1 my-5' />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h6 className='text-white font-bold italic text-sm md:text-base text-center md:text-left'>
              @ 2025 Makinnumgan . All Rights Reserved.
            </h6>
            <div className="flex space-x-4 md:space-x-8">
              <FaFacebook className="text-white text-2xl md:text-4xl cursor-pointer hover:text-amber-500" />
              <FaLine className="text-white text-2xl md:text-4xl cursor-pointer hover:text-amber-500" />
              <FaInstagram className="text-white text-2xl md:text-4xl cursor-pointer hover:text-amber-500" />
              <FaTwitter className="text-white text-2xl md:text-4xl cursor-pointer hover:text-amber-500" />
              <FaGithub className="text-white text-2xl md:text-4xl cursor-pointer hover:text-amber-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
