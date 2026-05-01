import Sidebar from "@/layout/sideBar";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

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
