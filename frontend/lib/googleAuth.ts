import { apiRequest } from "./api";
import { AuthResponse } from "./auth";

export async function loginWithGoogle(
  credential: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(
    "/api/auth/google",
    {
      method: "POST",
      body: {
        credential,
      },
    }
  );
}