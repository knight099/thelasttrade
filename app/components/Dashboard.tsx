"use client"

import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext"; // Assuming AuthContext is in components
import { useRouter } from "next/router";
import { Button } from "../components/Button"; // Assuming you have a Button component
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import axios from "axios"; // For API requests

interface Course {
  id: number;
  title: string;
  description: string;
  link: string;
}

// Mock data for available courses
const availableCourses: Course[] = [
  {
    id: 1,
    title: "VCP Setup",
    description: "Learn the Volatility Contraction Pattern (VCP) for high probability trades.",
    link: "/courses/vcp-setup",
  },
  {
    id: 2,
    title: "Rocket Base Setup",
    description: "A specialized trading setup focusing on rapid gains in a short timeframe.",
    link: "/courses/rocket-base",
  },
  // Add more courses as needed
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch enrolled courses from backend (Mock or actual API)
  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get("/api/user/courses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch enrolled courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEnrolledCourses();
    } else {
      router.push("/signin"); // Redirect to signin if not authenticated
    }
  }, [isAuthenticated, router]);

  // Handle buy now for available courses
  const handleBuyNow = (courseLink: string) => {
    router.push(courseLink); // Navigate to course details or checkout page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Appbar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}!</h1>

        {enrolledCourses.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Enrolled Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p>{course.description}</p>
                  <Button label="Go to Course" onClick={() => router.push(`/courses/${course.id}`)} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => (
                <div key={course.id} className="border p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p>{course.description}</p>
                  <Button label="Buy Now" onClick={() => handleBuyNow(course.link)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
