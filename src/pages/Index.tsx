import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterSection } from "@/components/index/FilterSection";
import { ProductGrid } from "@/components/index/ProductGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

type SortOption = "mostOrdered" | "newest" | "lowestPrice" | "highestDiscount";

const ITEMS_PER_PAGE = 6;

const Index = () => {
  const [sortBy, setSortBy] = useState<SortOption>("mostOrdered");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: products = [] } = useQuery({
    queryKey: ["cupcakes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cupcakes")
        .select("*");

      if (error) throw error;

      return data.map((cupcake): Product => ({
        id: cupcake.id,
        title: cupcake.title,
        ingredients: cupcake.ingredients,
        description: cupcake.description,
        price: Number(cupcake.price),
        image: cupcake.image,
        isNew: cupcake.is_new,
        discount: cupcake.discount,
        orderCount: cupcake.order_count,
        isBlackFriday: cupcake.is_black_friday,
        isChristmas: cupcake.is_christmas,
      }));
    },
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      switch (selectedCategory) {
        case "new":
          filtered = filtered.filter(product => product.isNew);
          break;
        case "blackFriday":
          filtered = filtered.filter(product => product.isBlackFriday);
          break;
        case "christmas":
          filtered = filtered.filter(product => product.isChristmas);
          break;
      }
    }

    filtered = filtered.filter(
      product =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    switch (sortBy) {
      case "mostOrdered":
        return filtered.sort((a, b) => b.orderCount - a.orderCount);
      case "newest":
        return filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
      case "lowestPrice":
        return filtered.sort((a, b) => a.price - b.price);
      case "highestDiscount":
        return filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default:
        return filtered;
    }
  }, [sortBy, searchTerm, selectedCategory, priceRange, products]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-3 py-4 md:p-6 lg:p-8 overflow-x-hidden">
        <section>
          <FilterSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />

          <ScrollArea className="h-[calc(100vh-12rem)] md:h-[calc(100vh-16rem)]">
            <ProductGrid
              products={currentProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </ScrollArea>
        </section>
        <WhatsAppButton />
      </main>
    </div>
  );
};

export default Index;