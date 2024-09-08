/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { Slider } from "../components/Slider";

export function Dashboard() {
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://yourapi.com/api/v1/user/courses",
          
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserCourses(response.data.courses);
      } catch (error) {
        setError("Failed to fetch courses");
        console.error("Error fetching user courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, []);

  return (
    <>
      <Appbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>

        {loading ? (
          <p>Loading your courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Your Enrolled Courses
            </h2>
            {userCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-700 mb-2">
                      Status: {course.status}
                    </p>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <Button label="View Details" className="w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <p>No enrolled courses found.</p>
            )}
          </>
        )}
      </div>
      <Slider />
      <Footer />
    </>
  );
}
