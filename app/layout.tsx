import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undercover · Thai Trends",
  description: "Play the social-deduction party game Undercover with Thai slang & meme words.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
