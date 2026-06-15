"use client";

import { Menu, X } from "lucide-react";
import { useMobileSidebarOptional } from "@/context/mobile-sidebar-context";

export function MobileSidebarTrigger() {
  const ctx = useMobileSidebarOptional();
  if (!ctx) return null;

  const { isOpen, toggle } = ctx;

  return (
    <button
      type="button"
      onClick={toggle}
      className="adm-mobile-menu-btn"
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
    </button>
  );
}
