import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateMenuItem, useUpdateMenuItem } from "@workspace/api-client-react";
import { useInvalidateMenu } from "@/hooks/use-menu-api";
import { MenuItem } from "@workspace/api-client-react/src/generated/api.schemas";
import { Edit2, Plus } from "lucide-react";

const formSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  puffCount: z.string().min(1, "Puff count is required"),
  flavor: z.string().min(1, "Flavor name is required"),
  inStock: z.boolean().default(true),
  isBestseller: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<MenuItem> | MenuItem;
}

export function ItemEditorDialog({ open, onOpenChange, initialData }: Props) {
  const isEdit = !!initialData?.id;
  const invalidate = useInvalidateMenu();
  
  const { mutateAsync: createItem, isPending: isCreating } = useCreateMenuItem({
    mutation: { onSuccess: () => { invalidate(); onOpenChange(false); } }
  });
  
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateMenuItem({
    mutation: { onSuccess: () => { invalidate(); onOpenChange(false); } }
  });

  const isPending = isCreating || isUpdating;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      puffCount: "",
      flavor: "",
      inStock: true,
      isBestseller: false,
    }
  });

  useEffect(() => {
    if (open) {
      form.reset({
        brand: initialData?.brand || "",
        puffCount: initialData?.puffCount || "",
        flavor: initialData?.flavor || "",
        inStock: initialData?.inStock ?? true,
        isBestseller: initialData?.isBestseller ?? false,
      });
    }
  }, [open, initialData, form]);

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateItem({ id: initialData.id, data: values });
    } else {
      await createItem({ data: values });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              {isEdit ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
            </div>
            <DialogTitle>{isEdit ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </div>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Brand Name</label>
                <Input {...form.register("brand")} placeholder="e.g. GeekBar" />
                {form.formState.errors.brand && <span className="text-xs text-destructive">{form.formState.errors.brand.message}</span>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Puff Count</label>
                <Input {...form.register("puffCount")} placeholder="e.g. 15000 Puffs" />
                {form.formState.errors.puffCount && <span className="text-xs text-destructive">{form.formState.errors.puffCount.message}</span>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Flavor Name</label>
              <Input {...form.register("flavor")} placeholder="e.g. Watermelon Ice" />
              {form.formState.errors.flavor && <span className="text-xs text-destructive">{form.formState.errors.flavor.message}</span>}
            </div>

            <div className="flex gap-6 p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Controller
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <span className="text-sm font-medium text-white">In Stock</span>
              </div>
              <div className="flex items-center gap-3">
                <Controller
                  control={form.control}
                  name="isBestseller"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <span className="text-sm font-medium text-white">Bestseller (🔥)</span>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-white hover:text-white">Cancel</Button>
          <Button type="submit" disabled={isPending} className="text-white hover:text-white disabled:text-white disabled:opacity-100">
            {isPending ? "Saving..." : "Save Item"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
