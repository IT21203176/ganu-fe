"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function SecretariatSolutions() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      title: "Company Formation and Registration",
      description: "Quick, compliant company setup including documentation, registration, and advisory support.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Maintaining Statutory Registers",
      description: "Accurate maintenance of statutory records in accordance with corporate and legal requirements.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Minute Bookkeeping",
      description: "Proper documentation of board and shareholder meetings, ensuring accuracy and legal compliance.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      title: "Annual Compliance and Filings",
      description: "Ensure timely submission of statutory returns and annual reports to relevant authorities.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Meeting Administration",
      description: "Coordinate and manage board and shareholder meetings with professionalism and precision.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Share Capital Management",
      description: "Efficient handling of share issuance, transfers, and capital restructuring activities.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Director and Officer Management",
      description: "Maintain accurate records and compliance of directors' and officers' appointments, changes, and duties.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: "Governance & Compliance",
      description: "Provide strategic guidance on corporate governance best practices and compliance frameworks.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Legal and Special Filings",
      description: "Handle all special resolutions, legal submissions, and regulatory filings promptly and accurately.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  // Calculate positions for the radial layout
  const getCategoryPosition = (index: number, total: number, radius: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  const radius = 200;

  return (
    <div className="min-h-screen bg-white">
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
            Secretariat Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Transform your corporate governance with strategic secretariat solutions that ensure compliance, efficiency, and seamless corporate administration.
          </motion.p>
        </div>
      </section>

      {/* Hub and Spoke Diagram Section */}
      <section className="py-20 mb-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-midnightBlue mb-4">
              Comprehensive Secretariat Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete range of corporate secretarial solutions designed to meet your organization s unique compliance and governance needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Dynamic Description */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h3 className="text-3xl font-bold text-midnightBlue mb-6">
                {categories[activeCategory].title}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                {categories[activeCategory].description}
              </p>
              <div className="mt-8">
                <Link href="/contact">
                  <button className="bg-desertSun hover:bg-burntOrange text-midnightBlue font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl">
                    Learn More
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Radial Diagram */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-full h-[600px] max-w-[600px]">
                
                {/* SVG for connecting lines */}
                <svg 
                  className="absolute w-full h-full pointer-events-none" 
                  style={{ overflow: 'visible', left: '50px', top: '40px' }}
                  viewBox="0 0 600 600"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g transform="translate(300, 300)">
                    {categories.map((_, index) => {
                      const position = getCategoryPosition(index, categories.length, radius);
                      const isActive = activeCategory === index;
                      return (
                        <motion.line
                          key={`line-${index}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          x1="0"
                          y1="0"
                          x2={position.x}
                          y2={position.y}
                          stroke={isActive ? "#d89c60" : "#d1d5db"}
                          strokeWidth={isActive ? "3" : "2"}
                          strokeDasharray={isActive ? "0" : "5,5"}
                          style={{ 
                            transition: 'all 0.3s ease',
                          }}
                        />
                      );
                    })}
                  </g>
                </svg>

                {/* Center Hub */}
                <motion.div
                  className="absolute z-20"
                  style={{
                    left: 'calc(50% - 10px)',
                    top: 'calc(50% - 21px)',
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{ 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-desertSun to-burntOrange rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-10 h-10 text-midnightBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Category Circles */}
                {categories.map((category, index) => {
                  const position = getCategoryPosition(index, categories.length, radius);
                  const isActive = activeCategory === index;
                  
                  return (
                    <motion.button
                      key={`circle-${index}`}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(index)}
                      className={`absolute z-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                        isActive ? 'z-30' : 'z-10'
                      }`}
                      style={{
                        left: `calc(50% + ${position.x}px)`,
                        top: `calc(50% + ${position.y}px)`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <motion.div
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-3 transition-all duration-300 ${
                          isActive 
                            ? 'bg-desertSun border-burntOrange shadow-desertSun/50' 
                            : 'bg-white border-gray-300 hover:border-desertSun hover:shadow-desertSun/30'
                        }`}
                        animate={{
                          scale: isActive ? 1.15 : 1,
                          boxShadow: isActive ? '0 0 25px rgba(216, 156, 96, 0.6)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={`transition-colors duration-300 ${
                          isActive ? 'text-midnightBlue' : 'text-desertSun'
                        }`}>
                          {category.icon}
                        </div>
                      </motion.div>
                      <motion.span 
                        className={`text-xs font-semibold mt-3 text-center max-w-28 transition-colors duration-300 leading-tight ${
                          isActive ? 'text-desertSun font-bold' : 'text-gray-700'
                        }`}
                        animate={{
                          scale: isActive ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {category.title}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
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
            Ready to Transform Your Corporate Governance?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl max-w-3xl mx-auto mb-10 text-gray-300"
          >
            Let us discuss how our secretariat solutions can ensure compliance and efficiency in your organization.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact">
              <button className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Contact Us
              </button>
            </Link>
            <Link href="/services">
              <button className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Our Services
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}