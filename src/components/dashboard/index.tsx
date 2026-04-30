import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import DashboardClient from "./components/dashboardClient";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Fetch activities
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardClient initialActivities={activities ?? []} userId={user.id} />
  );
}
