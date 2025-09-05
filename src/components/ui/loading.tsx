import { Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface LoadingProps {
  title?: string;
  message?: string;
  variant?: "loading" | "success" | "error" | "auth";
  size?: "sm" | "md" | "lg";
}

const Loading = ({
  title,
  message,
  variant = "loading",
  size = "md",
}: LoadingProps) => {
  const variants = {
    loading: {
      icon: Loader2,
      iconClass: "text-gray-400 animate-spin",
      title: title || "Loading...",
      message: message || "Please wait while we process your request.",
      bgColor: "text-gray-400",
    },
    success: {
      icon: CheckCircle,
      iconClass: "text-green-500",
      title: title || "Success!",
      message: message || "Operation completed successfully.",
      bgColor: "text-green-500",
    },
    error: {
      icon: AlertCircle,
      iconClass: "text-red-500",
      title: title || "Error",
      message: message || "Something went wrong. Please try again.",
      bgColor: "text-red-500",
    },
    auth: {
      icon: Clock,
      iconClass: "text-blue-500",
      title: title || "Authenticating...",
      message: message || "Please wait while we verify your credentials.",
      bgColor: "text-blue-500",
    },
  };

  const sizes = {
    sm: {
      container: "py-8",
      icon: "text-4xl mb-3",
      title: "text-lg font-semibold mb-2",
      message: "text-sm",
    },
    md: {
      container: "py-16",
      icon: "text-6xl mb-4",
      title: "text-xl font-semibold mb-2",
      message: "text-base",
    },
    lg: {
      container: "py-20",
      icon: "text-8xl mb-6",
      title: "text-2xl font-semibold mb-3",
      message: "text-lg",
    },
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];
  const IconComponent = currentVariant.icon;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div
          className={`${currentSize.icon} ${currentVariant.bgColor} mx-auto`}
        >
          <IconComponent
            className={`w-full h-full ${currentVariant.iconClass}`}
          />
        </div>
        <h3 className={`${currentSize.title} text-gray-900`}>
          {currentVariant.title}
        </h3>
        <p className={`${currentSize.message} text-gray-500 max-w-md mx-auto`}>
          {currentVariant.message}
        </p>
      </div>
    </div>
  );
};

export default Loading;
