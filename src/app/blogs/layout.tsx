import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "Blogs & Insights - GANU Professional Services",
  "Read expert insights, industry trends, and best practices from GANU Professional Services. Stay informed about HR, Finance, Compliance, and Business Management.",
  "/blogs",
  undefined,
  ["HR blog", "finance insights", "business tips", "compliance updates", "professional advice"]
);

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

