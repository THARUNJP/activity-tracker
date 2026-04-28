import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import TargetsClient from "./components/target";

export default async function Targets() {
  const supabase = await createClient();

  // ---- AUTH ----
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // ---- ACTIVITIES (only required fields) ----
  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select("id, name, color, icon")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (activitiesError) {
    console.error("Activities fetch error:", activitiesError.message);
  }

  // ---- TARGETS ----
  const { data: targets, error: targetsError } = await supabase
    .from("activity_targets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (targetsError) {
    console.error("Targets fetch error:", targetsError.message);
  }

  return (
    <TargetsClient
      userId={user.id}
      activities={activities ?? []}
      initialTargets={targets ?? []}
    />
  );
}
