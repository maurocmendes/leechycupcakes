import { z } from "zod";

const validateCPF = (cpf: string) => {
  // Remove non-digits
  cpf = cpf.replace(/\D/g, '');

  // Check length
  if (cpf.length !== 11) return false;

  // Check for all same digits
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Calculate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Calculate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

export const registerSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  cpf: z.string()
    .min(11, "CPF inválido")
    .max(11, "CPF inválido")
    .refine((cpf) => validateCPF(cpf), {
      message: "CPF inválido"
    }),
  cep: z.string().optional(),
  address: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;