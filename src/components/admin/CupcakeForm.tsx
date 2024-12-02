import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CupcakeFormProps {
  onSubmit: (formData: FormData) => void;
}

export const CupcakeForm = ({ onSubmit }: CupcakeFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input name="title" placeholder="Nome do Cupcake" required />
      </div>
      <div>
        <Textarea name="description" placeholder="Descrição" required />
      </div>
      <div>
        <Textarea name="ingredients" placeholder="Ingredientes" required />
      </div>
      <div>
        <Input
          name="price"
          type="number"
          step="0.01"
          placeholder="Preço"
          required
        />
      </div>
      <div>
        <Input name="image" placeholder="URL da Imagem" required />
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
        Adicionar Cupcake
      </Button>
    </form>
  );
};