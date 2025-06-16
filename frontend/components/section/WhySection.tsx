import { Bell, Merge, SquareCheckBig, TrendingUp } from "lucide-react";
import WhyCard from "../macro-element/WhyCard";

const WhySection = () => {
  const cardData = [
    {
      text: "Solution 100% Camerounaise",
    },
    {
      text: "Disponibilité 24h/24 7j/7",
      icon: SquareCheckBig,
    },
    {
      text: "Simplicité du processus",
      icon: Merge,
    },
    {
      text: "Suivi constant de sa demande",
      icon: TrendingUp,
    },
    {
      text: "Notification à chaque étape du processus",
      icon: Bell,
    },
  ];

  return (
    <section className="flex items-center justify-center flex-col w-full py-8 px-4 md:px-12 lg:px-24">
      <h3 className="text-3xl font-semibold text-center mb-10">
        Pourquoi faire sa CNI sur IDExpress ?
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-[85%]">
        {cardData.map((c, idx) => (
          <WhyCard
            key={idx}
            text={c.text}
            icon={c.icon}
          />
        ))}
      </div>
    </section>
  );
};

export default WhySection;
