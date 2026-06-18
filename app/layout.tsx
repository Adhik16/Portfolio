import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  metadataBase: new URL("https://your-domain.com"), // TODO: Replace with your production URL
=======
>>>>>>> aeff9a0 (Second commit)
  title: "Adhik Shakya — SOC Analyst | Cybersecurity Portfolio",
  description:
    "Cybersecurity portfolio of Adhik Shakya, a SOC Analyst specializing in threat detection, incident response, and network security.",
  keywords: [
    "cybersecurity",
    "SOC analyst",
    "security operations center",
    "portfolio",
    "threat detection",
    "incident response",
  ],
<<<<<<< HEAD
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
=======
>>>>>>> aeff9a0 (Second commit)
  openGraph: {
    title: "Adhik Shakya — SOC Analyst",
    description:
      "Cybersecurity portfolio showcasing skills in threat detection, incident response, and security operations.",
    type: "website",
<<<<<<< HEAD
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adhik Shakya — SOC Analyst Portfolio",
      },
    ],
=======
>>>>>>> aeff9a0 (Second commit)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delayDuration={300}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
