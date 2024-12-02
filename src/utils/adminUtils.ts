import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Cupcake = Tables<"cupcakes">;

export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] ?? '')
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const logActivity = async (
  action: string,
  entityType: string,
  entityId: string,
  details?: any
) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from('activity_logs').insert({
    user_id: session.user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details
  });

  if (error) throw error;
};

export const updateCupcakesBatch = async (
  ids: number[],
  updates: Partial<Cupcake>
) => {
  const { error } = await supabase
    .from('cupcakes')
    .update(updates)
    .in('id', ids);

  if (error) throw error;
};