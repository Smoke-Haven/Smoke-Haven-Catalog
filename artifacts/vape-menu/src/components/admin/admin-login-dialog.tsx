import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { isAdminAtom } from "@/store/admin-store";
import { useVerifyAdminPassword } from "@workspace/api-client-react";
import { Lock } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: Props) {
  const [, setIsAdmin] = useAtom(isAdminAtom);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { mutateAsync: verify, isPending } = useVerifyAdminPassword();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await verify({ data: { password } });
      if (res.success) {
        setIsAdmin(true);
        setPassword("");
        onOpenChange(false);
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Failed to verify password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogClose onClick={() => onOpenChange(false)} />
      <form onSubmit={handleLogin}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-white">Admin Access</DialogTitle>
          </div>
        </DialogHeader>
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <Input 
                type="password" 
                placeholder="Enter admin password..." 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              {error && <p className="text-sm text-destructive font-medium mt-1">{error}</p>}
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-white hover:text-white">Cancel</Button>
          <Button type="submit" variant="ghost" disabled={isPending || !password} className="text-white hover:text-white disabled:text-white disabled:opacity-100">
            {isPending ? "Verifying..." : "Login"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
