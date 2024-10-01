/* eslint-disable react/prop-types */
"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
// Import images directly or ensure the correct relative paths
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";

const images = [img1, img2, img3];

export function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, []); // Empty dependency array, runs once

  return (
    <div className="relative w-full h-64 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-80" : "opacity-0"
          }`}
        >
          <Image 
          src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"/>
        </div>
      ))}
    </div>
  );
}
