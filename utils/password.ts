export type PasswordCheck = { id: string; label: string; passed: boolean };

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    {
      id: "length",
      label: "At least 8 characters",
      passed: password.length >= 8,
    },
    {
      id: "case",
      label: "Upper and lowercase letters",
      passed: /[a-z]/.test(password) && /[A-Z]/.test(password),
    },
    { id: "number", label: "A number", passed: /\d/.test(password) },
    {
      id: "symbol",
      label: "A symbol (e.g. ! @ #)",
      passed: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

const COLORS = ["#E5E7EB", "#EF4444", "#F97316", "#EAB308", "#22C55E"];
const LABELS = ["", "Weak", "Fair", "Good", "Strong"];

/** Score 0-4 used by the strength meter (guidance only, Clerk enforces rules). */
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: COLORS[0] };

  if (password.length < 8) {
    return { score: 1, label: "Too short", color: COLORS[1] };
  }

  const score = getPasswordChecks(password).filter((c) => c.passed).length;
  return { score, label: LABELS[score], color: COLORS[score] };
}
