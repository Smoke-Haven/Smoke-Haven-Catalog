import { useAtom } from "jotai";
import { isAdminAtom } from "@/store/admin-store";
import { useState } from "react";
import { AdminLoginDialog } from "@/components/admin/admin-login-dialog";
import { Shield, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [isAdmin, setIsAdmin] = useAtom(isAdminAtom);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header className="relative w-full pt-16 pb-8 px-6 lg:px-8 text-center z-10">
        {/* Glow Aura Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40 -z-10" />
          <div className="absolute w-72 h-72 bg-primary/5 rounded-full blur-2xl opacity-60 -z-10" />
        </div>

        {/* Hidden Admin Trigger */}
        <button
          onClick={() => !isAdmin && setIsLoginOpen(true)}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center opacity-40 hover:opacity-100 active:opacity-100 transition-opacity rounded-full !text-white"
          title="Admin Login"
        >
          <Lock className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(255,165,0,0.6)]" />
        </button>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="relative">
            {/* Logo Glow */}
            <img 
              src="/images/smoke-haven-logo.png"
              alt="SMOKE HAVEN"
              className="h-32 lg:h-48 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,165,0,0.6)]"
            />
          </div>
          <p className="mt-6 text-sm lg:text-base text-white font-light tracking-wider max-w-xl">
            Premium vapes &amp; flavors — find your perfect pick.
          </p>
        </motion.div>
      </header>

      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-transparent border-y border-white/10 text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Shield className="w-5 h-5 text-white" />
                <span className="text-white">ADMIN MODE ACTIVE</span>
              </div>
              <button 
                onClick={() => setIsAdmin(false)}
                className="text-sm font-medium hover:text-white transition-colors bg-black/20 px-3 py-1.5 rounded-lg border border-white/10"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminLoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  );
}
