import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "Contact Us - GANU Professional Services",
  "Get in touch with GANU Professional Services. Contact us for HR solutions, finance services, secretariat services, and general administration support. We're here to help your business grow.",
  "/contact",
  undefined,
  ["contact GANU", "get in touch", "HR consulting contact", "business services Sri Lanka", "professional services contact"]
);

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

