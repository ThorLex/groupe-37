"use client";

import Link from "next/link";
import { useState, ReactElement } from "react";
import NavButton from "./macro-element/NavButton";
import { Menu } from "lucide-react";

export default function Navbar(): ReactElement {
  const [language, setLanguage] = useState<"fr" | "eng">("fr");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "eng" : "fr"));
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 via-red-600 to-yellow-400 h-14 flex items-center">
      <div className="mx-auto w-full flex items-center justify-between px-4 md:px-8">
        <div className="text-white font-[family-name:var(--font-audiowided)] text-2xl md:text-3xl">
          <Link href="/" className="hover:text-gray-200 transition-colors">
            IDExpress
          </Link>
        </div>

        <div className="hidden md:flex md:w-1/3 items-center justify-between space-x-6">
          <Link href={"/pre-enrolement"}></Link>
          <NavButton>
            <Link href={"/pre-enrolement"}>PRE ENROLEMENT</Link>
          </NavButton>
          <NavButton>
            <Link href={"/suivi"}>SUIVI DE DEMANDE</Link>
          </NavButton>

          <NavButton
            variant="language"
            onClick={toggleLanguage}
            aria-label="Changer la langue"
          >
            {language.toUpperCase()}
          </NavButton>
        </div>

        <div className="md:hidden flex items-center">
          <Menu className="w-6 h-6 text-white" />
        </div>
      </div>
    </nav>
  );
}