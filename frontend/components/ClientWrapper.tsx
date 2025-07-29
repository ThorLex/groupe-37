"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "react-hot-toast"

export default function ClientWrapper({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const showNavbar = !pathname.startsWith("/admin") && !pathname.startsWith("/login")

  return (
    <>
      {showNavbar && <Navbar />}
        <main className="flex-1">{children}</main>
        <Toaster position="bottom-right" />
      {showNavbar && <Footer />}
    </>
  )
}
