"use client";

import { useEffect } from "react";
import { useMission } from "@/store/mission-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const finish = () => useMission.setState({ hydrated: true });
    if (useMission.persist.hasHydrated()) finish();
    return useMission.persist.onFinishHydration(finish);
  }, []);

  return children;
}
