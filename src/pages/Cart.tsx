import { Sidebar } from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  const formatPrice = (value: number) => {
    return value.toFixed(2).replace(".", ",");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold text-cupcake-800 text-center md:text-left">
              Carrinho
            </h2>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Cupcake</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unitário</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value, 10))
                        }
                        className="w-16 p-1 border rounded"
                      />
                    </TableCell>
                    <TableCell>R$ {formatPrice(item.price)}</TableCell>
                    <TableCell>
                      R$ {formatPrice(item.price * item.quantity)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">
                      Total:
                    </TableCell>
                    <TableCell className="font-bold">
                      R$ {formatPrice(total)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Seu carrinho está vazio
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </section>
      </main>
    </div>
  );
};

export default Cart;