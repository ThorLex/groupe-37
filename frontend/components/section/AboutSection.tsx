import Image from "next/image";

const AboutSection = () => {
  return (
    <section className="flex flex-col md:flex-row w-full min-h-screen items-center justify-center p-4 md:p-8">
      <div className="relative w-full max-w-xl h-[400px] md:h-[600px] border-8 border-white shadow-2xl rounded-lg overflow-hidden mb-8 md:mb-0 md:mr-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 z-0"></div>
            <Image
            src="/2.png"
            alt="A propos"
            fill
            priority
            quality={90}
            className="object-cover z-10 p-2"
            sizes="(max-width: 768px) 100vw, 40vw"
            />
      </div>

      <div className="w-full max-w-3xl bg-white p-6 md:p-8 rounded-lg shadow-lg font-[family-name:var(--font-opensans)]">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Qui sommes nous ?
        </h2>
        <p className="text-gray-600 mb-2 leading-relaxed text-justify">
          <span className="font-[family-name:var(--font-audiowided)] font-semibold">IDExpress</span> est une plateforme numérique innovante dédiée à la simplification du processus
          de demande de la carte nationale d&lsquo;identité au Cameroun.
        </p>
        <p className="text-gray-600 mb-2 leading-relaxed text-justify">
          Notre mission est de rendre l&lsquo;accès à l&lsquo;identification plus simple, rapide et sécurisé pour
          tous les citoyens, en offrant un service en ligne clair, transparent et efficace.
        </p>
        <p className="text-gray-600 mb-2 leading-relaxed text-justify">
            Grâce à IDExpress, vous pouvez:
            <li className="ml-4">Initier votre demande de CNI en ligne</li>
            <li className="ml-4">Suivre en temps réel l&lsquo;évolution de votre dossier</li>
            <li className="ml-4">Réduire les déplacements et les longues files d&lsquo;attente</li>
        </p>
        <p className="text-gray-600 mb-1 leading-relaxed text-justify">
          Nous sommes une équipe de jeunes professionnels camerounais passionnées par la technologie et 
          engagés pour une administration plus accessible à tous.
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 italic font-[family-name:var(--font-audiowided)]">L&lsquo;équipe IDExpress</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;