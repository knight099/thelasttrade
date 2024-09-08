/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";

const courses = [
  {
    title: "Equity Cash Intraday",
    description:
      "Get exclusive access to equity cash intraday trading tips and strategies tailored for high-frequency traders.",
    link: "/courses/equity-cash-intraday",
  },
  {
    title: "Index Option (Standard Package)",
    description:
      "Standard package for index option trading, including regular market insights and updates.",
    link: "/courses/index-option-standard",
  },
  {
    title: "Index Option (Premium)",
    description:
      "Premium package with enhanced features, including in-depth market analysis and premium support.",
    link: "/courses/index-option-premium",
  },
  {
    title: "Index Option (Combo Package)",
    description:
      "Combo package offering a comprehensive mix of trading strategies across different asset types.",
    link: "/courses/index-option-combo",
  },
];

export const Courses = () => {
    const navigate = useNavigate();
  return (
    <>
      <Appbar />
      <div className="container mx-auto py-10 px-4">
        <Heading level={2} text="Our courses" className="text-center mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {courses.map((pkg, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4">{pkg.title}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <Button
                label="Learn More"
                onClick={() => navigate(pkg.link)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              />
            </div>
          ))}
        </div>
      </div>
      <Slider />
      <Footer />
    </>
  );
};
