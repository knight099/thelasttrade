// frontend/src/pages/Pricing.tsx
/* eslint-disable no-unused-vars */
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";
import { Heading } from "../components/Heading";
import { PricingCard } from "../components/PricingCard";
import { ContactUs } from "../components/ContactUs";
// import { useRouter } from "next/navigation";
import backgroundImage from "../assets/background2.jpg";

// Define the structure of pricing data
interface PricingData {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  link?: string; // Optional, as some items don't have a link
}



export default function Pricing() {
//   const router = useRouter();

  // Example pricing data
  const pricingData: PricingData[] = [
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
      link: "/checkout",
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
      link: "/checkout",
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
      link: "/checkout",
    },
  ];

  return (
    <>
      <Appbar />
      <Slider />

      {/* Pricing Section */}
      <section
        className="bg-black-100 py-12"
        style={{ backgroundImage: `url(${backgroundImage.src})` }}
      >
        <div className="container mx-auto px-4">
          <Heading
             label="Our Pricing Plans"
          />
          <Heading label= "Choose the best plan that suits your needs."/>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {pricingData.map((course, index) => (
              <PricingCard
                key={index}
                title={course.title}
                price={course.price}
                features={course.features}
                buttonLabel={course.buttonLabel}
                link={course.link || "/checkout"} // Provide a default link if missing
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
