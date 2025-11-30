"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function HRSolutions() {
  const [activeCategory, setActiveCategory] = useState(0);

  const categories = [
    {
      title: "Payroll",
      description: "Accurate and timely payroll management builds employee trust, ensures compliance with statutory requirements, prevents financial errors, and strengthens overall organizational efficiency while freeing management to focus on strategic business priorities rather than administrative burdens.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
        </svg>
      )
    },
    {
      title: "EPF/ETF Services",
      description: "Proper administration of EPF and ETF contributions guarantees employees’ long-term financial security, ensures compliance with labor laws, avoids penalties, and strengthens the organization’s reputation for transparency, fairness, and responsible HR management practices.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "HR Audit",
      description: "A professional HR audit helps identify policy gaps, ensures legal compliance, improves HR processes, and strengthens documentation, allowing management to make data-driven decisions while minimizing risks related to employee relations and statutory obligations.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Recruitment Process Outsourcing (RPO)",
      description: "RPO ensures you attract and retain the right talent efficiently, reduce recruitment time and cost, improve candidate quality, and enhance workforce productivity through expert-managed, technology-driven recruitment strategies aligned with organizational goals.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Compensation & Benefits Administration",
      description: "Effective benefits administration ensures fair and transparent management of employee benefits, improves satisfaction and retention, reduces administrative errors, and ensures compliance with both company policy and statutory benefit requirements.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Performance Management (PMS)",
      description: "A well-structured PMS aligns employee goals with business objectives, supports continuous performance tracking, strengthens accountability, and drives motivation, productivity, and career growth across all levels of the organization.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: "HR Consulting",
      description: "Professional HR consulting delivers expert guidance to design and implement effective HR systems, improve workforce planning, resolve employee issues, and align HR strategies with organizational goals for sustainable growth and compliance.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Compliance Management",
      description: "Effective compliance management safeguards your organization from legal risks, ensures adherence to labor laws, promotes ethical practices, and builds trust among employees, regulators, and stakeholders through transparent HR operations.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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

  const radius = 220;

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
            HR Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Transform your workforce with strategic HR solutions that drive growth, ensure compliance, and optimize human capital potential.

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
              Comprehensive HR Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our complete range of HR solutions designed to meet your organization s unique needs
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
                  style={{ overflow: 'visible', left: '40px', top: '40px' }}
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
                    left: 'calc(50% - 18px)',
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                        className={`text-xs font-semibold mt-3 text-center max-w-24 transition-colors duration-300 leading-tight ${
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
            Ready to Transform Your HR Operations?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl max-w-3xl mx-auto mb-10 text-gray-300"
          >
            Let us discuss how our HR solutions can drive growth and efficiency in your organization.
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