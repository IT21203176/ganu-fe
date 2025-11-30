"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function FinanceSolutions() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      title: "Core Accounting and Bookkeeping",
      description: "Maintain accurate financial records, manage ledgers, and handle daily transactions with precision and confidentiality.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Financial Planning and Analysis (FP&A)",
      description: "Deliver actionable financial insights, budgeting, and forecasting to drive informed strategic and operational decisions.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "Taxation Services",
      description: "Comprehensive tax planning, preparation, and compliance services to minimize liabilities and ensure full regulatory adherence.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      )
    },
    {
      title: "Audit and Assurance Support",
      description: "Independent audit assistance to strengthen transparency, risk management, and stakeholder confidence.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Financial Reporting and Compliance",
      description: "Accurate preparation of financial statements and compliance with local and international accounting standards.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Treasury and Cash Management",
      description: "Optimize cash flow, liquidity, and investment management for financial stability and growth.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Procurement and Vendor Management",
      description: "Streamlined vendor sourcing, evaluation, and procurement processes ensuring cost efficiency and accountability.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Strategic and Advisory Services",
      description: "Expert financial and business advisory to enhance performance, profitability, and long-term sustainability.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Technology and System Support",
      description: "Integrating digital tools and financial systems to improve accuracy, automation, and decision-making efficiency.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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
            Finance Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Transform your financial operations with strategic solutions that drive growth, ensure compliance, and optimize financial performance.
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
              Comprehensive Finance Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete range of financial solutions designed to meet your organization s unique needs
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            Ready to Transform Your Financial Operations?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl max-w-3xl mx-auto mb-10 text-gray-300"
          >
            Let us discuss how our financial solutions can drive growth and efficiency in your organization.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact" className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg mr-4 transition-colors inline-block">
                Contact Us
              </Link>
            
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}