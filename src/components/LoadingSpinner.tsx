import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "medium", 
  message = "Loading..." 
}) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-cyberblue-500 animate-spin`}
      />
      {message && (
        <p className="mt-2 text-sm text-cybergray-600 dark:text-cybergray-400">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;