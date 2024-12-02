import { Sidebar } from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MenuTable } from "@/components/MenuTable";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Menu = () => {
  const isMobile = useIsMobile();
  
  const { data: cupcakes = [] } = useQuery({
    queryKey: ["cupcakes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cupcakes")
        .select("id, title, ingredients, price");

      if (error) throw error;

      return data;
    },
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 overflow-hidden">
        <section className="mb-8 lg:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 lg:mb-8 gap-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-cupcake-800 text-center md:text-left">
              Cardápio
            </h2>
          </div>
          <ScrollArea className={`${isMobile ? 'h-[calc(100vh-10rem)]' : 'h-[calc(100vh-12rem)]'}`}>
            <div className="pr-4">
              <MenuTable items={cupcakes} />
            </div>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
};

export default Menu;