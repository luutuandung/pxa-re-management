
// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type User } from '@pxa-re-management/shared';
import { api } from '@/utils/api-client';

type AuthState =
  | { status: "loading"; user?: undefined; error?: undefined }
  | { status: "authenticated"; user: User; error?: undefined }
  | { status: "unauthenticated"; user?: undefined; error?: Error };

type AuthContextValue = AuthState & {
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  status: "loading",
  refetch: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  const getLoginUser = async () => {
    try {
      const user: User = await api
        .get<User>('user/login-user', {})
        .json();

      setState({ status: "authenticated", user });
    } catch (err: any) {
      setState({ status: "unauthenticated", error: err });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      await getLoginUser();
    })();
    return () => controller.abort();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      refetch: getLoginUser,
    }),
    [state],
  );

  // 初期化中は「描画前のゲート」としてローディングを表示
  if (state.status === "loading") {
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
