import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { StatsPanel } from "@/components/admin/StatsPanel";
import { CupcakeManager } from "@/components/admin/CupcakeManager";
import { ReportsPanel } from "@/components/admin/ReportsPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Não autenticado");

      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && !profile?.is_admin) {
      navigate("/");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) return null;
  if (!profile?.is_admin) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cupcake-800">
            Painel Administrativo
          </h1>
        </div>

        <StatsPanel />

        <div className="mt-8">
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="reports">Relatórios</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <TabsContent value="products" className="mt-6">
                <CupcakeManager />
              </TabsContent>
              <TabsContent value="reports" className="mt-6">
                <ReportsPanel />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;