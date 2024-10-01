"use client"
import { useRouter } from "next/navigation";
import { Button } from "./Button";

// Define the type for the props
interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  link: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, buttonLabel, link }) => {
  const navigate = useRouter();

  return (
    <div className="bg-black rounded-lg shadow-md p-6 flex flex-col justify-between text-white">
      <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      <p className="text-2xl font-semibold text-center mb-4">{price}</p>
      <ul className="list-disc list-inside mb-6 space-y-2 text-white">
        {features.map((feature, index) => (
          <li key={index} className="text-white-600">
            {feature}
          </li>
        ))}
      </ul>
      <Button
        label={buttonLabel}
        onClick={() => navigate.push(link)}
      />
    </div>
  );
};
