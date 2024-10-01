/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use Next.js's useRouter for navigation
import axios from "axios";
import { Button } from "./Button"; // Assuming Button is a separate component
import logobull from "../assets/logo-bull.jpg";
// import lasttrade from "../assets/thelasttrade-font.jpg";

export const Appbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is logged in by checking the existence of the token
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/v1/user/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/signin");
    } catch (error) {
      console.error("Error during signout:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between p-4">
        {/* Logo and Title */}
        <a
          href="/"
          className="flex items-center text-gray-900 dark:text-white space-x-3 rtl:space-x-reverse"
        >
          <img src={logobull.src} className="h-8" alt="Logo" />
          {/* <img src={lasttrade.src} className="h-8 " alt="fontlogo" /> */}
          <div className="tracking-wide text-gray-300 md:text-lg dark:text-gray-100">THE LAST TRADE</div>
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600"
          aria-controls="navbar_dropdown"
          aria-expanded={isMenuOpen}
          onClick={handleToggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } fixed top-16 left-0 w-full md:static md:flex md:w-auto md:space-x-8 md:mt-0 md:bg-grey md:dark:bg-gray-900 md:border-0`}
          id="navbar_dropdown"
        >
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:dark:bg-grey">
            {/* Home */}
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-gray-700 dark:text-white rounded hover:text-black-600 dark:hover:text-blue-400 transition"
                onClick={() => router.push("/")}
              >
                Home
              </a>
            </li>
            {/* Courses Dropdown */}
            <li className="relative group">
              <button
                id="dropdownNavbarLink"
                data-dropdown-toggle="dropdownNavbar"
                onClick={() => router.push("/courses")}
                className="flex items-center py-2 px-3 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Courses
              </button>
            </li> 
            {/* Contact Us */}
            <li>
              <a
                href="/contact"
                className="block py-2 px-3 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                onClick={() => router.push("/contact")}
              >
                Contact Us
              </a>
            </li>
            {/* Pricing */}
            <li>
              <a
                href="/pricing"
                className="block py-2 px-3 text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                onClick={() => router.push("/pricing")}
              >
                Pricing
              </a>
            </li>
            {/* Authentication Buttons */}
            {isLoggedIn ? (
              <li>
                <Button onClick={handleLogout} label={"Logout"} />
              </li>
            ) : (
              <li>
                <Button
                  onClick={() => router.push("/signin")}
                  label={"Login/Signup"}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
