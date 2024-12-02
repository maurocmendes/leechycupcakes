import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { exportToCSV, logActivity, updateCupcakesBatch } from "@/utils/adminUtils";
import { Download, Edit, Plus } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CupcakeForm } from "./CupcakeForm";
import { BatchEditForm } from "./BatchEditForm";

type Cupcake = Tables<"cupcakes">;

interface CupcakeOperationsProps {
  cupcakes: Cupcake[];
  selectedCupcakes: number[];
  setSelectedCupcakes: (ids: number[]) => void;
}

export const CupcakeOperations = ({
  cupcakes,
  selectedCupcakes,
  setSelectedCupcakes,
}: CupcakeOperationsProps) => {
  const [open, setOpen] = useState(false);
  const [batchEditOpen, setBatchEditOpen] = useState(false);
  const queryClient = useQueryClient();

  const addCupcake = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const cupcakeData = {
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        ingredients: String(formData.get("ingredients")),
        price: parseFloat(formData.get("price") as string),
        image: String(formData.get("image")),
        is_new: true,
        promotion_type: formData.get("promotion_type") as string || null,
        promotion_value: formData.get("promotion_value") ? parseFloat(formData.get("promotion_value") as string) : null,
        promotion_start_date: formData.get("promotion_start_date") as string || null,
        promotion_end_date: formData.get("promotion_end_date") as string || null,
      } satisfies Partial<Cupcake>;

      const { error } = await supabase.from("cupcakes").insert(cupcakeData);
      if (error) throw error;

      await logActivity("create", "cupcakes", String(cupcakeData.title), cupcakeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cupcakes"] });
      setOpen(false);
      toast.success("Cupcake adicionado com sucesso!");
    },
    onError: (error) => {
      console.error("Error adding cupcake:", error);
      toast.error("Erro ao adicionar cupcake: " + error.message);
    },
  });

  const batchEdit = useMutation({
    mutationFn: async (formData: FormData) => {
      const updates: Partial<Cupcake> = {};
      
      if (formData.get("price")) {
        updates.price = parseFloat(formData.get("price") as string);
      }
      if (formData.get("discount")) {
        updates.discount = parseInt(formData.get("discount") as string);
      }
      if (formData.get("promotion_type")) {
        updates.promotion_type = formData.get("promotion_type") as string;
        updates.promotion_value = parseFloat(formData.get("promotion_value") as string);
        updates.promotion_start_date = formData.get("promotion_start_date") as string;
        updates.promotion_end_date = formData.get("promotion_end_date") as string;
      }

      await updateCupcakesBatch(selectedCupcakes, updates);
      await logActivity("batch_update", "cupcakes", selectedCupcakes.join(","), updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cupcakes"] });
      setBatchEditOpen(false);
      setSelectedCupcakes([]);
      toast.success("Cupcakes atualizados com sucesso!");
    },
    onError: (error) => {
      console.error("Error batch editing cupcakes:", error);
      toast.error("Erro ao atualizar cupcakes: " + error.message);
    },
  });

  const handleExport = () => {
    if (!cupcakes) return;
    exportToCSV(cupcakes, "cupcakes-export");
    toast.success("Dados exportados com sucesso!");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-cupcake-800">
        Gerenciar Cupcakes
      </h2>
      <div className="space-x-2">
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button
          variant="secondary"
          disabled={selectedCupcakes.length === 0}
          onClick={() => setBatchEditOpen(true)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edição em Lote
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupcake
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cupcake</DialogTitle>
            </DialogHeader>
            <CupcakeForm onSubmit={(formData) => addCupcake.mutate(formData)} />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={batchEditOpen} onOpenChange={setBatchEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edição em Lote</DialogTitle>
          </DialogHeader>
          <BatchEditForm onSubmit={(formData) => batchEdit.mutate(formData)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};