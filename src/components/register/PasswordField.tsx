import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormData } from "@/schemas/registerSchema";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";

interface PasswordFieldProps {
  form: UseFormReturn<RegisterFormData>;
  password: string;
  setPassword: (value: string) => void;
}

export function PasswordField({ form, password, setPassword }: PasswordFieldProps) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Senha</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder="Digite sua senha" 
              {...field}
              onChange={(e) => {
                field.onChange(e);
                setPassword(e.target.value);
              }}
            />
          </FormControl>
          <PasswordStrengthIndicator password={password} />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}