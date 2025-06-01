import Image from "next/image"
import NavButton from "../macro-element/NavButton"

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
      
      <div className="relative pl-10  z-10 flex h-full flex-col items-start justify-center w-[48%] text-white font-[family-name:var(--font-opensans)]">
        <h1 className="text-5xl font-bold">Bienvenue sur IDExpress</h1>
        <p className="mt-4 text-xl">Etablissez facilement votre CNI au Cameroun et suivez votre demande en toute simplicité.</p>
        
        <div className="mt-12 font-[family-name:var(--font-audiowided)]">
            <NavButton 
                variant={"primary"} 
                className="text-xl font-extralight py-1.5 px-4 cursor-pointer"
                animation="pulse"
            >
                Commencer ici
            </NavButton>
            <NavButton 
                variant={"outline"}
                className="relative text-base font-extralight py-1.5 ml-4"
            >
                Consulter le statut
            </NavButton>
        </div>
      </div>
    </section>
  )
}

export default BaseSection