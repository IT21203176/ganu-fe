"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoBackground from "@/components/VideoBackground";
import Image from "next/image";
import Logo from "../../public/images/logo.png";
import CO from "../../public/images/co.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from 'next/link';

// Import client logos
import ChillLogo from "../../public/images/clients/chill.jpg";
import HearingLogo from "../../public/images/clients/hearing.png";
import LaViventeLogo from "../../public/images/clients/La-Vivente-logo.png";
import BamoraLogo from "../../public/images/clients/logo-bamoramedia.lk_.png";
import TopbookkeeperLogo from "../../public/images/clients/Logoclr.png";
import RigorLogo from "../../public/images/clients/rigor_logo.png";
import TechgatesLogo from "../../public/images/clients/techgates-logo-11-10-2016.png";
import LL from "../../public/images/clients/ll.jpg";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const companyOverviewRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Calculate opacity for header based on scroll position
  const headerOpacity = useTransform(
    scrollY,
    [0, 200], // Start fading in when scrolled 200px
    [0, 1]     // From transparent to fully opaque
  );

  // Function to scroll to the company overview section
  const scrollToCompanyOverview = () => {
    companyOverviewRef.current?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const moveCarousel = (direction: number) => {
    const carousel = document.getElementById('testimonial-carousel');
    const slides = document.querySelectorAll('#testimonial-carousel > div');
    const totalSlides = slides.length;
    
    let newSlide = currentSlide + direction;
    if (newSlide < 0) newSlide = totalSlides - 1;
    if (newSlide >= totalSlides) newSlide = 0;
    
    setCurrentSlide(newSlide);
    
    if (carousel) {
      carousel.style.transform = `translateX(-${newSlide * 100}%)`;
    }
    
    // Update dots
    updateDots(newSlide);
  };

  const goToSlide = (slideIndex: number) => {
    const carousel = document.getElementById('testimonial-carousel');
    setCurrentSlide(slideIndex);
    
    if (carousel) {
      carousel.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    
    updateDots(slideIndex);
  };

  const updateDots = (activeIndex: number) => {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('bg-desertSun', 'scale-125');
        dot.classList.remove('bg-gray-600');
      } else {
        dot.classList.remove('bg-desertSun', 'scale-125');
        dot.classList.add('bg-gray-600');
      }
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      moveCarousel(1);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

  // Initialize dots on first render
  useEffect(() => {
    updateDots(0);
  }, []);

  // Client logos array
  const clientLogos = [
    { src: ChillLogo, alt: "Colombo Chill", name: "Colombo Chill" },
    { src: HearingLogo, alt: "Miracle L Speech & Hearing Center", name: "Miracle L Speech & Hearing Center" },
    { src: LaViventeLogo, alt: "La Vivente Group", name: "La Vivente Group" },
    { src: BamoraLogo, alt: "BAMORA Media", name: "BAMORA Media" },
    { src: TopbookkeeperLogo, alt: "Topbookkeeper", name: "Topbookkeeper" },
    { src: RigorLogo, alt: "Rigor Consulting", name: "Rigor Consulting" },
    { src: TechgatesLogo, alt: "Techgates", name: "Techgates" },
    { src: LL, alt: "LL", name: "LL" },
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Mr. Ishan Bandara",
      company: "Managing Director, BAMORA Media (Pvt) Ltd",
      text: "GANU streamlined our payroll processing and statutory contribution payments, making compliance smooth and stress-free. Their guidance in reviewing and designing HR policies, along with professional advice on critical employee matters, has strengthened our decision-making process.",
      initials: "IB"
    },
    {
      id: 2,
      name: "Mr. Dishan De Silva",
      company: "Director, Miracle L Speech & Hearing Center",
      text: "GANU has been a true partner in reviewing and designing our employee contracts to the highest standards. Their team is always ready to provide professional HR consultations, and we have never felt like they were an outsourced service — they are part of our team.",
      initials: "DS"
    },
    {
      id: 3,
      name: "Dr. Dilesha Perera",
      company: "Founder, La Vivente Group",
      text: "The GANU team has been an incredible support system for our organization. Their guidance in identifying non-compliance issues and implementing the right strategies has given us peace of mind and allowed us to focus on our core business.",
      initials: "DP"
    },
    {
      id: 4,
      name: "Mr. Nishantha Kulasuriya",
      company: "Director, Rigor Consulting",
      text: "GANU brings unmatched confidence and expertise to every project. Their ability to design unique, tailored HR strategies for organizations of any size is truly impressive.",
      initials: "NK"
    },
    {
      id: 5,
      name: "Mr. Iranka DM",
      company: "Operation Manager, Chill Colombo",
      text: "GANU has been a key partner in setting up our HR framework. From designing employee contracts specific to the hospitality industry to implementing SOPs and creating a comprehensive employee handbook.",
      initials: "ID"
    },
    {
      id: 6,
      name: "Mr. Sidath Perera",
      company: "Founder, Topbookkeeper.com",
      text: "We approached GANU to conduct payroll introduction training for our HRIS software team, and they exceeded our expectations. The comprehensive online session covered every essential aspect of payroll management.",
      initials: "SP"
    },
    {
      id: 7,
      name: "Mr. Thiwanka De Silva",
      company: "Managing Director, TechGates",
      text: "We approached GANU for support with compliance on employee payments, contract reviews, and policy development. Their team is incredibly friendly and always goes beyond our expectations.",
      initials: "TS"
    }
  ];

  return (
    <>
      <motion.div style={{ opacity: headerOpacity }} className="fixed top-0 w-full z-50">
        <Header />
      </motion.div>
      
      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <VideoBackground />
        
        {/* Luxury decorative elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border-4 border-desertSun border-opacity-30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-16 w-12 h-12 border-2 border-desertSun border-opacity-20 rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 border border-desertSun border-opacity-10 rounded-full"></div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <Image 
              src={Logo} 
              alt="GANU Professional Services" 
              width={280} 
              height={120}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-2"
          >
            <span className="text-3xl md:text-5xl font-bold tracking-wider">
              GANU PROFESSIONAL SERVICES
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span
              className="text-xl md:text-2xl font-bold tracking-wider bg-gradient-to-r from-desertSun to-burntOrange bg-clip-text"
              style={{ color: "#e69b32" }}
            >
              YOUR PARTNER IN HR EXCELLENCE
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12"
          >
            <button 
              onClick={scrollToCompanyOverview}
              className="animate-bounce flex justify-center mx-auto cursor-pointer focus:outline-none"
              aria-label="Scroll to content"
            >
              <svg className="w-8 h-8 text-desertSun" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Client Logos Carousel Section */}
      <section className="py-16 bg-midnightBlue">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-desertSun mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We are proud to collaborate with visionary organizations that are shaping the future of their industries.
            </p>
          </motion.div>

          {/* Logo Carousel Container */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden py-8">
              <div className="flex animate-scroll hover:pause-scroll space-x-16">
                {/* First set of logos */}
                {clientLogos.map((logo, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 flex items-center justify-center"
                  >
                    <div className="relative w-32 h-20 md:w-40 md:h-24 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 128px, 160px"
                      />
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {clientLogos.map((logo, index) => (
                  <div
                    key={`second-${index}`}
                    className="flex-shrink-0 flex items-center justify-center"
                  >
                    <div className="relative w-32 h-20 md:w-40 md:h-24 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 128px, 160px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-midnightBlue to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-midnightBlue to-transparent z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Rest of the page content without Video background */}
      <div className="bg-black">
        {/* Company Overview Section */}
        <section ref={companyOverviewRef} className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center text-desertSun mb-12"
            >
              Company Overview
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Who We Are</h3>
                <p className="text-gray-300 mb-4 text-justify">
                  GANU Professional Services is a leading provider of comprehensive HR and financial solutions 
                  tailored to meet the unique needs of businesses across various industries.
                </p>
                <p className="text-gray-300 mb-4">
                  With years of experience and a team of dedicated experts, we deliver innovative strategies 
                  that drive organizational growth, enhance operational efficiency, and maximize human capital potential.
                </p>
                <Link href="/about-us">
                  <button className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg cursor-pointer">
                    Learn More About Us
                  </button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative h-80 rounded-xl overflow-hidden shadow-lg"
              >
                <Image 
                  src={CO}
                  alt="Company Overview" 
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="py-20 bg-midnightBlue">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-16"
              style={{ color: '#d89c60' }}
            >
              Our Solutions
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-30 gap-y-15">
              {/* HR Solutions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-10 top-8 flex flex-col items-center z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-colors" style={{ backgroundColor: '#e87a00', borderColor: '#e87a00' }}>
                    <svg className="w-10 h-10" fill="none" stroke="#001f3d" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="border-2 rounded-3xl p-8 pl-16 transition-all h-full min-h-[280px] flex flex-col justify-center" style={{ backgroundColor: '#001f3d', borderColor: '#d89c60' }}>
                  <h3 className="text-2xl font-bold text-white mb-4">HR Solutions</h3>
                  <p className="leading-relaxed text-justify" style={{ color: '#d89c60' }}>
                    Your strategic partner for compliance, operational efficiency, and workforce optimization. 
                    We manage your HR processes with professional care, empowering you to focus on business growth.
                  </p>
                </div>
              </motion.div>
              
              {/* Finance Solutions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-10 top-8 flex flex-col items-center z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-colors" style={{ backgroundColor: '#e87a00', borderColor: '#e87a00' }}>
                    <svg className="w-10 h-10" fill="none" stroke="#001f3d" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="border-2 rounded-3xl p-8 pl-16 transition-all h-full min-h-[280px] flex flex-col justify-center" style={{ backgroundColor: '#001f3d', borderColor: '#d89c60' }}>
                  <h3 className="text-2xl font-bold text-white mb-4">Finance Solutions</h3>
                  <p className="leading-relaxed text-justify" style={{ color: '#d89c60' }}>
                    Your partner for accurate accounting, taxation, and compliance. 
                    We ensure financial transparency and control to support your sustainable business growth.
                  </p>
                </div>
              </motion.div>

              {/* Secretariat Solutions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-10 top-8 flex flex-col items-center z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-colors" style={{ backgroundColor: '#e87a00', borderColor: '#e87a00' }}>
                    <svg className="w-10 h-10" fill="none" stroke="#001f3d" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                </div>
                <div className="border-2 rounded-3xl p-8 pl-16 transition-all h-full min-h-[280px] flex flex-col justify-center" style={{ backgroundColor: '#001f3d', borderColor: '#d89c60' }}>
                  <h3 className="text-2xl font-bold text-white mb-4">Secretariat Solutions</h3>
                  <p className="leading-relaxed text-justify" style={{ color: '#d89c60' }}>
                    Your partner for seamless corporate compliance. We handle company registration, statutory filings, 
                    and governance documentation to ensure your legal health and operational continuity.
                  </p>
                </div>
              </motion.div>

              {/* General Administration Solutions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-10 top-8 flex flex-col items-center z-10">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-colors" style={{ backgroundColor: '#e87a00', borderColor: '#e87a00' }}>
                    <svg className="w-10 h-10" fill="none" stroke="#001f3d" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="border-2 rounded-3xl p-8 pl-16 transition-all h-full min-h-[280px] flex flex-col justify-center" style={{ backgroundColor: '#001f3d', borderColor: '#d89c60' }}>
                  <h3 className="text-2xl font-bold text-white mb-4">General Administration Solutions</h3>
                  <p className="leading-relaxed text-justify" style={{ color: '#d89c60' }}>
                    Your operational backbone for seamless daily business functions. We manage office operations and logistics, 
                    enabling you to stay focused on core business goals.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Client Testimonials Section - Vertical Scrolling */}
        <section className="py-20 bg-gradient-to-t from-midnightBlue via-navyBlue to-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Static Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:sticky lg:top-24"
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Check out what our clients are saying
                </h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed text-justify">
                  Discover how our professional services have transformed businesses and driven success for our clients. 
                  Hear directly from the organizations that have partnered with us to achieve their HR and operational goals.
                </p>
                <button className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Get Started
                </button>
              </motion.div>

              {/* Right Vertical Scrolling Testimonials */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative h-[600px] overflow-hidden">
                  {/* Scrolling Container */}
                  <div className="animate-vertical-scroll hover:pause-vertical-scroll space-y-6">
                    {/* First Set */}
                    {testimonials.map((testimonial) => (
                      <div
                        key={`first-${testimonial.id}`}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-desertSun/30 transition-all duration-300 hover:shadow-desertSun/20"
                      >
                        {/* Quotation Mark */}
                        <div className="text-desertSun mb-4">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                          </svg>
                        </div>
                        
                        {/* Testimonial Text */}
                        <p className="text-gray-200 text-lg leading-relaxed mb-6 italic">
                          {testimonial.text}
                        </p>
                        
                        {/* Client Info */}
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-desertSun to-burntOrange p-0.5 mr-4">
                            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-desertSun font-semibold text-lg">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Duplicate Set for Seamless Loop */}
                    {testimonials.map((testimonial) => (
                      <div
                        key={`second-${testimonial.id}`}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-desertSun/30 transition-all duration-300 hover:shadow-desertSun/20"
                      >
                        {/* Quotation Mark */}
                        <div className="text-desertSun mb-4">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                          </svg>
                        </div>
                        
                        {/* Testimonial Text */}
                        <p className="text-gray-200 text-lg leading-relaxed mb-6 italic">
                          {testimonial.text}
                        </p>
                        
                        {/* Client Info */}
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-desertSun to-burntOrange p-0.5 mr-4">
                            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-desertSun font-semibold text-lg">{testimonial.name}</h4>
                            <p className="text-gray-400 text-sm">{testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gradient Overlays */}
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-midnightBlue to-transparent z-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-midnightBlue to-transparent z-10"></div>
                </div>
              </motion.div>
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
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl max-w-3xl mx-auto mb-10 text-gray-300"
            >
              Contact us today to discover how our professional services can help your organization achieve its goals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="bg-burntOrange hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-lg mr-4 transition-colors">
                Get Started
              </button>
              <button className="bg-transparent hover:bg-burntOrange hover:bg-opacity-10 border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Contact Us
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}