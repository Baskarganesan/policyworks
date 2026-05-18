import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ExplainabilityDrawer } from "./ExplainabilityDrawer";
import type { ExplainabilitySubject } from "./types";

interface ExplainabilityCtx {
  open: (subject: ExplainabilitySubject) => void;
  close: () => void;
}

const Ctx = createContext<ExplainabilityCtx | null>(null);

export function ExplainabilityProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<ExplainabilitySubject | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((s: ExplainabilitySubject) => {
    setSubject(s);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <ExplainabilityDrawer
        subject={subject}
        open={isOpen}
        onOpenChange={(o) => setIsOpen(o)}
      />
    </Ctx.Provider>
  );
}

export function useExplainability(): ExplainabilityCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Soft fallback so components remain safe if provider is missing in tests/SSR
    return {
      open: () => {},
      close: () => {},
    };
  }
  return ctx;
}
