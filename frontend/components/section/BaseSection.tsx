import Image from "next/image"
import NavButton from "../macro-element/NavButton"
import Link from "next/link"

const BaseSection = () => {
  return (
    <section className="relative h-screen">
      <Image
        src="/1.png"
        alt="Arrière-plan"
        fill
        priority
        quality={90}
        className="object-cover"
      />
      
      <div className="absolute inset-0 bg-black/10 z-0" />
      
      <div className="relative items-center pt-[40%] md:pt-0 md:pl-10  z-10 flex h-full flex-col md:items-start md:justify-center md:w-[48%] text-white font-[family-name:var(--font-opensans)]">
        <h1 className="max-md:text-center text-5xl font-bold">Bienvenue sur IDExpress</h1>
        <p className="mt-4 text-xl max-md:text-center">Etablissez facilement votre CNI au Cameroun et suivez votre demande en toute simplicité.</p>
        
        <div className="flex flex-col md:flex-row mt-12 font-[family-name:var(--font-audiowided)]">
            <Link href={"/pre-enrolement"}>
              <NavButton 
                variant={"primary"} 
                className="text-xl font-extralight py-1.5 px-4 cursor-pointer"
                animation="pulse"
              >
                Commencer ici
              </NavButton>
            </Link>
            <Link href={"/suivi"}>
              <NavButton 
                variant={"outline"}
                className="relative text-base font-extralight md:py-1.5 ml-3 md:ml-4 max-md:pt-4"
              >
                Consulter le statut
              </NavButton>
            </Link>
        </div>
      </div>
    </section>
  )
}

export default BaseSection