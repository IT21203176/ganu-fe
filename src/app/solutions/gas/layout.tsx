import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "General Administration Solutions - GANU Professional Services",
  "Comprehensive general administration services for seamless daily business operations. Manage office operations, logistics, and administrative tasks with GANU's professional support.",
  "/solutions/gas",
  undefined,
  ["general administration", "office management", "business administration", "administrative services", "office operations Sri Lanka"]
);

export default function GeneralAdminSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

