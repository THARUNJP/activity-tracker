import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import SchedulesClient from "./components/schedulesClient";

export default async function Schedules() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select("id, name, color, icon")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (activitiesError) {
    console.error("Activities fetch error:", activitiesError.message);
  }

  const { data: schedules, error: schedulesError } = await supabase
    .from("default_schedules")
    .select("*")
    .eq("user_id", user.id)
    .order("start_time", { ascending: true });

  if (schedulesError) {
    console.error("Schedules fetch error:", schedulesError.message);
  }

  return (
    <SchedulesClient
      userId={user.id}
      activities={activities ?? []}
      initialSchedules={schedules ?? []}
    />
  );
}
