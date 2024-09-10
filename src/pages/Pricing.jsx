// frontend/src/pages/Pricing.jsx
/* eslint-disable no-unused-vars */
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";
import { Heading } from "../components/Heading";
import { PricingCard } from "../components/PricingCard";
import { ContactUs } from "../components/ContactUs";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background2.jpg";

export const Pricing = () => {
    const navigate = useNavigate();
  // Example pricing data
  const pricingData = [
    {
      title: "Beginner Stock Trading",
      price: "₹499",
      features: [
        "Introduction to Stock Market",
        "Basics of Technical Analysis",
        "Risk Management Strategies",
        "Live Q&A Sessions",
      ],
      buttonLabel: "Enroll Now",
    },
    {
      title: "Advanced Trading Strategies",
      price: "₹999",
      features: [
        "Advanced Technical Analysis",
        "Options Trading Strategies",
        "Sector Rotation Techniques",
        "Personalized Mentoring",
      ],
      buttonLabel: "Enroll Now",
    },
    {
      title: "Professional Trader",
      price: "₹1,499",
      features: [
        "Full Access to All Courses",
        "Live Trading Sessions",
        "Access to Exclusive Tools",
        "One-on-One Coaching",
      ],
      buttonLabel: "Enroll Now",
      link: "/checkout"
    },
  ];

  return (
    <>
      <Appbar />
      <Slider />

      {/* Pricing Section */}
      <section
        className="bg-black-100 py-12"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="container mx-auto px-4">
          <Heading
            title="Our Pricing Plans"
            subtitle="Choose the best plan that suits your needs."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {pricingData.map((course, index) => (
              <PricingCard
                key={index}
                title={course.title}
                price={course.price}
                features={course.features}
                buttonLabel={course.buttonLabel}
                onClick={(course) => navigate("/checkout")}
              />
            ))}
          </div>
        </div>
      </section>
        <ContactUs />
      <Footer />
    </>
  );
};
