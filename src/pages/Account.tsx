import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoSection } from "@/components/account/PersonalInfoSection";
import { AddressSection } from "@/components/account/AddressSection";
import { AdditionalInfoSection } from "@/components/account/AdditionalInfoSection";
import { DeleteAccountSection } from "@/components/account/DeleteAccountSection";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  cpf: string | null;
  phone: string | null;
  cep: string | null;
  address: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  additional_info: string | null;
}

export default function Account() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil.",
        });
        return;
      }

      setProfile(profileData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao verificar o usuário.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-center">Carregando...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-cupcake-600 mb-8">Minha Conta</h1>
          
          <div className="space-y-6">
            {profile && (
              <>
                <PersonalInfoSection profile={profile} />
                <AddressSection profile={profile} onUpdate={checkUser} />
                <AdditionalInfoSection profile={profile} onUpdate={checkUser} />
                <DeleteAccountSection />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}