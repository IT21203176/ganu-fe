import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "Finance Solutions - GANU Professional Services",
  "Professional finance and accounting services including bookkeeping, taxation, financial reporting, and compliance. Trust GANU for accurate financial management and business growth.",
  "/solutions/finance",
  undefined,
  ["finance solutions", "accounting services", "taxation", "bookkeeping", "financial consulting Sri Lanka", "accounting"]
);

export default function FinanceSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

