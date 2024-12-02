import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BatchEditFormProps {
  onSubmit: (formData: FormData) => void;
}

export const BatchEditForm = ({ onSubmit }: BatchEditFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          name="price"
          type="number"
          step="0.01"
          placeholder="Novo Preço (opcional)"
        />
      </div>
      <div>
        <Input
          name="discount"
          type="number"
          placeholder="Novo Desconto % (opcional)"
        />
      </div>
      <div>
        <Select name="promotion_type">
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Promoção" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discount">Desconto</SelectItem>
            <SelectItem value="blackfriday">Black Friday</SelectItem>
            <SelectItem value="christmas">Natal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          name="promotion_value"
          type="number"
          step="0.01"
          placeholder="Valor da Promoção"
        />
      </div>
      <div>
        <Input
          name="promotion_start_date"
          type="datetime-local"
          placeholder="Início da Promoção"
        />
      </div>
      <div>
        <Input
          name="promotion_end_date"
          type="datetime-local"
          placeholder="Fim da Promoção"
        />
      </div>
      <Button type="submit" className="w-full">
        Atualizar Selecionados
      </Button>
    </form>
  );
};