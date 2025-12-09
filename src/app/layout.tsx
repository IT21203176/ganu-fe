import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { defaultMetadata, generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema, generateFAQSchema } from "@/config/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata as Metadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  
  // FAQ Schema for common HR service questions
  const faqSchema = generateFAQSchema([
    {
      question: "What HR services do you provide in Sri Lanka?",
      answer: "GANU Professional Services offers comprehensive HR services in Sri Lanka including HR consultancy, HR outsourcing, payroll management, EPF/ETF services, employee management, HR compliance, recruitment, and training services across Colombo and nationwide."
    },
    {
      question: "Do you provide HR services in Colombo?",
      answer: "Yes, GANU Professional Services is a leading HR services provider in Colombo, Sri Lanka. We offer HR consultancy, HR outsourcing, payroll management, EPF/ETF services, and complete HR solutions for businesses in Colombo and throughout Sri Lanka."
    },
    {
      question: "What are EPF and ETF services?",
      answer: "EPF (Employee Provident Fund) and ETF (Employee Trust Fund) are mandatory contributions for employees in Sri Lanka. GANU Professional Services provides complete EPF/ETF services including registration, monthly contributions, filing returns, and compliance management for businesses across Sri Lanka."
    },
    {
      question: "What is HR outsourcing in Sri Lanka?",
      answer: "HR outsourcing in Sri Lanka involves delegating HR functions to external service providers. GANU Professional Services offers comprehensive HR outsourcing services including payroll processing, employee record management, compliance, EPF/ETF handling, and complete HR administration for businesses in Colombo and Sri Lanka."
    },
    {
      question: "Why choose GANU for HR consultancy services in Sri Lanka?",
      answer: "GANU Professional Services is a trusted HR consultancy in Sri Lanka with expertise in payroll management, EPF/ETF services, HR compliance, and employee management. We serve businesses in Colombo and nationwide, providing professional, reliable, and compliant HR solutions."
    }
  ]);

  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
