import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { registerSchema, type RegisterFormData } from "@/schemas/registerSchema";
import { useNavigate } from "react-router-dom";
import { PersonalInfoFields } from "@/components/register/PersonalInfoFields";
import { PasswordField } from "@/components/register/PasswordField";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      cpf: "",
    },
  });

  async function onSubmit(values: RegisterFormData) {
    try {
      setIsSubmitting(true);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            cpf: values.cpf,
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a página de login.",
      });

      form.reset();
      setPassword("");
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao realizar o cadastro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-cupcake-600 mb-8">Cadastro de Cliente</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoFields form={form} />

              <PasswordField 
                form={form}
                password={password}
                setPassword={setPassword}
              />

              <Button 
                type="submit" 
                className="w-full bg-cupcake-500 hover:bg-cupcake-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}