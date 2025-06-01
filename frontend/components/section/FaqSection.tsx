"use client"

import { ReactElement, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "Comment faire ma CNI sur IDExpress ?",
    answer:
      "Pour faire votre CNI sur IDExpress, il suffit de :\n\n" +
      "1. Accéder à la section 'PRE ENROLEMENT'.\n" +
      "2. Remplir le formulaire en ligne avec vos informations personnelles.\n" +
      "3. Télécharger les pièces justificatives au format JPEG ou PDF.\n" +
      "4. Choisir un mode de paiement (Mobile Money, Visa…).\n" +
      "5. Valider votre demande et suivre le statut en temps réel.\n\n" +
      "Une fois votre dossier validé, vous recevrez une confirmation par SMS et e-mail, puis vous pourrez retirer votre CNI dans un des guichets partenaires IDExpress."
  },
  {
    question: "Comment suivre le statut de ma demande ?",
    answer:
      "Après avoir soumis votre demande, vous pouvez suivre chaque étape directement depuis votre tableau de bord :\n\n" +
      "• En attente de validation : notre équipe vérifie vos pièces.\n" +
      "• Rejeté : Votre demande n'a pas été validé.\n" +
      "• En traitement : votre dossier est transmis à l’agence nationale pour traitement.\n" +
      "• Prêt à retirer : votre CNI est fabriquée et vous pouvez la retirer au guichet indiqué.\n\n" +
      "Un e-mail et un SMS de notification vous seront envoyés à chaque changement d’étape."
  },
  {
    question: "Quelle durée pour ma CNI ?",
    answer:
      "Le délai moyen de délivrance d’une CNI via IDExpress est de 5 à 8 jours ouvrables après validation de votre dossier.  \n" +
      "Toutefois, selon le volume de demandes national, ce délai peut varier entre 3 et 10 jours ouvrables.  \n" +
      "Dès que votre carte est prête, vous recevez une notification pour venir la récupérer."
  }
];

export default function FaqSection(): ReactElement {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="w-full py-12 px-4 md:px-16 lg:px-32">
      <h2 className="text-3xl font-bold text-white text-center mb-8">FAQ</h2>

      <div className="flex flex-col space-y-4">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = idx === openIndex;

          return (
            <div
              key={idx}
              className="w-full bg-gradient-to-r from-gray-100 to-white rounded-xl"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between px-6 py-4 cursor-pointer focus:outline-none"
              >
                <span className="text-gray-800 font-medium text-left">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`px-6 overflow-hidden text-gray-700 transition-all duration-300 ${
                  isOpen ? "max-h-auto py-4" : "max-h-0"
                }`}
              >
                <p className="whitespace-pre-line text-sm font-[family-name:var(--font-opensans)]">{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
