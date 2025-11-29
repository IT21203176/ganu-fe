import { Metadata } from "next";
import { generatePageMetadata } from "@/config/seo";

export const metadata: Metadata = generatePageMetadata(
  "News & Events - GANU Professional Services",
  "Stay updated with the latest news and events from GANU Professional Services. Discover upcoming workshops, seminars, and industry insights in HR, Finance, and Business Services.",
  "/events",
  undefined,
  ["GANU events", "HR workshops", "business seminars", "professional development", "industry events Sri Lanka"]
);

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

