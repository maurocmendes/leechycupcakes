import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá, quero fazer um pedido");
    window.open(`https://wa.me/5561981209224?text=${message}`, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 flex items-center justify-center shadow-lg animate-float"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};