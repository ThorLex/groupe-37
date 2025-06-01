import Image from "next/image"

const BaseSection = () => {
  return (
    <section className="relative h-screen">
      {/* Image de fond optimisée */}
      <Image
        src="/1.png"
        alt="Arrière-plan"
        fill
        priority
        quality={90}
        className="object-cover"
      />
      
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/10 z-0" />
      
      {/* Contenu */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-5xl font-bold">Titre principal</h1>
        <p className="mt-4 text-xl">Sous-titre attractif</p>
      </div>
    </section>
  )
}

export default BaseSection