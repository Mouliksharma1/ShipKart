import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({
  title: "Partner & Cargo Collaboration – Contact Us",
  description:
    "Own a cargo service in Rajasthan? Partner with POOJA TRAVELS & CARGO. Contact us via phone, WhatsApp, or the collaboration form. Call 7852091119.",
  path: "/partner-contact",
});

export default function PartnerContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
