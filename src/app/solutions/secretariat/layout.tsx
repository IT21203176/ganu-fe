import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "Secretariat Solutions - GANU Professional Services",
  "Complete secretariat services including company registration, statutory filings, corporate compliance, and governance documentation. Ensure your legal health with GANU.",
  "/solutions/secretariat",
  undefined,
  ["secretariat services", "company registration", "corporate compliance", "statutory filings", "company secretarial services Sri Lanka"]
);

export default function SecretariatSolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

