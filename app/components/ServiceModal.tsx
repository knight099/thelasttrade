"use client"
import React from "react";
import { Button } from "./Button"; // Assuming the Button component is already created and typed

// Define the type for serviceDetails prop
interface ServiceDetails {
  title: string;
  description: string;
  details: string[];
}

// Define the props for ServiceModal
interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceDetails: ServiceDetails;
  onProceedToBuy: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  serviceDetails,
  onProceedToBuy,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">{serviceDetails.title}</h2>
        <p className="mb-4">{serviceDetails.description}</p>
        <ul className="list-disc list-inside mb-4">
          {serviceDetails.details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
        <Button
          label="Proceed to Buy"
          onClick={onProceedToBuy}
        />
        <Button
          label="Close"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default ServiceModal;
