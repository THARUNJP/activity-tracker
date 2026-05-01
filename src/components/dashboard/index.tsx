import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import DashboardClient from "./components/dashboardClient";
import { startOfYear } from "@/lib/helper";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const yearStart = startOfYear().toISOString();

  const [activitiesRes, entriesRes, targetsRes] = await Promise.all([
    supabase
      .from("activities")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),

    supabase
      .from("time_entries")
      .select("id, activity_id, start_time, end_time, duration_seconds")
      .eq("user_id", user.id)
      .not("end_time", "is", null)
      .gte("start_time", yearStart)
      .order("start_time", { ascending: false }),

    supabase
      .from("activity_targets")
      .select("*")
      .eq("user_id", user.id),
  ]);

  if (activitiesRes.error) console.error(activitiesRes.error.message);
  if (entriesRes.error) console.error(entriesRes.error.message);
  if (targetsRes.error) console.error(targetsRes.error.message);

  return (
    <DashboardClient
      userId={user.id}
      activities={activitiesRes.data ?? []}
      entriesYear={entriesRes.data ?? []}
      targets={targetsRes.data ?? []}
    />
  );
}
