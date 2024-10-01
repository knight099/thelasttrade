/* eslint-disable no-unused-vars */
"use client"
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Slider } from "../components/Slider";
import { AuthProvider, useAuth } from "../components/AuthContext";
import Image from "next/image";
import backgroundImage from "../assets/background.jpg"; // Use Next.js public folder for images

// TypeScript interface for the course details
interface Course {
  title: string;
  description: string;
  details: string;
  link: string;
}

// List of courses with details
const courses: Course[] = [
  {
    title: "VCP SETUP",
    description:
      "Learn the Volatility Contraction Pattern (VCP) for high probability trades.",
    details:
      "Master the VCP Setup to identify breakout points with low risk and high reward trades.",
    link: "/checkout",
  },
  {
    title: "ROCKET BASE SETUP",
    description:
      "A specialized trading setup focusing on rapid gains in a short timeframe.",
    details:
      "Rocket Base Setup teaches you how to capitalize on rapid momentum moves in the stock market.",
    link: "/checkout",
  },
  {
    title: "FUNDAMENTAL ANALYSIS",
    description:
      "Deep dive into analyzing companies based on their financials and market potential.",
    details:
      "This course covers essential fundamental analysis techniques for picking the right stocks.",
    link: "/checkout",
  },
  {
    title: "SECTOR ROTATION LIKE A PRO",
    description:
      "Understand the dynamics of sector rotation to align your trades with market trends.",
    details:
      "Learn how to shift your investments between sectors to maximize gains during different market cycles.",
    link: "/checkout",
  },
  {
    title: "MULTI BAGGER AND SCREENERS",
    description:
      "Identify multi-bagger stocks using advanced screeners and analysis techniques.",
    details:
      "Find potential multi-bagger stocks before they break out with our screening tools.",
    link: "/checkout",
  },
  {
    title: "1 Month Special Group",
    description:
      "Exclusive access to a special group with links shared via email and WhatsApp.",
    details:
      "Get a month of dedicated trading tips and strategies directly from experts.",
    link: "/checkout",
  },
  {
    title: "RECORDING MILEGI RELAXX",
    description:
      "Access all course recordings at your convenience for relaxed learning.",
    details:
      "Catch up on course materials anytime with recorded sessions available for replay.",
    link: "/checkout",
  },
  {
    title: "PROFITABLE OPTIONS",
    description:
      "Become a profitable options trader with strategies that work in all market conditions.",
    details:
      "Step-by-step guidance on stocks and index such as nifty, bank-nifty, finnifty, midcap nifty trading tactics to consistently make profits.",
    link: "/checkout",
  },
];

export function Courses() {
    
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Use the custom hook to check authentication
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Handle opening the modal with course details
  const handleLearnMore = (course: Course) => {
    setSelectedCourse(course);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  // Handle navigating to the payment page
  const handleBuyNow = (course: Course) => {
    if (isAuthenticated) {
      router.push({
        pathname: course.link,
        query: { courseTitle: course.title }, // Passing course data as query parameter
      });
    } else {
      router.push({
        pathname: "/signin",
        query: {
          redirectTo: course.link, // Redirect to checkout page after sign-in
          courseTitle: course.title, // Passing course data as query parameter
        },
      });
    }
  };

  return (
    <>
    <AuthProvider>
      <Appbar />
      <div className="relative min-h-screen bg-cover bg-center">
        <Image
          src={backgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        <div className="relative container mx-auto py-10 px-4 z-10">
          <Heading
            level={2}
            text="Our Courses"
            className="text-center text-white mb-8"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-lg p-6 bg-gray-800 bg-opacity-80 hover:shadow-2xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  {course.title}
                </h3>
                <p className="text-gray-300 mb-4">{course.description}</p>
                <Button
                  label="Learn More"
                  onClick={() => handleLearnMore(course)}
                />
              </div>
            ))}
          </div>
        </div>
        <Slider />
        <Footer />

        {/* Modal for course details */}
        {selectedCourse && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-gray-900 text-white rounded-lg p-8 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                {selectedCourse.title}
              </h2>
              <p className="text-gray-300 mb-6">{selectedCourse.details}</p>
              <div className="flex justify-between">
                <Button label="Close" onClick={handleCloseModal} />
                <Button
                  label="Buy Now"
                  onClick={() => handleBuyNow(selectedCourse)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      </AuthProvider>
    </>
    
  );

}
