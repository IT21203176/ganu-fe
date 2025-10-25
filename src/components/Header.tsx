"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from "../../public/images/logo.png";

const Header = () => {
  const [isSolutionsOpen, setSolutionsOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-midnightBlue text-white fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <Image 
            src={Logo} 
            alt="GANU Professional Services" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-desertSun transition-colors font-medium">Home</Link>
          <Link href="/about-us" className="hover:text-desertSun transition-colors font-medium">About Us</Link>
          
          <div className="relative">
            <button 
              onClick={() => setSolutionsOpen(!isSolutionsOpen)}
              onMouseEnter={() => setSolutionsOpen(true)}
              className="hover:text-desertSun transition-colors flex items-center font-medium"
            >
              Solutions
              <svg className={`ml-2 w-4 h-4 transition-transform ${isSolutionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSolutionsOpen && (
              <div 
                className="absolute top-full mt-3 bg-navyBlue border-2 border-desertSun/30 rounded-xl shadow-2xl py-4 w-64"
                onMouseEnter={() => setSolutionsOpen(true)}
                onMouseLeave={() => setSolutionsOpen(false)}
              >
                <div className="space-y-1 mt-2">
                  <Link 
                    href="/solutions/hr" 
                    className="flex items-center px-4 py-3 hover:bg-desertSun/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-burntOrange rounded-lg flex items-center justify-center mr-3 group-hover:bg-desertSun transition-colors">
                      <svg className="w-4 h-4 text-navyBlue group-hover:text-midnightBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-[#c4d5e2] font-medium group-hover:text-desertSun transition-colors">HR Solutions</span>
                  </Link>
                  
                  <Link 
                    href="/solutions/finance" 
                    className="flex items-center px-4 py-3 hover:bg-desertSun/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-burntOrange rounded-lg flex items-center justify-center mr-3 group-hover:bg-desertSun transition-colors">
                      <svg className="w-4 h-4 text-navyBlue group-hover:text-midnightBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[#c4d5e2] font-medium group-hover:text-desertSun transition-colors">Finance Solutions</span>
                  </Link>
                  
                  <Link 
                    href="/solutions/secretariat" 
                    className="flex items-center px-4 py-3 hover:bg-desertSun/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-burntOrange rounded-lg flex items-center justify-center mr-3 group-hover:bg-desertSun transition-colors">
                      <svg className="w-4 h-4 text-navyBlue group-hover:text-midnightBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                      </svg>
                    </div>
                    <span className="text-[#c4d5e2] font-medium group-hover:text-desertSun transition-colors">Secretariat Solutions</span>
                  </Link>
                  
                  <Link 
                    href="/solutions/gas" 
                    className="flex items-center px-4 py-3 hover:bg-desertSun/10 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-burntOrange rounded-lg flex items-center justify-center mr-3 group-hover:bg-desertSun transition-colors">
                      <svg className="w-4 h-4 text-navyBlue group-hover:text-midnightBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                    <span className="text-[#c4d5e2] font-medium group-hover:text-desertSun transition-colors">General Administration</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/events" className="hover:text-desertSun transition-colors font-medium">Events</Link>
          <Link href="/blogs" className="hover:text-desertSun transition-colors font-medium">Blogs</Link>
          <Link href="/careers" className="hover:text-desertSun transition-colors font-medium">Careers</Link>
          <Link href="/contact" className="hover:text-desertSun transition-colors font-medium">Contact Us</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-midnightBlue py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="hover:text-desertSun transition-colors font-medium py-2">Home</Link>
            <Link href="/about-us" className="hover:text-desertSun transition-colors font-medium py-2">About Us</Link>
            
            <div>
              <button 
                onClick={() => setSolutionsOpen(!isSolutionsOpen)}
                className="hover:text-desertSun transition-colors flex items-center font-medium py-2"
              >
                Solutions
                <svg className={`ml-2 w-4 h-4 transition-transform ${isSolutionsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSolutionsOpen && (
                <div className="pl-4 mt-2 flex flex-col space-y-3 border-l-2 border-desertSun/30 ml-2">
                  <Link href="/solutions/hr" className="block py-2 hover:text-desertSun transition-colors font-medium">HR Solutions</Link>
                  <Link href="/solutions/finance" className="block py-2 hover:text-desertSun transition-colors font-medium">Finance Solutions</Link>
                  <Link href="/solutions/secretariat" className="block py-2 hover:text-desertSun transition-colors font-medium">Secretariat Solutions</Link>
                  <Link href="/solutions/gas" className="block py-2 hover:text-desertSun transition-colors font-medium">General Administration Solutions</Link>
                </div>
              )}
            </div>
            
            <Link href="/events" className="hover:text-desertSun transition-colors font-medium py-2">Events</Link>
            <Link href="/blogs" className="hover:text-desertSun transition-colors font-medium py-2">Blogs</Link>
            <Link href="/careers" className="hover:text-desertSun transition-colors font-medium py-2">Careers</Link>
            <Link href="/contact" className="hover:text-desertSun transition-colors font-medium py-2">Contact</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;