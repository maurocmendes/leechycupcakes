import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export const UsersList = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Primeiro verificamos se o usuário atual é um administrador
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) throw new Error("Não autenticado");

      // Verificar se o usuário é um administrador usando o campo is_admin
      const { data: adminCheck, error: adminError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .single();

      if (adminError) {
        console.error("Error checking admin status:", adminError);
        throw new Error("Erro ao verificar status de administrador");
      }

      if (!adminCheck?.is_admin) {
        throw new Error("Acesso não autorizado");
      }

      // Agora buscamos todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        console.error("Error fetching users:", profilesError);
        throw profilesError;
      }

      if (!profiles) {
        return [];
      }

      return profiles;
    },
  });

  if (isLoading) return <div>Carregando usuários...</div>;

  if (error) {
    console.error("Error loading users:", error);
    return <div>Erro ao carregar usuários: {error.message}</div>;
  }

  if (!users?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Usuários Cadastrados</h2>
        <p className="text-gray-500">Nenhum usuário cadastrado.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Usuários Cadastrados</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Data de Cadastro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "-"}</TableCell>
                <TableCell>{user.cpf || "-"}</TableCell>
                <TableCell>{user.city || "-"}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};