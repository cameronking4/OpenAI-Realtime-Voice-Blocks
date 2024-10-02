import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Script from 'next/script';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  authors: [{ name: siteConfig.author, url: siteConfig.links.twitter }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    images: "/opengraph-image.png",
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: ["Vapi Blocks", "Vapi", "Blocks", "Vapiblocks", "VapiBlocks", "Voice AI", "Voice AI components", "web components", "UI components", "UI Library", "shadcn", "aceternity", "AI", "Next.js", "React", "Tailwind CSS", "Framer Motion", "TypeScript", "Design engineer", "Vapi AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll">
      <body
        className={cn(
          "min-h-dvh bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Header />
            <main className="flex flex-1 justify-center items-start">
              {children}
            </main>
            <Footer />
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
      <Script
        async
        src="https://cloud.umami.is/script.js"
        data-website-id="746564e6-6d18-4a7e-8059-b2a4a8493a40"
       />
    </html>
  );
}
