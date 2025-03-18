import React from "react";

type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
};

const buttonStyles = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

const buttonSizes = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-md",
  lg: "px-6 py-3 text-lg",
};

const Button: React.FC<ButtonProps> = ({ label, variant = "primary", size = "md", onClick }) => {
  return (
    <button
      className={`rounded ${buttonStyles[variant]} ${buttonSizes[size]} transition-all duration-200`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
