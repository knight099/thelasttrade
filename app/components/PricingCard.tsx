/* eslint-disable react/prop-types */
// frontend/src/components/PricingCard.jsx
/* eslint-disable no-unused-vars */
"use client"
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export const PricingCard = ({ title, price, features, buttonLabel, link }) => {
    const navigate = useNavigate();
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
        onClick={() => navigate({link})}
      />
    </div>
  );
};
