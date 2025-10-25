import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from "../../public/images/logo.png";

const Footer = () => (
  <footer className="bg-midnightBlue text-white py-12">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-2">
        <Image 
          src={Logo} 
          alt="GANU Professional Services" 
          width={160} 
          height={50}
          className="h-12 w-auto mb-4"
        />
        <p className="text-gray-300 max-w-md">
          Your partner in HR excellence. We provide comprehensive professional services to help your business thrive.
        </p>
        <div className="flex gap-4 mt-6">
          <a href="#" className="text-gray-300 hover:text-desertSun transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-300 hover:text-desertSun transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
            </svg>
          </a>
          <a href="#" className="text-gray-300 hover:text-desertSun transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.033 10.033 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
            </svg>
          </a>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><Link href="/" className="text-gray-300 hover:text-desertSun transition-colors">Home</Link></li>
          <li><Link href="/about" className="text-gray-300 hover:text-desertSun transition-colors">About Us</Link></li>
          <li><Link href="/solutions" className="text-gray-300 hover:text-desertSun transition-colors">Solutions</Link></li>
          <li><Link href="/events" className="text-gray-300 hover:text-desertSun transition-colors">Events</Link></li>
          <li><Link href="/contact" className="text-gray-300 hover:text-desertSun transition-colors">Contact</Link></li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-4">Contact Info</h3>
        <address className="text-gray-300 not-italic">
          <p>No. 94/6,</p>
          <p>Hokandara East,</p>
          <p>Hokandara, Sri Lanka, 10118</p>
          <p className="mt-4 mb-4">service@ganuprofessional.lk</p>
          <p>+94 11 2563944</p>
        </address>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-gray-700 text-center text-gray-400">
      <p>© {new Date().getFullYear()} GANU Professional Services. All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;