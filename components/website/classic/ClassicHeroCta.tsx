"use client";

import React from "react";

const CLASSIC_HERO_CTA_TONE = "#c4956a";

export function ClassicHeroCta() {
  return (
    <div className="relative z-20 mx-auto flex w-full max-w-5xl justify-center px-3 sm:px-4 md:max-w-6xl md:px-5">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-[10px] border bg-white px-8 py-3 text-xl font-semibold tracking-tight shadow-sm transition hover:bg-neutral-50"
        style={{ borderColor: CLASSIC_HERO_CTA_TONE, color: CLASSIC_HERO_CTA_TONE }}
      >
        Get Started
      </button>
    </div>
  );
}
