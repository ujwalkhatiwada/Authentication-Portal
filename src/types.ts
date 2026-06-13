export interface DeviceLogin {
  id: string;
  deviceName: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface User {
  id: string;
  email: string;
  password?: string; // Optional for OAuth users
  name: string;
  avatarUrl?: string;
  isOAuth: boolean;
  oauthProvider?: "google" | "github" | "microsoft";
  createdAt: string;
  lastLoginAt: string;
  devices: DeviceLogin[];
}

export interface Session {
  user: User | null;
  token: string | null;
}

export type AuthScreen = "signin" | "signup" | "recovery" | "dashboard";

export interface PasswordStrength {
  score: number; // 0 to 4
  feedback: string[];
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Excellent";
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}
