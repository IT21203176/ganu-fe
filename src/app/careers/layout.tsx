import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "Careers - Join GANU Professional Services",
  "Explore career opportunities at GANU Professional Services. Join our team of experts in HR, Finance, and Business Services. Build your career with a leading professional services company.",
  "/careers",
  undefined,
  ["GANU careers", "job opportunities", "HR jobs", "finance careers", "professional services jobs Sri Lanka"]
);

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

