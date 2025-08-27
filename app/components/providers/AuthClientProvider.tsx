"use client";

import { AuthProvider } from "../../_lib/hooks/useAuth";
import { ReactNode } from "react";

export function AuthClientProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
