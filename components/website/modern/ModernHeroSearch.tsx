"use client";

import React from "react";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";
import { HeroSearchFilters } from "../shared/HeroSearchFilters";

export function ModernHeroSearch({ general }: { general: WebsiteGeneral }) {
  return (
    <HeroSearchFilters general={general} />
  );
}

