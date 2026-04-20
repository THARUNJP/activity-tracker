import Sidebar from "@/layout/sideBar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex">
      <Sidebar userEmail="thax12@gmail.com" />
      <main className="flex-1">{children}</main>
    </div>
  );
}