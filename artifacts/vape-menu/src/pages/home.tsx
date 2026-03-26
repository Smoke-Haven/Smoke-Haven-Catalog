import { useState } from "react";
import { Header } from "@/components/layout/header";
import { MenuFilters, FilterState } from "@/components/menu/menu-filters";
import { Bestsellers } from "@/components/menu/bestsellers";
import { MenuList } from "@/components/menu/menu-list";

export default function Home() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    brand: "",
    puffCount: "",
    inStockOnly: false
  });

  return (
    <div className="min-h-screen w-full relative">
      {/* Premium Dark Background with Luxury Gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-[#1a1a2e]" />
        
        {/* Smooth Gradient Overlay */}
        <div className="absolute inset-0 bg-radial" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 165, 0, 0.08) 0%, transparent 60%)'
        }} />
        
        {/* Animated Smoke Waves */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="w-full h-full opacity-30" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <defs>
              <linearGradient id="smokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 165, 0, 0.3)" />
                <stop offset="50%" stopColor="rgba(200, 100, 0, 0.2)" />
                <stop offset="100%" stopColor="rgba(255, 165, 0, 0.1)" />
              </linearGradient>
            </defs>
            <path d="M0,100 Q300,50 600,100 T1200,100 L1200,400 L0,400 Z" fill="url(#smokeGradient)" opacity="0.4" />
            <path d="M0,150 Q300,100 600,150 T1200,150 L1200,400 L0,400 Z" fill="url(#smokeGradient)" opacity="0.3" style={{animation: 'drift 20s infinite ease-in-out'}} />
          </svg>
        </div>

        {/* Blur Spotlight */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MenuFilters filters={filters} onChange={setFilters} />
          
          <Bestsellers filters={filters} />
          
          <MenuList filters={filters} />
        </main>
        
        <footer className="w-full text-center py-8 text-white text-sm">
          <p>© {new Date().getFullYear()} Smoke Haven. Must be of legal smoking age to purchase.</p>
        </footer>
      </div>
    </div>
  );
}
