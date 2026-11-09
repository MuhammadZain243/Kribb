const FALLBACK = "Something went wrong. Please try again.";

type ClerkLikeError = {
  errors?: {
    message?: string;
    longMessage?: string;
    meta?: { paramName?: string };
  }[];
};

/** Extracts a readable message (and the offending field) from a Clerk error. */
export function getClerkError(error: unknown): {
  message: string;
  param?: string;
} {
  const first = (error as ClerkLikeError | null)?.errors?.[0];

  if (first) {
    return {
      message: first.longMessage ?? first.message ?? FALLBACK,
      param: first.meta?.paramName,
    };
  }

  if (error instanceof Error) return { message: error.message };

  return { message: FALLBACK };
}

export const getErrorMessage = (error: unknown): string =>
  getClerkError(error).message;
