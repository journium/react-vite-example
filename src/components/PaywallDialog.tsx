import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { track, Events } from "@/lib/events";

interface PaywallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: 'habit_limit' | 'insights' | 'upgrade_card';
}

export function PaywallDialog({ open, onOpenChange, trigger = 'upgrade_card' }: PaywallDialogProps) {
  const { upgradeToPro } = useApp();

  const handleUpgrade = () => {
    // TODO: Analytics - paywall upgrade clicked
    track(Events.PAYWALL_UPGRADE_CLICKED, { trigger });
    
    upgradeToPro();
    toast.success("Welcome to Pro! 🎉", {
      description: "You now have access to all premium features.",
    });
    
    // TODO: Analytics - upgrade success
    track(Events.UPGRADE_SUCCESS, { trigger });
    
    onOpenChange(false);
  };

  // TODO: Analytics - paywall shown
  if (open) {
    track(Events.PAYWALL_SHOWN, { trigger });
  }

  const features = [
    { name: "Active habits", free: "3", pro: "Unlimited" },
    { name: "Daily logging", free: true, pro: true },
    { name: "Streak tracking", free: true, pro: true },
    { name: "Basic insights", free: true, pro: true },
    { name: "Deep analytics", free: false, pro: true },
    { name: "Habit history export", free: false, pro: true },
    { name: "Custom reminders", free: false, pro: true },
    { name: "Priority support", free: false, pro: true },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-orange-400">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
          <DialogDescription className="text-base">
            Unlock your full potential with unlimited habits and deep insights.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="mb-3 font-semibold text-muted-foreground">Free</div>
            <div className="space-y-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  {feature.free === true ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : feature.free === false ? (
                    <X className="h-4 w-4 text-muted-foreground/50" />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">{feature.free}</span>
                  )}
                  <span className={feature.free === false ? "text-muted-foreground/50" : ""}>
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-orange-500/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-semibold text-primary">Pro</span>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">Popular</Badge>
            </div>
            <div className="space-y-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  {feature.pro === true ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <span className="text-xs font-medium text-primary">{feature.pro}</span>
                  )}
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold">$6.99</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          
          <Button 
            variant="premium" 
            size="xl" 
            className="w-full"
            onClick={handleUpgrade}
          >
            <Zap className="h-5 w-5" />
            Start Pro (mock)
          </Button>
          
          <p className="mt-3 text-xs text-muted-foreground">
            This is a demo. No actual payment will be processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
