"use client";

import { createContext, useContext } from "react";

type SessionCtx = { isStaff: boolean };

const Ctx = createContext<SessionCtx>({ isStaff: false });

export function SessionProvider({
  isStaff,
  children,
}: {
  isStaff: boolean;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ isStaff }}>{children}</Ctx.Provider>;
}

export function useSession() {
  return useContext(Ctx);
}
