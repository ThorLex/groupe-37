'use client'

import Link from "next/link"
import NavButton from "./macro-element/NavButton"
import { useState } from "react"

const Navbar = () => {
    const [language, setLanguage] = useState<"fr" | "eng">("fr")

    const toggleLanguage = () => {
        setLanguage(prev => prev === "fr" ? "eng" : "fr")
    }

    return (
        <nav className="flex justify-between items-center bg-linear-to-r from-[#008000] via-[#FF0000] to-[#FFFF00] h-14">
            <div className="text-4xl font-normal font-[family-name:var(--font-audiowided)] ml-5">
                <Link href={"/"}>IDExpress</Link>
            </div>

            <div className="flex justify-between px-4 items-center w-1/3 mr-6">
                <NavButton>PRE ENROLEMENT</NavButton>
                <NavButton>SUIVI DE DEMANDE</NavButton>
                <NavButton variant={"language"} onClick={toggleLanguage}>{language}</NavButton>
            </div>
        </nav>
    )
}

export default Navbar