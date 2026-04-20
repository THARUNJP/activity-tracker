import Sidebar from "@/layout/sideBar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const user = {
    email: "",
  };
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar userEmail={user.email ?? ""} />
      <main
        style={{
          flex: 1,
          marginLeft: "240px",
          padding: "32px",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
