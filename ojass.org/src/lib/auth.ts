import jwt, { JwtPayload } from "jsonwebtoken";

interface AdminJwtPayload extends JwtPayload {
  email: string;
  role: "admin";
}

const ADMIN_USER_IDS = process.env.ADMIN_USER_ID?.split(",") || [];
const ADMIN_PASSWORDS = process.env.ADMIN_PASSWORD?.split(",") || [];
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

// Generate token
export function generateAdminToken(email: string): string {
  if (!ADMIN_USER_IDS.includes(email)) {
    throw new Error("Unauthorized admin");
  }
  return jwt.sign({ email, role: "admin" } as AdminJwtPayload, JWT_SECRET, {
    expiresIn: "2h",
  });
}

// Verify token
export function verifyAdminToken(token?: string): AdminJwtPayload {
  if (!token) throw new Error("No token provided");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;

    if (decoded.role !== "admin") {
      throw new Error("Invalid admin");
    }

    return decoded;
  } catch {
    throw new Error("Invalid or expired token");
  }
}

// Validate login
export function validateAdminLogin(email: string, password: string): boolean {
  const index = ADMIN_USER_IDS.indexOf(email);
  return index !== -1 && ADMIN_PASSWORDS[index] === password;
}
