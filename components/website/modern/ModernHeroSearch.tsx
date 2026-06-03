"use client";

import React from "react";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";

export function ModernHeroSearch({ general }: { general: WebsiteGeneral }) {
  const accent = general.primaryColor || "#246AF6";

  return (
    <div className="relative z-20 mx-auto flex w-full max-w-5xl justify-center px-3 sm:px-4 md:max-w-6xl md:px-5">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-[10px] border bg-white px-8 py-3 text-xl font-semibold tracking-tight shadow-sm transition hover:bg-neutral-50"
        style={{ borderColor: `${accent}66`, color: accent }}
      >
        Get Started
      </button>
    </div>
  );
}
