/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "./Button"; // Adjust the import path based on your project structure
import backgroundImage from "../assets/background2.jpg";

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
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

  return (
    <section className="py-12 bg-gray-800 text-white">
      <div
        className="container mx-auto text-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h2 className="text-3xl font-extrabold mb-8">Contact Us</h2>
        <form
          className="max-w-xl mx-auto space-y-4"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            className="w-full p-3 bg-gray-900 rounded"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Your Email"
            className="w-full p-3 bg-gray-900 rounded"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            id="phone"
            placeholder="Your Phone"
            className="w-full p-3 bg-gray-900 rounded"
            value={formData.phone}
            onChange={handleChange}
          />
          <textarea
            id="message"
            placeholder="Your Message"
            className="w-full p-3 bg-gray-900 rounded"
            rows="4"
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <Button
            label="Send Message"
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSendMessage}
          />
        </form>
      </div>
    </section>
  );
};

