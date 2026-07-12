"use client";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({
  className = "",
}: LoadingSpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`h-4 w-4 animate-spin ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />

      <path
        fill="currentColor"
        className="opacity-75"
        d="M22 12a10 10 0 00-10-10v4a6 6 0 016 6h4z"
      />
    </svg>
  );
}