/* eslint-disable react/prop-types */
"use client"

interface HeadingProps {
  label: string;
}
export const Heading: React.FC<HeadingProps> =({ label }) => {
  return <div className="font-bold text-4xl pt-6">{label}</div>;
}
