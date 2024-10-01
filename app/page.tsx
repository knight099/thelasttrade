/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Appbar } from "./components/Appbar"; // Assuming you have these components
import { Slider } from "./components/Slider";
import { ContactUs } from "./components/ContactUs";
import { Footer } from "./components/Footer";
import ServiceModal from "./components/ServiceModal";
// import {ServiceDetails } from "./components/ServiceModal";
import { Button } from "./components/Button"; // Button component assumed

interface ServiceDetails {
  title: string;
  description: string;
  details: string[];
}

interface User {
  name: string;
  email: string;
  phone: string;
}

// interface Order {
//   amount: number;
//   currency: string;
//   id: string;
// }

async function getUserData(): Promise<User | null> {
  try {
    const response = await axios.get("http://localhost:3000/api/user");
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Order = {
  id: string;
  amount: number;
  currency: string;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};


const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<ServiceDetails>();
  const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const serviceDetails: ServiceDetails = {
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
  if (!userData) {
    router.push("/signin");
    return;
  }

  try {
    const { data: order }: { data: Order } = await axios.post(
      "http://localhost:3000/create-order",
      {
        amount: 499,
        currency: "INR",
        receipt: `receipt#${Math.random().toString(36).substring(7)}`,
      }
    );

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID",
      amount: order.amount,
      currency: order.currency,
      name: "The Last Trade",
      description: selectedService?.title || "",
      image: "/logo.png",
      order_id: order.id,
      handler: async (response: RazorpayResponse) => {
        alert("Payment Successful");
        router.push("/thank-you");
      },
      prefill: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone,
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
      <section
        className="relative py-12 text-center text-white"
        style={{
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 blur-sm"></div>
        <div className="relative container mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-6">
            9 Golden Rules for Trading in the Stock Market
          </h2>
          <ul className="space-y-4">
            {[
              { text: "Choose the right stocks", icon: "📈" },
              { text: "Take calculated risks", icon: "🧮" },
              { text: "Do thorough research", icon: "🔍" },
              { text: "Take expert's help", icon: "🧑‍🏫" },
              { text: "Never be emotional", icon: "😌" },
              { text: "Redressal of grievance", icon: "📜" },
              { text: "Use Stop Loss", icon: "⛔" },
              { text: "Don't be greedy", icon: "💡" },
              { text: "Never take decisions based on rumors", icon: "🚫" },
            ].map((rule, index) => (
              <li
                key={index}
                className="flex items-center justify-center gap-3 p-4 bg-white bg-opacity-10 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <span className="text-2xl">{rule.icon}</span>
                <span className="font-semibold">{rule.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="bg-gray-900 py-12 relative"
        style={{
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative bg-white/30 backdrop-blur-md p-8 rounded-lg container mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
            What Services We Offer
          </h2>
          <div className="grid justify-items-center">
            {/* Service Card */}
            <div
              className="bg-white/50 bg-opacity-80 p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 hover:shadow-xl"
              style={{ width: "500px" }}
            >
              <Image
                src="/assets/stock-education.png"
                alt="Stock Market Education"
                width={500}
                height={160}
                className="w-full h-40 object-cover rounded-t-lg mb-4 opacity-80"
              />
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Stock Market Education Services
              </h3>
              <p className="text-white leading-relaxed mb-4">
                Gain in-depth knowledge of trading strategies, hands-on
                experience, and expert insights designed to help traders excel
                in the stock market. Our course includes:
              </p>
              <ul className="text-left text-white list-disc list-inside space-y-2 mb-4">
                <li>
                  <span className="font-semibold text-blue-600">
                    VCP Setup:
                  </span>{" "}
                  Identify Volatility Contraction Patterns.
                </li>
                <li>
                  <span className="font-semibold text-blue-600">
                    Rocket Base Setup:
                  </span>{" "}
                  Master setups for rapid gains.
                </li>
                <li>
                  <span className="font-semibold text-blue-600">
                    Sector Rotation:
                  </span>{" "}
                  Spot trends and adjust your portfolio.
                </li>
              </ul>
              <Button
                label="Learn More"
                onClick={handleLearnMore}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactUs />

      <Footer />

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceDetails={selectedService}
        onProceedToBuy={handleProceedToBuy}
      />
    </>
  );
};

export default Home;
