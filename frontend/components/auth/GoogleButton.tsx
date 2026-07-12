"use client";

import { useState } from "react";

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
    <div className={className}>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() =>
            setError("Google sign in failed.")
          }
          theme="filled_black"
          shape="pill"
          text="continue_with"
          width="350"
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