import { verifyAdminToken } from "./auth";

// Helper to require admin token
export function requireAdmin(token?: string) {
  if (!token) throw new Error("Unauthorized: No token provided");
  return verifyAdminToken(token); // throws if invalid
}
