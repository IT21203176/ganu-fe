"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function GeneralAdminSolutions() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      title: "Office and Facility Management",
      description: "Efficient management of office operations, maintenance, and administrative resources.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Travel and Logistic Coordination",
      description: "End-to-end coordination of business travel, transportation, and logistics arrangements.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: "Event and Meeting Coordination",
      description: "Professional planning and coordination of corporate meetings, seminars, and events.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

  const radius = 180;

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
            General Administration Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Streamline your administrative operations with comprehensive solutions that ensure efficiency, organization, and seamless business support.
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
              Comprehensive Administration Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete range of administrative solutions designed to optimize your business operations and support services
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
            Ready to Streamline Your Administrative Operations?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl max-w-3xl mx-auto mb-10 text-gray-300"
          >
            Let us discuss how our administrative solutions can enhance efficiency and organization in your business.
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