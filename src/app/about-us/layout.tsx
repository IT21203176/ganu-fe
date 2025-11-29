import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "About Us - GANU Professional Services",
  "Learn about GANU Professional Services - a leading provider of HR, Finance, Secretariat, and General Administration solutions in Sri Lanka. Discover our mission, vision, values, and commitment to excellence.",
  "/about-us",
  "/images/co.jpg",
  ["about GANU", "company history", "mission vision", "professional services Sri Lanka", "HR solutions company"]
);

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

