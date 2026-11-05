/**
 * Centralised, validated environment variables.
 *
 * NOTE: Expo only inlines `process.env.EXPO_PUBLIC_*` when it is accessed
 * statically (dot notation), so each variable is read explicitly below.
 */

const required = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Add it to your .env file.`,
    );
  }
  return value;
};

export const env = {
  clerkPublishableKey: required(
    "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY",
    process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  ),
} as const;
