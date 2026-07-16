import { createClient } from "@/utils/supabase/client";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://designature.onrender.com";

export interface BackendUser {
  id: number;
  auth_user_id: string;
  email: string;
  display_name: string;
  sub_plan: string;
  role: string;
}

/**
 * Grabs the active Supabase JWT access token and synchronizes/registers
 * the user with the FastAPI backend at https://designature.onrender.com.
 * Tries both generic POST /users and fallback POST /users/sync.
 */
export async function syncUserWithBackend(): Promise<BackendUser | null> {
  const supabase = createClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn("No active Supabase session found for backend sync.");
      return null;
    }

    const token = session.access_token;
    console.log("Synchronizing user with Render FastAPI backend using Supabase JWT...");

    // 1. Try targeting POST /users/sync (common fastapi router setup)
    try {
      const response = await fetch(`${BACKEND_URL}/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully synchronized user via POST /users/sync:", data);
        return data;
      }
      console.warn(`POST /users/sync returned status ${response.status}. Retrying alternate POST /users route...`);
    } catch (e) {
      console.warn("POST /users/sync failed or was unreachable. Trying alternate route...", e);
    }

    // 2. Fallback to POST /users
    const fallbackResponse = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!fallbackResponse.ok) {
      throw new Error(`Fallback endpoint /users failed with state: ${fallbackResponse.statusText}`);
    }

    const data = await fallbackResponse.json();
    console.log("Successfully synchronized user via fallback POST /users:", data);
    return data;
  } catch (error) {
    console.error("Backend user authentication sync failed entirely:", error);
    return null;
  }
}
