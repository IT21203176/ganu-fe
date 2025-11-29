import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "HR Solutions - GANU Professional Services",
  "Comprehensive HR solutions including payroll management, EPF/ETF services, HR policy development, compliance, recruitment, and employee relations. Partner with GANU for strategic HR excellence.",
  "/solutions/hr",
  undefined,
  ["HR solutions", "payroll management", "HR compliance", "EPF ETF services", "HR consulting Sri Lanka", "human resources"]
);

export default function HRSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

