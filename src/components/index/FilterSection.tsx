import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type SortOption = "mostOrdered" | "newest" | "lowestPrice" | "highestDiscount";

interface FilterSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
}

export const FilterSection = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
}: FilterSectionProps) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-cupcake-800">Destaques</h2>
        <div className="w-full md:w-auto">
          <Input
            type="search"
            placeholder="Buscar cupcakes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              <SelectItem value="new">Novidades</SelectItem>
              <SelectItem value="blackFriday">Black Friday</SelectItem>
              <SelectItem value="christmas">Natal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mostOrdered">Mais Pedidos</SelectItem>
              <SelectItem value="newest">Novidades</SelectItem>
              <SelectItem value="lowestPrice">Menor Preço</SelectItem>
              <SelectItem value="highestDiscount">Maior Desconto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600">
            Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
          </label>
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};