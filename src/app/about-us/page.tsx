"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from 'react';
import CO from "../../../public/images/co.jpg";

export default function AboutUs() {

  const [activeCard, setActiveCard] = useState('mission');
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            About Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Learn more about our journey, values, and commitment to excellence in professional services.
          </motion.p>
        </div>
      </section>

      {/* Company Overview Section */}
      <section id="overview" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-desertSun mb-6">
                Company Overview
              </h2>
              <div className="space-y-4 text-gray-300 text-justify">
                <p>
                  GANU Professional Services is an innovative firm specializing in comprehensive business 
                  support solutions, with a core focus on 360-degree Human Resource Management. Since 2019, 
                  we have delivered professional and reliable services through a team of experienced 
                  specialists in Human Resources, Business Administration, and related service areas essential 
                  for smooth business operations. At GANU, we offer customized solutions designed to meet each 
                  client’s needs, ensuring results, compliance, and sustainable growth.
                </p>
                <p>
                  GANU has now expanded its expertise beyond HR services to include Accounting and Finance Services, 
                  Secretarial Services, and General Administration Services. This expansion allows us to offer clients 
                  an integrated platform to manage their business functions efficiently and confidently under one roof. 
                  From recruitment, training, and payroll to accounting, statutory filings, and administrative management, 
                  our wide-ranging services are designed to help your business thrive.
                </p>
                <p>
                  Our commitment to quality, reliability, and professionalism has earned us the trust of numerous clients. 
                  With GANU as your strategic partner, you can focus on growing your core business while we manage your people, 
                  finances, and operations with precision and care.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-desertSun mb-2">50+</div>
                  <div className="text-gray-300">Clients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-desertSun mb-2">5+</div>
                  <div className="text-gray-300">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-desertSun mb-2">95%</div>
                  <div className="text-gray-300">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-desertSun mb-2">24/7</div>
                  <div className="text-gray-300">Support</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl"
            >
              <Image 
                src={CO}
                alt="GANU Professional Services Office" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            style={{ color: '#d89c60' }}
          >
            Our Mission & Vision
          </motion.h2>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 mb-32">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`
                bg-navyBlue rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 border-4
                hover:shadow-2xl hover:transform hover:-translate-y-2
                ${activeCard === 'mission' 
                  ? 'border-desertSun shadow-xl scale-105' 
                  : 'border-gray-200 shadow-lg'
                }
              `}
              onClick={() => setActiveCard('mission')}
              >
                {/* Icon - Target */}
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors
                  ${activeCard === 'mission' ? 'bg-desertSun' : 'bg-gray-100'}
                `}>
                  <svg className={`w-10 h-10 transition-colors ${activeCard === 'mission' ? 'text-midnightBlue' : 'text-gray-400'}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="6" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="2" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 16v-4m10-10h-4M6 12H2" />
                  </svg>
                </div>
                
                {/* Headline */}
                <h3 className={`
                  text-2xl font-bold transition-colors
                  ${activeCard === 'mission' ? 'text-desertSun' : 'text-gray-300'}
                `}>
                  Mission
                </h3>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`
                bg-navyBlue rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 border-4
                hover:shadow-2xl hover:transform hover:-translate-y-2
                ${activeCard === 'vision' 
                  ? 'border-desertSun shadow-xl scale-105' 
                  : 'border-gray-200 shadow-lg'
                }
              `}
              onClick={() => setActiveCard('vision')}
              >
                {/* Icon - Eye */}
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors
                  ${activeCard === 'vision' ? 'bg-desertSun' : 'bg-gray-100'}
                `}>
                  <svg className={`w-10 h-10 transition-colors ${activeCard === 'vision' ? 'text-midnightBlue' : 'text-gray-400'}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                
                {/* Headline */}
                <h3 className={`
                  text-2xl font-bold transition-colors
                  ${activeCard === 'vision' ? 'text-desertSun' : 'text-gray-300'}
                `}>
                  Vision
                </h3>
              </div>
            </motion.div>
          </div>

          {/* Single Speech Bubble Container - Positioned below both cards */}
          <div className="relative -mt-8">
            {/* Mission Speech Bubble */}
            {activeCard === 'mission' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-desertSun/20 relative max-w-4xl mx-auto">
                  {/* Speech bubble pointer - positioned under Mission card */}
                  <div className="absolute -top-3 left-1/4 transform -translate-x-1/2 w-6 h-6 bg-white border-l-2 border-t-2 border-desertSun/20 rotate-45"></div>
                  
                  <p className="text-midnightBlue text-center leading-relaxed text-lg font-semibold italic">
                    To empower organizations with innovative HR solutions, fostering growth and excellence through 
                    dedicated, personalized service and a commitment to integrity and trust.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Vision Speech Bubble */}
            {activeCard === 'vision' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-desertSun/20 relative max-w-4xl mx-auto">
                  {/* Speech bubble pointer - positioned under Vision card */}
                  <div className="absolute -top-3 left-3/4 transform -translate-x-1/2 w-6 h-6 bg-white border-l-2 border-t-2 border-desertSun/20 rotate-45"></div>
                  
                  <p className="text-midnightBlue text-center leading-relaxed text-lg font-semibold italic">
                    To be the leading service provider by delivering unique and exceptional service in the field 
                    of Human Resources Management.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Supporting Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mt-16"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Our mission and vision guide everything we do, from strategic planning to daily operations, 
              ensuring we deliver exceptional value to our clients while maintaining the highest standards of professionalism.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-midnightBlue via-navyBlue to-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-desertSun mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto">
              The principles that guide our actions and define our culture
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Integrity",
                description: "We operate with honesty and transparency in all our dealings, building trust through consistent ethical behavior.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Excellence",
                description: "We strive for the highest standards in everything we do, continuously improving and innovating.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )
              },
              {
                title: "Collaboration",
                description: "We believe in the power of partnership, working closely with clients to achieve shared success.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                title: "Innovation",
                description: "We embrace change and creativity, developing cutting-edge solutions for evolving challenges.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center hover:border-desertSun/30 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-desertSun rounded-full flex items-center justify-center mx-auto mb-4 text-midnightBlue">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navyBlue text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Learn More?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl max-w-3xl mx-auto mb-10 text-gray-300"
          >
            Discover how our expertise can help your organization achieve its full potential.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Contact Us
            </button>
            <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Our Services
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
