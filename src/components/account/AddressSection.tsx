import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddressSectionProps {
  profile: {
    cep: string | null;
    address: string | null;
    number: string | null;
    complement: string | null;
    neighborhood: string | null;
    city: string | null;
  };
  onUpdate: () => void;
}

export function AddressSection({ profile, onUpdate }: AddressSectionProps) {
  const { toast } = useToast();
  const [editingAddress, setEditingAddress] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [formData, setFormData] = useState({
    cep: profile.cep || '',
    address: profile.address || '',
    number: profile.number || '',
    complement: profile.complement || '',
    neighborhood: profile.neighborhood || '',
    city: profile.city || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchAddressData = async (cep: string) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast({
          variant: "destructive",
          title: "CEP não encontrado",
          description: "Verifique o CEP digitado e tente novamente.",
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        address: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
      }));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível buscar o endereço.",
      });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          cep: formData.cep,
          address: formData.address,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Endereço atualizado com sucesso!",
      });
      setEditingAddress(false);
      onUpdate();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o endereço.",
      });
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cupcake-500">Endereço de Entrega</h2>
        <Button 
          variant="outline"
          onClick={() => {
            if (editingAddress) {
              handleSaveAddress();
            } else {
              setEditingAddress(true);
            }
          }}
        >
          {editingAddress ? 'Salvar' : 'Editar'}
        </Button>
      </div>
      
      {editingAddress ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>CEP</Label>
            <Input
              name="cep"
              value={formData.cep}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                handleInputChange({ target: { name: 'cep', value } } as React.ChangeEvent<HTMLInputElement>);
                if (value.length === 8) {
                  fetchAddressData(value);
                }
              }}
              placeholder="Digite seu CEP"
              maxLength={8}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Endereço</Label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Digite seu endereço"
              disabled={isLoadingAddress}
            />
          </div>
          <div>
            <Label>Número</Label>
            <Input
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              placeholder="Número"
            />
          </div>
          <div>
            <Label>Complemento</Label>
            <Input
              name="complement"
              value={formData.complement}
              onChange={handleInputChange}
              placeholder="Complemento"
            />
          </div>
          <div>
            <Label>Bairro</Label>
            <Input
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleInputChange}
              placeholder="Bairro"
              disabled={isLoadingAddress}
            />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Cidade"
              disabled={isLoadingAddress}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-500">Endereço</Label>
            <p className="text-gray-900">{profile.address || '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Complemento</Label>
            <p className="text-gray-900">{profile.complement || '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Bairro</Label>
            <p className="text-gray-900">{profile.neighborhood || '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Cidade</Label>
            <p className="text-gray-900">{profile.city || '-'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">CEP</Label>
            <p className="text-gray-900">{profile.cep || '-'}</p>
          </div>
        </div>
      )}
    </section>
  );
}