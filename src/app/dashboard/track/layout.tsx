import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
