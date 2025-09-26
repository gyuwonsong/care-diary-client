import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import LayoutContent from "@/components/common/layout-content";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "돌봄일지",
  description:
    "희귀질환 환자·보호자 기록에서 정신 상태와 SDoH를 LLM으로 자동 추출·분석하는 서비스",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`h-full ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col">
        <div
          className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Navbar />
        </div>

        <LayoutContent>{children}</LayoutContent>

        <div id="portal-root" />
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: { description: "text-xs !text-black leading-relaxed" },
          }}
        />
      </body>
    </html>
  );
}
