/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext"; // Correctly use the custom hook
import axios from "axios"; // For making API requests
import backgroundImg from "../assets/background.jpg"; // Importing background image
import stockeducationImg from "../assets/stock-education.png";

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

const handleSendMessage = () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  const whatsappMessage = `Hello, I'm ${name}.%0A%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage: ${message}`;
  const whatsappNumber = "+917258840855";

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`,
    "_blank"
  );
};

export function Homepage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const { isAuthenticated, user } = useAuth();
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

    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/create-order",
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
        description: selectedService.title,
        image: "/logo.png",
        order_id: order.id,
        handler: async (response) => {
          alert("Payment Successful");
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
      <section
        className="relative py-12 text-center text-white"
        style={{
          backgroundImage: `url(${backgroundImg})`,
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
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative bg-white/70 backdrop-blur-md p-8 rounded-lg container mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8">
            What Services We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {/* Service Card */}
            <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md transform transition duration-500 hover:scale-105 hover:shadow-xl">
              <img
                src={stockeducationImg}
                alt="Stock Market Education"
                className="w-full h-40 object-cover rounded-t-lg mb-4 opacity-80"
              />
              <h3 className="text-xl font-semibold mb-3 text-blue-800">
                Stock Market Education Services
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Gain in-depth knowledge of trading strategies, hands-on
                experience, and expert insights designed to help traders excel
                in the stock market. Our course includes:
              </p>
              <ul className="text-left text-gray-600 list-disc list-inside space-y-2 mb-4">
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
                className="bg-blue-600 text-white px-4 py-2 rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-8">Contact Us</h2>
          <form className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              className="w-full p-3 bg-gray-900 rounded"
            />
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              className="w-full p-3 bg-gray-900 rounded"
            />
            <input
              type="tel"
              id="phone"
              placeholder="Your Phone"
              className="w-full p-3 bg-gray-900 rounded"
            />
            <textarea
              id="message"
              placeholder="Your Message"
              className="w-full p-3 bg-gray-900 rounded"
              rows="4"
            ></textarea>
            <Button
              label="Send Message"
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            />
          </form>
        </div>
      </section>

      <Footer />
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceDetails={selectedService}
        onProceedToBuy={handleProceedToBuy}
      />
    </>
  );
}
