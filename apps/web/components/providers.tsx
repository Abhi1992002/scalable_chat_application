"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

type ProvidersProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ClerkProvider>
      <RecoilRoot>{children}</RecoilRoot>
      <Toaster />
    </ClerkProvider>
  );
};
