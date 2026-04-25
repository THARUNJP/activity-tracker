import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export default async function DashboardPage() {
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
    .order("is_default", { ascending: false });

  // Fetch settings
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return <></>;
}
