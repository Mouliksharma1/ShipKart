import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata = generatePageMetadata({
  title: "Track Your Parcel",
  description:
    "Track your parcel, cargo or consignment in real time using your LR number. Instant tracking powered by ShipKart – POOJA TRAVELS & CARGO.",
  path: "/track",
});

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
