import { ReactElement } from "react";
import Image from "next/image";

interface WhyCardProps {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
  className?: string;
}

const WhyCard = ({
  text,
  icon: Icon,
  className = "",
}: WhyCardProps): ReactElement => {
  return (
    <div
      className={
        `flex items-center justify-center 
         w-full md:max-w-xs h-auto 
         p-4 rounded-xl shadow-sm 
         bg-gradient-to-r from-gray-200 to-white 
         ${className}`
      }
    >
      {Icon ? (
        <Icon className="w-8 h-8 flex-shrink-0 mr-3 text-gray-700" />
      ) : (
        <Image
          src="/cmr.svg"
          width={70}
          height={16}
          alt="Icône Cameroon"
          className="mr-3"
        />
      )}

      <p className="text-center text-sm font-medium text-gray-800">{text}</p>
    </div>
  );
};

export default WhyCard;
