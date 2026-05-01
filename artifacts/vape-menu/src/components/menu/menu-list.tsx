import { useMemo, useState } from "react";
import { useGetMenuItems, useUpdateMenuItem, useDeleteMenuItem, MenuItem } from "@workspace/api-client-react";
import { FilterState } from "./menu-filters";
import { useAtom } from "jotai";
import { isAdminAtom } from "@/store/admin-store";
import { useInvalidateMenu } from "@/hooks/use-menu-api";
import { Button } from "@/components/ui/button";
import { ItemEditorDialog } from "@/components/admin/item-editor-dialog";
import { Edit2, Plus, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type GroupedMenu = Record<string, Record<string, MenuItem[]>>;
type SortedGroupedMenu = Array<{ brand: string; puffGroups: Array<{ puffCount: string; flavors: MenuItem[] }> }>;

const ALL_BRANDS_DISPLAY_ORDER = [
  "Mr Fog Switch",
  "Posh",
  "Fogger",
  "Foger",
  "Tesla Bar",
  "North",
  "Geek Bar",
];

const getBrandSortValue = (brand: string) => {
  const index = ALL_BRANDS_DISPLAY_ORDER.indexOf(brand);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

const isPoshTwentyK = (item: MenuItem) =>
  item.brand === "Posh" && /^20K Puffs(?:\s*\([^)]*\))?$/i.test(item.puffCount);

export function MenuList({ filters }: { filters: FilterState }) {
  const [isAdmin] = useAtom(isAdminAtom);
  const invalidate = useInvalidateMenu();
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | undefined>();
  
  const queryFilters = {
    brand: filters.brand || undefined,
    puffCount: filters.puffCount || undefined,
    search: filters.search || undefined,
    inStockOnly: filters.inStockOnly ? true : undefined
  };
  
  const { data, isLoading } = useGetMenuItems(queryFilters);
  const items = data?.items || [];
  
  const { mutateAsync: updateItem } = useUpdateMenuItem({ mutation: { onSuccess: invalidate } });
  const { mutateAsync: deleteItem } = useDeleteMenuItem({ mutation: { onSuccess: invalidate } });

  const grouped = useMemo(() => {
    const map: GroupedMenu = {};
    const remainingPoshMap: GroupedMenu = {};
    for (const item of items) {
      const targetMap =
        !filters.brand && item.brand === "Posh" && !isPoshTwentyK(item)
          ? remainingPoshMap
          : map;

      if (!targetMap[item.brand]) targetMap[item.brand] = {};
      if (!targetMap[item.brand][item.puffCount]) targetMap[item.brand][item.puffCount] = [];
      targetMap[item.brand][item.puffCount].push(item);
    }
    
    // Sort numerically by puff count
    const getNumericValue = (puffCount: string): number => {
      const match = puffCount.match(/^([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    };
    
    // Create sorted array structure instead of nested object
    const sortedGrouped: SortedGroupedMenu = [];
    
    const addBrandGroup = (brand: string, puffMap: Record<string, MenuItem[]>) => {
      const sortedPuffCounts = Object.keys(puffMap)
        .sort((a, b) => {
          const aNum = getNumericValue(a);
          const bNum = getNumericValue(b);
          if (aNum !== bNum) return aNum - bNum;
          return a.localeCompare(b);
        });

      sortedGrouped.push({
        brand,
        puffGroups: sortedPuffCounts.map(puffCount => ({
          puffCount,
          flavors: puffMap[puffCount].sort((a, b) =>
            a.flavor.localeCompare(b.flavor)
          )
        }))
      });
    };

    Object.keys(map)
      .sort((a, b) => {
        if (filters.brand) return a.localeCompare(b);

        const aOrder = getBrandSortValue(a);
        const bOrder = getBrandSortValue(b);
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.localeCompare(b);
      })
      .forEach(brand => {
        addBrandGroup(brand, map[brand]);
      });

    if (!filters.brand && remainingPoshMap.Posh) {
      addBrandGroup("Posh", remainingPoshMap.Posh);
    }
    
    return sortedGrouped;
  }, [items, filters.brand]);

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditorOpen(true);
  };

  const handleAdd = (brand?: string, puffCount?: string) => {
    setEditingItem({ brand, puffCount });
    setEditorOpen(true);
  };

  const handleToggleStock = async (item: MenuItem) => {
    await updateItem({ id: item.id, data: { inStock: !item.inStock } });
  };

  const handleToggleBestseller = async (item: MenuItem) => {
    await updateItem({ id: item.id, data: { isBestseller: !item.isBestseller } });
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this flavor?")) {
      await deleteItem({ id });
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-white animate-pulse text-lg">Loading menu...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-card/20 rounded-2xl border border-white/5 backdrop-blur-sm">
        <p className="text-xl text-white mb-4">No flavors found matching your criteria.</p>
        {isAdmin && (
          <Button onClick={() => handleAdd()}>Add New Flavor</Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {grouped.map(({ brand, puffGroups }, brandIndex) => (
        <div key={`${brand}-${brandIndex}`} className="relative">
          {/* Sticky Brand Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background/90 to-background/0 backdrop-blur-xl py-6 border-b border-primary/10 mb-8">
            <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,165,0,0.5)]">
              {brand}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
            {puffGroups.map(({ puffCount: puff, flavors }) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={puff} 
                className="glass-effect glow-border glow-border-hover rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-primary/5 to-primary/0 px-6 py-5 border-b border-primary/10 flex items-center justify-between backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white">{puff}</h3>
                  <span className="text-sm font-medium text-white bg-primary/10 px-3 py-1 rounded-full">{flavors.length} flavors</span>
                </div>
                <div className="divide-y divide-white/5">
                  {flavors.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={item.id} 
                      className="px-6 py-4 flex items-center justify-between group hover:bg-primary/5 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-base font-semibold transition-all duration-300",
                          !item.inStock ? "text-white/50 line-through" : "text-white"
                        )}>
                          {item.flavor}
                        </span>
                        {item.isBestseller && !isAdmin && <span className="text-lg drop-shadow-[0_0_8px_rgba(255,165,0,0.4)]" title="Bestseller">🔥</span>}
                      </div>

                      {isAdmin && (
                        <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                          <label className="flex items-center gap-2 mr-2 cursor-pointer hover:text-primary transition-colors">
                            <input 
                              type="checkbox" 
                              checked={!item.inStock} 
                              onChange={() => handleToggleStock(item)}
                              className="w-4 h-4 rounded bg-black/20 border-white/50 text-white focus:ring-white/50 accent-white"
                            />
                            <span className="text-xs text-white uppercase tracking-wider font-semibold">Out</span>
                          </label>
                          <button onClick={() => handleToggleBestseller(item)} className={cn("p-2 rounded-lg hover:bg-white/10 transition-colors", item.isBestseller ? "text-white" : "text-white")}>
                            <Star className={cn("w-4 h-4", item.isBestseller && "fill-current")} />
                          </button>
                          <button onClick={() => handleEdit(item)} className="p-2 rounded-lg hover:bg-white/10 text-white hover:text-white transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-white/10 text-white hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isAdmin && (
                    <div className="p-3 bg-black/20">
                      <Button variant="ghost" className="w-full text-white hover:text-primary border border-dashed border-white/10" onClick={() => handleAdd(brand, puff)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Flavor to {puff}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {isAdmin && (
            <div className="mt-6 px-2">
              <Button variant="outline" onClick={() => handleAdd(brand, "")} className="text-white">
                <Plus className="w-4 h-4 mr-2" /> Add Puff Category to {brand}
              </Button>
            </div>
          )}
        </div>
      ))}

      {isAdmin && (
        <div className="pt-12 pb-24 text-center border-t border-white/5">
          <Button size="lg" onClick={() => handleAdd("", "")} className="shadow-[0_0_30px_rgba(255,165,0,0.6)] text-white hover:text-white hover:bg-transparent">
            <Plus className="w-5 h-5 mr-2" /> Create Completely New Brand
          </Button>
        </div>
      )}

      <ItemEditorDialog open={editorOpen} onOpenChange={setEditorOpen} initialData={editingItem} />
    </div>
  );
}
