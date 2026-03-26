import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { useGetBrands, useGetPuffCounts } from "@workspace/api-client-react";

export interface FilterState {
  search: string;
  brand: string;
  puffCount: string;
  inStockOnly: boolean;
}

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

export function MenuFilters({ filters, onChange }: Props) {
  const { data: brandsData } = useGetBrands();
  const { data: puffData } = useGetPuffCounts();

  const brands = brandsData?.brands || [];
  const puffCounts = puffData?.puffCounts || [];

  return (
    <div className="relative z-20 mb-10">
      {/* Glassmorphic Container */}
      <div className="glass-effect glow-border rounded-2xl p-6 sm:p-8 backdrop-blur-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          
          {/* Search */}
          <div className="lg:col-span-5 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white transition-colors group-focus-within:text-white" />
            <Input 
              placeholder="Search flavors..." 
              className="pl-11 bg-black/30 border-primary/20 hover:border-primary/40 focus:border-primary/60 text-white placeholder:text-white/50 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              value={filters.search}
              onChange={e => onChange({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Brand Filter */}
          <div className="lg:col-span-3">
            <Select 
              value={filters.brand} 
              onChange={e => onChange({ ...filters, brand: e.target.value })}
              className="bg-black/30 border-primary/20 hover:border-primary/40 focus:border-primary/60 text-white rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </Select>
          </div>

          {/* Puff Filter */}
          <div className="lg:col-span-2">
            <Select 
              value={filters.puffCount} 
              onChange={e => onChange({ ...filters, puffCount: e.target.value })}
              className="bg-black/30 border-primary/20 hover:border-primary/40 focus:border-primary/60 text-white rounded-xl transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Puffs</option>
              {puffCounts.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
          </div>

          {/* Toggle */}
          <div className="lg:col-span-2 flex items-center justify-between sm:justify-end gap-4 px-2">
            <label className="text-sm font-medium text-white whitespace-nowrap cursor-pointer select-none hover:text-white/90 transition-colors" onClick={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}>
              In Stock Only
            </label>
            <Switch 
              checked={filters.inStockOnly} 
              onCheckedChange={c => onChange({ ...filters, inStockOnly: c })} 
              className="data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_15px_rgba(255,165,0,0.4)]"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
