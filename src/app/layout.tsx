import { config } from "@/lib/consts";
import Body from "./Body";
import "./globals.css";
import { Metadata } from "next";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: config.site.name,
  description: config.site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <Providers>
        <Body>{children}</Body>
      </Providers>
    </html>
  );
}
