import { Card } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon, description, isLoading }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">
          {isLoading ? "..." : value}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="p-3 bg-primary/10 rounded-full">
        {icon}
      </div>
    </div>
  </Card>
);

export const StatsPanel = () => {
  const { data: salesData, isLoading: isLoadingSales } = useQuery({
    queryKey: ["admin-sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("status", "completed");

      if (error) throw error;
      return data.reduce((acc, order) => acc + Number(order.total_amount), 0);
    },
  });

  const { data: productsCount, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("cupcakes")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },
  });

  const { data: pendingOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-pending-orders"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total de Vendas"
        value={isLoadingSales ? "..." : `R$ ${salesData?.toFixed(2)}`}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        description="Vendas finalizadas"
        isLoading={isLoadingSales}
      />
      <StatCard
        title="Produtos"
        value={productsCount || 0}
        icon={<Package className="h-5 w-5 text-primary" />}
        isLoading={isLoadingProducts}
      />
      <StatCard
        title="Pedidos Pendentes"
        value={pendingOrders || 0}
        icon={<ShoppingCart className="h-5 w-5 text-primary" />}
        isLoading={isLoadingOrders}
      />
    </div>
  );
};