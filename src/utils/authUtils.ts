import { PasswordStrength, User, DeviceLogin } from "../types";

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const feedback: string[] = [];
  if (!hasMinLength) feedback.push("At least 8 characters");
  if (!hasUppercase) feedback.push("At least one uppercase letter (A-Z)");
  if (!hasLowercase) feedback.push("At least one lowercase letter (a-z)");
  if (!hasNumber) feedback.push("At least one number (0-9)");
  if (!hasSymbol) feedback.push("At least one special character (e.g., !@#$%)");

  let metCount = 0;
  if (hasMinLength) metCount++;
  if (hasUppercase) metCount++;
  if (hasLowercase) metCount++;
  if (hasNumber) metCount++;
  if (hasSymbol) metCount++;

  const levels: {
    [key: number]: {
      score: number;
      label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Excellent";
      color: string;
    };
  } = {
    0: { score: 0, label: "Very Weak", color: "bg-red-500" },
    1: { score: 1, label: "Very Weak", color: "bg-red-500" },
    2: { score: 2, label: "Weak", color: "bg-orange-500" },
    3: { score: 3, label: "Fair", color: "bg-yellow-500" },
    4: { score: 4, label: "Strong", color: "bg-emerald-500" },
    5: { score: 4, label: "Excellent", color: "bg-teal-500" },
  };

  const selected = levels[metCount];

  return {
    score: selected.score,
    feedback,
    label: selected.label,
    color: selected.color,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
  };
}

const DEFAULT_DEVICES: DeviceLogin[] = [
  {
    id: "device-1",
    deviceName: "Apple MacBook Pro 16\"",
    browser: "Chrome 122.0",
    ipAddress: "192.168.1.45 (Local) / 73.140.92.12",
    location: "San Jose, CA, USA",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "device-2",
    deviceName: "iPhone 15 Pro",
    browser: "Safari Mobile 17.2",
    ipAddress: "172.56.21.110 (Cellular)",
    location: "Oakland, CA, USA",
    lastActive: "3 hours ago",
    isCurrent: false,
  }
];

export function getInitialUsers(): User[] {
  const stored = localStorage.getItem("auth_portal_users");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
  }

  // Prepopulate with a default testing user corresponding to the metadata email
  const initial: User[] = [
    {
      id: "user-default",
      email: "ujwalkhatiwada2021@gmail.com",
      password: "Password@123", // Encrypted dummy representing verified mock hashed db passwords
      name: "Ujwal Khatiwada",
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), // 30 days ago
      lastLoginAt: new Date().toISOString(),
      isOAuth: false,
      devices: DEFAULT_DEVICES
    },
    {
      id: "user-demo",
      email: "demo@example.com",
      password: "DemoUserPass!2026",
      name: "Demo User",
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      lastLoginAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      isOAuth: false,
      devices: [
        {
          id: "device-3",
          deviceName: "Windows Core PC",
          browser: "Firefox 125.0",
          ipAddress: "24.112.98.54",
          location: "Seatle, WA, USA",
          lastActive: "1 day ago",
          isCurrent: false,
        }
      ]
    }
  ];

  localStorage.setItem("auth_portal_users", JSON.stringify(initial));
  return initial;
}

export function saveUsers(users: User[]): void {
  localStorage.setItem("auth_portal_users", JSON.stringify(users));
}
