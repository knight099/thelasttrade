/* eslint-disable react/prop-types */
"use client"
import Link from "next/link";

interface BottomWarningProps {
  label: string;
  buttonText: string;
  to: string;
}

export const BottomWarning: React.FC<BottomWarningProps> = ({ label, buttonText, to }) => {
  return (
    <div className="py-2 text-sm flex justify-center text-black
    ">
      <div>{label}</div>
      <Link href={to} className="pointer underline pl-1 cursor-pointer">
        {buttonText}
      </Link>
    </div>
  );
};
