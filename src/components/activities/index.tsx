import { redirect } from "next/navigation";
import ActivitiesClient from "./components/activitiesClient";
import { createClient } from "@/supabase/server";

export default async function Activities() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <ActivitiesClient userId={user.id} initialActivities={activities ?? []} />
  );
}
