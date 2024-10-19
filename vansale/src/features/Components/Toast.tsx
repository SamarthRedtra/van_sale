import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning" | "";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Start fade-out transition
      setTimeout(() => {
        onClose(); // Call onClose after the transition ends
      }, 500); // Delay matches the fade-out transition duration
    }, 5000); // Display toast for 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeClasses = {
    success:
      "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    error: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    "": "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 flex items-center w-full max-w-xs p-4 text-sm rounded-lg transition-all duration-500 ease-in-out shadow-xl",
        typeClasses[type],
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
      role="alert"
    >
      {getIcon(type)}
      <div className="ms-3 font-normal flex-grow">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsVisible(false)}
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

const getIcon = (type: ToastProps["type"]) => {
  switch (type) {
    case "success":
      return (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-300" />
      );
    case "error":
      return <X className="w-5 h-5 text-red-600 dark:text-red-300" />;
    case "warning":
      return (
        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
      );
    case "info":
      return <Info className="w-5 h-5 text-blue-600 dark:text-blue-300" />;
    default:
      return null;
  }
};
