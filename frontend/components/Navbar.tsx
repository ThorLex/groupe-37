"use client";

import Link from "next/link"
import { useState, ReactElement } from "react"
import NavButton from "./macro-element/NavButton"
import { Menu, X } from "lucide-react"

export default function Navbar(): ReactElement {
  const [language, setLanguage] = useState<"fr" | "eng">("fr")
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "eng" : "fr"))
  }
  const toggleMobileMenu = () => setMobileOpen((open) => !open)

  return (
    <nav className="relative bg-gradient-to-r from-green-600 via-red-600 to-yellow-400 h-14 flex items-center">
      <div className="mx-auto w-full flex items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="text-white font-[family-name:var(--font-audiowided)] text-2xl md:text-3xl hover:text-gray-200 transition-colors"
        >
          IDExpress
        </Link>

        <div className="hidden md:flex md:w-1/3 items-center justify-between space-x-6">
          <NavButton>
            <Link href="/pre-enrolement">PRÉ-ENRÔLEMENT</Link>
          </NavButton>
          <NavButton>
            <Link href="/suivi">SUIVI DE DEMANDE</Link>
          </NavButton>
          <NavButton
            variant="language"
            onClick={toggleLanguage}
            aria-label="Changer la langue"
          >
            {language.toUpperCase()}
          </NavButton>
        </div>

        <button
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
          aria-label="Ouvrir le menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`
          absolute top-full left-0 w-full bg-gradient-to-r from-green-600 via-red-600 to-yellow-400 rounded-b-xl shadow-lg z-20 md:hidden
          transform transition-all duration-300 ease-in-out origin-top
          ${mobileOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <div className="flex flex-col space-y-2 px-4 py-4">
          <NavButton className="w-full justify-center" onClick={toggleMobileMenu}>
            <Link href="/pre-enrolement">PRÉ-ENRÔLEMENT</Link>
          </NavButton>
          <NavButton className="w-full justify-center" onClick={toggleMobileMenu}>
            <Link href="/suivi">SUIVI DE DEMANDE</Link>
          </NavButton>
          <NavButton
            variant="language"
            onClick={() => {
              toggleLanguage();
              setMobileOpen(false);
            }}
            className="w-full justify-center"
            aria-label="Changer la langue"
          >
            {language.toUpperCase()}
          </NavButton>
        </div>
      </div>
    </nav>
  )
}
