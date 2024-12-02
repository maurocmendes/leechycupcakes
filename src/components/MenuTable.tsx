import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MenuTableRow } from "./MenuTableRow";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  id: number;
  title: string;
  ingredients: string;
  price: number;
}

interface MenuTableProps {
  items: MenuItem[];
}

export const MenuTable = ({ items }: MenuTableProps) => {
  const isMobile = useIsMobile();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={isMobile ? "w-[160px]" : "w-[200px]"}>Nome</TableHead>
          {!isMobile && <TableHead className="w-[400px]">Ingredientes</TableHead>}
          <TableHead className="w-[80px]">Preço</TableHead>
          <TableHead className="w-[60px]">Qtd.</TableHead>
          <TableHead className="w-[40px]">Cart</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <MenuTableRow
            key={item.id}
            id={item.id}
            title={item.title}
            ingredients={item.ingredients}
            price={item.price}
          />
        ))}
      </TableBody>
    </Table>
  );
};