import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Cupcake = Tables<"cupcakes">;

interface CupcakeListProps {
  cupcakes: Cupcake[];
  selectedCupcakes: number[];
  onSelect: (id: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDelete: (id: number) => void;
}

export const CupcakeList = ({
  cupcakes,
  selectedCupcakes,
  onSelect,
  onSelectAll,
  onDelete,
}: CupcakeListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Checkbox
              checked={selectedCupcakes.length === cupcakes?.length}
              onCheckedChange={(checked) => onSelectAll(checked as boolean)}
            />
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Desconto</TableHead>
          <TableHead>Promoção</TableHead>
          <TableHead>Pedidos</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cupcakes?.map((cupcake) => (
          <TableRow key={cupcake.id}>
            <TableCell>
              <Checkbox
                checked={selectedCupcakes.includes(cupcake.id)}
                onCheckedChange={(checked) => onSelect(cupcake.id, checked as boolean)}
              />
            </TableCell>
            <TableCell>{cupcake.title}</TableCell>
            <TableCell>R$ {cupcake.price.toFixed(2)}</TableCell>
            <TableCell>{cupcake.discount || 0}%</TableCell>
            <TableCell>
              {cupcake.promotion_type ? (
                <span className="text-sm">
                  {cupcake.promotion_type} - {cupcake.promotion_value}%
                </span>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>{cupcake.order_count || 0}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(cupcake.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};