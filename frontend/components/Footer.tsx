import Link from "next/link";
import { ReactElement } from "react";

export default function Footer(): ReactElement {
  return (
    <footer className="bg-[#002147] text-white font-[family-name:var(--font-audiowided)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:divide-x md:divide-gray-400/50">
          <div className="flex-1 mb-8 md:mb-0 md:pr-8">
            <h3 className="text-2xl font-bold">IDExpress</h3>
            <p className="mt-4 text-sm leading-relaxed">
              Votre plateforme digitale pour simplifier la demande de Carte nationale d’identité au Cameroun
            </p>
          </div>
         
          <div className="flex-1 mb-8 md:mb-0 md:px-8">
            <h4 className="text-xl font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">Qui sommes-nous ?</Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">Faire une demande</Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">Suivre une demande</Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">FAQ</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 md:pl-8">
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <p className="text-sm">
              Email: <a href="mailto:support@idexpress.cm" className="underline">support@idexpress.cm</a>
            </p>
            <p className="text-sm mt-1">
              Tel: <a href="tel:+237680000000" className="underline">+237 680-000-000</a>
            </p>
            <p className="text-sm mt-4 leading-relaxed">
              Service client disponible du Lundi au Vendredi<br/>de 8h à 17h
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-400/50 py-4">
        <p className="text-center text-sm">
          © 2025 IDExpress – Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
