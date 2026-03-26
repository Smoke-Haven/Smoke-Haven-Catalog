import { useGetMenuItems } from "@workspace/api-client-react";
import { FilterState } from "./menu-filters";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  filters: FilterState;
}

export function Bestsellers({ filters }: Props) {
  // Use same filters so bestsellers respect brand/puff filters, but you can opt out if you want global bestsellers.
  const queryFilters = {
    brand: filters.brand || undefined,
    puffCount: filters.puffCount || undefined,
    search: filters.search || undefined,
    inStockOnly: filters.inStockOnly ? true : undefined
  };
  
  const { data } = useGetMenuItems(queryFilters);
  const items = data?.items || [];
  
  const bestsellers = items.filter(i => i.isBestseller).slice(0, 10);

  if (bestsellers.length === 0) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div>
          <Flame className="w-6 h-6" color="orange"/>
        </div>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-white">Trending Bestsellers</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bestsellers.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            key={item.id}
            className="group relative glass-effect rounded-2xl p-6 shadow-lg hover:shadow-[0_0_40px_rgba(255,165,0,0.3)] transition-all duration-300"
          >
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-transparent" />
            
            <div className="absolute top-4 right-4 text-primary group-hover:scale-125 transition-transform duration-300">
              <Flame className="w-6 h-6 drop-shadow-[0_0_12px_rgba(255,165,0,0.6)]" color="orange"/>
            </div>
            <p className="text-xs font-semibold text-white uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{item.brand}</p>
            <h3 className={cn(
              "text-lg font-bold mb-3 transition-colors",
              !item.inStock ? "text-white/50 line-through" : "text-white group-hover:text-primary"
            )}>
              {item.flavor}
            </h3>
            <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg text-xs font-medium text-white group-hover:text-primary group-hover:border-primary/40 transition-all duration-300">
              {item.puffCount}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
