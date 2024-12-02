import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ReportsPanel = () => {
  const { data: salesData } = useQuery({
    queryKey: ["sales-report"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const groupedData = data.reduce((acc: any, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, total: 0, count: 0 };
        }
        acc[date].total += curr.total_amount;
        acc[date].count += 1;
        return acc;
      }, {});

      return Object.values(groupedData);
    },
  });

  const { data: topProducts } = useQuery({
    queryKey: ["top-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cupcakes")
        .select("title, order_count")
        .order("order_count", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Relatórios</h2>
      
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total de Vendas (R$)"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Número de Pedidos"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="order_count"
                  name="Quantidade de Pedidos"
                  fill="#8884d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};