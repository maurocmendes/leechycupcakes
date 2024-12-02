import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Comprimento mínimo de 8 caracteres
    if (password.length >= 8) strength += 1;
    
    // Contém números
    if (/\d/.test(password)) strength += 1;
    
    // Contém letras minúsculas
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contém letras maiúsculas
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contém caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    return strength;
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 w-full rounded-full transition-colors",
              {
                "bg-red-500": strength >= level && strength <= 2,
                "bg-yellow-500": strength >= level && strength === 3,
                "bg-green-500": strength >= level && strength >= 4,
                "bg-gray-200": strength < level,
              }
            )}
          />
        ))}
      </div>
      <p className={cn(
        "text-sm",
        {
          "text-red-500": strength <= 2,
          "text-yellow-500": strength === 3,
          "text-green-500": strength >= 4,
        }
      )}>
        {strength === 0 && "Digite sua senha"}
        {strength === 1 && "Senha muito fraca"}
        {strength === 2 && "Senha fraca"}
        {strength === 3 && "Senha média"}
        {strength === 4 && "Senha forte"}
        {strength === 5 && "Senha muito forte"}
      </p>
    </div>
  );
}