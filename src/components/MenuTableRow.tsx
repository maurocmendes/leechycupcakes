import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuTableRowProps {
  id: number;
  title: string;
  ingredients: string;
  price: number;
}

export const MenuTableRow = ({ id, title, ingredients, price }: MenuTableRowProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  const formatPrice = (value: number) => {
    return value.toFixed(2).replace(".", ",");
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Por favor, faça login para adicionar itens ao carrinho");
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          cupcake_id: id,
          quantity,
          user_id: user.id
        });

      if (error) {
        if (error.message.includes('Not enough stock')) {
          toast.error("Desculpe, não há estoque suficiente para este item.");
        } else {
          toast.error("Erro ao adicionar item ao carrinho.");
        }
        return;
      }

      addToCart({ id, title, price }, quantity);
      toast.success("Item adicionado ao carrinho!", {
        description: `${quantity}x ${title}`,
      });
    } catch (error) {
      toast.error("Erro ao adicionar item ao carrinho.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="truncate max-w-[160px] lg:max-w-[200px]">{title}</span>
          {isMobile && (
            <div 
              className="text-xs text-muted-foreground cursor-pointer"
              onClick={toggleExpand}
            >
              <div className="flex items-center gap-1">
                <span className={isExpanded ? "" : "truncate max-w-[160px]"}>
                  {ingredients}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3 shrink-0" />
                ) : (
                  <ChevronDown className="h-3 w-3 shrink-0" />
                )}
              </div>
            </div>
          )}
        </div>
      </TableCell>
      {!isMobile && <TableCell>{ingredients}</TableCell>}
      <TableCell className="text-right">R$ {formatPrice(price)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleDecrement}
            disabled={isLoading}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-4 text-center text-sm">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={handleIncrement}
            disabled={isLoading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart className="h-3 w-3" />
        </Button>
      </TableCell>
    </TableRow>
  );
};