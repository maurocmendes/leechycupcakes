import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  description: string;
  isNew?: boolean;
  discount?: number;
}

// Image cache implementation
const imageCache = new Map<string, string>();

export const ProductCard = ({ id, image, title, price, description, isNew, discount }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [optimizedImage, setOptimizedImage] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  useEffect(() => {
    const loadImage = async () => {
      if (!image) {
        setImageError(true);
        setImageLoading(false);
        return;
      }

      if (imageCache.has(image)) {
        setOptimizedImage(imageCache.get(image)!);
        setImageLoading(false);
        return;
      }

      try {
        const img = new Image();
        img.src = image;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        imageCache.set(image, image);
        setOptimizedImage(image);
        setImageError(false);
      } catch (error) {
        console.error("Error loading image:", error);
        setImageError(true);
        setOptimizedImage("/placeholder.svg");
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
  }, [image]);
  
  const formatPrice = (value: number) => {
    return value.toFixed(2).replace('.', ',');
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast.error("Por favor, faça login para adicionar itens ao carrinho.");
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

      addToCart({ id, title, price: discountedPrice }, quantity);
      toast.success("Item adicionado ao carrinho!", {
        description: `${quantity}x ${title}`,
      });
    } catch (error) {
      toast.error("Erro ao adicionar item ao carrinho.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden group">
      <div className="relative overflow-hidden">
        {imageLoading ? (
          <div className="w-full h-48 bg-gray-200 animate-pulse" />
        ) : imageError ? (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Imagem indisponível</span>
          </div>
        ) : (
          <img
            src={optimizedImage}
            alt={title}
            className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={() => {
              setImageError(true);
              setOptimizedImage("/placeholder.svg");
            }}
          />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2" 
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-cupcake-600">Novo</Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            -{discount}%
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discount > 0 ? (
              <>
                <p className="font-bold text-cupcake-600">
                  R$ {formatPrice(discountedPrice)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  R$ {formatPrice(price)}
                </p>
              </>
            ) : (
              <p className="font-bold text-cupcake-600">R$ {formatPrice(price)}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrement}
                disabled={isLoading}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleIncrement}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};