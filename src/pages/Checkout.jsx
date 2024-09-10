/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { Heading } from "../components/Heading";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication
import axios from "axios"; // For making API requests

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);

  // Extracting order details from location state
  useEffect(() => {
    if (location.state && location.state.course) {
      setOrderDetails(location.state.course);
    } else {
      navigate("/pricing"); // Redirect to pricing page if no order details are found
    }
  }, [location.state, navigate]);

  // Function to handle payment
  const handlePayment = async () => {
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:5000/create-order",
        {
          amount: parseInt(orderDetails.price.replace("₹", "")) * 100, // Convert to paise
          currency: "INR",
          receipt: `receipt#${Math.random().toString(36).substring(7)}`,
        }
      );

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: order.currency,
        name: "The Last Trade",
        description: orderDetails.title,
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
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <Heading
            title="Checkout"
            subtitle="Review your order and proceed with payment."
          />
          {orderDetails ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{orderDetails.title}</h2>
              <p className="text-lg font-semibold mb-2">
                Price: {orderDetails.price}
              </p>
              <ul className="list-disc list-inside mb-4">
                {orderDetails.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <Button
                label="Proceed to Payment"
                onClick={handlePayment}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              />
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};
