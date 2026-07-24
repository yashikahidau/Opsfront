"use client";

import { useEffect, useRef, useState } from "react";

import {
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";

import FormAlert from "@/components/form/FormAlert";

import { useGoogleAuth } from "@/hooks/useGoogleAuth";

interface GoogleButtonProps {
  className?: string;
}

export default function GoogleButton({
  className,
}: GoogleButtonProps) {
  const { login } = useGoogleAuth();

  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
const [buttonWidth, setButtonWidth] = useState(350);

useEffect(() => {
  const updateWidth = () => {
    if (containerRef.current) {
      setButtonWidth(
  Math.max(200, Math.floor(containerRef.current.offsetWidth))
);
    }
  };

  updateWidth();

  const observer = new ResizeObserver(updateWidth);

  if (containerRef.current) {
    observer.observe(containerRef.current);
  }

  window.addEventListener("resize", updateWidth);

  return () => {
    observer.disconnect();
    window.removeEventListener("resize", updateWidth);
  };
}, []);

  async function handleSuccess(
    credentialResponse: CredentialResponse
  ) {
    try {
      setError("");

      await login(credentialResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign in failed."
      );
    }
  }

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div ref={containerRef} className="w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            setError("Google sign in failed.")
          }
          theme="filled_black"
          shape="pill"
          text="continue_with"
          width={buttonWidth}
        />
      </div>

      {error && (
        <div className="mt-4">
          <FormAlert variant="error">
            {error}
          </FormAlert>
        </div>
      )}
    </div>
  );
}