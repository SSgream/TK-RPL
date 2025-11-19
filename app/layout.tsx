// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "@/components/Providers"
import LayoutWrapper from "@/components/LayoutWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "UKM Teknik",
  description: "Portal UKM Fakultas Teknik",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning={true}>
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
