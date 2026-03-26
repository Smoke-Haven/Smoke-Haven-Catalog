import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={cn(
                "w-full max-w-lg bg-card border border-white/10 shadow-2xl rounded-2xl overflow-hidden pointer-events-auto",
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("px-6 py-5 border-b border-white/5", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={cn("text-xl font-display font-semibold text-foreground tracking-tight", className)}>{children}</h2>;
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("px-6 py-4 bg-white/5 border-t border-white/5 flex items-center justify-end gap-3", className)}>{children}</div>;
}

export function DialogClose({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-white/10"
    >
      <X className="w-5 h-5" />
    </button>
  );
}
