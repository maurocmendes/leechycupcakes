import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Você será redirecionado para a página inicial.",
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: "Não foi possível enviar o email de recuperação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: "Não foi possível realizar o login social.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-cupcake-600">
                {isResetMode ? "Recuperar Senha" : "Login"}
              </CardTitle>
              <CardDescription className="text-center">
                {isResetMode 
                  ? "Digite seu email para receber as instruções"
                  : "Entre com seu email e senha ou use uma rede social"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isResetMode ? (
                <>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="Digite seu email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-cupcake-500 hover:bg-cupcake-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Ou continue com
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                    >
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSocialLogin('github')}
                      disabled={isLoading}
                    >
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center space-y-2">
                    <Button
                      variant="link"
                      className="text-cupcake-600 hover:text-cupcake-700"
                      onClick={() => setIsResetMode(true)}
                    >
                      Esqueceu sua senha?
                    </Button>
                    <div>
                      <Link to="/register" className="text-cupcake-600 hover:underline">
                        Ainda não tem uma conta? Cadastre-se
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      placeholder="Digite seu email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-cupcake-500 hover:bg-cupcake-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar email de recuperação"}
                  </Button>
                  <Button
                    variant="link"
                    className="w-full text-cupcake-600 hover:text-cupcake-700"
                    onClick={() => setIsResetMode(false)}
                  >
                    Voltar ao login
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}