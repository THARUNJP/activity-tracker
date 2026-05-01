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
    <div className="min-h-screen flex">
      <Sidebar userEmail={user.email ?? ""} />
      <main className="flex-1 w-full lg:ml-64 pt-14 lg:pt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
