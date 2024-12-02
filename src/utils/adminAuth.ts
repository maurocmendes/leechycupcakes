import { supabase } from "@/integrations/supabase/client";

export const checkAdminStatus = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return data?.is_admin || false;
};