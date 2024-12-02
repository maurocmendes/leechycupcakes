import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdditionalInfoSectionProps {
  profile: {
    additional_info: string | null;
  };
  onUpdate: () => void;
}

export function AdditionalInfoSection({ profile, onUpdate }: AdditionalInfoSectionProps) {
  const { toast } = useToast();
  const [editingAdditionalInfo, setEditingAdditionalInfo] = useState(false);
  const [formData, setFormData] = useState({
    additional_info: profile.additional_info || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAdditionalInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          additional_info: formData.additional_info,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Informações adicionais atualizadas com sucesso!",
      });
      setEditingAdditionalInfo(false);
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações adicionais.",
      });
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cupcake-500">Informações Adicionais</h2>
        <Button 
          variant="outline"
          onClick={() => {
            if (editingAdditionalInfo) {
              handleSaveAdditionalInfo();
            } else {
              setEditingAdditionalInfo(true);
            }
          }}
        >
          {editingAdditionalInfo ? 'Salvar' : 'Editar'}
        </Button>
      </div>
      
      {editingAdditionalInfo ? (
        <div>
          <Label>Instruções para Entrega</Label>
          <Textarea
            name="additional_info"
            value={formData.additional_info}
            onChange={handleInputChange}
            placeholder="Digite instruções adicionais para entrega"
            className="mt-2"
          />
        </div>
      ) : (
        <div>
          <Label className="text-sm font-medium text-gray-500">Instruções para Entrega</Label>
          <p className="text-gray-900">{profile.additional_info || '-'}</p>
        </div>
      )}
    </section>
  );
}