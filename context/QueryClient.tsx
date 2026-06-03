"use client";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

const QueryClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#1e44b5" showSpinner={false} shadow={false} />
      {children}
      <Toaster richColors closeButton />
    </QueryClientProvider>
  );
};

export default QueryClientWrapper;
