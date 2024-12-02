import { Label } from "@/components/ui/label";

interface PersonalInfoSectionProps {
  profile: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    cpf: string | null;
    phone: string | null;
  };
}

export function PersonalInfoSection({ profile }: PersonalInfoSectionProps) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-cupcake-500 mb-4">Informações Pessoais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-500">Nome</Label>
          <p className="text-gray-900">{profile?.first_name || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Sobrenome</Label>
          <p className="text-gray-900">{profile?.last_name || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Email</Label>
          <p className="text-gray-900">{profile?.email || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">CPF</Label>
          <p className="text-gray-900">{profile?.cpf || '-'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-500">Telefone</Label>
          <p className="text-gray-900">{profile?.phone || '-'}</p>
        </div>
      </div>
    </section>
  );
}