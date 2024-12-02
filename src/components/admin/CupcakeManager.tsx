import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CupcakeList } from "./CupcakeList";
import { ActivityLogsTable } from "./ActivityLogsTable";
import { CupcakeOperations } from "./CupcakeOperations";
import { checkAdminStatus } from "@/utils/adminAuth";
import { toast } from "sonner";

export const CupcakeManager = () => {
  const [selectedCupcakes, setSelectedCupcakes] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ["admin-check"],
    queryFn: checkAdminStatus,
  });

  const { data: cupcakes, isLoading } = useQuery({
    queryKey: ["admin-cupcakes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cupcakes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  const { data: activityLogs } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    enabled: !!isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("cupcakes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cupcakes"] });
      toast.success("Cupcake removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting cupcake:", error);
      toast.error("Erro ao remover cupcake: " + error.message);
    },
  });

  if (isCheckingAdmin) return <div>Verificando permissões...</div>;
  if (!isAdmin) return <div>Acesso não autorizado</div>;
  if (isLoading) return <div>Carregando cupcakes...</div>;

  return (
    <Card className="p-6">
      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <CupcakeOperations
            cupcakes={cupcakes || []}
            selectedCupcakes={selectedCupcakes}
            setSelectedCupcakes={setSelectedCupcakes}
          />

          <div className="overflow-x-auto">
            <CupcakeList
              cupcakes={cupcakes || []}
              selectedCupcakes={selectedCupcakes}
              onSelect={(id, checked) => {
                if (checked) {
                  setSelectedCupcakes([...selectedCupcakes, id]);
                } else {
                  setSelectedCupcakes(selectedCupcakes.filter(cid => cid !== id));
                }
              }}
              onSelectAll={(checked) => {
                if (checked && cupcakes) {
                  setSelectedCupcakes(cupcakes.map(c => c.id));
                } else {
                  setSelectedCupcakes([]);
                }
              }}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Logs de Atividade</h2>
          </div>
          <ScrollArea className="h-[500px]">
            <ActivityLogsTable logs={activityLogs || []} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};