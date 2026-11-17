"use client";

import { MissionGuard } from "@/components/chrome";

export default function MissionLayout({ children }: { children: React.ReactNode }) {
  return <MissionGuard>{children}</MissionGuard>;
}
