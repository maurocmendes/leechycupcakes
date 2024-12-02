import { MessageSquare, Instagram, Twitter, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";

export default function Contact() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Olá, gostaria de mais informações");
    window.open(`https://wa.me/5561981209224?text=${message}`, "_blank");
  };

  const handleInstagramClick = () => {
    window.open("https://instagram.com/leechycupcakes", "_blank");
  };

  const handleTwitterClick = () => {
    window.open("https://twitter.com/leechycupcakes", "_blank");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center text-cupcake-600">Entre em Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-600">
                  Estamos sempre prontos para atender você! Entre em contato conosco através de qualquer um dos nossos canais.
                </p>
                <p className="text-gray-600">
                  Horário de Funcionamento:<br />
                  Segunda a Sábado: 09:00 - 19:00<br />
                  Domingo: 09:00 - 13:00
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleWhatsAppClick}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600"
                >
                  <MessageSquare className="h-5 w-5" />
                  WhatsApp
                </Button>

                <Button
                  onClick={handleInstagramClick}
                  className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </Button>

                <Button
                  onClick={handleTwitterClick}
                  className="flex items-center justify-center gap-2 bg-blue-400 hover:bg-blue-500"
                >
                  <Twitter className="h-5 w-5" />
                  Twitter
                </Button>

                <Button
                  onClick={() => window.open("tel:+5561981209224")}
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700"
                >
                  <Phone className="h-5 w-5" />
                  (61) 98120-9224
                </Button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Endereço:<br />
                  Quadra 1, Lote 2, Loja 3<br />
                  Brasília - DF
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}