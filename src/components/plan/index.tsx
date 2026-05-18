import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import PlanClient from "./components/planClient";

export default async function Plan() {
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

  const { data: plans, error: plansError } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .order("start_time", { ascending: true });

  if (plansError) {
    console.error("Plans fetch error:", plansError.message);
  }

  return (
    <PlanClient
      userId={user.id}
      activities={activities ?? []}
      initialPlans={plans ?? []}
    />
  );
}
