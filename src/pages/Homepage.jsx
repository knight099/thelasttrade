/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext"; // Correctly use the custom hook
import axios from "axios"; // For making API requests

const ServiceModal = ({ isOpen, onClose, serviceDetails, onProceedToBuy }) => {
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
          className="bg-blue-600 text-white px-4 py-2 rounded"
        />
        <Button
          label="Close"
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded ml-4"
        />
      </div>
    </div>
  );
};

export function Homepage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const { isAuthenticated, user } = useAuth(); // Use the custom hook
  const navigate = useNavigate();

  const serviceDetails = {
    title: "Stock Market Education Services",
    description:
      "Our Stock Market Education Services are designed to empower traders with in-depth knowledge, practical strategies, and hands-on experience needed to excel in stock trading.",
    details: [
      "VCP Setup - Learn to identify Volatility Contraction Patterns.",
      "Rocket Base Setup - Understand this setup for rapid gains.",
      "Fundamental Analysis - Master financial and qualitative analysis.",
      "Sector Rotation Like a Pro - Spot trends and adjust your portfolio.",
      "Multi-Bagger and Screeners - Discover stocks with high-growth potential.",
      "Special Focus Groups - Personalized mentoring and one-on-one sessions.",
      "Simulated Trading - Practice with real-time data in a risk-free environment.",
      "Hands-On Workshops - Participate in live trading and backtesting strategies.",
      "Ongoing Support - Get continuous access to resources, updates, and community.",
    ],
  };

  const handleLearnMore = () => {
    setSelectedService(serviceDetails);
    setIsModalOpen(true);
  };

  const handleProceedToBuy = async () => {
    if (!isAuthenticated) {
      navigate("/signin", {
        state: {
          redirectTo: "/payment",
          course: selectedService,
        },
      });
      return;
    }

    // Create Razorpay order on the backend
    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/create-order",
        {
          amount: 499, // Replace with the actual amount
          currency: "INR",
          receipt: `receipt#${Math.random().toString(36).substring(7)}`,
        }
      );

      // Open Razorpay payment modal
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Razorpay key id
        amount: order.amount,
        currency: order.currency,
        name: "The Last Trade",
        description: selectedService.title,
        image: "/logo.png", // Replace with your logo URL
        order_id: order.id,
        handler: async (response) => {
          alert("Payment Successful");
          // Handle post-payment success (e.g., save details to the database)
          navigate("/thank-you");
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <>
      <Appbar />
      <Slider />

      {/* 9 Golden Rules Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            9 Golden Rules for Trading in Stock Market
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Choose the right stocks</li>
            <li>Take calculated risks</li>
            <li>Do thorough research</li>
            <li>Take expert's help</li>
            <li>Never be emotional</li>
            <li>Redressal of grievance</li>
            <li>Use Stop Loss</li>
            <li>Don't be greedy</li>
            <li>Never take decision based on rumors</li>
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">What Services We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Stock Market Education Services
              </h3>
              <p>
                Our education services empower traders with practical strategies
                and hands-on experience to excel in stock trading.
              </p>
              <Button
                label="Learn More"
                onClick={handleLearnMore}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">We're Ready, Let's Talk</h2>
          <Button label="Contact Us Now" />
        </div>
      </section>

      <Footer />

      {/* Service Details Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceDetails={selectedService}
        onProceedToBuy={handleProceedToBuy}
      />
    </>
  );
}
